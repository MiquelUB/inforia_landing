import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin"; // Importamos nuestro cliente admin

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error: any) {
        console.error(`❌ Error de Firma Webhook: ${error.message}`);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    // Solo nos interesa cuando el pago (o registro gratuito) se completa
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`🔔 Pago recibido: ${session.id}`);

        // Recuperar líneas de pedido para saber qué plan es
        const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ['line_items']
        });
        const lineItems = expandedSession.line_items?.data || [];
        const priceId = lineItems[0]?.price?.id;

        // Datos del cliente
        const customerEmail = session.customer_email || session.customer_details?.email;
        const customerName = session.customer_details?.name || '';

        if (customerEmail && priceId) {
            // --- LÓGICA DE ASIGNACIÓN DE CRÉDITOS ---
            let creditsToAdd = 0;
            let planType = 'free';

            // Mapa de planes (Asegúrate que coinciden con tus variables de entorno)
            if (priceId === process.env.NEXT_PUBLIC_STRIPE_FLASH_PRICE_ID) {
                creditsToAdd = 5;
                planType = 'promo_flash';
            } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_ESENCIAL_PRICE_ID) {
                creditsToAdd = 50;
                planType = 'esencial';
            } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_DUO_PRICE_ID) {
                creditsToAdd = 110;
                planType = 'duo';
            } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PROFESIONAL_PRICE_ID) {
                creditsToAdd = 220;
                planType = 'profesional';
            } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_CLINICA_PRICE_ID) {
                creditsToAdd = 400;
                planType = 'clinica';
            } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_CENTRO_PRICE_ID) {
                creditsToAdd = 650;
                planType = 'centro';
            }

            console.log(`📦 PLAN DETECTADO: ${planType} (+${creditsToAdd} créditos)`);

            try {
                // 1. GESTIÓN DE USUARIO (AUTH)
                // Buscamos si el usuario ya existe en Supabase Auth
                const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
                const existingUser = users.find(u => u.email === customerEmail);

                let userId = existingUser?.id;

                // Si NO existe, lo creamos "silenciosamente"
                if (!userId) {
                    console.log(`👤 Creando nuevo usuario para: ${customerEmail}`);
                    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                        email: customerEmail,
                        email_confirm: true, // ¡Vital! Lo marcamos confirmado para que no pida verificar email
                        user_metadata: { full_name: customerName }
                        // No ponemos password, así el usuario usará "Login con Google" o "Magic Link"
                    });

                    if (createError) throw createError;
                    userId = newUser.user?.id;
                    console.log(`✅ Usuario creado en Auth con ID: ${userId}`);
                } else {
                    console.log(`👤 Usuario existente encontrado: ${userId}`);
                }

                // 2. GESTIÓN DE PERFIL (BASE DE DATOS)
                if (userId && creditsToAdd > 0) {
                    // Verificamos si ya tiene perfil
                    const { data: profile } = await supabaseAdmin
                        .from('profiles')
                        .select('credits_limit')
                        .eq('id', userId)
                        .single();

                    const currentCredits = profile?.credits_limit || 0;
                    const newTotalCredits = currentCredits + creditsToAdd;

                    console.log(`💳 Créditos actuales: ${currentCredits} | Añadiendo: ${creditsToAdd} | Total: ${newTotalCredits}`);

                    // Actualizamos o creamos el perfil
                    const { error: upsertError } = await supabaseAdmin
                        .from('profiles')
                        .upsert({
                            id: userId, // Vinculamos con el ID de Auth
                            email: customerEmail,
                            full_name: customerName,
                            credits_limit: newTotalCredits, // Sumamos créditos (acumulativo)
                            plan_type: planType,
                            stripe_customer_id: session.customer as string,
                            stripe_session_id: session.id,
                            amount_paid: session.amount_total || 0,
                            amount_discount: session.total_details?.amount_discount || 0,
                            updated_at: new Date().toISOString()
                        }, { onConflict: 'id' });

                    if (upsertError) throw upsertError;

                    console.log(`✅ ÉXITO: Usuario ${customerEmail} actualizado. Saldo total: ${newTotalCredits} créditos`);
                } else if (creditsToAdd === 0) {
                    console.warn(`⚠️ No se asignaron créditos para el priceId: ${priceId}`);
                }

            } catch (err: any) {
                console.error('❌ Error procesando usuario en Supabase:', err.message);
                console.error('Stack:', err);
                // No devolvemos error 500 a Stripe para evitar reintentos infinitos si es un error lógico
                // pero lo logueamos para revisarlo.
            }
        } else {
            console.warn(`⚠️ Falta email o priceId. Email: ${customerEmail}, PriceID: ${priceId}`);
        }
    }

    return NextResponse.json({ received: true });
}
