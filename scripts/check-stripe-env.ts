import Stripe from 'stripe';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const requiredVars = [
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PRICE_FLASH',
  'NEXT_PUBLIC_STRIPE_PRICE_PRO',
  'NEXT_PUBLIC_STRIPE_PRICE_PRO_PLUS',
  'NEXT_PUBLIC_STRIPE_PRICE_EQUIPO',
  'NEXT_PUBLIC_STRIPE_PRICE_CLINICA',
  'NEXT_PUBLIC_STRIPE_PRICE_CENTRO',
  'NEXT_PUBLIC_STRIPE_PRICE_CENTRO_PLUS',
  'NEXT_PUBLIC_URL'
];

console.log('🔍 Checking Environment Variables...');

const missingVars = requiredVars.filter(key => !process.env[key]);

if (missingVars.length > 0) {
  console.error('❌ Missing Environment Variables:');
  missingVars.forEach(key => console.error(`   - ${key}`));
  console.log('\nPlease add these to your .env.local file.');
  process.exit(1);
}

console.log('✅ All required environment variables are present.');

const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
    console.error('❌ STRIPE_SECRET_KEY is undefined (unexpected).');
    process.exit(1);
}

console.log('\n🔌 Testing Stripe Connection...');

const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-10-16' as any,
});

async function testConnection() {
  try {
    const products = await stripe.products.list({ limit: 1 });
    console.log('✅ Stripe Connection Successful!');
    console.log(`   Retrieved ${products.data.length} product(s) as a test.`);
  } catch (error: any) {
    console.error('❌ Stripe Connection Failed:');
    console.error(`   Error: ${error.message}`);
    if (error.type === 'StripeAuthenticationError') {
        console.error('   Hint: Check if your STRIPE_SECRET_KEY is correct.');
    }
  }
}

testConnection();
