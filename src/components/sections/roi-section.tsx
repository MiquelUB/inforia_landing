'use client';

import React from 'react';
import { Clock, TrendingUp, Brain, ShieldCheck, Users, FileText, Heart, Activity } from 'lucide-react';

export function RoiSection() {
  const items = [
    {
      icon: FileText,
      value: '80%',
      label: 'Reducción de papeleo',
    },
    {
      icon: Clock,
      value: '15h',
      label: 'Tiempo ahorrado semanal',
    },
    {
      icon: Users,
      value: '500+',
      label: 'Psicólogos activos',
    },
    {
      icon: Activity,
      value: '+25%',
      label: 'Capacidad de atención',
    },
    {
      icon: Brain,
      value: '0%',
      label: 'Estrés administrativo',
    },
    {
      icon: Heart,
      value: '100%',
      label: 'Tranquilidad mental',
    },
    {
      icon: TrendingUp,
      value: '360º',
      label: 'Visión clínica',
    },
    {
      icon: ShieldCheck,
      value: '0',
      label: 'Errores en gestión',
    },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-heading font-bold text-inforia-green">
            Tu tiempo también es clínico
          </h2>
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

        <div className="mt-16 max-w-4xl mx-auto p-8 rounded-2xl bg-inforia-green/5 border border-inforia-green/10 text-center">
          <p className="text-2xl md:text-3xl font-serif text-inforia-green italic">
            "iNFORiA no es un gasto: es la herramienta que multiplica tu capacidad de trabajo."
          </p>
        </div>
      </div>
    </section>
  );
}
