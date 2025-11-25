import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
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
      let planDisplayName = 'Plan';

      // Mapa de planes (Asegúrate que coinciden con tus variables de entorno)
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
        // Buscamos si el usuario ya existe en Supabase Auth
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = users.find(u => u.email === customerEmail);

        let userId = existingUser?.id;
        let isNewUser = false;

        // Si NO existe, lo creamos "silenciosamente"
        if (!userId) {
          isNewUser = true;
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

          // 3. ENVIAR EMAIL DE BIENVENIDA/CONFIRMACIÓN
          try {
            const emailSubject = isNewUser
              ? `¡Bienvenido a INFORIA! - ${planDisplayName}`
              : `Confirmación de Compra - ${planDisplayName}`;

            const emailHtml = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #2E403B 0%, #1a2621 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                  <h1 style="color: #FBF9F6; margin: 0; font-size: 28px;">¡${isNewUser ? 'Bienvenido' : 'Gracias'}, ${customerName || 'Usuario'}! 🎉</h1>
                </div>
                
                <div style="background: #FBF9F6; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <p style="font-size: 16px; color: #2E403B;">
                    ${isNewUser
                ? 'Tu cuenta en <strong>INFORIA</strong> ha sido creada exitosamente.'
                : 'Hemos recibido tu pago correctamente.'}
                  </p>
                  
                  <div style="background: white; border-left: 4px solid #2E403B; padding: 20px; margin: 20px 0; border-radius: 5px;">
                    <h2 style="color: #2E403B; margin-top: 0; font-size: 20px;">📊 Detalles de tu ${planDisplayName}</h2>
                    <p style="margin: 10px 0;"><strong>Créditos disponibles:</strong> <span style="color: #2E403B; font-size: 24px; font-weight: bold;">${newTotalCredits} informes</span></p>
                    <p style="margin: 10px 0;"><strong>Plan:</strong> ${planDisplayName}</p>
                    <p style="margin: 10px 0; color: #666; font-size: 14px;">
                      ${isNewUser
                ? 'Has recibido ' + creditsToAdd + ' créditos de bienvenida'
                : 'Se han añadido ' + creditsToAdd + ' nuevos créditos a tu cuenta'}
                    </p>
                  </div>

                  ${isNewUser ? `
                  <div style="background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #2E403B; margin-top: 0; font-size: 16px;">🚀 Primeros pasos</h3>
                    <ol style="color: #2E403B; margin: 10px 0; padding-left: 20px;">
                      <li>Accede a tu dashboard usando el botón de abajo</li>
                      <li>Inicia sesión con Google o tu email</li>
                      <li>Comienza a generar tus primeros informes</li>
                    </ol>
                  </div>
                  ` : ''}

                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://app.inforia.pro/login" 
                       style="display: inline-block; background: #2E403B; color: #FBF9F6; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
                      ${isNewUser ? '🎯 Ir a Mi Dashboard' : '📊 Acceder a Mi Cuenta'}
                    </a>
                  </div>

                  <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px;">
                    <p style="color: #666; font-size: 14px; margin: 10px 0;">
                      <strong>¿Necesitas ayuda?</strong><br>
                      Responde a este correo o escríbenos a <a href="mailto:soporte@inforia.pro" style="color: #2E403B;">soporte@inforia.pro</a>
                    </p>
                    <p style="color: #999; font-size: 12px; margin-top: 20px;">
                      Este correo fue enviado automáticamente. Por favor no respondas directamente a esta notificación.
                    </p>
                  </div>
                </div>

                <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                  <p>© ${new Date().getFullYear()} INFORIA - Asistente Clínico con IA</p>
                  <p>
                    <a href="https://inforia.pro/privacidad" style="color: #2E403B; margin: 0 10px;">Privacidad</a> |
                    <a href="https://inforia.pro/terminos" style="color: #2E403B; margin: 0 10px;">Términos</a>
                  </p>
                </div>
              </body>
              </html>
            `;

            await resend.emails.send({
              from: 'INFORIA <hola@inforia.pro>', // Verifica tu dominio en Resend
              to: customerEmail,
              subject: emailSubject,
              html: emailHtml,
            });

            console.log(`✉️ Email enviado a ${customerEmail}`);
          } catch (emailError: unknown) {
            const emailErrorMessage = emailError instanceof Error ? emailError.message : 'Unknown email error';
            console.error("❌ Error enviando email:", emailErrorMessage);
            // No bloqueamos el proceso si falla el email, los créditos son lo importante
          }

        } else if (creditsToAdd === 0) {
          console.warn(`⚠️ No se asignaron créditos para el priceId: ${priceId}`);
        }

      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('❌ Error procesando usuario en Supabase:', errorMessage);
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
