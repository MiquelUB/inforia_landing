'use client';

import React from 'react';
import { FileText, Edit3, FolderOpen, Calendar, Users, ShieldCheck } from 'lucide-react';

export function ValueDifferentialSection() {
  const features = [
    {
      icon: FileText,
      title: 'Informes clínicos completos, basados en DC5 y CIE-11',
      description: 'La herramienta genera informes de primera visita, seguimiento y alta con diagnósticos diferenciales a considerar, estructura terapéutica y narrativa profesional. Tú decides, iNFORiA redacta.'
    },
    {
      icon: Edit3,
      title: 'Edición inteligente con contexto clínico',
      description: 'Cada informe se puede ajustar fácilmente: valores, hipótesis, evolución, tratamiento, sesiones previas… Sin plantillas rígidas ni textos impersonales.'
    },
    {
      icon: FolderOpen,
      title: 'Dossier clínico unificado',
      description: 'Todo el recorrido del paciente —evaluaciones, evolución, intervenciones, informes y altas— en un único documento exportable y ordenado.'
    },
    {
      icon: Calendar,
      title: 'Gestión completa de agenda y pagos',
      description: 'Citas recurrentes, recordatorios automáticos, estados de asistencia, gestión de impagos y registro económico por paciente.'
    },
    {
      icon: Users,
      title: 'Organización total del centro',
      description: 'Acceso por usuarios, reparto de créditos, control de permisos, y supervisión centralizada. Un único plan puede gestionar a todo tu equipo sin perder control documental.'
    },
    {
      icon: ShieldCheck,
      title: 'Seguimiento y Protección de Datos',
      description: 'Cumplimiento total de RGPD y estándares de seguridad. Tus datos y los de tus pacientes están encriptados y protegidos con copias de seguridad automáticas.'
    }
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-heading font-bold text-inforia-green">
            Más tiempo para tus pacientes. Menos tiempo en tareas repetitivas.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="p-8 rounded-neu bg-background shadow-neu-flat hover:shadow-neu-pressed transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-background shadow-neu-pressed flex items-center justify-center text-inforia-green mb-6 group-hover:text-inforia-gold transition-colors">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-inforia-green mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
