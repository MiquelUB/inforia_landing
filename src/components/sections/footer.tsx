import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-inforia-green text-inforia-cream py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Company */}
          <div className="space-y-4">
            <h1 className="font-serif text-2xl font-medium text-inforia-cream">iNFORiA</h1>
            <p className="text-sm text-inforia-green">
              IA para psicólogos. Recupera tu vocación.
            </p>
          </div>


          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-inforia-green hover:text-inforia-cream transition">Blog</a></li>
              <li><a href="/sobre-nosotros" className="text-inforia-green hover:text-inforia-cream transition">Sobre Nosotros</a></li>
              <li><a href="mailto:inforia@inforia.pro" className="text-inforia-green hover:text-inforia-cream transition">Contacto</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacidad" className="text-inforia-green hover:text-inforia-cream transition">Privacidad</a></li>
              <li><a href="/terminos" className="text-inforia-green hover:text-inforia-cream transition">Términos</a></li>
              <li><a href="/seguridad" className="text-inforia-green hover:text-inforia-cream transition">Seguridad</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 pt-8">
          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-inforia-green">
              © {currentYear} INFORIA. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="/" className="text-inforia-green hover:text-inforia-cream transition">
                Twitter
              </a>
              <a href="/" className="text-inforia-green hover:text-inforia-cream transition">
                LinkedIn
              </a>
              <a href="/" className="text-inforia-green hover:text-inforia-cream transition">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
