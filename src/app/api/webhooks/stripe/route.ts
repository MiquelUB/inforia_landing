import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any,
});

// Cliente Supabase ADMIN (ignora RLS para poder escribir)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error: any) {
        console.error(`❌ Webhook Error: ${error.message}`);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    // Cuando el pago (incluso de 0€) es exitoso
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log(`🎯 Procesando checkout.session.completed: ${session.id}`);

        // Expandir line_items para ver qué compró
        const sessionWithLineItems = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ['line_items'],
        });
        const lineItems = sessionWithLineItems.line_items?.data || [];
        const priceId = lineItems[0]?.price?.id;
        const userEmail = session.customer_email || session.customer_details?.email;
        const amountTotal = session.amount_total || 0;
        const amountDiscount = session.total_details?.amount_discount || 0;

        console.log(`📊 Detalles: Email=${userEmail}, PriceID=${priceId}, Total=€${amountTotal / 100}, Descuento=€${amountDiscount / 100}`);

        if (userEmail && priceId) {
            let credits = 0;
            let planName = 'unknown';

            // Lógica de asignación según el producto comprado
            if (priceId === process.env.NEXT_PUBLIC_STRIPE_FLASH_PRICE_ID) {
                credits = 5; // Los 5 del pack de bienvenida
                planName = 'plan_flash_promo';
            } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_ESENCIAL_PRICE_ID) {
                credits = 50;
                planName = 'esencial';
            } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_DUO_PRICE_ID) {
                credits = 110;
                planName = 'duo';
            } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PROFESIONAL_PRICE_ID) {
                credits = 220;
                planName = 'profesional';
            } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_CLINICA_PRICE_ID) {
                credits = 400;
                planName = 'clinica';
            } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_CENTRO_PRICE_ID) {
                credits = 650;
                planName = 'centro';
            }

            if (credits > 0) {
                console.log(`💳 Asignando ${credits} créditos a ${userEmail} (${planName})`);

                // Guardar en Supabase (Tabla 'profiles')
                // Usamos upsert para crear si no existe o actualizar si ya existe
                const { error } = await supabaseAdmin
                    .from('profiles') // Asegúrate que tu tabla se llama así
                    .upsert({
                        email: userEmail,
                        credits_limit: credits, // O sumar si quisieras acumular
                        plan_type: planName,
                        stripe_customer_id: session.customer,
                        stripe_session_id: session.id,
                        amount_paid: amountTotal,
                        amount_discount: amountDiscount,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'email' });

                if (error) {
                    console.error('❌ Error guardando en Supabase:', error);
                    return new NextResponse('Database Error', { status: 500 });
                }

                console.log(`✅ Usuario ${userEmail} actualizado con ${credits} créditos (Plan: ${planName})`);
            } else {
                console.warn(`⚠️ No se pudo determinar créditos para priceId: ${priceId}`);
            }
        } else {
            console.warn(`⚠️ Falta email o priceId. Email: ${userEmail}, PriceID: ${priceId}`);
        }
    }

    return NextResponse.json({ received: true });
}
