'use client';

import React from 'react';
import { NeuButton } from '@/components/ui/neu-button';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-inforia-cream">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Hero Text */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-serif text-inforia-green leading-tight">
            Recupera tu vocación. Nosotros nos encargamos del papeleo.
          </h1>
          <p className="text-xl text-gray-600">
            El asistente clínico con IA para psicólogos. Automatiza informes, gestiona pacientes y enfócate en lo que realmente importa.
          </p>
          <div className="flex gap-4">
            <NeuButton
              variant="primary"
              size="lg"
              onClick={() => document.getElementById('coupon-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Prueba Gratis
            </NeuButton>
            <NeuButton variant="ghost" size="lg" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
              Ver Precios
            </NeuButton>
          </div>
        </div>

        {/* Right: Hero Image with Neumorphic Shadow */}
        <div className="relative">
          <div className="rounded-[30px] overflow-hidden shadow-[5px_5px_10px_#d1cfcc,-5px_-5px_10px_#ffffff] bg-gradient-to-br from-inforia-green/10 to-inforia-burgundy/10 aspect-square flex items-center justify-center">
            {/* Placeholder for woman_main.png */}
            <div className="text-center text-inforia-green/30 p-8">
              <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
                <circle cx="200" cy="140" r="60" fill="currentColor" opacity="0.2" />
                <path d="M120 250 Q120 200 200 200 Q280 200 280 250 L280 350 Q280 380 250 380 L150 380 Q120 380 120 350 Z" fill="currentColor" opacity="0.2" />
              </svg>
              <p className="text-sm mt-4">woman_main.png</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
