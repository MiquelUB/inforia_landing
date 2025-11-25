import { NextResponse } from 'next/server';

/**
 * Endpoint de verificación de configuración de Make.com
 * URL: /api/test-make
 */
export async function GET() {
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_LEAD;

    if (!makeWebhookUrl) {
        return NextResponse.json({
            status: 'error',
            message: 'MAKE_WEBHOOK_LEAD no está configurado',
            configured: false,
            instructions: [
                '1. Ve a Make.com y crea un webhook',
                '2. Copia la URL del webhook',
                '3. Añade MAKE_WEBHOOK_LEAD=tu_url en .env.local',
                '4. En Vercel: Settings → Environment Variables → Add',
            ]
        }, { status: 500 });
    }

    // Ocultar parte de la URL por seguridad
    const maskedUrl = makeWebhookUrl.substring(0, 30) + '...' + makeWebhookUrl.substring(makeWebhookUrl.length - 10);

    return NextResponse.json({
        status: 'success',
        message: 'Make.com webhook está configurado',
        configured: true,
        webhookUrl: maskedUrl,
        timestamp: new Date().toISOString()
    });
}

/**
 * Endpoint POST para probar el webhook con datos de prueba
 */
export async function POST() {
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_LEAD;

    if (!makeWebhookUrl) {
        return NextResponse.json({
            status: 'error',
            message: 'MAKE_WEBHOOK_LEAD no está configurado'
        }, { status: 500 });
    }

    try {
        // Datos de prueba
        const testData = {
            name: 'Test Usuario - Verificación',
            email: 'test-verificacion@inforia.pro',
            role: 'Test',
            timestamp: new Date().toISOString(),
            source: 'api-test-endpoint'
        };

        console.log('🧪 Enviando datos de prueba a Make.com...');

        const response = await fetch(makeWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        if (!response.ok) {
            throw new Error(`Make.com respondió con status ${response.status}`);
        }

        console.log('✅ Datos enviados exitosamente a Make.com');

        return NextResponse.json({
            status: 'success',
            message: 'Datos de prueba enviados a Make.com',
            testData,
            makeResponse: {
                status: response.status,
                statusText: response.statusText
            },
            instructions: 'Verifica en Make.com que el dato de prueba llegó correctamente'
        });

    } catch (error: any) {
        console.error('❌ Error enviando a Make.com:', error.message);

        return NextResponse.json({
            status: 'error',
            message: 'Error al enviar datos a Make.com',
            error: error.message,
            instructions: [
                '1. Verifica que la URL del webhook en Make.com está activa',
                '2. Verifica que el escenario en Make.com está activado',
                '3. Revisa los logs en Make.com para más detalles'
            ]
        }, { status: 500 });
    }
}
