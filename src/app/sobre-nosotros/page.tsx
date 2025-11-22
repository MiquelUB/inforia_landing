import { Header } from '@/components/sections/header';
import { Footer } from '@/components/sections/footer';

export const metadata = {
    title: 'Sobre Nosotros - INFORIA',
    description: 'Nuestra Misión: Tecnología que Cuida al que Cuida. Conoce la historia y filosofía detrás de INFORIA.',
};

export default function SobreNosotrosPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-4xl mx-auto px-4 py-16">
                <article className="prose prose-lg max-w-none">
                    <h1 className="text-4xl font-bold text-inforia-green mb-8">Nuestra Misión: Tecnología que Cuida al que Cuida</h1>

                    <div className="space-y-6 text-gray-700">
                        <p>
                            En INFORIA, creemos que la psicología es una vocación profundamente humana que no debería verse ahogada por la carga administrativa. Sabemos que cada minuto que dedicas a pelear con el papeleo es un minuto menos para ti o para tus pacientes.
                        </p>

                        <p>
                            Nacimos de una necesidad real: resolver la epidemia silenciosa del agotamiento profesional en salud mental. No somos solo una empresa de software; somos el aliado que entiende tu día a día.
                        </p>

                        <p className="font-semibold text-gray-800">
                            Nuestra filosofía se basa en el equilibrio del Mentor:
                        </p>

                        <div className="pl-6 space-y-4">
                            <div>
                                <h3 className="text-xl font-bold text-inforia-green mb-2">El Rigor del Sabio</h3>
                                <p>
                                    Aplicamos la inteligencia artificial más avanzada para garantizar precisión clínica, diagnósticos sugeridos basados en evidencia (DSM-5/CIE-10) y una seguridad de datos inquebrantable.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-inforia-green mb-2">La Empatía del Cuidador</h3>
                                <p>
                                    Diseñamos herramientas que reducen tu estrés, protegen tu tiempo libre y te devuelven la paz mental que mereces.
                                </p>
                            </div>
                        </div>

                        <p>
                            En INFORIA, la tecnología no viene a reemplazarte, sino a liberarte. Nuestro objetivo final es simple pero potente: que recuperes tu vocación y vuelvas a enamorarte de tu profesión, sabiendo que la burocracia está en buenas manos.
                        </p>

                        <p className="text-xl font-semibold text-inforia-green italic mt-8 text-center">
                            Tu consulta, libre de ruido. Tu mente, libre para sanar.
                        </p>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
