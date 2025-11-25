import { Header } from '@/components/sections/header';
import { Footer } from '@/components/sections/footer';

export const metadata = {
    title: 'Política de Privacidad - INFORIA',
    description: 'Política de Privacidad de INFORIA. Información sobre cómo recopilamos, usamos y protegemos tu información.',
};

export default function PrivacidadPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-4xl mx-auto px-4 py-16">
                <article className="prose prose-lg max-w-none">
                    <h1 className="text-4xl font-bold text-inforia-green mb-8">Política de Privacidad de INFORIA</h1>

                    <p className="text-gray-600 mb-8"><strong>Última actualización:</strong> 1/11/2025</p>

                    <p className="text-gray-700 mb-8">
                        En INFORIA, nos tomamos muy en serio la privacidad. Esta política describe cómo recopilamos, usamos y protegemos tu información y la de tus pacientes al utilizar nuestro software de asistencia clínica.
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-inforia-green mb-4">1. Responsable del Tratamiento</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>Identidad:</strong> INFORIA.</li>
                            <li><strong>NIF:</strong> 43726721H</li>
                            <li><strong>Dirección:</strong> Mayor, 11; 25560, SORT, Lleida</li>
                            <li><strong>Email de contacto:</strong> inforia@inforia.pro</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-inforia-green mb-4">2. Qué datos recopilamos</h2>
                        <p className="text-gray-700 mb-4">Recopilamos información para prestar el servicio:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>Datos de Cuenta:</strong> Nombre, correo electrónico, especialidad profesional.</li>
                            <li><strong>Datos de Facturación:</strong> Procesados de forma segura a través de <strong>Stripe</strong>. Nosotros no almacenamos números de tarjeta de crédito completos.</li>
                            <li><strong>Datos de Uso:</strong> Métricas de uso de la plataforma para mejorar el servicio.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-inforia-green mb-4">3. Tratamiento de Datos Clínicos (Pacientes)</h2>
                        <p className="text-gray-700 mb-4">INFORIA funciona con una arquitectura de &quot;Privacidad por Diseño&quot;.</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>Soberanía del Dato:</strong> Los informes clínicos y transcripciones generados se almacenan principalmente en <strong>tu propio entorno de Google Drive</strong>. INFORIA actúa como una pasarela de procesamiento seguro.</li>
                            <li><strong>Procesamiento Transitorio:</strong> Los audios y textos enviados a nuestros sistemas de IA se procesan de forma encriptada y no se utilizan para entrenar modelos públicos.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-inforia-green mb-4">4. Finalidad del tratamiento</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>Proveer el servicio de generación de informes y gestión clínica.</li>
                            <li>Gestionar suscripciones y pagos.</li>
                            <li>Enviar comunicaciones transaccionales (códigos de acceso, facturas).</li>
                            <li>Responder a solicitudes de soporte.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-inforia-green mb-4">5. Compartición con Terceros (Subencargados)</h2>
                        <p className="text-gray-700 mb-4">Para prestar el servicio, utilizamos proveedores de infraestructura de máxima seguridad:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>Supabase:</strong> Base de datos y autenticación (Alojado en AWS Europa).</li>
                            <li><strong>Stripe:</strong> Pasarela de pagos (Certificado PCI-DSS Nivel 1).</li>
                            <li><strong>Make:</strong> Automatización de procesos internos.</li>
                            <li><strong>OpenAI / Proveedores IA:</strong> Procesamiento de lenguaje natural (vía API empresarial con cláusula de no-entrenamiento).</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-inforia-green mb-4">6. Tus Derechos (RGPD)</h2>
                        <p className="text-gray-700">
                            Tienes derecho a acceder, rectificar, suprimir, limitar u oponerte al tratamiento de tus datos.
                            Puedes ejercer estos derechos escribiendo a <a href="mailto:inforia@inforia.pro" className="text-inforia-green hover:underline">inforia@inforia.pro</a>.
                        </p>
                    </section>
                </article>
            </main>

            <Footer />
        </div>
    );
}
