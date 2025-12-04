import { serve } from "std/http/server.ts";
import Stripe from "stripe";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!webhookSecret || !stripeSecretKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required environment variables");
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });
    const signature = req.headers.get("stripe-signature");
    if (!signature) throw new Error("Missing stripe-signature header");

    const body = await req.text();
    let event;

    // FIX 1: Verificación asíncrona para Deno
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: err.message }), { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event, stripe, supabase);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event, stripe, supabase);
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event, stripe, supabase);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event, stripe, supabase);
        break;
      default:
        console.log("Unhandled event type:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

async function handleCheckoutCompleted(event: Stripe.Event, stripe: Stripe, supabase: SupabaseClient) {
  const session = event.data.object as Stripe.Checkout.Session;

  // FIX 2: Expandir datos necesarios para leer metadatos
  const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: [
      'customer',
      'line_items.data.price.product', // Expandir producto para leer metadatos globales
      'total_details.breakdown.discounts'
    ]
  });

  const customerEmail = expandedSession.customer_details?.email;
  const customerName = expandedSession.customer_details?.name;

  if (!customerEmail) throw new Error("No email found in checkout session");

  // --- LÓGICA DINÁMICA DE PLANES (Soporte para 6+ planes) ---
  // Valores por defecto
  let planType = 'professional';
  let creditsLimit = 100;

  // Leemos el primer item de la compra
  const mainItem = expandedSession.line_items?.data[0];
  const priceMetadata = mainItem?.price?.metadata;
  // También intentamos leer del producto si el precio no tiene metadata
  const productMetadata = (mainItem?.price?.product as any)?.metadata;

  const metadata = { ...productMetadata, ...priceMetadata }; // Prioridad al precio

  if (metadata) {
    // 1. Tipo de Plan
    if (metadata.plan_type) {
      planType = metadata.plan_type;
      console.log(`✅ Plan detectado vía metadatos: ${planType}`);
    }

    // 2. Créditos
    if (metadata.credits) {
      creditsLimit = parseInt(metadata.credits);
      console.log(`✅ Créditos detectados vía metadatos: ${creditsLimit}`);
    }

    // 3. Seats (Si decides añadirlos a tu DB en el futuro)
    if (metadata.seats) {
      console.log(`✅ Seats detectados vía metadatos: ${metadata.seats} (Nota: Requiere columna en DB)`);
      // Si tuvieras una columna 'seats' en profiles, la añadiríamos aquí.
    }
  }

  // --- LÓGICA DE CUPONES ---
  // Si el cupón define créditos (ej. pack extra), sobreescribe o suma
  const discounts = expandedSession.total_details?.breakdown?.discounts;
  if (discounts && discounts.length > 0) {
    const coupon = discounts[0].discount?.coupon;
    if (coupon?.metadata?.credits) {
      // Si es un cupón de "recarga", quizás quieras sumar, pero aquí asignamos el valor del cupón
      creditsLimit = parseInt(coupon.metadata.credits);
      console.log(`🎟️ Cupón aplicado: Asignando créditos a ${creditsLimit}`);
    }
  }

  // DNI/NIF
  let nifDni = null;
  if (expandedSession.custom_fields) {
    const dniField = expandedSession.custom_fields.find((f: any) => f.key === 'dni_nif');
    if (dniField) nifDni = dniField.text?.value;
  }

  // FIX 3: Crear usuario en Auth si no existe (Evita error Foreign Key)
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', customerEmail)
    .single();

  let userId = existingProfile?.id;

  if (!userId) {
    console.log("Creating new Auth user for:", customerEmail);
    const { data: authData, error: _authError } = await supabase.auth.admin.createUser({
      email: customerEmail,
      email_confirm: true,
      user_metadata: { full_name: customerName }
    });

    if (authData.user) {
      userId = authData.user.id;
    } else {
      // Fallback si el usuario ya existe en Auth pero no en profiles
      const { data: usersData } = await supabase.auth.admin.listUsers();
      const existingUser = usersData?.users.find((u: any) => u.email === customerEmail);
      if (existingUser) userId = existingUser.id;
    }
  }

  if (!userId) throw new Error("Could not resolve User ID");

  // Upsert Profile
  const profileData = {
    id: userId,
    email: customerEmail,
    full_name: customerName,
    credits_limit: creditsLimit, // ¡Valor dinámico!
    credits_used: 0,
    plan_type: planType,         // ¡Valor dinámico!
    subscription_status: 'active',
    billing_name: customerName,
    billing_email: customerEmail,
    nif_dni: nifDni,
    updated_at: new Date().toISOString()
  };

  const { error: upsertError } = await supabase.from('profiles').upsert(profileData);
  if (upsertError) throw upsertError;

  console.log(`Success! Profile updated. Plan: ${planType}, Credits: ${creditsLimit}`);
}

// Handlers auxiliares para otros eventos (simplificados para mantener la lógica existente)
async function handleSubscriptionUpdated(event: Stripe.Event, stripe: Stripe, supabase: SupabaseClient) {
  const subscription = event.data.object;
  const customerEmail = await getCustomerEmail(subscription.customer, stripe);
  if (!customerEmail) return;

  const status = subscription.status === 'active' ? 'active' : 'inactive';
  await supabase.from('profiles').update({ subscription_status: status }).eq('email', customerEmail);
}

async function handleInvoicePaymentSucceeded(event: Stripe.Event, stripe: Stripe, supabase: SupabaseClient) {
  // Lógica para renovar créditos o activar suscripción podría ir aquí
  const invoice = event.data.object;
  const customerEmail = await getCustomerEmail(invoice.customer, stripe);
  if (customerEmail) {
    await supabase.from('profiles').update({ subscription_status: 'active' }).eq('email', customerEmail);
  }
}

async function handleInvoicePaymentFailed(event: Stripe.Event, stripe: Stripe, supabase: SupabaseClient) {
  const invoice = event.data.object;
  const customerEmail = await getCustomerEmail(invoice.customer, stripe);
  if (customerEmail) {
    await supabase.from('profiles').update({ subscription_status: 'past_due' }).eq('email', customerEmail);
  }
}

// Helper para obtener email
async function getCustomerEmail(customerId: string | any, stripe: Stripe): Promise<string | null> {
  if (typeof customerId === 'object' && customerId.email) return customerId.email;
  if (typeof customerId === 'string') {
    const customer = await stripe.customers.retrieve(customerId);
    return (customer as any).email || null;
  }
  return null;
};