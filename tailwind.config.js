/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: '#FBF9F6', // Inforia Cream Base
                foreground: '#333333', // Inforia Graphite Text

                // Colores Base shadcn (mapeados a marca si es necesario)
                primary: {
                    DEFAULT: '#2E403B', // Inforia Green
                    foreground: '#FBF9F6'
                },
                secondary: {
                    DEFAULT: '#D4AF37', // Inforia Gold
                    foreground: '#2E403B'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: '#F0EEEB', // Un tono más oscuro que el fondo
                    foreground: '#666666'
                },
                accent: {
                    DEFAULT: '#800020', // Inforia Burgundy
                    foreground: '#FBF9F6'
                },
                popover: {
                    DEFAULT: '#FBF9F6',
                    foreground: '#333333'
                },
                card: {
                    DEFAULT: '#FBF9F6',
                    foreground: '#333333'
                },

                // Paleta Explícita INFORIA
                inforia: {
                    green: '#2E403B',
                    burgundy: '#800020',
                    gold: '#D4AF37',
                    cream: '#FBF9F6',
                    graphite: '#333333'
                },
            },
            fontFamily: {
                heading: ['Lora', 'serif'],
                body: ['Nunito Sans', 'sans-serif'],
                sans: ['Nunito Sans', 'sans-serif'] // Default sans
            },
            // SISTEMA DE SOMBRAS NEUMÓRFICO (Optimizado para #FBF9F6)
            boxShadow: {
                'neu-flat': '9px 9px 18px #d1cfcc, -9px -9px 18px #ffffff',
                'neu-pressed': 'inset 5px 5px 10px #d1cfcc, inset -5px -5px 10px #ffffff',
                'neu-convex': '5px 5px 10px #d1cfcc, -5px -5px 10px #ffffff',
                'neu-toggle': 'inset 0 0 5px rgba(0,0,0,0.1), inset 0 0 10px rgba(0,0,0,0.05)',
                // Sombras estándar para elevación
                'elegant': '0 10px 30px -10px rgba(46, 64, 59, 0.1)',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
                'neu': '30px', // Radio estándar para tarjetas neumórficas
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
