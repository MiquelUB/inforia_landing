# 🚀 INFORIA Promo System - Quick Reference

## 📋 URLs Promocionales

### Landing Principal (PromoActivator)
```
https://inforia.com/?promo=FLASH5&email=user@example.com
```

### Página Dedicada
```
https://inforia.com/promo?code=FLASH5
```

---

## ⚙️ Variables de Entorno Críticas

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_COUPON_FLASH_ID=tu_coupon_id

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Price ID Plan Flash
NEXT_PUBLIC_STRIPE_FLASH_PRICE_ID=price_xxx
```

---

## 🔧 Configuración Rápida

### 1. Crear Cupón en Stripe
1. Dashboard → Coupons → Create
2. 100% off (o tu descuento)
3. Copiar Coupon ID → `STRIPE_COUPON_FLASH_ID`

### 2. Crear Tabla Supabase
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  credits_limit INTEGER DEFAULT 0,
  plan_type TEXT,
  stripe_customer_id TEXT,
  amount_paid INTEGER,
  amount_discount INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Configurar Webhook
1. Stripe → Webhooks → Add endpoint
2. URL: `https://tu-dominio.com/api/webhooks/stripe`
3. Evento: `checkout.session.completed`
4. Copiar secret → `STRIPE_WEBHOOK_SECRET`

---

## 🧪 Testing Rápido

```bash
# Local
npm run dev

# Test URL
http://localhost:3000/?promo=FLASH5&email=test@example.com

# Stripe CLI (webhook local)
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger checkout.session.completed
```

---

## 📁 Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `src/app/api/checkout/route.ts` | API checkout con promos |
| `src/app/api/webhooks/stripe/route.ts` | Webhook → Supabase |
| `src/components/promo-activator.tsx` | Activador automático |
| `src/app/promo/page.tsx` | Página de promos |
| `src/lib/promo-codes.ts` | Config códigos |

---

## 🎯 Flujo del Sistema

```
Usuario abre URL promo
    ↓
PromoActivator detecta
    ↓
Confirmación usuario
    ↓
POST /api/checkout
    ↓
Stripe Checkout (€0)
    ↓
Webhook recibe evento
    ↓
Guarda en Supabase
    ↓
Usuario tiene 5 créditos ✅
```

---

## 📊 Verificación Rápida

```sql
-- Ver usuarios con promo
SELECT email, credits_limit, plan_type
FROM profiles
WHERE plan_type = 'plan_flash_promo'
ORDER BY created_at DESC;
```

---

## 🚨 Troubleshooting

### Error: Webhook signature failed
→ Verificar `STRIPE_WEBHOOK_SECRET`

### Error: Database error
→ Verificar `SUPABASE_SERVICE_ROLE_KEY`

### No asigna créditos
→ Verificar tabla `profiles` existe

### Checkout no aplica descuento
→ Verificar `STRIPE_COUPON_FLASH_ID` correcto

---

## 📚 Documentación Completa

- `SISTEMA_PROMOCIONES_COMPLETO.md` - Guía completa
- `WEBHOOK_SETUP.md` - Setup webhook
- `PROMO_ACTIVATOR.md` - Guía activador
- `ENV_VARIABLES.md` - Variables entorno

---

## ✅ Checklist Go-Live

- [ ] Variables entorno configuradas
- [ ] Cupón creado en Stripe
- [ ] Tabla Supabase creada
- [ ] Webhook configurado
- [ ] Test local exitoso
- [ ] Test con Stripe CLI exitoso
- [ ] Primer checkout de prueba completado
- [ ] Webhook recibe y procesa evento
- [ ] Usuario guardado en Supabase con créditos

---

**Status**: ✅ Ready for Production
