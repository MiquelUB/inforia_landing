# Configuración del Webhook de Stripe con Supabase

Este documento explica cómo configurar el webhook de Stripe para que funcione con tu aplicación INFORIA y base de datos Supabase.

## 📋 Resumen

El webhook recibe notificaciones de Stripe cuando un pago se completa (incluso si es 0€ por código promocional) y automáticamente:
- ✅ Crea o actualiza el perfil del usuario en Supabase
- ✅ Asigna la cantidad correcta de créditos según el plan comprado
- ✅ Guarda información del pago y descuentos aplicados

---

## 🔧 Variables de Entorno Necesarias

Añade estas variables a tu `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
STRIPE_SECRET_KEY=sk_test_... # o sk_live_ para producción
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs de todos tus planes
NEXT_PUBLIC_STRIPE_FLASH_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_ESENCIAL_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_DUO_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_PROFESIONAL_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_CLINICA_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_CENTRO_PRICE_ID=price_xxx
```

### Cómo obtener cada variable:

#### 1. **NEXT_PUBLIC_SUPABASE_URL**
- Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
- Settings → API
- Copia "Project URL"

#### 2. **SUPABASE_SERVICE_ROLE_KEY**
- En la misma página (Settings → API)
- Copia "service_role" key (¡NO la "anon" key!)
- **⚠️ IMPORTANTE**: Nunca expongas esta clave en el frontend

#### 3. **STRIPE_WEBHOOK_SECRET**
- Ve al [Dashboard de Stripe](https://dashboard.stripe.com/webhooks)
- Crea un nuevo webhook endpoint (ver sección siguiente)
- Copia el "Signing secret"

---

## 🗄️ Configuración de Supabase

### Crear la Tabla `profiles`

Ejecuta este SQL en Supabase SQL Editor:

```sql
-- Crear tabla profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  credits_limit INTEGER DEFAULT 0,
  credits_used INTEGER DEFAULT 0,
  plan_type TEXT,
  stripe_customer_id TEXT,
  stripe_session_id TEXT,
  amount_paid INTEGER DEFAULT 0, -- En centavos
  amount_discount INTEGER DEFAULT 0, -- En centavos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para búsquedas rápidas por email
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Crear índice por stripe_customer_id
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver solo su propio perfil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid()::text = id::text);

-- Política: Solo service_role puede insertar/actualizar (para el webhook)
-- No creamos políticas de INSERT/UPDATE para usuarios normales
-- El webhook usa la service_role key que ignora RLS
```

### Verificar la Tabla

Después de crear la tabla:
1. Ve a Supabase Dashboard → Table Editor
2. Busca la tabla `profiles`
3. Verifica que tiene todas las columnas correctas

---

## 🌐 Configuración del Webhook en Stripe

### Opción A: Desarrollo Local (Testing)

Para probar localmente usando Stripe CLI:

```bash
# 1. Instalar Stripe CLI (Windows)
scoop install stripe

# 2. Login a Stripe
stripe login

# 3. Forward webhooks a tu servidor local
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 4. Copiar el webhook signing secret que aparece
# Añadirlo a .env.local como STRIPE_WEBHOOK_SECRET
```

### Opción B: Producción/Staging

1. **Ve al Dashboard de Stripe**
   - [Test mode webhooks](https://dashboard.stripe.com/test/webhooks)
   - [Live mode webhooks](https://dashboard.stripe.com/webhooks)

2. **Haz clic en "Add endpoint"**

3. **Configurar el endpoint:**
   ```
   Endpoint URL: https://tu-dominio.com/api/webhooks/stripe
   Events to send: checkout.session.completed
   ```

4. **Copiar el Signing Secret**
   - Después de crear el webhook, aparecerá el "Signing secret"
   - Cópialo y añádelo a tus variables de entorno como `STRIPE_WEBHOOK_SECRET`

---

## 🧪 Testing del Webhook

### Test 1: Webhook Local con Stripe CLI

```bash
# Terminal 1: Iniciar servidor de desarrollo
npm run dev

# Terminal 2: Escuchar webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Terminal 3: Disparar evento de prueba
stripe trigger checkout.session.completed
```

**Resultado esperado:**
- Terminal 2 muestra: `✓ checkout.session.completed`
- Consola de Next.js muestra: `✅ Usuario actualizado con X créditos`
- Supabase tiene un nuevo registro en `profiles`

### Test 2: Checkout Real de Prueba

1. Inicia el servidor: `npm run dev`
2. Abre: `http://localhost:3000/promo?code=FLASH5`
3. Completa el checkout con tarjeta de prueba: `4242 4242 4242 4242`
4. Verifica:
   - Stripe redirect a success page
   - Webhook procesado en logs
   - Usuario creado en Supabase con 5 créditos

### Test 3: Promo Code con 0€

1. Crea un cupón de 100% descuento en Stripe
2. Añádelo al checkout como `FLASH5`
3. Completa el pago (total: 0€)
4. **Verificar crítico**: Usuario aún recibe los créditos ✅

---

## 📊 Monitoreo y Logs

### Ver Logs del Webhook

El webhook genera logs detallados:

```
🎯 Procesando checkout.session.completed: cs_test_xxx
📊 Detalles: Email=user@example.com, PriceID=price_xxx, Total=€0, Descuento=€49
💳 Asignando 5 créditos a user@example.com (plan_flash_promo)
✅ Usuario user@example.com actualizado con 5 créditos (Plan: plan_flash_promo)
```

### Dashboard de Stripe

1. **Ver eventos del webhook:**
   - Dashboard → Developers → Webhooks
   - Clic en tu webhook endpoint
   - Pestaña "Events"

2. **Verificar entregas:**
   - Status 200 = Éxito ✅
   - Status 400/500 = Error ❌

3. **Re-enviar eventos fallidos:**
   - Clic en el evento fallido
   - Botón "Resend event"

### Base de Datos Supabase

```sql
-- Ver usuarios recientes
SELECT email, credits_limit, plan_type, amount_paid, created_at 
FROM profiles 
ORDER BY created_at DESC 
LIMIT 10;

-- Ver usuarios con descuentos
SELECT email, plan_type, amount_paid, amount_discount
FROM profiles  
WHERE amount_discount > 0
ORDER BY created_at DESC;

-- Ver créditos totales asignados
SELECT plan_type, COUNT(*) as users, SUM(credits_limit) as total_credits
FROM profiles
GROUP BY plan_type;
```

---

## 🔒 Seguridad

### Verificación de Firma

El webhook **siempre** verifica la firma de Stripe:

```typescript
event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
```

Esto garantiza que:
- ✅ La solicitud proviene realmente de Stripe
- ✅ El payload no ha sido modificado
- ✅ No es un ataque de replay

### Permisos de Supabase

- `service_role` key: Solo para el webhook (backend)
- `anon` key: Solo para el frontend
- RLS habilitado: Usuarios solo ven sus propios datos

### HTTPS Obligatorio

Stripe **requiere HTTPS** para webhooks en producción. Asegúrate de que tu dominio tiene SSL configurado.

---

## 🐛 Solución de Problemas

### Error: "Webhook signature verification failed"

**Causa**: Signing secret incorrecto

**Solución**:
1. Ve a Stripe Dashboard → Webhooks
2. Clic en tu endpoint
3. Clic en "Signing secret" → "Reveal"
4. Copia y actualiza `STRIPE_WEBHOOK_SECRET`

### Error: "Database Error" / Supabase 401

**Causa**: Service role key incorrecta o expirada

**Solución**:
1. Ve a Supabase Dashboard → Settings → API
2. Copia la "service_role" key nuevamente
3. Actualiza `SUPABASE_SERVICE_ROLE_KEY`

### Error: "relation 'profiles' does not exist"

**Causa**: Tabla no creada en Supabase

**Solución**:
1. Ve a Supabase SQL Editor
2. Ejecuta el SQL de creación de tablas (ver arriba)
3. Verifica en Table Editor

### Webhook recibe evento pero no guarda en DB

**Causa**: Plan/Price ID no coincide

**Solución**:
1. Revisa los logs: `⚠️ No se pudo determinar créditos para priceId: price_xxx`
2. Verifica que el price ID esté en las variables de entorno
3. Añade el plan al switch del webhook si falta

### Usuario no recibe créditos con promo 0€

**Causa**: Lógica incorrecta condicional por `amount_total`

**Solución**: ✅ Ya implementado - el webhook procesa sin importar el monto

---

## 📈 Próximos Pasos

### Mejoras Opcionales

1. **Notificaciones al usuario**
   ```typescript
   // Enviar email de bienvenida con Resend/SendGrid
   await sendWelcomeEmail(userEmail, credits, planName);
   ```

2. **Webhooks adicionales**
   ```typescript
   // Manejar renovaciones
   if (event.type === "invoice.payment_succeeded") { ... }
   
   // Manejar cancelaciones
   if (event.type === "customer.subscription.deleted") { ... }
   ```

3. **Idempotencia**
   ```typescript
   // Prevenir procesamiento duplicado
   const existing = await supabaseAdmin
     .from('webhook_events')
     .select('id')
     .eq('stripe_event_id', event.id)
     .single();
   
   if (existing.data) {
     return NextResponse.json({ received: true, duplicate: true });
   }
   ```

4. **Alertas de errores**
   ```typescript
   // Integrar con Sentry, LogRocket, etc
   if (error) {
     Sentry.captureException(error);
   }
   ```

---

## ✅ Checklist de Configuración

Antes de ir a producción, verifica:

- [ ] Variables de entorno configuradas en `.env.local`
- [ ] Tabla `profiles` creada en Supabase
- [ ] RLS habilitado y políticas configuradas
- [ ] Webhook creado en Stripe Dashboard
- [ ] Signing secret copiado y configurado
- [ ] Endpoint URL apunta a tu dominio con HTTPS
- [ ] Evento `checkout.session.completed` seleccionado
- [ ] Test local con Stripe CLI exitoso
- [ ] Test con pago real de prueba exitoso
- [ ] Test con cupón 100% (0€) exitoso
- [ ] Logs del webhook funcionando correctamente
- [ ] Datos guardándose en Supabase

---

## 📞 Recursos

- [Stripe Webhooks Docs](https://stripe.com/docs/webhooks)
- [Supabase Database](https://supabase.com/docs/guides/database)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
