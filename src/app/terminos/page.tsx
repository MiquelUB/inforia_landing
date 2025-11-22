import { Header } from '@/components/sections/header';
import { Footer } from '@/components/sections/footer';

export const metadata = {
    title: 'Términos y Condiciones de Uso - INFORIA',
    description: 'Términos y Condiciones de Uso de INFORIA. Condiciones legales para el uso de nuestra plataforma.',
};

export default function TerminosPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-4xl mx-auto px-4 py-16">
                <article className="prose prose-lg max-w-none">
                    <h1 className="text-4xl font-bold text-inforia-green mb-8">Términos y Condiciones de Uso</h1>

                    <p className="text-gray-600 mb-8"><strong>Última actualización:</strong> 1/11/25</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-inforia-green mb-4">1. Aceptación</h2>
                        <p className="text-gray-700">
                            Al registrarte o utilizar INFORIA, aceptas estos términos. Si no estás de acuerdo, no debes usar el servicio.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-inforia-green mb-4">2. Descripción del Servicio</h2>
                        <p className="text-gray-700">
                            INFORIA es una herramienta de software as a service (SaaS) que utiliza Inteligencia Artificial para asistir a profesionales de la salud mental en tareas administrativas, redacción de informes y gestión documental.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-inforia-green mb-4">3. Responsabilidad Profesional</h2>
                        <p className="text-gray-700 font-bold mb-4">IMPORTANTE: INFORIA es una herramienta de asistencia, no un sustituto del juicio profesional.</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>Supervisión:</strong> El profesional usuario es el único responsable de revisar, editar y validar cualquier contenido, diagnóstico sugerido o informe generado por la plataforma.</li>
                            <li><strong>Exención:</strong> INFORIA, S.L. no se hace responsable de decisiones clínicas tomadas basándose en los borradores generados por el software.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-inforia-green mb-4">4. Suscripciones y Pagos</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>Planes:</strong> Ofrecemos planes mensuales (Esencial, Dúo, Profesional, Clínica).</li>
                            <li><strong>Prueba Gratuita:</strong> Ofrecemos un periodo de prueba o un cupón de uso limitado. Al finalizar, se requiere una suscripción activa para continuar usando el servicio.</li>
                            <li><strong>Cancelación:</strong> Puedes cancelar tu suscripción en cualquier momento desde tu panel de control. El acceso continuará hasta el final del ciclo de facturación pagado.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-inforia-green mb-4">5. Propiedad Intelectual</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>Del Software:</strong> INFORIA, S.L. conserva todos los derechos sobre el código, diseño y algoritmos de la plataforma.</li>
                            <li><strong>De tus Datos:</strong> Tú conservas la propiedad total de los informes y datos de pacientes que generes o subas a la plataforma.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-inforia-green mb-4">6. Modificaciones</h2>
                        <p className="text-gray-700">
                            Nos reservamos el derecho de modificar estos términos. Notificaremos cambios significativos a través del correo electrónico asociado a tu cuenta.
                        </p>
                    </section>
                </article>
            </main>

            <Footer />
        </div>
    );
}
