'use client';

import React, { useState, Suspense } from 'react';
import { Check, Users, FileText, ArrowRight, Gift, Sparkles } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface PricingPlan {
  name: string;
  target: string;
  price: string;
  originalPrice?: string; // Para tachar precios
  reports: string;
  users: string;
  features: string[];
  priceId: string;
  popular?: boolean;
  isPromo?: boolean; // Para destacar la oferta flash
}

// 1. Definimos el Plan Flash (Oculto por defecto)
const FLASH_PLAN: PricingPlan = {
  name: 'Pack Bienvenida',
  target: 'Oferta Especial Email',
  price: '0€',
  originalPrice: '25€',
  reports: '5',
  users: '1',
  popular: true,
  isPromo: true,
  priceId: process.env.NEXT_PUBLIC_STRIPE_FLASH_PRICE_ID || '',
  features: [
    '5 Informes Completos GRATIS',
    'Acceso total a todas las funciones',
    'Sin compromiso de permanencia',
    'No requiere tarjeta (opcional)',
  ],
};

// Tus planes normales (sin cambios)
const STANDARD_PLANS: PricingPlan[] = [
  {
    name: 'Esencial',
    target: 'Solo-preneur (Lite)',
    price: '49€',
    reports: '50',
    users: '1',
    popular: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_ESENCIAL_PRICE_ID || '',
    features: [
      'Transcripción IA ilimitada',
      'Plantillas DSM-5/CIE-10',
      'Almacenamiento Google Drive',
      'Soporte Email',
    ],
  },
  {
    name: 'Dúo',
    target: 'Socios / Parejas',
    price: '99€',
    reports: '110',
    users: '2',
    popular: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_DUO_PRICE_ID || '',
    features: [
      'Todo lo de Esencial',
      'Panel de Gestión de Equipo',
      'Plantillas personalizadas',
      'Soporte Prioritario',
      'Onboarding asistido',
    ],
  },
  {
    name: 'Profesional',
    target: 'Pequeña Consulta',
    price: '189€',
    reports: '220',
    users: '3',
    popular: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PROFESIONAL_PRICE_ID || '',
    features: [
      'Todo lo de Dúo',
      'Roles avanzados',
      'Analítica básica',
      'Panel de estadísticas',
    ],
  },
  {
    name: 'Clínica',
    target: 'Equipos en Crecimiento',
    price: '299€',
    reports: '400',
    users: '4',
    popular: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_CLINICA_PRICE_ID || '',
    features: [
      'Todo lo de Profesional',
      'API de integración',
      'Gestor de cuenta dedicado',
      'Contrato personalizado',
    ],
  },
  {
    name: 'Centro',
    target: 'Instituciones',
    price: '450€',
    reports: '650',
    users: '5',
    popular: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_CENTRO_PRICE_ID || '',
    features: [
      'Todo lo de Clínica',
      'SLA Garantizado',
      'Formación dedicada',
      'Soporte 24/7',
    ],
  },
];

function PricingContent() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const promoCode = searchParams.get('promo');
  const emailParam = searchParams.get('email');

  // 2. Lógica de Activación: Si hay promo, añadimos el plan al principio
  const activePlans = promoCode === 'FLASH5'
    ? [FLASH_PLAN, ...STANDARD_PLANS]
    : STANDARD_PLANS;

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
          // Si es el plan promo, enviamos el código y el email capturado
          promoCode: plan.isPromo ? 'FLASH5' : undefined,
          email: emailParam || undefined
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
            {promoCode === 'FLASH5' ? '¡Oferta Activada! 🎉' : 'Escalera de Valor INFORIA'}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {promoCode === 'FLASH5'
              ? 'Has desbloqueado el Pack de Bienvenida. Reclámalo abajo 👇'
              : 'Elige el plan que se adapta a tu volumen actual. Cambia cuando crezcas.'}
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${promoCode === 'FLASH5' ? 'xl:grid-cols-3' : 'xl:grid-cols-5'} gap-6 max-w-[1400px] mx-auto mb-16`}>
          {activePlans.map((plan) => (
            <div
              key={plan.name}
              className={`
                relative rounded-3xl p-6 transition-all duration-300 flex flex-col
                ${plan.isPromo
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-inforia-green shadow-2xl scale-105 z-20 animate-pulse-slow' // Estilo Promo
                  : plan.popular
                    ? 'bg-background border-2 border-inforia-green z-10 shadow-[8px_8px_16px_#d1cfcc,-8px_-8px_16px_#ffffff]'
                    : 'bg-background border border-gray-200 hover:scale-[1.02] shadow-[5px_5px_10px_#d1cfcc,-5px_-5px_10px_#ffffff]'
                }
                hover:shadow-[8px_8px_16px_#d1cfcc,-8px_-8px_16px_#ffffff]
              `}
            >
              {plan.isPromo && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-inforia-green text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                    <Sparkles className="w-4 h-4 animate-spin" /> REGALO EXCLUSIVO
                  </span>
                </div>
              )}

              <div className="space-y-5 flex-1">
                <div className="inline-block px-3 py-1 rounded-lg bg-inforia-green/5 text-inforia-green text-xs font-bold uppercase tracking-wide">
                  {plan.target}
                </div>

                <div>
                  <h3 className="font-bold text-2xl text-gray-800">{plan.name}</h3>
                  <div className="flex items-baseline mt-2 gap-2">
                    {plan.originalPrice && (
                      <span className="line-through text-gray-400 text-lg">{plan.originalPrice}</span>
                    )}
                    <span className={`font-bold text-4xl ${plan.isPromo ? 'text-green-600' : 'text-inforia-green'}`}>
                      {plan.price}
                    </span>
                    {!plan.isPromo && <span className="text-gray-500 text-sm">/mes</span>}
                  </div>
                  {plan.isPromo && (
                    <p className="text-xs text-green-700 font-bold mt-1">¡Ahorra {plan.originalPrice}! Solo hoy</p>
                  )}
                </div>

                <div className="space-y-2 py-4 border-y border-gray-200">
                  <div className={`flex items-center gap-2 ${plan.isPromo ? 'text-green-600' : 'text-inforia-green'} font-bold text-sm`}>
                    <Gift className="w-4 h-4" />
                    <span>{plan.reports} Informes</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Users className="w-4 h-4" />
                    <span>{plan.users} {parseInt(plan.users) === 1 ? 'Usuario' : 'Usuarios'}</span>
                  </div>
                </div>

                <ul className="space-y-2.5">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                      <Check className={`w-3.5 h-3.5 ${plan.isPromo ? 'text-green-600' : 'text-inforia-green'} mt-0.5 shrink-0`} />
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
                  ${plan.isPromo
                    ? 'bg-inforia-green text-white hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105'
                    : 'bg-background text-inforia-green border-2 border-inforia-green hover:bg-gray-50 shadow-[5px_5px_10px_#d1cfcc,-5px_-5px_10px_#ffffff] active:shadow-[inset_3px_3px_6px_#d1cfcc,inset_-3px_-3px_6px_#ffffff]'
                  }
                `}
              >
                {isLoading === plan.priceId
                  ? 'Procesando...'
                  : plan.isPromo ? '🎁 RECLAMAR REGALO GRATIS' : 'Seleccionar'
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
                ¿Necesitas más de 650 informes?
              </h3>
              <p className="text-gray-600">
                Diseñamos un plan a medida para grandes redes de clínicas.
              </p>
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
              Contactar Ventas
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
