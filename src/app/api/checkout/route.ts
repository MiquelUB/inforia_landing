import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Schema de validación para checkout
const CheckoutSchema = z.object({
  priceId: z.string().min(1, 'El ID de precio es requerido'),
  email: z.string().email('Email inválido').optional(),
});

type CheckoutPayload = z.infer<typeof CheckoutSchema>;

// Lista de Price IDs válidos permitidos
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

    // Validar datos con Zod
    const validatedData = CheckoutSchema.parse(body);

    // Verificar que el priceId sea válido (seguridad contra injection)
    if (!VALID_PRICE_IDS.includes(validatedData.priceId)) {
      console.error(`⚠️ Intento de checkout con Price ID inválido: ${validatedData.priceId}`);
      return NextResponse.json(
        { error: 'Plan no válido o no disponible' },
        { status: 400 }
      );
    }

    // Inicializar cliente de Stripe
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY no está configurado');
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-11-17.clover',
    });

    // Obtener la URL de origen para las redirecciones
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Crear sesión de Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: validatedData.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
      customer_email: validatedData.email,
      locale: 'es',
      billing_address_collection: 'auto',
      metadata: {
        source: 'landing-page',
      },
    });

    if (!session.url) {
      console.error('Session URL no disponible');
      return NextResponse.json(
        { error: 'Error al crear sesión de Stripe' },
        { status: 500 }
      );
    }

    console.log(`✓ Sesión de Stripe creada: ${session.id}`);
    
    return NextResponse.json(
      {
        success: true,
        sessionId: session.id,
        url: session.url,
      },
      { status: 200 }
    );
  } catch (error) {
    // Manejo de errores de validación de Zod
    if (error instanceof z.ZodError) {
      console.error('❌ Error de validación:', error.issues);
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    // Manejo de errores de Stripe
    if (error instanceof Stripe.errors.StripeError) {
      console.error('❌ Error de Stripe:', error.message);
      
      // Errores específicos de Stripe
      if (error.message.includes('No such price')) {
        return NextResponse.json(
          { error: 'Price ID no existe en Stripe. Verifica tu configuración.' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Error en el procesamiento de pago' },
        { status: 500 }
      );
    }

    console.error('❌ Error en checkout route:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
