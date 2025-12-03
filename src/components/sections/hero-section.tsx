'use client';

import React from 'react';
import { NeuButton } from '@/components/ui/neu-button';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-background">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center mb-20">
        {/* Left: Hero Text */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-serif text-inforia-green leading-tight">
            Tu consulta, organizada con precisión clínica
          </h1>
          <p className="text-xl text-gray-600">
            iNFORiA te ayuda a gestionar tu día a día profesional sin esfuerzo: agenda inteligente, pagos centralizados, informes clínicos automáticos y un historial completo siempre listo.
            <br className="hidden md:block" />
            Trabaja mejor, decide con más claridad y libera horas cada semana.
          </p>
          <div className="flex gap-4">
            <NeuButton
              variant="primary"
              size="lg"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Comenzar ahora
            </NeuButton>
          </div>
        </div>

        <div className="relative flex flex-col gap-8">
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

          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-inforia-green">
              El asistente que tu consulta necesitaba
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              iNFORiA combina gestión, documentación y análisis clínico en una única herramienta pensada para psicólogos, psiquiatras y centros multidisciplinares.
              <br />
              <span className="font-bold text-inforia-green">Todo el rigor. Toda la eficiencia. Ningún caos administrativo.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Hero Section - Moved inside grid */}

    </section>
  );
}
