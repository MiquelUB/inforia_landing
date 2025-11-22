'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQ {
    question: string;
    answer: string;
}

const faqs: FAQ[] = [
    {
        question: '¿Cómo funciona exactamente la prueba de los 5 informes gratis?',
        answer: 'Es nuestra forma de demostrarte la calidad sin riesgo. Solicitas tu código en la web, te llega al correo y tienes acceso inmediato a la plataforma completa para generar tus primeros 5 informes reales. Sin introducir tarjeta de crédito, sin límite de tiempo para gastarlos y sin letra pequeña. Queremos que veas el valor antes de pagar un céntimo.',
    },
    {
        question: '¿Es legal utilizar IA para redactar informes clínicos en España?',
        answer: 'Sí, es completamente legal y ético, siempre que se utilice como herramienta de asistencia. INFORIA actúa como un borrador inteligente: procesa la información, pero tú eres quien revisa, valida y firma el documento final. Cumplimos rigurosamente con el RGPD y la LOPD, asegurando que la tecnología sirva al profesional, nunca sustituyendo su criterio clínico.',
    },
    {
        question: 'Me preocupa la privacidad. ¿La IA "aprende" con los datos de mis pacientes?',
        answer: 'Rotundamente NO. Esta es una diferencia crítica de INFORIA. A diferencia de herramientas gratuitas como ChatGPT, nosotros utilizamos una infraestructura empresarial blindada donde tus datos no se utilizan para entrenar a la IA. La información se procesa de forma encriptada para generar tu informe y luego desaparece del motor de procesamiento. Tu secreto profesional está a salvo.',
    },
    {
        question: '¿Los informes sonarán robóticos o genéricos?',
        answer: 'Para nada. Hemos entrenado a nuestros modelos específicamente con terminología clínica, DSM-5 y CIE-10 para que el lenguaje sea técnico, preciso y empático. Además, INFORIA se adapta al contexto: sabe diferenciar un informe pericial de una nota de evolución. El resultado es un documento profesional que, en el 95% de los casos, solo requiere una revisión ligera por tu parte.',
    },
    {
        question: '¿Qué tipo de "input" necesito darle? ¿Solo voz?',
        answer: 'INFORIA es flexible. Puedes subir el audio grabado de una sesión (con consentimiento), dictar tus propias notas de voz post-sesión o, si lo prefieres, subir tus apuntes escritos escaneados o en texto "sucio". El sistema se encarga de estructurar, limpiar y redactar todo en un formato coherente, ahorrándote horas de transcripción y redacción.',
    },
    {
        question: '¿Dónde se guardan los datos? ¿Están seguros?',
        answer: 'La seguridad es nuestra obsesión. Utilizamos servidores en la Unión Europea con certificación ISO 27001 y encriptación AES-256 (nivel bancario). Además, hemos diseñado INFORIA para integrarse con tu propio entorno (como Google Drive), de modo que tú mantengas la soberanía y el control final de los archivos de tus pacientes.',
    },
    {
        question: '¿Qué pasa si un mes necesito hacer más informes de los que incluye mi plan?',
        answer: 'No te dejaremos tirado. Si superas el límite de tu plan (por ejemplo, el Plan Profesional de 100 informes), puedes adquirir paquetes extra de informes sueltos directamente desde tu panel. Si tu volumen crece de forma sostenida, te avisaremos para que valores pasar al siguiente plan y optimizar tu inversión.',
    },
    {
        question: '¿Hay algún compromiso de permanencia?',
        answer: 'Ninguno. Creemos que te quedarás por la utilidad, no por obligación. Puedes cancelar tu suscripción en cualquier momento con un solo clic desde tu perfil. Mantendrás el acceso hasta que finalice tu ciclo de facturación pagado y podrás exportar todos tus datos antes de irte.',
    },
    {
        question: 'No soy muy tecnológico/a, ¿es difícil de usar?',
        answer: 'Diseñamos INFORIA pensando en la "Sencillez Radical". Si sabes enviar un correo electrónico, sabes usar INFORIA. La interfaz es limpia, sin menús complicados. Además, los planes Profesional y Clínica incluyen soporte prioritario para ayudarte si alguna vez te atascas.',
    },
    {
        question: '¿Funciona bien con diferentes acentos o si hablo rápido?',
        answer: 'Sí. Nuestro motor de transcripción es de última generación y entiende perfectamente español de España y las distintas variantes de Latinoamérica, incluso con ruido de fondo moderado o habla rápida. La precisión media es superior al 95%, captando matices que otras herramientas generalistas pierden.',
    },
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faqs" className="py-24 px-4 bg-background">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-inforia-green">
                        Preguntas Frecuentes
                    </h2>
                    <p className="text-xl text-gray-600">
                        Todo lo que necesitas saber sobre INFORIA
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="rounded-3xl bg-background shadow-[inset_5px_5px_10px_#d1cfcc,inset_-5px_-5px_10px_#ffffff] border border-white/50 overflow-hidden"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50/30 transition-colors duration-200"
                            >
                                <h3 className="text-lg font-bold text-gray-800 pr-4">
                                    {faq.question}
                                </h3>
                                <ChevronDown
                                    className={`w-6 h-6 text-inforia-green flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                    }`}
                            >
                                <div className="px-8 pb-6 pt-2">
                                    <p className="text-gray-700 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">
                        ¿Tienes más preguntas? Estamos aquí para ayudarte.
                    </p>
                    <a
                        href="mailto:inforia@inforia.pro"
                        className="inline-block px-8 py-3 rounded-xl bg-background text-inforia-green border-2 border-inforia-green font-bold text-sm
              shadow-[5px_5px_10px_#d1cfcc,-5px_-5px_10px_#ffffff]
              hover:shadow-[8px_8px_16px_#d1cfcc,-8px_-8px_16px_#ffffff]
              hover:bg-gray-50 transition-all duration-300"
                    >
                        Contactar Soporte
                    </a>
                </div>
            </div>
        </section>
    );
}
