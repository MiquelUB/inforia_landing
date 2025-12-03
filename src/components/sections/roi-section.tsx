'use client';

import React from 'react';
import { Clock, TrendingUp, Brain, ShieldCheck, Users, FileText, Heart, Activity } from 'lucide-react';

export function RoiSection() {
  const items = [
    {
      icon: Clock,
      value: '1-2h',
      label: 'Gestión semanal (vs 10-14h)',
    },
    {
      icon: Activity,
      value: '+ Sesiones',
      label: 'Más tiempo disponible',
    },
    {
      icon: Brain,
      value: '0%',
      label: 'Estrés administrativo',
    },
    {
      icon: TrendingUp,
      value: '+ Ingresos',
      label: 'Mayor rentabilidad',
    },
    {
      icon: FileText,
      value: '100%',
      label: 'Decisiones informadas',
    },
    {
      icon: ShieldCheck,
      value: '0',
      label: 'Errores administrativos',
    },
    {
      icon: Heart,
      value: '100%',
      label: 'Tranquilidad mental',
    },
    {
      icon: Users,
      value: '360º',
      label: 'Visión clínica',
    },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-heading font-bold text-inforia-green">
            Tu tiempo también es clínico
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un profesional invierte de media <span className="font-bold text-[#800020]">10 a 14 horas</span> a la semana en tareas administrativas.
            <br />
            Con iNFORiA esas tareas pasan a tomar <span className="font-bold text-inforia-green">1 o 2 horas</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <div 
              key={idx}
              className="p-8 rounded-neu bg-background shadow-neu-flat hover:shadow-neu-pressed transition-all duration-300 group flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-background shadow-neu-pressed flex items-center justify-center text-inforia-green mb-4 group-hover:text-inforia-gold transition-colors">
                <item.icon className="w-6 h-6" />
              </div>
              
              <div className="text-3xl font-bold text-inforia-green mb-2 font-heading">
                {item.value}
              </div>
              
              <div className="font-semibold text-gray-600">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-serif text-inforia-green italic">
            "iNFORiA no es un gasto: es la herramienta que multiplica tu capacidad de trabajo."
          </p>
        </div>
      </div>
    </section>
  );
}
