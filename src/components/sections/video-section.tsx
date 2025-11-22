import React from 'react';
import { NeuCard } from '@/components/ui/neu-card';
import { Play } from 'lucide-react';

export function VideoSection() {
  return (
    <section className="py-20 px-4 bg-inforia-cream">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-inforia-green">
            Mira INFORIA en Acción
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre cómo nuestro asistente IA automatiza el 80% de tu trabajo administrativo
          </p>
        </div>

        {/* Video Container */}
        <NeuCard className="aspect-video flex items-center justify-center bg-gradient-to-br from-inforia-green to-inforia-burgundy cursor-pointer group hover:shadow-2xl transition-all">
          <div className="flex flex-col items-center gap-4">
            <Play className="w-20 h-20 text-inforia-cream group-hover:scale-110 transition-transform" />
            <span className="text-inforia-cream font-semibold">
              Presiona para ver demo (3:45 min)
            </span>
          </div>
        </NeuCard>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { label: 'Reducción de papeleo', value: '80%' },
            { label: 'Tiempo ahorrado semanal', value: '15h' },
            { label: 'Psicólogos activos', value: '500+' },
          ].map((stat) => (
            <NeuCard key={stat.label} className="text-center space-y-2 p-8">
              <p className="text-4xl font-bold text-inforia-green">{stat.value}</p>
              <p className="text-gray-600">{stat.label}</p>
            </NeuCard>
          ))}
        </div>
      </div>
    </section>
  );
}
