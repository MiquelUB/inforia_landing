'use client';

import React, { useState } from 'react';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuButton } from '@/components/ui/neu-button';
import { Check } from 'lucide-react';

interface PricingPlan {
  name: string;
  target: string;
  price: string;
  period: string;
  reports: string;
  features: string[];
  priceId: string;
  popular?: boolean;
}

// INFORIA 2.0: Simplified pricing structure
const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Plan Inicio',
    target: 'Para empezar',
    price: '49€',
    period: '/mes',
    reports: '50 informes/mes',
    popular: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_INICIO_PRICE_ID || '',
    features: [
      '1 Usuario',
      'Transcripción con IA',
      'Generación de informes',
      'Almacenamiento Google Drive',
      'Soporte por email',
    ],
  },
  {
    name: 'Plan Profesional',
    target: 'Más popular',
    price: '99€',
    period: '/mes',
    reports: '150 informes/mes',
    popular: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PROFESIONAL_PRICE_ID || '',
    features: [
      '2 Usuarios',
      'Todo del Plan Inicio',
      'Panel de gestión de equipo',
      'Plantillas personalizadas',
      'Soporte prioritario',
      'Onboarding asistido',
    ],
  },
  {
    name: 'Plan Clínica',
    target: 'Equipos en crecimiento',
    price: '149€',
    period: '/mes',
    reports: '300 informes/mes',
    popular: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_CLINICA_PRICE_ID || '',
    features: [
      '4 Usuarios',
      'Todo del Plan Profesional',
      'Gestión de roles avanzada',
      'Panel de estadísticas',
      'API de integración',
      'Contrato personalizado',
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
    <section id="pricing" className="py-20 px-4 bg-inforia-cream">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-inforia-green">
            Planes y Precios
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Elige el plan perfecto para tu práctica. Cancela cuando quieras.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <NeuCard
              key={plan.name}
              className={`relative p-8 space-y-6 flex flex-col h-full transition-all duration-300 ${plan.popular
                  ? 'md:scale-105 ring-2 ring-inforia-green shadow-[5px_5px_15px_#d1cfcc,-5px_-5px_15px_#ffffff]'
                  : 'shadow-[5px_5px_10px_#d1cfcc,-5px_-5px_10px_#ffffff]'
                }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-inforia-burgundy text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                    ⭐ Más Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-inforia-green">{plan.name}</h3>
                <p className="text-sm text-gray-500">{plan.target}</p>
              </div>

              {/* Price */}
              <div className="py-4 border-y border-gray-200">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-inforia-green">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{plan.reports}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-inforia-green flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <NeuButton
                variant={plan.popular ? 'primary' : 'accent'}
                size="lg"
                className="w-full mt-auto"
                onClick={() => handleCheckout(plan.priceId)}
                disabled={isLoading === plan.priceId}
              >
                {isLoading === plan.priceId ? 'Procesando...' : 'Comenzar Prueba Gratis'}
              </NeuButton>

              <p className="text-xs text-gray-500 text-center">
                14 días gratis. No requiere tarjeta de crédito.
              </p>
            </NeuCard>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 text-center">
          <NeuCard className="max-w-2xl mx-auto p-8">
            <h3 className="text-2xl font-bold text-inforia-green mb-4">
              ¿Necesitas un plan personalizado?
            </h3>
            <p className="text-gray-600 mb-6">
              Contacta con nosotros para soluciones empresariales con más de 5 usuarios.
            </p>
            <NeuButton variant="ghost" size="lg">
              Contactar Ventas
            </NeuButton>
          </NeuCard>
        </div>
      </div>
    </section>
  );
}
