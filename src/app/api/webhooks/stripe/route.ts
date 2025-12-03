import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// 1. Configuración de Clientes
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any, // Usa la versión de tu dashboard
  typescript: true,
});

const resend = new Resend(process.env.RESEND_API_KEY);
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  // Usamos Service Role para poder escribir en la tabla 'access_invitations' sin restricciones RLS
  // Inicializamos dentro del handler para evitar errores en build time si faltan las env vars
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
  );

  const body = await req.text();
  const signature = (await headers()).get('stripe-signature')!;

  let event: Stripe.Event;

  // 2. Verificación de Firma de Stripe (Seguridad Crítica)
  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err: any) {
    console.error(`❌ Error verifying webhook signature: ${err.message}`);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // 3. Procesar Evento: Pago Completado
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Extraer datos clave
    const emailPago = session.customer_details?.email;
    
    // Recuperar metadatos (inyectados en /api/checkout/route.ts)
    // Si no vienen, usamos valores por defecto (ej. Plan Flash)
    const planType = session.metadata?.planType || 'flash'; 
    const credits = parseInt(session.metadata?.seats || '1') * (planType === 'flash' ? 5 : 100); 
    // Nota: Ajusta la lógica de créditos según tus reglas. Aquí asumo: Flash=5, Otros=100*seats

    if (!emailPago) {
      console.error('❌ No email found in session');
      return NextResponse.json({ error: 'No email provided' }, { status: 400 });
    }

    console.log(`💰 Pago recibido de: ${emailPago}. Plan: ${planType}. Generando invitación...`);

    try {
      // 4. Generar Token Único de Reclamación (El "Vale")
      const token = crypto.randomUUID();

      // 5. Guardar en tabla intermedia 'access_invitations'
      const { error: dbError } = await supabaseAdmin
        .from('access_invitations')
        .insert({
          token: token,
          payment_email: emailPago,
          stripe_customer_id: session.customer as string,
          plan_type: planType,
          credits_limit: credits, // Guardamos los créditos comprados
          status: 'pending'       // Estado inicial
        });

      if (dbError) {
        console.error('❌ Error guardando invitación en Supabase:', dbError);
        throw dbError;
      }

      // 6. Construir el Enlace Mágico
      // Debe apuntar al Login del SaaS, pasando el token como parámetro
      const saasUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const activationLink = `${saasUrl}/login?token=${token}`;

      // 7. Enviar Email Transaccional (Resend)
      const emailResponse = await resend.emails.send({
        from: 'Inforia <hola@inforia.pro>', // ¡Verifica que este remitente esté autorizado en Resend!
        to: emailPago,
        subject: '🚀 Activa tu cuenta de Inforia',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h1 style="color: #2E403B;">¡Gracias por tu compra!</h1>
            <p>Tu plan <strong>${planType.toUpperCase()}</strong> con <strong>${credits} créditos</strong> está listo.</p>
            <p>Para acceder a la plataforma y vincular esta licencia a tu cuenta de Google, haz clic aquí:</p>
            
            <a href="${activationLink}" style="display: inline-block; background-color: #2E403B; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold;">
              Activar mi Cuenta
            </a>
            
            <p style="font-size: 14px; margin-top: 20px;">
              <strong>Importante:</strong> Al hacer clic, se te pedirá iniciar sesión con tu cuenta de Google profesional para completar la activación.
            </p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
            
            <p style="font-size: 12px; color: #888;">
              Si el botón no funciona, copia y pega este enlace: <br>
              ${activationLink}
            </p>
          </div>
        `
      });

      console.log(`✅ Invitación enviada a ${emailPago} con token ${token}`);
      
      return NextResponse.json({ 
        received: true, 
        status: 'success',
        data: {
          email: emailPago,
          plan: planType,
          credits: credits,
          dbSaved: true,
          emailId: emailResponse.data?.id,
          emailError: emailResponse.error
        }
      });

    } catch (error: any) {
      console.error('❌ Error procesando invitación:', error);
      // Devolvemos 500 para que Stripe reintente si fue un error transitorio
      return NextResponse.json({ 
        error: 'Internal Server Error', 
        details: error.message,
        stack: error.stack 
      }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true, status: 'ignored', reason: 'Event type not handled' });
}
