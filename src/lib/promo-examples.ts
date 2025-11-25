/**
 * Ejemplos de URLs de Promo para Marketing
 * 
 * Estos son ejemplos de URLs que puedes usar en campañas de marketing,
 * emails, redes sociales, etc.
 */

// 🎯 EJEMPLOS DE CAMPAÑA
// ================================================

// 1. Email Marketing - Black Friday
// https://inforia.com/promo?code=BLACKFRIDAY50
// Configurar en promo-codes.ts:
// 'BLACKFRIDAY50': {
//   stripePromoId: 'promo_blackfriday2024',
//   description: '50% descuento Black Friday',
// }

// 2. Redes Sociales - Instagram/Facebook
// https://inforia.com/promo?code=INSTA30
// Link corto: https://bit.ly/inforia-insta30

// 3. Campaña de Prueba Gratuita
// https://inforia.com/promo?code=TRIAL30&priceId=price_esencial
// Ofrece 30 días gratis del plan Esencial

// 4. Partnership - Colaboración con Influencer
// https://inforia.com/promo?code=DRSMITH20
// Código personalizado por afiliado

// 5. Oferta de Bienvenida - Nuevos Usuarios
// https://inforia.com/promo?code=BIENVENIDA
// Primer mes con descuento

// 6. Oferta de Actualización - Para usuarios existentes
// https://inforia.com/promo?code=UPGRADE15&priceId=price_profesional
// 15% al mejorar a plan superior

// 7. Evento/Webinar - Promoción limitada
// https://inforia.com/promo?code=WEBINAR2024
// Solo válido para asistentes del webinar

// 8. Campaña de Re-engagement
// https://inforia.com/promo?code=VUELVE20
// Para usuarios inactivos


// 📱 TRACKING DE CAMPAÑAS
// ================================================

// Añade parámetros UTM para tracking en analytics:
// https://inforia.com/promo?code=5GRATIS&utm_source=facebook&utm_medium=cpc&utm_campaign=q1_2024


// 🎨 LANDING PAGES PERSONALIZADAS
// ================================================

// Puedes crear páginas específicas que luego redirijan a /promo:
// Ejemplo: /oferta-especial -> redirige a /promo?code=ESPECIAL

// En Next.js, crea: src/app/oferta-especial/page.tsx
// import { redirect } from 'next/navigation';
// export default function OfertaEspecial() {
//   redirect('/promo?code=ESPECIAL');
// }


// 🔗 QR CODES
// ================================================

// Genera QR codes que apunten a:
// https://inforia.com/promo?code=QR_EVENTO
// Úsalos en:
// - Material impreso
// - Eventos presenciales
// - Stands de conferencias


// 📧 EMAIL TEMPLATES
// ================================================

// HTML para email:
/*
<div style="text-align: center; padding: 20px;">
  <h2>🎁 ¡Oferta Exclusiva para Ti!</h2>
  <p>5 informes completamente gratis para nuevos usuarios</p>
  <a href="https://inforia.com/promo?code=5GRATIS&utm_source=email&utm_campaign=welcome" 
     style="background: #2E403B; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
    Activar Mi Oferta
  </a>
</div>
*/


// 🌐 REDES SOCIALES - Ejemplos de Posts
// ================================================

// Twitter/X:
// "🎉 ¡5 informes GRATIS para nuevos usuarios!
//  Usa el código: 5GRATIS
//  👉 inforia.com/promo?code=5GRATIS
//  #IA #Salud #Psicologia"

// Instagram (Bio Link):
// "Link en bio 👆 - Código: INSTA30"
// URL: https://inforia.com/promo?code=INSTA30

// LinkedIn:
// "Oferta exclusiva para profesionales de la salud...
//  Enlace: https://inforia.com/promo?code=LINKEDIN20"


// 💼 ESTRATEGIAS AVANZADAS
// ================================================

// 1. Códigos por Segmento de Usuario
const _SEGMENTED_CODES = {
  'PSICOLOGO': { plan: 'esencial', discount: 20 },
  'CLINICA': { plan: 'profesional', discount: 30 },
  'HOSPITAL': { plan: 'centro', discount: 40 },
};

// 2. Códigos con Límites
// Configura en Stripe:
// - Max 100 usos
// - Válido hasta 31/12/2024
// - Solo para primera suscripción

// 3. Códigos de Referidos
// AMIGO_JUAN -> Da descuento a ambos
// Requiere lógica adicional en el backend

export { };
