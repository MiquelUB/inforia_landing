import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

// Schema de validación para el lead magnet
const LeadMagnetSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  role: z.string().min(1, 'El rol es requerido'),
});

type LeadMagnetPayload = z.infer<typeof LeadMagnetSchema>;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos con Zod
    const validatedData = LeadMagnetSchema.parse(body);

    // URL del Webhook de Make.com (Actualizada para Demo)
    const makeWebhookUrl = "https://hook.eu2.make.com/6w8ubhn2d92b7fx4s795ry5euccslbdm";

    /* 
    // Anteriormente usábamos variable de entorno, pero estaba desactualizada
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_LEAD;
    if (!makeWebhookUrl) { ... } 
    */

    console.log('🚀 Enviando a Make.com:', makeWebhookUrl);
    console.log('📦 Payload:', {
      ...validatedData,
      timestamp: new Date().toISOString(),
      source: 'landing-page',
    });

    // Enviar datos al webhook de Make.com
    const makeResponse = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...validatedData,
        timestamp: new Date().toISOString(),
        source: 'landing-page',
      }),
    });

    console.log('✅ Respuesta de Make:', makeResponse.status, makeResponse.statusText);

    if (!makeResponse.ok) {
      const errorText = await makeResponse.text();
      console.error(`❌ Error en Make.com: ${makeResponse.statusText}`, errorText);
      return NextResponse.json(
        { error: 'Error al procesar la solicitud' },
        { status: 500 }
      );
    }

    const makeData = await makeResponse.text();
    console.log('📥 Datos de Make:', makeData);

    return NextResponse.json(
      {
        success: true,
        message: 'Lead capturado correctamente. ¡Revisa tu email!',
        data: {
          name: validatedData.name,
          email: validatedData.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // Manejo de errores de validación de Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('Error en lead-magnet route:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
