'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';

// Helper function to validate URL
const isValidUrl = (url: string): boolean => {
    if (!url) return true; // Empty is valid (optional field)
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
};

export function LeadForm() {
    const [formData, setFormData] = useState({ name: '', email: '', web: '' });
    const [errors, setErrors] = useState({ name: '', email: '', web: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form data
        const newErrors = { name: '', email: '', web: '' };

        if (formData.name.trim().length < 3) {
            newErrors.name = 'El nombre debe tener al menos 3 caracteres';
        }

        if (formData.web && !isValidUrl(formData.web)) {
            newErrors.web = 'Por favor, introduce una URL válida (ej: https://tusitio.com)';
        }

        if (newErrors.name || newErrors.web) {
            setErrors(newErrors);
            return;
        }

        // Clear errors if validation passes
        setErrors({ name: '', email: '', web: '' });
        setIsSubmitting(true);

        try {
            console.log('Enviando datos:', { name: formData.name, email: formData.email, role: formData.web });

            const response = await fetch('/api/lead-magnet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    role: formData.web || 'No especificado',
                }),
            });

            console.log('Respuesta recibida:', response.status, response.statusText);

            if (response.ok) {
                const data = await response.json();
                console.log('Datos de respuesta:', data);
                setIsSubmitted(true);
            } else {
                const errorData = await response.json();
                console.error('Error de API:', errorData);
                throw new Error(errorData.error || 'Error al enviar');
            }
        } catch (error) {
            console.error('Error capturado:', error);
            setErrors({ ...errors, email: 'Error al enviar. Intenta de nuevo.' });
        } finally {
            setIsSubmitting(false);
        }
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
                        Accede a la plataforma
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
                            minLength={3}
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value });
                                if (errors.name) setErrors({ ...errors, name: '' });
                            }}
                            className="w-full px-4 py-3 rounded-xl bg-background shadow-[inset_3px_3px_6px_#d1cfcc,inset_-3px_-3px_6px_#ffffff] border-none focus:outline-none focus:ring-2 focus:ring-inforia-green/20 text-gray-800"
                            placeholder="Dr. Juan Pérez"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-inforia-burgundy">{errors.name}</p>
                        )}
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
                            onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value });
                                if (errors.email) setErrors({ ...errors, email: '' });
                            }}
                            className="w-full px-4 py-3 rounded-xl bg-background shadow-[inset_3px_3px_6px_#d1cfcc,inset_-3px_-3px_6px_#ffffff] border-none focus:outline-none focus:ring-2 focus:ring-inforia-green/20 text-gray-800"
                            placeholder="juan.perez@clinica.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-inforia-burgundy">{errors.email}</p>
                        )}
                    </div>

                    {/* Input Web */}
                    <div>
                        <label htmlFor="web" className="block text-sm font-bold text-gray-700 mb-2">
                            Sitio Web
                        </label>
                        <input
                            type="url"
                            id="web"
                            value={formData.web}
                            onChange={(e) => {
                                setFormData({ ...formData, web: e.target.value });
                                if (errors.web) setErrors({ ...errors, web: '' });
                            }}
                            className="w-full px-4 py-3 rounded-xl bg-background shadow-[inset_3px_3px_6px_#d1cfcc,inset_-3px_-3px_6px_#ffffff] border-none focus:outline-none focus:ring-2 focus:ring-inforia-green/20 text-gray-800"
                            placeholder="https://tusitio.com"
                        />
                        {errors.web && (
                            <p className="mt-1 text-sm text-inforia-burgundy">{errors.web}</p>
                        )}
                    </div>

                    {/* Botón Submit Neumórfico */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-xl font-bold text-inforia-green bg-background shadow-[5px_5px_10px_#d1cfcc,-5px_-5px_10px_#ffffff] hover:shadow-[3px_3px_6px_#d1cfcc,-3px_-3px_6px_#ffffff] active:shadow-[inset_3px_3px_6px_#d1cfcc,inset_-3px_-3px_6px_#ffffff] transition-all duration-300 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Enviando...' : 'Accede a 5 informes'}
                    </button>

                    <p className="text-xs text-center text-gray-500">
                        Acceso inmediato · Respuesta en menos de 24 h
                    </p>
                </form>
            </div>
        </section>
    );
}
