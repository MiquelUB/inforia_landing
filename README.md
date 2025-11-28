# Inforia Landing Page

Landing page moderna y optimizada para **Inforia**, construida con **Next.js 14**, **Supabase** y **Stripe**.

## 🚀 Tecnologías

-   **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
-   **Estilos:** [Tailwind CSS](https://tailwindcss.com/) (Diseño Neumórfico)
-   **Base de Datos:** [Supabase](https://supabase.com/)
-   **Pagos:** [Stripe](https://stripe.com/)
-   **Validación:** [Zod](https://zod.dev/)
-   **Iconos:** [Lucide React](https://lucide.dev/)

## 🛠️ Configuración del Proyecto

### 1. Instalación

```bash
npm install
```

### 2. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# App
NEXT_PUBLIC_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key

# Stripe
STRIPE_SECRET_KEY=tu_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key

# Stripe Price IDs (Deben coincidir con los IDs en Supabase 'prices' table)
NEXT_PUBLIC_STRIPE_FLASH_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_ESENCIAL_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_DUO_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PROFESIONAL_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_CLINICA_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_CENTRO_PRICE_ID=price_...
STRIPE_TEST_PRICE_ID=price_...

# Stripe Coupons
STRIPE_COUPON_FLASH_ID=tu_coupon_id
```

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 💳 Flujo de Pagos (Stripe)

El sistema de checkout (`src/app/api/checkout/route.ts`) maneja dinámicamente dos modos de pago:

1.  **Suscripción (`subscription`):** Para planes recurrentes (ej. Esencial, Duo).
2.  **Pago Único (`payment`):** Para planes de un solo pago (ej. Plan Flash).

El modo se determina automáticamente consultando el tipo de precio (`recurring` vs `one_time`) en Stripe.

### Códigos Promocionales

-   **Manual:** El campo de código promocional está siempre visible en el checkout de Stripe.
-   **Flash Plan:** Usa el código `FLASH5` para obtener el descuento del 100% en el Plan Flash (requiere configuración de cupón en Stripe).

## 🗄️ Base de Datos (Supabase)

El proyecto utiliza Supabase para almacenar la información de los planes y precios.

**Importante:** La tabla `prices` en Supabase debe contener los mismos IDs de precio que Stripe (`price_1SY...`).

### Generar Tipos de TypeScript

Para mantener la seguridad de tipos con la base de datos:

```bash
npx supabase gen types typescript --project-id "tu_project_id" > src/lib/database.types.ts
```

## 📂 Estructura del Proyecto

-   `src/app`: Rutas y API (App Router).
-   `src/components`: Componentes React reutilizables.
-   `src/lib`: Utilidades y clientes (Supabase, Stripe).
-   `src/hooks`: Hooks personalizados (ej. `usePrices`).
