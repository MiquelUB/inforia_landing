'use client';

import React, { useState, Suspense } from 'react';
import { Check, Users, Gift, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { usePrices } from '@/hooks/use-prices';

interface PricingPlan {
  name: string;
  target: string;
  price: string;
  originalPrice?: string;
  reports: string;
  users: string;
  features: string[];
  priceId: string;
  popular?: boolean;
  isPromo?: boolean;
}

// El Plan Flash (15€ base, 0€ con cupón)
const FLASH_PLAN_BASE: PricingPlan = {
  name: 'Plan Flash',
  target: 'Ideal para probar',
  price: '15€',
  reports: '5',
  users: '1',
  popular: true,
  isPromo: true,
  priceId: process.env.NEXT_PUBLIC_STRIPE_FLASH_PRICE_ID || '',
  features: [
    '5 Informes Completos',
    'Acceso total a todas las funciones',
    'Sin compromiso de permanencia',
    'Pago único (sin suscripción)',
  ],
};

function PricingContent() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const promoCode = searchParams.get('promo');
  const emailParam = searchParams.get('email');

  const { plans: dbPlans, loading: plansLoading } = usePrices();

  const standardPlans: PricingPlan[] = dbPlans.map(p => ({
    name: p.name,
    target: p.target,
    price: `${p.amount}€`,
    reports: p.reports_limit,
    users: p.users_limit,
    features: p.features,
    priceId: p.id,
    popular: p.popular
  }));

  if (plansLoading) {
    return (
      <section id="pricing" className="py-24 px-4 bg-background min-h-[600px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-background shadow-neu-flat animate-pulse"></div>
            <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 animate-spin text-inforia-green" />
          </div>
          <span className="text-inforia-green font-heading text-lg tracking-wide">Sincronizando tarifas...</span>
        </div>
      </section>
    );
  }

  const isFlashPromo = promoCode === 'FLASH5';

  const flashPlan = {
    ...FLASH_PLAN_BASE,
    price: isFlashPromo ? '0€' : '15€',
    originalPrice: isFlashPromo ? '15€' : undefined,
    features: [
      '5 Informes Completos',
      'Acceso total a todas las funciones',
      'Sin compromiso de permanencia',
      isFlashPromo ? 'No requiere tarjeta (opcional)' : 'Pago único (sin suscripción)',
    ]
  };

  const activePlans = [flashPlan, ...standardPlans];

  const handleCheckout = async (plan: PricingPlan) => {
    if (!plan.priceId) {
      alert('Error de configuración: Plan no disponible.');
      return;
    }

    setIsLoading(plan.priceId);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.priceId,
          promoCode: (plan.isPromo && isFlashPromo) ? 'FLASH5' : undefined,
          email: emailParam || undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error al iniciar pago');
      if (data.url) window.location.href = data.url;

    } catch (error) {
      console.error(error);
      alert('Error de conexión con la pasarela de pago.');
      setIsLoading(null);
    }
  };

  return (
    <section id="pricing" className="py-24 px-4 bg-background transition-all">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-inforia-green drop-shadow-sm">
            Planes y Precios
          </h2>
          <p className="text-xl text-gray-600 font-body max-w-2xl mx-auto">
            {isFlashPromo
              ? 'Has desbloqueado el Plan Flash GRATIS. Reclámalo abajo 👇'
              : 'Elige el plan que se adapta a tu volumen actual.'}
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 max-w-[1400px] mx-auto mb-20`}>
          {activePlans.map((plan) => (
            <div
              key={plan.priceId || plan.name}
              className={`
                relative rounded-neu p-8 flex flex-col transition-all duration-300
                bg-background
                ${plan.isPromo
                  ? 'shadow-neu-flat border-2 border-inforia-gold/20 z-10'
                  : plan.popular
                    ? 'shadow-neu-flat border-2 border-inforia-green/10 transform md:-translate-y-4'
                    : 'shadow-neu-flat hover:shadow-neu-convex'
                }
              `}
            >
              {/* Solo mostramos badge si es la promo GRATIS activa */}
              {plan.isPromo && isFlashPromo && (
                <div className="absolute -top-5 left-0 right-0 flex justify-center">
                  <span className="bg-inforia-gold text-inforia-green px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg font-heading tracking-wider">
                    <Sparkles className="w-4 h-4 animate-spin-slow" />
                    REGALO EXCLUSIVO
                  </span>
                </div>
              )}

              {plan.popular && !plan.isPromo && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-inforia-green text-inforia-cream px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
                    Más Popular
                  </span>
                </div>
              )}

              <div className="space-y-6 flex-1">
                <div className="inline-block px-4 py-1.5 rounded-full bg-background shadow-neu-pressed text-inforia-green text-xs font-bold uppercase tracking-wide">
                  {plan.target}
                </div>

                <div>
                  <h3 className="font-heading font-bold text-2xl text-inforia-green">{plan.name}</h3>
                  <div className="flex items-baseline mt-3 gap-3">
                    {plan.originalPrice && (
                      <span className="line-through text-gray-400 text-lg font-body decoration-inforia-burgundy/50 decoration-2">
                        {plan.originalPrice}
                      </span>
                    )}
                    <span className={`font-heading font-bold text-4xl ${plan.isPromo ? 'text-inforia-gold' : 'text-inforia-green'}`}>
                      {plan.price}
                    </span>
                    {!plan.isPromo && <span className="text-gray-500 text-sm font-body">/mes</span>}
                  </div>
                </div>

                <div className="space-y-3 py-6 border-t border-gray-100/50">
                  <div className={`flex items-center gap-3 ${plan.isPromo ? 'text-inforia-gold' : 'text-inforia-green'} font-bold text-sm`}>
                    <Gift className="w-5 h-5" />
                    <span>{plan.reports} Informes</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <Users className="w-5 h-5" />
                    <span>{plan.users} {parseInt(plan.users) === 1 ? 'Usuario' : 'Usuarios'}</span>
                  </div>
                </div>

                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 font-body leading-relaxed">
                      <div className={`mt-0.5 p-0.5 rounded-full ${plan.isPromo ? 'bg-inforia-gold/20 text-inforia-gold' : 'bg-inforia-green/10 text-inforia-green'}`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleCheckout(plan)}
                disabled={isLoading === plan.priceId}
                className={`
                  mt-8 w-full py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${plan.isPromo
                    ? 'bg-inforia-green text-inforia-gold shadow-neu-flat hover:shadow-neu-pressed hover:text-white'
                    : 'bg-background text-inforia-green shadow-neu-flat hover:shadow-neu-pressed hover:text-inforia-gold'
                  }
                `}
              >
                {isLoading === plan.priceId
                  ? 'Procesando...'
                  : (plan.isPromo && isFlashPromo) ? '🎁 RECLAMAR GRATIS' : 'Seleccionar Plan'
                }
              </button>
            </div>
          ))}
        </div>

        {/* Bloque Enterprise Neumórfico */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-neu bg-background p-10 shadow-neu-flat flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <h3 className="font-heading font-bold text-2xl text-inforia-green">¿Necesitas más capacidad?</h3>
              <p className="text-gray-600 font-body">Planes a medida para grandes redes de clínicas y hospitales.</p>
            </div>
            <button
              onClick={() => window.location.href = '#contact'}
              className="px-8 py-4 rounded-xl bg-background text-inforia-green shadow-neu-flat hover:shadow-neu-pressed font-bold text-sm transition-all flex items-center gap-3"
            >
              Contactar Ventas <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  return (
    <Suspense fallback={<div className="py-24 text-center bg-background">Cargando ofertas...</div>}>
      <PricingContent />
    </Suspense>
  );
}
