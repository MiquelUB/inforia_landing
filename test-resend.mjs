import { Resend } from 'resend';
import dotenv from 'dotenv';

// Cargar variables de entorno locales
dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendTestEmail() {
  console.log('📧 Iniciando prueba de envío de email con Resend...');
  console.log(`🔑 API Key (primeros 5 chars): ${process.env.RESEND_API_KEY?.substring(0, 5)}...`);
  console.log(`📨 Remitente: Inforia <hola@inforia.pro>`);

  try {
    const data = await resend.emails.send({
      from: 'Inforia <hola@inforia.pro>',
      to: 'delivered@resend.dev', // Correo de prueba seguro de Resend
      subject: '🚀 Test de Configuración de Producción',
      html: '<p>Si recibes esto, la configuración de <strong>hola@inforia.pro</strong> es correcta.</p>'
    });

    console.log('✅ Email enviado con éxito:', data);
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    
    if (error.message?.includes('domain')) {
      console.log('\n⚠️  POSIBLE CAUSA: El dominio "inforia.pro" no está verificado en Resend.');
      console.log('💡 SOLUCIÓN: Verifica el dominio en el dashboard de Resend o usa "onboarding@resend.dev" para pruebas.');
    }
  }
}

sendTestEmail();
