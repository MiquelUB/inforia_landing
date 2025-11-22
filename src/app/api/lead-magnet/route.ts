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

    // Obtener el webhook URL de Make.com desde variables de entorno
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_LEAD;

    if (!makeWebhookUrl) {
      console.error('MAKE_WEBHOOK_LEAD no está configurado');
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta' },
        { status: 500 }
      );
    }

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

    if (!makeResponse.ok) {
      console.error(`Error en Make.com: ${makeResponse.statusText}`);
      return NextResponse.json(
        { error: 'Error al procesar la solicitud' },
        { status: 500 }
      );
    }

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
