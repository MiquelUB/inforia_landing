import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// 1. Configuración de Clientes
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
  typescript: true,
});

// Usamos Service Role para poder escribir en la tabla 'access_invitations' sin restricciones RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

const resend = new Resend(process.env.RESEND_API_KEY);
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  
  // ✅ CORRECCIÓN NEXT.JS 15+: headers() es asíncrono
  const headerList = await headers();
  const signature = headerList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature found' }, { status: 400 });
  }

  let event: Stripe.Event;

  // 2. Verificación de Firma de Stripe
  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err: any) {
    console.error(`❌ Error verifying webhook signature: ${err.message}`);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // 3. Procesar Evento: Pago Completado
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(`🔔 Pago recibido: ${session.id}`);

    const emailPago = session.customer_details?.email;
    
    // Recuperar Price ID (intentamos metadata o expandimos sesión si es necesario)
    let priceId = session.metadata?.priceId;
    
    // Fallback: Si no viene en metadata, intentamos obtenerlo de la sesión (aunque en webhook básico a veces requiere llamada extra)
    if (!priceId) {
       // Nota: En un entorno de alto volumen, idealmente haríamos stripe.checkout.sessions.retrieve con expand,
       // pero para este flujo intentaremos mapear lo que tengamos o usar un fallback seguro.
       // Si el checkout no envió metadata, Stripe no envía line_items por defecto en este evento.
       // Hacemos una llamada rápida para asegurar:
       try {
         const expanded = await stripe.checkout.sessions.retrieve(session.id, { expand: ['line_items'] });
         priceId = expanded.line_items?.data[0]?.price?.id;
       } catch (e) {
         console.warn('No se pudo expandir la sesión de Stripe', e);
       }
    }

    if (!emailPago || !priceId) {
      console.error('❌ Datos faltantes:', { emailPago, priceId });
      // No devolvemos 400 para no reintentar infinitamente si faltan datos irrecuperables
      return NextResponse.json({ error: 'Missing email or priceId' }, { status: 200 }); 
    }

    // --- 📊 LÓGICA DE ASIGNACIÓN (Sincronizada con tus Planes) ---
    let credits = 0;
    let planType = 'free';
    let planDisplayName = 'Plan';

    // 1. PLAN FLASH
    if (priceId === process.env.NEXT_PUBLIC_STRIPE_FLASH_PRICE_ID) {
      credits = 5;
      planType = 'flash';
      planDisplayName = 'Plan Flash';
    } 
    // 2. PLAN PRO (Individual) - 100 créditos
    else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) { // Asegúrate que la variable se llame así en tu .env
      credits = 100;
      planType = 'pro';
      planDisplayName = 'Plan PRO';
    } 
    // 3. PLAN PRO+ (Volumen Alto) - 200 créditos
    else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PLUS_PRICE_ID) {
      credits = 200;
      planType = 'pro_plus';
      planDisplayName = 'Plan PRO+';
    } 
    // 4. CENTRO PEQUEÑO (3 usuarios) - 300 créditos
    else if (priceId === process.env.NEXT_PUBLIC_STRIPE_SMALL_CENTER_PRICE_ID) {
      credits = 300;
      planType = 'small_center';
      planDisplayName = 'Centro Pequeño';
    } 
    // 5. CLÍNICA (4 usuarios) - 400 créditos
    else if (priceId === process.env.NEXT_PUBLIC_STRIPE_CLINICA_PRICE_ID) {
      credits = 400;
      planType = 'clinic';
      planDisplayName = 'Plan Clínica';
    } 
    // 6. CENTRO (5 usuarios) - 500 créditos
    else if (priceId === process.env.NEXT_PUBLIC_STRIPE_CENTER_PRICE_ID) {
      credits = 500;
      planType = 'center';
      planDisplayName = 'Plan Centro';
    } 
    // 7. EQUIPO ESCALADO (Dinámico)
    else if (priceId === process.env.NEXT_PUBLIC_STRIPE_SCALED_TEAM_PRICE_ID) {
      const seats = parseInt(session.metadata?.seats || '6');
      credits = seats * 100;
      planType = 'scaled_team';
      planDisplayName = `Equipo Escalado (${seats} usuarios)`;
    } 
    else {
        // Fallback para pruebas o IDs no reconocidos
        credits = 5;
        planType = 'flash'; 
        planDisplayName = 'Plan Básico (Fallback)';
        console.warn(`⚠️ ID de precio no reconocido: ${priceId}. Asignando default.`);
    }

    console.log(`📦 PLAN DETECTADO: ${planType} (${credits} créditos). Generando invitación...`);

    try {
      // 4. Generar Token Único
      const token = crypto.randomUUID();

      // 5. Guardar en 'access_invitations'
      const { error: dbError } = await supabaseAdmin
        .from('access_invitations')
        .insert({
          token: token,
          payment_email: emailPago,
          stripe_customer_id: session.customer as string,
          plan_type: planType,
          credits_limit: credits,
          status: 'pending'
        });

      if (dbError) throw dbError;

      // 6. Construir Enlace
      const saasUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const activationLink = `${saasUrl}/login?token=${token}`;

      // 7. Enviar Email
      await resend.emails.send({
        from: 'Inforia <onboarding@mail.inforia.pro>',
        to: emailPago,
        subject: '🚀 Activa tu cuenta de Inforia',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h1 style="color: #2E403B;">¡Gracias por tu compra!</h1>
            <p>Tu suscripción al <strong>${planDisplayName}</strong> (${credits} créditos) está lista.</p>
            
            <p>Para acceder a la plataforma y <strong>vincular esta licencia a tu cuenta de Google</strong>, haz clic aquí:</p>
            
            <a href="${activationLink}" style="display: inline-block; background-color: #2E403B; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold;">
              Activar mi Cuenta
            </a>
            
            <p style="font-size: 14px; margin-top: 20px; background-color: #f4f4f5; padding: 15px; border-radius: 5px;">
              <strong>⚠️ Importante:</strong> Al hacer clic, serás redirigido al inicio de sesión. Entra con tu cuenta de Google habitual para recibir tus créditos.
            </p>
          </div>
        `
      });

      console.log(`✅ Invitación enviada a ${emailPago} con token ${token}`);

    } catch (error) {
      console.error('❌ Error procesando invitación:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
