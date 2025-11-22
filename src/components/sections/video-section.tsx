'use client';

import React from 'react';
import { Play } from 'lucide-react';

export function VideoSection() {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-inforia-green">
            Ve INFORIA en Acción
          </h2>
          <p className="text-xl text-gray-600">
            Descubre cómo transformamos tu práctica clínica en minutos
          </p>
        </div>

        {/* Contenedor de video con sombra de pantalla física profunda */}
        <div className="relative aspect-video rounded-[30px] overflow-hidden shadow-[20px_20px_60px_#d1cfcc,-20px_-20px_60px_#ffffff] bg-background group cursor-pointer hover:shadow-[25px_25px_70px_#d1cfcc,-25px_-25px_70px_#ffffff] transition-all duration-300">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-inforia-green/5 to-inforia-burgundy/5">
            <div className="text-center p-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-background shadow-[5px_5px_10px_#d1cfcc,-5px_-5px_10px_#ffffff] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-10 h-10 text-inforia-green ml-1" fill="currentColor" />
              </div>
              <p className="text-gray-700 font-semibold">
                Presiona para ver demo (3:45 min)
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Próximamente
              </p>
            </div>
          </div>
        </div>

        {/* Stats Neumórficos */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            { label: 'Reducción de papeleo', value: '80%' },
            { label: 'Tiempo ahorrado semanal', value: '15h' },
            { label: 'Psicólogos activos', value: '500+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center space-y-2 p-8 rounded-[30px] bg-background shadow-[5px_5px_10px_#d1cfcc,-5px_-5px_10px_#ffffff]">
              <p className="text-4xl font-bold text-inforia-green">{stat.value}</p>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
