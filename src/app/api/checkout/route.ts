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
].filter(Boolean) as string[];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CheckoutSchema.parse(body);

    if (!VALID_PRICE_IDS.includes(validatedData.priceId)) {
      return NextResponse.json({ error: 'Plan no válido' }, { status: 400 });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY no configurada');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia' as any, // Versión estable
      typescript: true,
    });

    // --- CORRECCIÓN DE LA CAUSA 1 ---
    // 1. Si definimos NEXT_PUBLIC_URL en Vercel, usa esa (la más segura).
    // 2. Si no, intenta leer la cabecera 'origin'.
    // 3. Si todo falla, usa explícitamente tu dominio real 'https://inforia.pro'.
    // 4. Solo usa localhost si estamos en desarrollo.
    const productionUrl = 'https://inforia.pro';
    
    let origin = request.headers.get('origin');
    
    if (process.env.NODE_ENV === 'production') {
      // En producción FORZAMOS tu dominio real o la variable de entorno
      origin = process.env.NEXT_PUBLIC_URL || productionUrl;
    } else {
      // En local, nos vale localhost
      origin = origin || 'http://localhost:3000';
    }
    // --------------------------------

    let discounts = undefined;
    if (
      validatedData.promoCode === 'FLASH5' && 
      validatedData.priceId === process.env.NEXT_PUBLIC_STRIPE_FLASH_PRICE_ID
    ) {
       if (process.env.STRIPE_COUPON_FLASH_ID) {
         discounts = [{ coupon: process.env.STRIPE_COUPON_FLASH_ID }];
       }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: validatedData.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription', 
      discounts: discounts,
      allow_promotion_codes: !discounts,
      // Aquí usamos la variable 'origin' ya corregida
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
    console.error('❌ Error detallado:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Error interno del servidor',
        code: error.code 
      },
      { status: 500 }
    );
  }
}