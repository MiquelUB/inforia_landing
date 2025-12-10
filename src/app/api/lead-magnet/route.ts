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
    console.log('🚀 [LeadMagnet] Recibida petición POST en /api/lead-magnet');
    const body = await request.json();

    // Validar datos con Zod
    const validatedData = LeadMagnetSchema.parse(body);

    // Obtener el webhook URL de Make.com desde variables de entorno
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_LEAD;

    // Masked logging for security
    const maskedUrl = makeWebhookUrl 
      ? `${makeWebhookUrl.substring(0, 15)}...${makeWebhookUrl.substring(makeWebhookUrl.length - 5)}`
      : 'UNDEFINED';

    console.log(`🔍 [LeadMagnet] MAKE_WEBHOOK_LEAD: ${maskedUrl}`);

    if (!makeWebhookUrl) {
      console.error('❌ [LeadMagnet] MAKE_WEBHOOK_LEAD no está configurado');
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta' },
        { status: 500 }
      );
    }

    console.log('📦 [LeadMagnet] Payload a enviar:', {
      ...validatedData,
      timestamp: new Date().toISOString(),
      source: 'landing-page',
    });

    // Enviar datos al webhook de Make.com
    console.log('⏳ [LeadMagnet] Iniciando fetch a Make.com...');
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

    console.log(`✅ [LeadMagnet] Respuesta de Make: Status ${makeResponse.status} ${makeResponse.statusText}`);

    if (!makeResponse.ok) {
      const errorText = await makeResponse.text();
      console.error(`❌ [LeadMagnet] Error en Make.com: ${makeResponse.statusText}`, errorText);
      return NextResponse.json(
        { error: 'Error al procesar la solicitud' },
        { status: 500 }
      );
    }

    const makeData = await makeResponse.text();
    console.log('📥 [LeadMagnet] Datos recibidos de Make:', makeData);

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
      console.warn('⚠️ [LeadMagnet] Error de validación Zod:', error.flatten());
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('🔥 [LeadMagnet] Error interno no controlado:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
