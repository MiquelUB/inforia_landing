'use client';

import React from 'react';
import { X, Check } from 'lucide-react';

export function ProblemSolutionSection() {
  const comparisons = [
    {
      manual: 'Cada informe requiere entre 20 y 40 minutos.',
      inforia: 'Redacción clínica automática basada en protocolos profesionales.',
    },
    {
      manual: 'Duplicas información en distintos documentos.',
      inforia: 'Todo centralizado: informes, citas, pagos, historial y dosieres.',
    },
    {
      manual: 'Agendas, pagos e historial están distribuidos en varias herramientas.',
      inforia: 'Evolución clara y accesible al instante.',
    },
    {
      manual: 'Revisar la evolución del paciente lleva demasiado tiempo.',
      inforia: 'El equipo trabaja con un mismo criterio y estándar documental.',
    },
    {
      manual: 'La documentación pierde consistencia entre profesionales.',
      inforia: 'La consulta funciona de forma ordenada y previsible.',
    },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-inforia-green">
            Cuando gestionas tu consulta sin iNFORiA... vs Cuando trabajas con iNFORiA...
          </h2>
        </div>

        {/* Comparison Cards */}
        <div className="space-y-6">
          {comparisons.map((item, idx) => (
            <div
              key={idx}
              className="grid md:grid-cols-2 gap-4 md:gap-8 items-stretch"
            >
              {/* Manual (Problem) */}
              <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100 flex items-start gap-4">
                <div className="p-2 bg-red-100 rounded-full text-red-600 shrink-0">
                  <X className="w-5 h-5" />
                </div>
                <p className="text-gray-700 font-medium pt-1">{item.manual}</p>
              </div>

              {/* Inforia (Solution) */}
              <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100 flex items-start gap-4 shadow-neu-flat">
                <div className="p-2 bg-inforia-green/10 rounded-full text-inforia-green shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <p className="text-gray-800 font-bold pt-1">{item.inforia}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
