'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQ {
    question: string;
    answer: string;
}

const faqs: FAQ[] = [
    {
        question: '¿Qué es iNFORiA?',
        answer: 'iNFORiA es tu ayudante inteligente: genera informes clínicos, organiza tu agenda y registra cobros con rigor profesional, basándose en criterios DSM-5 y CIE-11. Todo mediante una interfaz clara que puedes usar desde el primer minuto.',
    },
    {
        question: '¿Cómo funciona el sistema de créditos?',
        answer: 'Cada plan incluye una cantidad de créditos mensual. El consumo es proporcional al uso real de IA y de almacenamiento que requiere cada acción. Si una sesión necesita más procesamiento o más capacidad de subida, consumirá más créditos.',
    },
    {
        question: '¿Los informes son editables?',
        answer: 'Sí. Cada informe se puede modificar completamente: redacción, diagnóstico, evolución, notas o estructura. iNFORiA aporta la base clínica y tú defines el contenido final.',
    },
    {
        question: '¿Dónde se guardan mis informes y mi historial clínico?',
        answer: 'Todo se almacena directamente en tu Google Drive, de forma estructurada y privada. iNFORiA no almacena tu documentación clínicamente sensible en servidores propios. Esto garantiza el control total, el cumplimiento RGPD y la independencia de la herramienta.',
    },
    {
        question: '¿Puedo recuperar el historial completo de un paciente?',
        answer: 'Sí. Puedes acceder desde iNFORiA o directamente desde tu Drive. Tendrás siempre disponibles informes, evolución, documentación y dosieres ordenados automáticamente.',
    },
    {
        question: '¿Cómo funciona iNFORiA en un centro con varios profesionales?',
        answer: 'La cuenta propietaria gestiona usuarios, permisos y créditos. Cada profesional solo accede a su propia información, manteniendo el secreto profesional. El propietario únicamente ve datos administrativos (uso de créditos, actividad general), nunca contenido clínico ni informes del equipo.',
    },
    {
        question: '¿Puedo adaptar los informes a mi modelo terapéutico?',
        answer: 'Sí. Puedes modificar narrativa, estructura, lenguaje, hipótesis y enfoque profesional. iNFORiA te da la base técnica, tú decides cómo quieres expresarla.',
    },
    {
        question: '¿Qué ocurre si me quedo sin créditos antes de la renovación?',
        answer: 'Si agotas los créditos puedes adelantar la renovación del plan y continuar trabajando sin interrupciones, o esperar al ciclo mensual. Además, estamos trabajando en un sistema de cupones de informes, pensado para ofrecer más flexibilidad sin depender de ampliaciones o micropagos.',
    },
    {
        question: '¿Necesito un ordenador potente o software específico para usar iNFORiA?',
        answer: 'No. iNFORiA funciona desde el navegador en cualquier dispositivo moderno: ordenador, tablet o móvil. No requiere instalaciones ni configuraciones especiales. Solo necesitas conexión a internet y tu cuenta de Google Drive para almacenar la documentación. Esto hace que puedas trabajar desde la consulta, desde casa o entre sesiones con total comodidad.',
    },
    {
        question: '¿Qué soporte tengo si necesito ayuda?',
        answer: 'Encontrarás onboarding dentro de la herramienta, documentación actualizada y soporte directo por correo para cualquier duda. Nuestro objetivo es que no pierdas tiempo en configuraciones ni en procesos técnicos.',
    },
    {
        question: '¿Por qué necesito una cuenta de Gmail para usar iNFORiA?',
        answer: 'iNFORiA utiliza Google Drive como sistema seguro de almacenamiento para tus informes, historiales y documentos clínicos. Esto garantiza que toda tu información se guarde en tu propia cuenta, bajo tu control y sin que quede alojada en servidores externos, cumpliendo estrictamente con el RGPD. Por este motivo, actualmente es necesario disponer de una cuenta de Gmail o Google Workspace para operar con total seguridad. Dicho esto, estamos trabajando para incorporar nuevos proveedores de almacenamiento, como Outlook/OneDrive y otros servicios compatibles. El objetivo es que pronto puedas elegir dónde guardar tu documentación clínica sin depender de un único sistema. Cuando esté disponible, podrás cambiar de proveedor sin perder tus datos ni modificar tu flujo de trabajo.',
    },
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [showBreakdown, setShowBreakdown] = useState(false);

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
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[800px]' : 'max-h-0'
                                    }`}
                            >
                                <div className="px-8 pb-6 pt-2">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {faq.answer}
                                    </p>
                                    
                                    {/* Desglose de créditos para la pregunta #2 */}
                                    {index === 1 && (
                                        <div className="mt-4">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowBreakdown(!showBreakdown);
                                                }}
                                                className="text-inforia-green font-bold hover:underline flex items-center gap-2"
                                            >
                                                {showBreakdown ? 'Ocultar desglose técnico' : 'Ver desglose técnico disponible'}
                                                <ChevronDown className={`w-4 h-4 transition-transform ${showBreakdown ? 'rotate-180' : ''}`} />
                                            </button>
                                            
                                            {showBreakdown && (
                                                <div className="mt-4 p-6 rounded-xl bg-gray-50 border border-gray-200 text-sm space-y-4">
                                                    <div>
                                                        <p className="font-bold text-inforia-green mb-2">1 Crédito — Sesión Estándar</p>
                                                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                                            <li>1 informe clínico (IA)</li>
                                                            <li>1 grabación/audio</li>
                                                            <li>Notas de sesión</li>
                                                            <li>1 transcripción (50 min)</li>
                                                            <li>1 archivo pequeño (txt/docx/pdf hasta 10 MB)</li>
                                                        </ul>
                                                    </div>
                                                    
                                                    <div>
                                                        <p className="font-bold text-inforia-green mb-2">2 Créditos — Gestión Documental / Dossier</p>
                                                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                                            <li>Nuevo dossier clínico</li>
                                                            <li>2 archivos pequeños extra</li>
                                                            <li>1 archivo mediano (≈50 MB)</li>
                                                        </ul>
                                                    </div>
                                                    
                                                    <div>
                                                        <p className="font-bold text-inforia-green mb-2">4 Créditos — Sesión Extendida / Compleja</p>
                                                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                                            <li>Sesión estándar completa</li>
                                                            <li>Hasta ≈200 MB para audios de alta calidad o múltiples adjuntos pesados</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
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
