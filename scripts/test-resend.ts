import { Resend } from 'resend';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const resendKey = process.env.RESEND_API_KEY;

if (!resendKey) {
  console.error('❌ RESEND_API_KEY is missing in .env.local');
  process.exit(1);
}

console.log(`🔑 Found RESEND_API_KEY: ${resendKey.slice(0, 5)}...`);

const resend = new Resend(resendKey);

async function sendTestEmail() {
  try {
    console.log('📧 Attempting to send test email...');
    const data = await resend.emails.send({
      from: 'Inforia Test <onboarding@resend.dev>', // Use resend.dev for testing if domain not verified, or try the user's domain
      to: 'delivered@resend.dev', // Safe test address
      subject: 'Test Email from Script',
      html: '<p>It works!</p>',
    });

    if (data.error) {
        console.error('❌ Resend API returned error:', data.error);
    } else {
        console.log('✅ Email sent successfully!', data);
    }
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
}

sendTestEmail();
