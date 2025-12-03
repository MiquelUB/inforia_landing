'use client';

import React from 'react';
import { NeuButton } from '@/components/ui/neu-button';

export function CtaSection() {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-serif text-inforia-green leading-tight">
          Tu consulta funciona mejor cuando tú puedes enfocarte en lo importante
        </h2>
        
        <p className="text-xl text-gray-600 leading-relaxed">
          iNFORiA lleva el peso administrativo, documental y operativo.
          <br />
          Tú te centras en tus pacientes.
        </p>

        <div className="pt-4">
          <p className="text-lg text-gray-800 font-medium mb-8">
            Activa tu plan y empieza a trabajar con la organización y precisión que tu práctica profesional merece.
          </p>
          
          <NeuButton
            variant="primary"
            size="lg"
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Ver Planes
          </NeuButton>
        </div>
      </div>
    </section>
  );
}
