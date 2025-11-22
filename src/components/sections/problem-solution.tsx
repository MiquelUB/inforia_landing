import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export function ProblemSolutionSection() {
  const comparisons = [
    {
      title: 'Diagnósticos',
      manual: 'Escribir manualmente cada diagnóstico, validar contra DSM-5',
      inforia: 'IA sugiere diagnósticos validados en segundos',
    },
    {
      title: 'Informes clínicos',
      manual: '2-3 horas por informe, riesgo de inconsistencias',
      inforia: 'Genera informes profesionales en 5 minutos',
    },
    {
      title: 'Seguimiento de pacientes',
      manual: 'Hojas de cálculo confusas y propenso a errores',
      inforia: 'Dashboard intuitivo con historial completo',
    },
  ];

  return (
    <section id="features" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-inforia-green">
            El Papeleo Manual vs INFORIA
          </h2>
          <p className="text-xl text-gray-600">
            Compara cómo trabajas hoy con cómo trabajarás mañana
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="space-y-6">
          {comparisons.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl bg-background p-8 shadow-[inset_5px_5px_10px_#d1cfcc,inset_-5px_-5px_10px_#ffffff] border border-white/50"
            >
              <h3 className="text-2xl font-bold text-inforia-green mb-6">
                {item.title}
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Manual Process */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-700">Método manual</p>
                      <p className="text-gray-600 mt-2">{item.manual}</p>
                    </div>
                  </div>
                </div>

                {/* INFORIA Solution */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-inforia-green flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-inforia-green">Con INFORIA</p>
                      <p className="text-gray-600 mt-2">{item.inforia}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {[
            '📋 Informe sin sesgo',
            '⚡ 10x más rápido',
            '🔒 HIPAA compliant',
            '💰 ROI en 3 meses',
          ].map((benefit) => (
            <div
              key={benefit}
              className="rounded-3xl bg-background p-6 text-center shadow-[inset_5px_5px_10px_#d1cfcc,inset_-5px_-5px_10px_#ffffff] border border-white/50"
            >
              <p className="text-lg font-semibold text-inforia-green">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
