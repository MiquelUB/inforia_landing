'use client';

import React from 'react';
import { NeuButton } from '@/components/ui/neu-button';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-background">
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
              onClick={() => document.getElementById('demo-gratis')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Demo Gratis
            </NeuButton>
          </div>
        </div>

        {/* Right: Hero Image with Neumorphic Frame */}
        <div className="relative">
          <div className="rounded-[30px] overflow-hidden shadow-[5px_5px_10px_#d1cfcc,-5px_-5px_10px_#ffffff] bg-background">
            <Image
              src="/img/mujer_main.png"
              alt="Psicóloga profesional usando INFORIA"
              width={600}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
