# PromoActivator - Activador de Promociones Frontend

## 📋 Descripción

El `PromoActivator` es un componente React invisible que detecta parámetros promocionales en la URL y automáticamente activa ofertas especiales sin que el usuario tenga que navegar a páginas adicionales.

## ✨ Características

- ✅ **Detección automática** de URLs promocionales
- ✅ **Invisible** - No interfiere con el diseño de la página
- ✅ **Validación de email** incorporada
- ✅ **Experiencia fluida** - Confirmación antes de activar
- ✅ **Seguro** - Previene activaciones duplicadas
- ✅ **Logging detallado** para debugging

---

## 🔗 URLs Soportadas

### Con Email (Recomendado)
```
https://inforia.com/?promo=FLASH5&email=usuario@ejemplo.com
```
- Detecta automáticamente la promo
- Muestra confirmación personalizada
- Si acepta, redirige directamente a checkout

### Sin Email
```
https://inforia.com/?promo=FLASH5
```
- Detecta la promo
- Solicita el email al usuario
- Valida el email
- Redirige a checkout

---

## 🎯 Casos de Uso

### 1. **Email Marketing**

Ejemplo de email HTML:

```html
<div style="text-align: center; padding: 20px;">
  <h1>🎁 ¡5 Informes GRATIS!</h1>
  <p>Hola {{nombre}},</p>
  <p>Activa tu pack de bienvenida ahora</p>
  <a href="https://inforia.com/?promo=FLASH5&email={{email}}"
     style="background: #2E403B; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px;">
    Activar Mi Oferta
  </a>
</div>
```

**Flujo:**
1. Usuario hace clic en el email
2. Abre landing page con parámetros
3. PromoActivator detecta `promo=FLASH5` y `email=...`
4. Muestra confirmación personalizada
5. Usuario acepta
6. Redirige a Stripe Checkout con descuento aplicado

---

### 2. **Campaña de Redes Sociales**

**URL para Bio de Instagram:**
```
https://inforia.com/?promo=FLASH5
```

**Post de ejemplo:**
```
🎉 ¡OFERTA EXCLUSIVA!

5 informes de IA completamente GRATIS para nuevos usuarios

👉 Link en bio
Código: FLASH5

#IA #Psicología #INFORIA
```

**Flujo:**
1. Usuario hace clic en link de bio
2. PromoActivator detecta `promo=FLASH5`
3. Pide el email al usuario (popup)
4. Valida formato
5. Redirige a checkout

---

### 3. **QR Code en Eventos**

Genera un QR que apunte a:
```
https://inforia.com/?promo=FLASH5
```

Úsalo en:
- Stands de conferencias
- Material impreso
- Presentaciones

---

### 4. **WhatsApp/Telegram**

Mensaje de ejemplo:
```
¡Hola! 👋

Te tengo una oferta especial:
5 informes de IA GRATIS

Actívala aquí:
https://inforia.com/?promo=FLASH5&email=tu@email.com

¡Solo por tiempo limitado!
```

---

## 🛠️ Instalación

### Ya está instalado ✅

El componente ya está integrado en tu `src/app/page.tsx`:

```typescript
import { PromoActivator } from '@/components/promo-activator';

export default function Home() {
  return (
    <div>
      <Suspense fallback={null}>
        <PromoActivator />
      </Suspense>
      {/* Resto de componentes */}
    </div>
  );
}
```

---

## 🧪 Testing

### Test 1: Con Email en URL

1. Abre en navegador:
   ```
   http://localhost:3000/?promo=FLASH5&email=test@example.com
   ```

2. **Resultado esperado:**
   - Popup de confirmación aparece automáticamente
   - Mensaje: "¡Hola test@example.com! ..."
   - Si aceptas, redirige a Stripe Checkout

### Test 2: Sin Email en URL

1. Abre en navegador:
   ```
   http://localhost:3000/?promo=FLASH5
   ```

2. **Resultado esperado:**
   - Popup pidiendo email
   - Ingresa email válido
   - Redirige a Stripe Checkout

### Test 3: Email Inválido

1. Abre: `http://localhost:3000/?promo=FLASH5`
2. Ingresa email inválido (ej: "test")
3. **Resultado esperado:**
   - Muestra alerta de error
   - Solicita email nuevamente

### Test 4: Prevención de Duplicados

1. Abre: `http://localhost:3000/?promo=FLASH5&email=test@example.com`
2. Acepta la primera confirmación
3. Presiona botón "Atrás" del navegador
4. **Resultado esperado:**
   - NO muestra confirmación nuevamente
   - `hasActivated.current` previene duplicados

---

## 🔍 Debugging

### Logs en Consola

El componente genera logs detallados:

```javascript
🎁 Promo detectada: FLASH5 test@example.com
🚀 Activando promo para: test@example.com
✅ Redirigiendo a checkout...
```

O en caso de error:
```javascript
❌ Error al activar la oferta: [mensaje de error]
```

### Verificar en Network Tab

1. Abre DevTools → Network
2. Activa la promo
3. Busca request POST a `/api/checkout`
4. Verifica payload:
   ```json
   {
     "priceId": "price_xxx",
     "email": "test@example.com",
     "promoCode": "FLASH5"
   }
   ```

---

## ⚙️ Personalización

### Cambiar el Mensaje de Confirmación

Edita `src/components/promo-activator.tsx`:

```typescript
const showConfirmation = (email: string) => {
  const confirmed = window.confirm(
    `🎁 ¡Oferta Especial!\n\n` +
    `Hola ${email},\n\n` +
    `Tu mensaje personalizado aquí.\n\n` +
    `¿Continuar?`
  );
  // ...
};
```

### Usar Toast en vez de Alert

Si tienes Sonner o React-Toastify instalado:

```bash
npm install sonner
```

```typescript
import { toast } from 'sonner';

const showConfirmation = (email: string) => {
  toast.custom((t) => (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3>🎁 ¡Oferta Especial!</h3>
      <p>Hola {email}</p>
      <button onClick={() => {
        toast.dismiss(t);
        activatePromo(email);
      }}>
        Activar Ahora
      </button>
    </div>
  ));
};
```

### Añadir Más Promociones

```typescript
useEffect(() => {
  const promo = searchParams.get('promo');
  const email = searchParams.get('email');

  if (promo && !hasActivated.current) {
    hasActivated.current = true;
    
    // Añadir más códigos aquí
    switch(promo) {
      case 'FLASH5':
        handleFlash5Promo(email);
        break;
      case 'PROMO20':
        handlePromo20(email);
        break;
      case 'TRIAL30':
        handleTrialPromo(email);
        break;
      default:
        console.warn('Promo desconocida:', promo);
    }
  }
}, [searchParams]);
```

---

## 🚀 Mejores Prácticas

### 1. **Tracking de Conversiones**

Añade tracking cuando se activa una promo:

```typescript
const activatePromo = async (email: string) => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'promo_activated', {
      promo_code: 'FLASH5',
      email: email,
    });
  }

  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_name: 'Flash5 Promo',
    });
  }

  // ... resto del código
};
```

### 2. **A/B Testing**

Prueba diferentes mensajes:

```typescript
const messages = {
  A: '¡5 informes GRATIS! ¿Quieres canjearlos ahora?',
  B: 'Oferta exclusiva: Pack de bienvenida GRATIS',
  C: '🎁 Tu regalo está listo. ¿Activarlo?',
};

const variant = ['A', 'B', 'C'][Math.floor(Math.random() * 3)];
const confirmed = window.confirm(messages[variant]);
```

### 3. **Validaciones Adicionales**

```typescript
// Verificar que el plan Flash existe
if (!process.env.NEXT_PUBLIC_STRIPE_FLASH_PRICE_ID) {
  console.error('STRIPE_FLASH_PRICE_ID no configurado');
  alert('La promoción no está disponible temporalmente.');
  return;
}

// Rate limiting (evitar spam)
const lastActivation = localStorage.getItem('lastPromoActivation');
const now = Date.now();
if (lastActivation && now - parseInt(lastActivation) < 60000) {
  console.warn('Activación muy reciente, esperando...');
  return;
}
localStorage.setItem('lastPromoActivation', now.toString());
```

---

## 🔒 Seguridad

### Prevención de Activaciones Duplicadas

```typescript
const hasActivated = useRef(false);
```

Garantiza que aunque el componente se re-renderice, solo se activa una vez por sesión.

### Validación de Email

```typescript
const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
```

Previene envíos con emails inválidos.

### Backend Validation

El checkout API también valida:
- ✅ `priceId` está en lista blanca
- ✅ `promoCode` es válido para el plan
- ✅ Stripe valida el cupón

---

## 📊 Métricas Sugeridas

Trackear:
1. **Tasa de activación**: Usuarios que ven promo vs. activan
2. **Cancelaciones**: Usuarios que cierran el popup
3. **Emails inválidos**: Frecuencia de errores de validación
4. **Conversión final**: Checkouts completados desde promo

```sql
-- En Supabase Analytics
SELECT 
  COUNT(*) as total_activations,
  COUNT(CASE WHEN amount_paid = 0 THEN 1 END) as free_activations,
  AVG(amount_discount) as avg_discount
FROM profiles
WHERE plan_type = 'plan_flash_promo'
  AND created_at > NOW() - INTERVAL '30 days';
```

---

## ✅ Checklist

Antes de lanzar campañas:

- [ ] PromoActivator integrado en `page.tsx`
- [ ] Wrapped en `<Suspense>`
- [ ] Variable `NEXT_PUBLIC_STRIPE_FLASH_PRICE_ID` configurada
- [ ] Cupón `FLASH5` creado en Stripe
- [ ] Test con email válido exitoso
- [ ] Test sin email exitoso
- [ ] Test de email inválido muestra error
- [ ] Prevención de duplicados funciona
- [ ] Webhook configurado para asignar créditos
- [ ] Tracking de eventos configurado (opcional)

---

## 🎉 Listo para Usar

El PromoActivator está completamente configurado y listo para recibir tráfico promocional. 

**Próximo paso:** Crear campañas y compartir las URLs promocionales.
