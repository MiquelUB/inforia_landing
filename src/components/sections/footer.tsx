import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-inforia-green text-inforia-cream py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">INFORIA</h3>
            <p className="text-sm text-gray-200">
              IA para psicólogos. Recupera tu vocación.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold">Producto</h4>
            <ul className="space-y-2 text-sm text-gray-200">
              <li><a href="#features" className="hover:text-inforia-cream transition">Características</a></li>
              <li><a href="#pricing" className="hover:text-inforia-cream transition">Precios</a></li>
              <li><a href="/">Documentación</a></li>
              <li><a href="/">Roadmap</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Empresa</h4>
            <ul className="space-y-2 text-sm text-gray-200">
              <li><a href="/" className="hover:text-inforia-cream transition">Blog</a></li>
              <li><a href="/" className="hover:text-inforia-cream transition">Sobre Nosotros</a></li>
              <li><a href="/" className="hover:text-inforia-cream transition">Contacto</a></li>
              <li><a href="/" className="hover:text-inforia-cream transition">Carreras</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-200">
              <li><a href="/" className="hover:text-inforia-cream transition">Privacidad</a></li>
              <li><a href="/" className="hover:text-inforia-cream transition">Términos</a></li>
              <li><a href="/" className="hover:text-inforia-cream transition">HIPAA</a></li>
              <li><a href="/" className="hover:text-inforia-cream transition">Seguridad</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 pt-8">
          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-300">
              © {currentYear} INFORIA. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="/" className="text-gray-300 hover:text-inforia-cream transition">
                Twitter
              </a>
              <a href="/" className="text-gray-300 hover:text-inforia-cream transition">
                LinkedIn
              </a>
              <a href="/" className="text-gray-300 hover:text-inforia-cream transition">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
