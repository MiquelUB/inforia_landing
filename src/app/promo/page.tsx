'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getPromoConfig } from '@/lib/promo-codes';

/**
 * Página de aterrizaje para promociones especiales
 * 
 * URLs soportadas:
 * - /promo?code=FLASH5  (código amigable)
 * - /promo?code=FLASH5&priceId=price_xxx  (código con price específico)
 * 
 * El código de promoción se aplicará automáticamente en el checkout
 */

// Componente interno que usa useSearchParams
function PromoLandingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const activatePromo = async () => {
            // Obtener parámetros de la URL
            const friendlyCode = searchParams.get('code');

            // Validar que existe un código
            if (!friendlyCode) {
                setErrorMessage('No se proporcionó un código de promoción válido.');
                setStatus('error');
                setTimeout(() => router.push('/'), 3000);
                return;
            }

            // Obtener configuración del código promocional (opcional)
            const promoConfig = getPromoConfig(friendlyCode);

            // Determinar el priceId: URL param > Config default > Fallback
            const priceId =
                searchParams.get('priceId') ||
                promoConfig?.defaultPriceId ||
                process.env.NEXT_PUBLIC_STRIPE_FLASH_PRICE_ID;

            // Validar que existe un priceId
            if (!priceId) {
                setErrorMessage('No se pudo determinar el plan. Por favor, contacta con soporte.');
                setStatus('error');
                setTimeout(() => router.push('/'), 3000);
                return;
            }

            try {
                console.log('🎁 Activando promoción:', {
                    code: friendlyCode,
                    priceId,
                    description: promoConfig?.description
                });

                // Llamar a nuestro API de checkout con el código promocional
                const response = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        priceId,
                        promoCode: friendlyCode, // Pasar el código amigable directamente
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Error al crear sesión de checkout');
                }

                // Redirigir a Stripe Checkout
                if (data.url) {
                    console.log('✓ Redirigiendo a Stripe Checkout...');
                    window.location.href = data.url;
                } else {
                    throw new Error('No se recibió URL de checkout');
                }
            } catch (error) {
                console.error('❌ Error al activar la promoción:', error);
                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : 'No se pudo activar la oferta. Por favor, inténtalo de nuevo.'
                );
                setStatus('error');
                setTimeout(() => router.push('/'), 5000);
            }
        };

        activatePromo();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full text-center space-y-6">
                {status === 'loading' && (
                    <>
                        {/* Loader animado neumórfico */}
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-background shadow-[inset_5px_5px_10px_#d1cfcc,inset_-5px_-5px_10px_#ffffff] flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full border-4 border-inforia-green border-t-transparent animate-spin"></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-inforia-green animate-pulse">
                                🎁 Activando tu oferta especial...
                            </h1>
                            <p className="text-gray-600">
                                Preparando tu descuento exclusivo
                            </p>
                        </div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        {/* Error state */}
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-background shadow-[5px_5px_10px_#d1cfcc,-5px_-5px_10px_#ffffff] flex items-center justify-center">
                                <span className="text-4xl">⚠️</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-2xl font-bold text-inforia-burgundy">
                                Oops, algo salió mal
                            </h1>
                            <p className="text-gray-600">
                                {errorMessage}
                            </p>
                            <p className="text-sm text-gray-500">
                                Redirigiendo a la página principal...
                            </p>
                        </div>

                        <button
                            onClick={() => router.push('/')}
                            className="mt-4 px-6 py-3 rounded-xl bg-background text-inforia-green border-2 border-inforia-green font-bold
                shadow-[5px_5px_10px_#d1cfcc,-5px_-5px_10px_#ffffff]
                hover:shadow-[8px_8px_16px_#d1cfcc,-8px_-8px_16px_#ffffff]
                hover:bg-gray-50 transition-all duration-300"
                        >
                            Volver al inicio
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

// Componente de carga mientras Suspense está resolviendo
function PromoLoadingFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-background shadow-[inset_5px_5px_10px_#d1cfcc,inset_-5px_-5px_10px_#ffffff] flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border-4 border-inforia-green border-t-transparent animate-spin"></div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-inforia-green animate-pulse">
                        Cargando...
                    </h1>
                </div>
            </div>
        </div>
    );
}

// Export principal con Suspense
export default function PromoLanding() {
    return (
        <Suspense fallback={<PromoLoadingFallback />}>
            <PromoLandingContent />
        </Suspense>
    );
}
