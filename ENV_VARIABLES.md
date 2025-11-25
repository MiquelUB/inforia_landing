# ============================================
# STRIPE CONFIGURATION
# ============================================

# Stripe Secret Key (Backend only - NEVER expose to frontend)
# Get from: https://dashboard.stripe.com/apikeys
# Test mode: sk_test_...
# Live mode: sk_live_...
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Stripe Webhook Secret (for webhook signature verification)
# Get from: https://dashboard.stripe.com/webhooks
# After creating webhook endpoint, copy the "Signing secret"
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# ============================================
# STRIPE PRICE IDs (Public - safe to expose)
# ============================================

# Plan Flash - 5 informes de bienvenida
NEXT_PUBLIC_STRIPE_FLASH_PRICE_ID=price_your_flash_plan_id

# Plan Esencial - 50 informes/mes
NEXT_PUBLIC_STRIPE_ESENCIAL_PRICE_ID=price_your_esencial_plan_id

# Plan Dúo - 110 informes/mes
NEXT_PUBLIC_STRIPE_DUO_PRICE_ID=price_your_duo_plan_id

# Plan Profesional - 220 informes/mes
NEXT_PUBLIC_STRIPE_PROFESIONAL_PRICE_ID=price_your_profesional_plan_id

# Plan Clínica - 400 informes/mes
NEXT_PUBLIC_STRIPE_CLINICA_PRICE_ID=price_your_clinica_plan_id

# Plan Centro - 650 informes/mes
NEXT_PUBLIC_STRIPE_CENTRO_PRICE_ID=price_your_centro_plan_id

# ============================================
# STRIPE COUPON IDs
# ============================================

# Cupón para promoción FLASH5
# Get from: https://dashboard.stripe.com/coupons
# Create a coupon, then copy its ID (NOT the promo code)
STRIPE_COUPON_FLASH_ID=your_coupon_id_here

# Puedes añadir más cupones aquí para otras promociones
# STRIPE_COUPON_PROMO20_ID=your_coupon_id
# STRIPE_COUPON_TRIAL_ID=your_coupon_id

# ============================================
# SUPABASE CONFIGURATION
# ============================================

# Supabase Project URL (Public - safe to expose)
# Get from: Supabase Dashboard → Settings → API → Project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase Anon Key (Public - safe to expose)
# Get from: Supabase Dashboard → Settings → API → anon public
# Used for frontend authentication
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role Key (Backend only - NEVER expose to frontend)
# Get from: Supabase Dashboard → Settings → API → service_role
# Used by webhook to write to database (bypasses RLS)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# EXTERNAL INTEGRATIONS (Optional)
# ============================================

# Make.com Webhook for Lead Magnet
# Get from: Make.com → Create webhook scenario
MAKE_WEBHOOK_LEAD=https://hook.us1.make.com/your_webhook_id

# Make.com Webhook for Stripe Events (if using Make instead of direct integration)
# MAKE_WEBHOOK_STRIPE=https://hook.us1.make.com/your_stripe_webhook_id

# ============================================
# NOTES
# ============================================

# 1. Copy this file to .env.local and fill in your actual values
# 2. Never commit .env.local to git (it's in .gitignore)
# 3. For production, set these in your hosting platform (Vercel, etc)
# 4. Test mode vs Live mode: Use test keys for development
# 5. Service role keys have admin access - keep them secret!
