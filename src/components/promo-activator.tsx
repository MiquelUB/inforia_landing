'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Componente invisible que detecta URLs promocionales y activa ofertas automáticamente
 * 
 * Uso: Añadir a layout.tsx o page.tsx
 * 
 * URLs soportadas:
 * - /?promo=FLASH5&email=user@example.com
 * - /?promo=FLASH5 (pedirá email al usuario)
 */
export function PromoActivator() {
    const searchParams = useSearchParams();
    const hasActivated = useRef(false);

    useEffect(() => {
        const promo = searchParams.get('promo');
        const email = searchParams.get('email');

        // Solo activar para promoción FLASH5 y si no se ha activado ya
        if (promo === 'FLASH5' && !hasActivated.current) {
            hasActivated.current = true;

            console.log('🎁 Promo detectada:', promo, email);

            // Si el email viene en la URL, activar directamente
            if (email && validateEmail(email)) {
                showConfirmation(email);
            } else {
                // Si no hay email, pedirlo al usuario
                requestEmailAndActivate();
            }
        }
    }, [searchParams]);

    const validateEmail = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const showConfirmation = (email: string) => {
        const confirmed = window.confirm(
            `¡Hola ${email}! 🎁\n\n` +
            `Tenemos un pack especial de 5 informes GRATIS esperándote.\n\n` +
            `¿Quieres canjearlo ahora?`
        );

        if (confirmed) {
            activatePromo(email);
        }
    };

    const requestEmailAndActivate = () => {
        const email = window.prompt(
            '🎁 ¡Pack de 5 informes GRATIS!\n\n' +
            'Ingresa tu email para canjear tu oferta:'
        );

        if (email && validateEmail(email)) {
            activatePromo(email);
        } else if (email) {
            alert('⚠️ Email inválido. Por favor, verifica e intenta de nuevo.');
        }
    };

    const activatePromo = async (email: string) => {
        try {
            console.log('🚀 Activando promo para:', email);

            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: process.env.NEXT_PUBLIC_STRIPE_FLASH_PRICE_ID,
                    email: email,
                    promoCode: 'FLASH5'
                })
            });

            const data = await res.json();

            if (data.url) {
                console.log('✅ Redirigiendo a checkout...');
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'No se recibió URL de checkout');
            }
        } catch (error) {
            console.error('❌ Error al activar la oferta:', error);
            alert(
                '⚠️ Hubo un error al activar la oferta.\n\n' +
                'Por favor, intenta más tarde o contáctanos.'
            );
        }
    };

    // Componente invisible - no renderiza nada
    return null;
}
