import { Resend } from 'resend';
import dotenv from 'dotenv';

// Cargar variables de entorno locales
dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testWebhookSender() {
  console.log('📧 Probando envío con el remitente del Webhook...');
  console.log(`📨 Remitente: Inforia <onboarding@mail.inforia.pro>`);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Inforia <onboarding@mail.inforia.pro>', // El que usa el webhook
      to: 'perepons001@gmail.com', // El correo del usuario (para confirmar recepción real)
      subject: '🚀 Test de Remitente Webhook (mail.inforia.pro)',
      html: '<p>Si recibes esto, el subdominio <strong>mail.inforia.pro</strong> funciona correctamente.</p>'
    });

    if (error) {
      console.error('❌ Error devuelto por Resend:', error);
      console.log('\n⚠️ DIAGNÓSTICO: El subdominio "mail.inforia.pro" probablemente no está verificado.');
      console.log('✅ SOLUCIÓN: Cambiar el remitente en el webhook a "hola@inforia.pro" (que sabemos que funciona).');
    } else {
      console.log('✅ Email enviado con éxito:', data);
      console.log('ℹ️ Si esto funciona localmente pero falla en Vercel, revisa las variables de entorno en Vercel.');
    }
  } catch (err) {
    console.error('❌ Excepción al enviar:', err);
  }
}

testWebhookSender();
