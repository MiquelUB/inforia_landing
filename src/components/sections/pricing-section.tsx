'use client';

import React, { useState } from 'react';
import { Check, Users, FileText, Star, ArrowRight } from 'lucide-react';

interface PricingPlan {
  name: string;
  target: string;
  price: string;
  reports: string;
  users: string;
  features: string[];
  priceId: string;
  popular?: boolean;
}

// INFORIA 2.0: Escalera de Valor - 5 Planes
const PRICING_PLANS: PricingPlan[] = [
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
    popular: true, // ⭐ Plan Destacado
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

export function PricingSection() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string) => {
    if (!priceId) {
      alert('Este plan aún no está disponible. Contacta con soporte.');
      return;
    }

    setIsLoading(priceId);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear sesión de checkout');
      }

      // Redirigir a Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert(error instanceof Error ? error.message : 'Error al procesar el pago');
      setIsLoading(null);
    }
  };

  return (
    <section id="pricing" className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-inforia-green">
            Escalera de Valor INFORIA
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Elige el plan que se adapta a tu volumen actual. Cambia cuando crezcas.
          </p>
        </div>

        {/* Grid de 5 Planes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-[1400px] mx-auto mb-16">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`
                relative rounded-3xl p-6 bg-background transition-all duration-300
                ${plan.popular
                  ? 'border-2 border-inforia-green lg:scale-105 z-10 shadow-[8px_8px_16px_#d1cfcc,-8px_-8px_16px_#ffffff]'
                  : 'border border-gray-200 hover:scale-[1.02] shadow-[5px_5px_10px_#d1cfcc,-5px_-5px_10px_#ffffff]'
                }
                hover:shadow-[8px_8px_16px_#d1cfcc,-8px_-8px_16px_#ffffff]
              `}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-inforia-green text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                  <Star className="w-3 h-3 fill-current" />
                  Más Popular
                </div>
              )}

              <div className="space-y-5">
                {/* Badge Target */}
                <div className="inline-block px-3 py-1 rounded-lg bg-inforia-green/5 text-inforia-green text-xs font-bold uppercase tracking-wide">
                  {plan.target}
                </div>

                {/* Plan Name */}
                <div>
                  <h3 className="font-bold text-2xl text-gray-800">{plan.name}</h3>
                  <div className="flex items-baseline mt-2">
                    <span className="font-bold text-4xl text-inforia-green">{plan.price}</span>
                    <span className="text-gray-500 ml-1 text-sm">/mes</span>
                  </div>
                </div>

                {/* Métricas Clave */}
                <div className="space-y-2 py-4 border-y border-gray-200">
                  <div className="flex items-center gap-2 text-inforia-burgundy font-bold text-sm">
                    <FileText className="w-4 h-4" />
                    <span>{plan.reports} Informes</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Users className="w-4 h-4" />
                    <span>{plan.users} {parseInt(plan.users) === 1 ? 'Usuario' : 'Usuarios'}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2.5">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                      <Check className="w-3.5 h-3.5 text-inforia-green mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button - Neumórfico */}
                <button
                  onClick={() => handleCheckout(plan.priceId)}
                  disabled={isLoading === plan.priceId}
                  className={`
                    w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300
                    shadow-[5px_5px_10px_#d1cfcc,-5px_-5px_10px_#ffffff]
                    active:shadow-[inset_3px_3px_6px_#d1cfcc,inset_-3px_-3px_6px_#ffffff]
                    hover:translate-y-[1px]
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${plan.popular
                      ? 'bg-inforia-green text-white hover:bg-inforia-green/90'
                      : 'bg-background text-inforia-green border-2 border-inforia-green hover:bg-gray-50'
                    }
                  `}
                >
                  {isLoading === plan.priceId ? 'Procesando...' : 'Seleccionar'}
                </button>

                <p className="text-[10px] text-gray-500 text-center">
                  14 días gratis. Sin tarjeta.
                </p>
              </div>
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
                px-8 py-3 rounded-xl bg-inforia-burgundy text-white font-bold text-sm
                shadow-[5px_5px_10px_#d1cfcc,-5px_-5px_10px_#ffffff]
                hover:shadow-[8px_8px_16px_#d1cfcc,-8px_-8px_16px_#ffffff]
                hover:bg-inforia-burgundy/90 transition-all duration-300
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
