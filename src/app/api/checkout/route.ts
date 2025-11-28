import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const CheckoutSchema = z.object({
  priceId: z.string().min(1, 'El ID de precio es requerido'),
  email: z.string().email('Email inválido').optional(),
  promoCode: z.string().optional(),
});

const VALID_PRICE_IDS = [
  process.env.NEXT_PUBLIC_STRIPE_FLASH_PRICE_ID,
  process.env.NEXT_PUBLIC_STRIPE_ESENCIAL_PRICE_ID,
  process.env.NEXT_PUBLIC_STRIPE_DUO_PRICE_ID,
  process.env.NEXT_PUBLIC_STRIPE_PROFESIONAL_PRICE_ID,
  process.env.NEXT_PUBLIC_STRIPE_CLINICA_PRICE_ID,
  process.env.NEXT_PUBLIC_STRIPE_CENTRO_PRICE_ID,
  process.env.STRIPE_TEST_PRICE_ID,
].filter(Boolean) as string[];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[Checkout] Request Body:', body);

    const validatedData = CheckoutSchema.parse(body);

    console.log('[Checkout] Validating Price ID:', validatedData.priceId);
    console.log('[Checkout] Valid IDs:', VALID_PRICE_IDS);

    if (!VALID_PRICE_IDS.includes(validatedData.priceId)) {
      console.error('[Checkout] Invalid Price ID:', validatedData.priceId);
      return NextResponse.json({ error: 'Plan no válido' }, { status: 400 });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY no configurada en variables de entorno');
    }

    // 1. CORRECCIÓN: Usamos la versión estable por defecto para evitar errores
    const stripe = new Stripe(stripeSecretKey, {
      typescript: true,
    });

    // 2. CORRECCIÓN CRÍTICA: Definición robusta del dominio de retorno
    // Esto soluciona el error 500 al evitar 'localhost' en producción
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const host = request.headers.get('host') || 'inforia.pro';
    const origin = process.env.NEXT_PUBLIC_URL || `${protocol}://${host}`;

    console.log(`[Checkout] Iniciando sesión para: ${validatedData.email} | Origen: ${origin}`);

    // 3. Determinar el modo (subscription vs payment) dinámicamente
    const priceInfo = await stripe.prices.retrieve(validatedData.priceId);
    const mode = priceInfo.type === 'recurring' ? 'subscription' : 'payment';

    console.log('[Checkout] Creating session:', {
      priceId: validatedData.priceId,
      mode,
      promoCode: validatedData.promoCode,
      allow_promotion_codes: true
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: validatedData.priceId,
          quantity: 1,
        },
      ],
      mode: mode,
      // discounts: discounts, // Desactivado para permitir entrada manual
      allow_promotion_codes: true, // Siempre mostrar la casilla de cupón
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
      customer_email: validatedData.email,
      locale: 'es',
      billing_address_collection: 'auto',
      metadata: {
        source: 'landing-page',
        promo_campaign: validatedData.promoCode || 'none'
      },
    });

    return NextResponse.json({ success: true, url: session.url, sessionId: session.id });

  } catch (error: any) {
    console.error('❌ Error crítico en checkout:', error);
    return NextResponse.json(
      {
        error: error.message || 'Error interno del servidor',
        code: error.code
      },
      { status: 500 }
    );
  }
}