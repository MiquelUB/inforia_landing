'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';

export function LeadForm() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // TODO: Integrar con tu backend/CRM
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitted(true);
        setIsSubmitting(false);
    };

    if (isSubmitted) {
        return (
            <section id="demo-gratis" className="py-24 px-4 bg-background">
                <div className="max-w-md mx-auto text-center">
                    <div className="rounded-[30px] p-12 bg-background shadow-[5px_5px_10px_#d1cfcc,-5px_-5px_10px_#ffffff]">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-inforia-green/10 flex items-center justify-center">
                            <Check className="w-10 h-10 text-inforia-green" />
                        </div>
                        <h3 className="text-2xl font-bold text-inforia-green mb-4">
                            ¡Solicitud Recibida!
                        </h3>
                        <p className="text-gray-600">
                            Te contactaremos pronto para programar tu demo personalizada.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="demo-gratis" className="py-24 px-4 bg-background">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-inforia-green mb-4">
                        Solicita tu Demo Gratis
                    </h2>
                    <p className="text-lg text-gray-600">
                        Descubre cómo INFORIA puede transformar tu práctica clínica
                    </p>
                </div>

                {/* Formulario Neumórfico */}
                <form onSubmit={handleSubmit} className="rounded-[30px] p-8 bg-background shadow-[inset_5px_5px_10px_#d1cfcc,inset_-5px_-5px_10px_#ffffff] space-y-6">

                    {/* Input Nombre */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                            Nombre Completo *
                        </label>
                        <input
                            type="text"
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-background shadow-[inset_3px_3px_6px_#d1cfcc,inset_-3px_-3px_6px_#ffffff] border-none focus:outline-none focus:ring-2 focus:ring-inforia-green/20 text-gray-800"
                            placeholder="Dr. Juan Pérez"
                        />
                    </div>

                    {/* Input Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                            Email Profesional *
                        </label>
                        <input
                            type="email"
                            id="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-background shadow-[inset_3px_3px_6px_#d1cfcc,inset_-3px_-3px_6px_#ffffff] border-none focus:outline-none focus:ring-2 focus:ring-inforia-green/20 text-gray-800"
                            placeholder="juan.perez@clinica.com"
                        />
                    </div>

                    {/* Input Teléfono */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                            Teléfono (opcional)
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-background shadow-[inset_3px_3px_6px_#d1cfcc,inset_-3px_-3px_6px_#ffffff] border-none focus:outline-none focus:ring-2 focus:ring-inforia-green/20 text-gray-800"
                            placeholder="+34 600 000 000"
                        />
                    </div>

                    {/* Botón Submit Neumórfico */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-xl font-bold text-white bg-inforia-green shadow-[5px_5px_10px_#d1cfcc,-5px_-5px_10px_#ffffff] hover:bg-inforia-green/90 active:shadow-[inset_3px_3px_6px_#d1cfcc,inset_-3px_-3px_6px_#ffffff] transition-all duration-300 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Enviando...' : 'Solicitar Demo Gratis'}
                    </button>

                    <p className="text-xs text-center text-gray-500">
                        Sin compromiso. Respuesta en menos de 24 horas.
                    </p>
                </form>
            </div>
        </section>
    );
}
