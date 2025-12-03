'use client';

import React, { useState, Suspense } from 'react';
import { Check, Users, FileText, ArrowRight, Gift, Sparkles } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface PricingPlan {
  name: string;
  price: string;
  originalPrice?: string;
  reports: string;
  users: string;
  features: string[];
  priceId: string;
  popular?: boolean;
  isDynamic?: boolean;
}

// 1. Definimos el Plan Flash
const FLASH_PLAN: PricingPlan = {
  name: 'Plan Flash',
  price: '15€',
  reports: '5',
  users: '1',
  popular: true,
  priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_FLASH || '',
  features: [
    '5 Informes Completos',
    'Acceso total a todas las funciones',
    'Sin caducidad',
    'Pago único (sin suscripción)',
  ],
};

// Tus planes normales
const STANDARD_PLANS: PricingPlan[] = [
  {
    name: 'PRO',
    price: '99€',
    reports: '100',
    users: '1',
    popular: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || '',
    features: [
      '100 informes incluidos',
      'Gestión de agenda y pagos',
      'Dossier clínico completo',
    ],
  },
  {
    name: 'PRO+',
    price: '199€',
    reports: '200',
    users: '1',
    popular: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_PLUS || '',
    features: [
      '200 informes incluidos',
      'Todo lo del plan PRO',
      'Prioridad en soporte',
    ],
  },
  {
    name: 'EQUIPO',
    price: '299€',
    reports: '300',
    users: '3',
    popular: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_EQUIPO || '',
    features: [
      '300 informes incluidos',
      '3 Usuarios',
      'Panel de gestión de equipo',
    ],
  },
  {
    name: 'CLÍNICA',
    price: '399€',
    reports: '400',
    users: '4',
    popular: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_CLINICA_PRICE_ID || '',
    features: [
      '400 informes incluidos',
      '4 Usuarios',
      'Roles y permisos avanzados',
    ],
  },
  {
    name: 'CENTRO',
    price: '499€',
    reports: '500',
    users: '5',
    popular: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CENTRO || '',
    features: [
      '500 informes incluidos',
      '5 Usuarios',
      'API de integración',
    ],
  },
  {
    name: 'CENTRO PLUS',
    price: '599€', // Precio base para 6 usuarios
    reports: '600', // Base
    users: '6', // Base
    popular: false,
    isDynamic: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CENTRO_PLUS || '',
    features: [
      'Bolsa global de créditos',
      'Auditoría y control total',
      'Soporte dedicado',
    ],
  },
];

function PricingContent() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [seats, setSeats] = useState(6); // Estado para el slider de Centro Plus
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');

  // DEBUG: Verificar variables de entorno (Individualmente)
  console.log('--- DEBUG STRIPE START ---');
  console.log('FLASH:', process.env.NEXT_PUBLIC_STRIPE_PRICE_FLASH);
  console.log('PRO:', process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO);
  console.log('PRO+:', process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_PLUS);
  console.log('EQUIPO:', process.env.NEXT_PUBLIC_STRIPE_PRICE_EQUIPO);
  console.log('CLINICA:', process.env.NEXT_PUBLIC_STRIPE_CLINICA_PRICE_ID);
  console.log('CENTRO:', process.env.NEXT_PUBLIC_STRIPE_PRICE_CENTRO);
  console.log('CENTRO_PLUS:', process.env.NEXT_PUBLIC_STRIPE_PRICE_CENTRO_PLUS);
  console.log('--- DEBUG STRIPE END ---');

  // Todos los planes visibles
  const activePlans = [FLASH_PLAN, ...STANDARD_PLANS];

  // Cálculo dinámico para Centro Plus
  const calculateDynamicPrice = (users: number) => {
    // Base 599€ por 6 usuarios. +100€ por cada usuario extra.
    const basePrice = 599;
    const extraUsers = users - 6;
    return basePrice + (extraUsers * 100);
  };

  const handleCheckout = async (plan: PricingPlan) => {
    if (!plan.priceId) {
      alert('Este plan aún no está disponible. Contacta con soporte.');
      return;
    }

    setIsLoading(plan.priceId);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.priceId,
          promoCode: plan.name === 'Plan Flash' ? 'FLASH5' : undefined, // Mantenemos el código interno si es necesario
          email: emailParam || undefined,
          quantity: plan.isDynamic ? seats : 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear sesión de checkout');
      }

      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert(error instanceof Error ? error.message : 'Error al procesar el pago');
      setIsLoading(null);
    }
  };

  return (
    <section id="pricing" className="py-24 px-4 bg-background transition-all">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-inforia-green">
            Elije tu Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Planes diseñados para adaptarse a tu forma de trabajar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1400px] mx-auto mb-16">
          {activePlans.map((plan) => (
            <div
              key={plan.name}
              className={`
                relative rounded-neu p-8 transition-all duration-300 flex flex-col
                bg-background shadow-neu-flat hover:shadow-neu-pressed
                ${plan.popular ? 'border-2 border-inforia-green/10 transform md:-translate-y-4 z-10' : ''}
              `}
            >
              <div className="space-y-5 flex-1">
                <div>
                  <h3 className="font-bold text-2xl text-gray-800">{plan.name}</h3>
                  <div className="flex items-baseline mt-2 gap-2">
                    {plan.originalPrice && (
                      <span className="line-through text-gray-400 text-lg">{plan.originalPrice}</span>
                    )}
                    <span className="font-bold text-4xl text-inforia-green">
                      {plan.isDynamic ? `${calculateDynamicPrice(seats)}€` : plan.price}
                    </span>
                    {plan.name !== 'Plan Flash' && <span className="text-gray-500 text-sm">/mes</span>}
                  </div>
                </div>

                {/* Selector de Usuarios para Centro Plus */}
                {plan.isDynamic && (
                  <div className="py-4">
                    <div className="flex items-center justify-between bg-background rounded-neu-inner p-2 shadow-neu-pressed">
                      <button 
                        onClick={() => setSeats(Math.max(6, seats - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-background shadow-neu-flat text-inforia-green hover:text-inforia-gold active:shadow-neu-pressed transition-all"
                      >
                        -
                      </button>
                      <span className="font-bold text-gray-700">{seats} Usuarios</span>
                      <button 
                        onClick={() => setSeats(Math.min(10, seats + 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-background shadow-neu-flat text-inforia-green hover:text-inforia-gold active:shadow-neu-pressed transition-all"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-2">
                      {seats * 100} informes incluidos
                    </p>
                  </div>
                )}

                <div className="space-y-2 py-4 border-y border-gray-200">
                  <div className="flex items-center gap-2 text-inforia-green font-bold text-sm">
                    <Gift className="w-4 h-4" />
                    <span>
                      {plan.isDynamic ? `${seats * 100}` : plan.reports} {plan.isDynamic ? 'Informes' : (plan.name === 'PRO' || plan.name === 'PRO+' ? 'informes' : 'Informes')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Users className="w-4 h-4" />
                    <span>
                      {plan.isDynamic ? `${seats} Usuarios` : `${plan.users} ${parseInt(plan.users) === 1 ? 'Usuario' : 'Usuarios'}`}
                    </span>
                  </div>
                </div>

                <ul className="space-y-2.5">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                      <Check className="w-3.5 h-3.5 text-inforia-green mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleCheckout(plan)}
                disabled={isLoading === plan.priceId}
                className={`
                  mt-6 w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  bg-background text-inforia-green border-2 border-inforia-green hover:bg-gray-50 shadow-[5px_5px_10px_#d1cfcc,-5px_-5px_10px_#ffffff] active:shadow-[inset_3px_3px_6px_#d1cfcc,inset_-3px_-3px_6px_#ffffff]
                `}
              >
                {isLoading === plan.priceId
                  ? 'Procesando...'
                  : 'Seleccionar'
                }
              </button>
            </div>
          ))}
        </div>

        {/* Plan Enterprise - Neumórfico Inverso */}
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl bg-background p-8 
              shadow-[inset_5px_5px_10px_#d1cfcc,inset_-5px_-5px_10px_#ffffff] 
              flex flex-col md:flex-row items-center justify-between gap-6 
              border border-white/50"
          >
            <div className="space-y-2 text-center md:text-left">
              <h3 className="font-bold text-2xl text-gray-800">
                ¿Necesitas personalizacion?
              </h3>
            </div>
            <button
              onClick={() => window.location.href = '#contact'}
              className="
                px-8 py-3 rounded-xl bg-background text-inforia-green border-2 border-inforia-green font-bold text-sm
                shadow-[5px_5px_10px_#d1cfcc,-5px_-5px_10px_#ffffff]
                hover:shadow-[8px_8px_16px_#d1cfcc,-8px_-8px_16px_#ffffff]
                hover:bg-gray-50 transition-all duration-300
                flex items-center gap-2
              "
            >
              Hablamos
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Wrapper necesario para Next.js App Router y useSearchParams
export function PricingSection() {
  return (
    <Suspense fallback={<div className="py-24 text-center">Cargando ofertas...</div>}>
      <PricingContent />
    </Suspense>
  );
}
