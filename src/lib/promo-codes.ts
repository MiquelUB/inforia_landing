/**
 * Mapeo de códigos promocionales amigables a IDs de Stripe
 * 
 * Esto permite usar URLs como:
 * /promo?code=FLASH5 en lugar de especificar IDs complejos
 *
 * IMPORTANTE: Los IDs de cupón de Stripe se crean en el Dashboard de Stripe
 * Sección: Products → Coupons
 */

export interface PromoConfig {
    // ID del código de promoción en Stripe (ej: "promo_1234abcd")
    stripePromoId: string;
    // Plan por defecto asociado (opcional)
    defaultPriceId?: string;
    // Descripción para logs
    description?: string;
}

export const PROMO_CODE_MAPPING: Record<string, PromoConfig> = {
    // Oferta Flash - 5 informes gratis
    'FLASH5': {
        stripePromoId: 'promo_flash5', // Este campo es para referencia, el checkout usa el coupon ID
        defaultPriceId: process.env.NEXT_PUBLIC_STRIPE_FLASH_PRICE_ID,
        description: '5 informes gratuitos - Plan Flash',
    },

    // Ejemplo: Oferta de 5 informes
    '5GRATIS': {
        stripePromoId: 'promo_5gratis',
        defaultPriceId: process.env.NEXT_PUBLIC_STRIPE_ESENCIAL_PRICE_ID,
        description: '5 informes gratuitos',
    },

    // Ejemplo: Descuento del 20%
    'INFORIA20': {
        stripePromoId: 'promo_inforia20',
        description: '20% de descuento',
    },

    // Ejemplo: Oferta de prueba gratuita extendida
    'TRIAL30': {
        stripePromoId: 'promo_trial30',
        description: '30 días de prueba gratis',
    },

    // Puedes añadir más códigos según necesites
    // 'CÓDIGO_URL': {
    //   stripePromoId: 'promo_xxxx',
    //   defaultPriceId: 'price_xxxx',
    //   description: 'Descripción de la oferta',
    // },
};

/**
 * Obtiene la configuración de una promoción por su código amigable
 */
export function getPromoConfig(friendlyCode: string): PromoConfig | null {
    const upperCode = friendlyCode.toUpperCase();
    return PROMO_CODE_MAPPING[upperCode] || null;
}

/**
 * Obtiene el ID de Stripe para un código promocional
 * Si el código ya es un ID de Stripe (comienza con "promo_"), lo devuelve tal cual
 */
export function getStripePromoId(code: string): string | null {
    // Si ya es un ID de Stripe, devolverlo directamente
    if (code.startsWith('promo_')) {
        return code;
    }

    // Buscar en el mapeo
    const config = getPromoConfig(code);
    return config?.stripePromoId || null;
}
