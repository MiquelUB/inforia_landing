import { Header } from '@/components/sections/header';
import { Footer } from '@/components/sections/footer';

export const metadata = {
    title: 'Seguridad - INFORIA',
    description: 'Seguridad en INFORIA. Información sobre cómo protegemos tus datos y los de tus pacientes.',
};

export default function SeguridadPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-4xl mx-auto px-4 py-16">
                <article className="prose prose-lg max-w-none">
                    <h1 className="text-4xl font-bold text-inforia-green mb-8">Seguridad en INFORIA</h1>

                    <p className="text-gray-700 mb-8">
                        La seguridad de los datos de tu práctica clínica es nuestra prioridad absoluta. Hemos diseñado nuestra infraestructura para cumplir con los estándares más exigentes de la industria.
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-inforia-green mb-4">Infraestructura Segura</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>Servidores:</strong> Utilizamos infraestructura en la nube de proveedores líderes (AWS a través de Supabase), certificados bajo ISO 27001, SOC 2 Tipo 2.</li>
                            <li><strong>Región de Datos:</strong> Por defecto, nuestros servidores están ubicados en la Unión Europea (Frankfurt/Dublín), cumpliendo con la normativa de residencia de datos del RGPD.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-inforia-green mb-4">Protección de Datos</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>Aislamiento de Datos:</strong> Utilizamos Row Level Security (RLS) a nivel de base de datos. Esto garantiza matemáticamente que un usuario nunca pueda acceder a los datos de otro, incluso en caso de error de la aplicación.</li>
                            <li><strong>Copias de Seguridad:</strong> Realizamos backups automáticos diarios con retención segura para prevenir pérdida de información.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-inforia-green mb-4">Seguridad de Pagos</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>PCI-DSS:</strong> Utilizamos Stripe para el procesamiento de pagos. INFORIA nunca toca ni almacena tus datos bancarios completos. Stripe es un proveedor certificado PCI Service Provider Level 1.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-inforia-green mb-4">Autenticación</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>Acceso Seguro:</strong> Utilizamos estándares modernos de autenticación (JWT) y ofrecemos integración con Google Auth para mayor seguridad.</li>
                            <li><strong>Gestión de Sesiones:</strong> Los tokens de acceso tienen caducidad automática y se almacenan de forma segura en el navegador.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-inforia-green mb-4">Notificación de Incidentes</h2>
                        <p className="text-gray-700">
                            Disponemos de un protocolo de respuesta a incidentes. En el improbable caso de una brecha de seguridad que afecte a tus datos, te notificaremos en un plazo máximo de 72 horas, conforme a la normativa vigente.
                        </p>
                    </section>
                </article>
            </main>

            <Footer />
        </div>
    );
}
