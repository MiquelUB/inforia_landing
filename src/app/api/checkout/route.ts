import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// 1. Inicialización de Stripe (Lado Servidor)
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Falta la variable STRIPE_SECRET_KEY en .env.local');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16' as any, // Asegúrate de que coincida con tu versión en Stripe Dashboard
});

// 2. Whitelist de Precios Válidos (Seguridad)
// Solo permitimos los IDs que tú has configurado en el entorno
const VALID_PRICE_IDS = [
  process.env.NEXT_PUBLIC_STRIPE_PRICE_FLASH,
  process.env.NEXT_PUBLIC_STRIPE_FLASH_PRICE_ID,
  
  process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
  process.env.NEXT_PUBLIC_STRIPE_PROFESIONAL_PRICE_ID,
  
  process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_PLUS,
  process.env.NEXT_PUBLIC_STRIPE_DUO_PRICE_ID,
  
  process.env.NEXT_PUBLIC_STRIPE_PRICE_EQUIPO,
  process.env.NEXT_PUBLIC_STRIPE_EQUIPO_PRICE_ID,
  
  process.env.NEXT_PUBLIC_STRIPE_PRICE_CLINICA,
  process.env.NEXT_PUBLIC_STRIPE_CLINICA_PRICE_ID,
  
  process.env.NEXT_PUBLIC_STRIPE_PRICE_CENTRO,
  process.env.NEXT_PUBLIC_STRIPE_CENTRO_PRICE_ID,
  
  process.env.NEXT_PUBLIC_STRIPE_PRICE_CENTRO_PLUS,
  process.env.NEXT_PUBLIC_STRIPE_CENTRO_PLUS_PRICE_ID,
].filter(Boolean); // Filtra undefineds si alguna variable falta

export async function POST(req: Request) {
  try {
    // 3. Parsear el body
    const body = await req.json();
    const { priceId, quantity = 1, email } = body;

    // 4. Validaciones
    if (!priceId || !VALID_PRICE_IDS.includes(priceId)) {
      console.error(`Intento de compra con ID no válido: ${priceId}`);
      return NextResponse.json(
        { error: 'El plan seleccionado no es válido o no está disponible.' },
        { status: 400 }
      );
    }

    // Validación específica para Centro Plus (Opcional, doble check de seguridad)
    const isCentroPlus = priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_CENTRO_PLUS || priceId === process.env.NEXT_PUBLIC_STRIPE_CENTRO_PLUS_PRICE_ID;
    if (isCentroPlus && quantity < 6) {
      return NextResponse.json(
        { error: 'El plan Centro Plus requiere un mínimo de 6 usuarios.' },
        { status: 400 }
      );
    }

    console.log(`📦 Creando sesión: Plan ${priceId} | Cantidad: ${quantity}`);

    // 4.b Buscar Cliente Existente
    let customerId = undefined;
    if (email) {
      try {
        const customers = await stripe.customers.list({
          email: email,
          limit: 1,
        });
        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
          console.log(`✅ Cliente existente encontrado: ${customerId} (${email})`);
        }
      } catch (err) {
        console.warn('Error buscando cliente por email, se procederá como nuevo cliente:', err);
      }
    }

    // 5. Configurar Parámetros de la Sesión
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      // Detectar modo: Flash es pago único ("payment"), el resto son suscripciones ("subscription")
      mode: (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_FLASH || priceId === process.env.NEXT_PUBLIC_STRIPE_FLASH_PRICE_ID) ? 'payment' : 'subscription',
      
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/?canceled=true`,
      
      // Metadatos clave para tu Webhook en Supabase
      metadata: {
        priceId: priceId, // <--- CRÍTICO: El webhook busca 'priceId'
        planId: priceId,
        seats: quantity.toString(),
        planType: 'flash', // Valor por defecto
      },
      
      // Recopilación de datos fiscales (NIF/DNI) automática
      tax_id_collection: {
        enabled: true,
      },
      
      // Permitir códigos promocionales
      allow_promotion_codes: true,
    };

    // 6. Asignar Cliente o Email
    if (customerId) {
      sessionParams.customer = customerId;
      // IMPORTANTE: Si pasas 'customer', NO puedes pasar 'customer_email' ni 'customer_creation'
    } else if (email) {
      sessionParams.customer_email = email;
      sessionParams.customer_creation = 'always';
    }

    // 7. Crear Sesión
    const session = await stripe.checkout.sessions.create(sessionParams);

    // 6. Retornar URL
    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('❌ Error en Stripe Checkout:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
};