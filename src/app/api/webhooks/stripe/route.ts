import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Resend } from 'resend';

// Evitamos error en build si falta la API Key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy123456789', {
  typescript: true,
});

// Evitamos error en build si falta la API Key
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Error de Firma Webhook: ${errorMessage}`);
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  // 1. PAGO EXITOSO / CHECKOUT COMPLETADO
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
    const customerName = session.customer_details?.name || 'Profesional';

    if (customerEmail && priceId) {
      // --- LÓGICA DE ASIGNACIÓN DE CRÉDITOS ---
      let creditsToAdd = 0;
      let planType = 'free';
      let planDisplayName = 'Plan';

      // Mapa de planes
      if (priceId === process.env.NEXT_PUBLIC_STRIPE_FLASH_PRICE_ID) {
        creditsToAdd = 5;
        planType = 'promo_flash';
        planDisplayName = 'Pack Bienvenida';
      } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_ESENCIAL_PRICE_ID) {
        creditsToAdd = 50;
        planType = 'esencial';
        planDisplayName = 'Plan Esencial';
      } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_DUO_PRICE_ID) {
        creditsToAdd = 110;
        planType = 'duo';
        planDisplayName = 'Plan Dúo';
      } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PROFESIONAL_PRICE_ID) {
        creditsToAdd = 220;
        planType = 'profesional';
        planDisplayName = 'Plan Profesional';
      } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_CLINICA_PRICE_ID) {
        creditsToAdd = 400;
        planType = 'clinica';
        planDisplayName = 'Plan Clínica';
      } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_CENTRO_PRICE_ID) {
        creditsToAdd = 650;
        planType = 'centro';
        planDisplayName = 'Plan Centro';
      }

      console.log(`📦 PLAN DETECTADO: ${planType} (+${creditsToAdd} créditos)`);

      try {
        // 1. GESTIÓN DE USUARIO (AUTH)
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = users.find(u => u.email === customerEmail);

        let userId = existingUser?.id;
        let isNewUser = false;

        if (!userId) {
          isNewUser = true;
          console.log(`👤 Creando nuevo usuario para: ${customerEmail}`);
          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: customerEmail,
            email_confirm: true,
            user_metadata: { full_name: customerName }
          });

          if (createError) throw createError;
          userId = newUser.user?.id;
          console.log(`✅ Usuario creado en Auth con ID: ${userId}`);
        } else {
          console.log(`👤 Usuario existente encontrado: ${userId}`);
        }

        // 2. GESTIÓN DE PERFIL (BASE DE DATOS)
        if (userId && creditsToAdd > 0) {
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('credits_limit')
            .eq('id', userId)
            .single();

          const currentCredits = profile?.credits_limit || 0;
          const newTotalCredits = currentCredits + creditsToAdd;

          console.log(`💳 Créditos actuales: ${currentCredits} | Añadiendo: ${creditsToAdd} | Total: ${newTotalCredits}`);

          const { error: upsertError } = await supabaseAdmin
            .from('profiles')
            .upsert({
              id: userId,
              email: customerEmail,
              full_name: customerName,
              credits_limit: newTotalCredits,
              plan_type: planType,
              stripe_customer_id: session.customer as string,
              stripe_session_id: session.id,
              amount_paid: session.amount_total || 0,
              amount_discount: session.total_details?.amount_discount || 0,
              updated_at: new Date().toISOString()
            }, { onConflict: 'id' });

          if (upsertError) throw upsertError;

          console.log(`✅ ÉXITO: Usuario ${customerEmail} actualizado. Saldo total: ${newTotalCredits} créditos`);

          // 3. ENVIAR EMAIL DE ONBOARDING (ÉXITO)
          console.log("Profile processed. Sending onboarding email...");

          try {
            await resend.emails.send({
              from: 'INFORIA <onboarding@mail.inforia.pro>',
              to: [customerEmail],
              subject: '¡Bienvenido a INFORIA! Tu cuenta está activa 🚀',
              html: `
                <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                  <h1 style="color: #2E403B;">¡Ya eres parte de INFORIA!</h1>
                  <p>Hola <strong>${customerName}</strong>,</p>
                  <p>Tu suscripción al <strong>${planDisplayName}</strong> se ha confirmado con éxito.</p>
                  
                  <div style="background-color: #f4f4f5; padding: 24px; border-radius: 12px; margin: 30px 0; text-align: center;">
                    <p style="margin-bottom: 20px; font-size: 16px;">Tu Puesto de Mando Clínico está listo.</p>
                    <a href="https://app.inforia.pro/login" style="background-color: #2E403B; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Acceder a INFORIA Ahora</a>
                  </div>

                  <p style="color: #666; font-size: 14px;">Si el botón no funciona, copia este enlace: https://app.inforia.pro/login</p>
                  
                  <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                  <p style="font-size: 12px; color: #888;">INFORIA - Inteligencia Clínica para Psicólogos</p>
                </div>
              `
            });
            console.log("✅ Onboarding email sent");
          } catch (emailError: unknown) {
            const emailErrorMessage = emailError instanceof Error ? emailError.message : 'Unknown email error';
            console.error("❌ Failed to send onboarding email:", emailErrorMessage);
          }

        } else if (creditsToAdd === 0) {
          console.warn(`⚠️ No se asignaron créditos para el priceId: ${priceId}`);
        }

      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('❌ Error procesando usuario en Supabase:', errorMessage);
        console.error('Stack:', err);
      }
    } else {
      console.warn(`⚠️ Falta email o priceId. Email: ${customerEmail}, PriceID: ${priceId}`);
    }
  }

  // 2. PAGO FALLIDO / INVOICE PAYMENT FAILED
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const customerEmail = invoice.customer_email;

    console.log(`❌ Pago fallido para invoice: ${invoice.id}, cliente: ${customerEmail}`);

    // Aquí podrías actualizar el estado en Supabase si tuvieras un campo 'status' o 'subscription_status'
    // Ejemplo: await supabaseAdmin.from('profiles').update({ subscription_status: 'past_due' }).eq('email', customerEmail);

    console.log("Payment failure logged. Sending alert email...");

    try {
      if (customerEmail) {
        await resend.emails.send({
          from: 'INFORIA Pagos <billing@mail.inforia.pro>',
          to: [customerEmail],
          subject: 'Acción necesaria: Hubo un problema con tu pago ⚠️',
          html: `
            <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #991b1b;">No hemos podido procesar tu pago</h2>
              <p>Hola,</p>
              <p>Hemos intentado renovar tu suscripción a INFORIA, pero la transacción ha sido rechazada por tu banco.</p>
              
              <p><strong>Para evitar la interrupción de tu servicio y mantener acceso a tus informes, por favor actualiza tu método de pago lo antes posible.</strong></p>
              
              <div style="margin: 30px 0;">
                <a href="https://app.inforia.pro/billing" style="background-color: #991b1b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Actualizar Método de Pago</a>
              </div>

              <p>Intentaremos realizar el cobro de nuevo en unos días.</p>
              <p>Atentamente,<br/>El equipo de Facturación de INFORIA</p>
            </div>
          `
        });
        console.log("✅ Payment failed email sent");
      }
    } catch (emailError: unknown) {
      const emailErrorMessage = emailError instanceof Error ? emailError.message : 'Unknown email error';
      console.error("❌ Failed to send payment failed email:", emailErrorMessage);
    }
  }

  return NextResponse.json({ received: true });
}
