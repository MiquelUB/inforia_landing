/**
 * Script de prueba para verificar que el webhook de Make.com está activo
 * 
 * USO:
 * 1. Asegúrate de tener MAKE_WEBHOOK_LEAD en tu .env.local
 * 2. El servidor debe estar corriendo (npm run dev)
 * 3. Ejecuta: node test-make-webhook.mjs
 */

const TEST_DATA = {
    name: "Test Usuario",
    email: "test@ejemplo.com",
    role: "Psicólogo"
};

async function testMakeWebhook() {
    console.log('🧪 Iniciando prueba del webhook de Make.com...\n');

    try {
        // Cambiar según tu entorno
        const API_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
        const endpoint = `${API_URL}/api/lead-magnet`;

        console.log(`📡 Enviando petición a: ${endpoint}`);
        console.log(`📦 Datos de prueba:`, JSON.stringify(TEST_DATA, null, 2));
        console.log('');

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(TEST_DATA)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ ¡ÉXITO! El webhook de Make.com está funcionando');
            console.log('📊 Respuesta del servidor:', JSON.stringify(data, null, 2));
            console.log('\n🎯 Verifica en Make.com que el dato llegó correctamente');
        } else {
            console.log('❌ ERROR: El webhook no respondió correctamente');
            console.log(`📊 Status: ${response.status}`);
            console.log(`📊 Respuesta:`, JSON.stringify(data, null, 2));

            if (response.status === 500 && data.error === 'Configuración del servidor incompleta') {
                console.log('\n⚠️  CAUSA: La variable MAKE_WEBHOOK_LEAD no está configurada');
                console.log('💡 SOLUCIÓN: Añade MAKE_WEBHOOK_LEAD a tu .env.local o en Vercel');
            }
        }

    } catch (error) {
        console.log('❌ ERROR CRÍTICO:', error.message);
        console.log('\n⚠️  CAUSAS POSIBLES:');
        console.log('  1. El servidor no está corriendo (ejecuta: npm run dev)');
        console.log('  2. La URL es incorrecta');
        console.log('  3. Problema de red');
    }
}

// Ejecutar test
testMakeWebhook();
