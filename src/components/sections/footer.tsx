import React from 'react';
import Link from 'next/link';

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
              <li><Link href="/" className="text-inforia-green hover:text-inforia-cream transition">Blog</Link></li>
              <li><Link href="/sobre-nosotros" className="text-inforia-green hover:text-inforia-cream transition">Sobre Nosotros</Link></li>
              <li><a href="mailto:inforia@inforia.pro" className="text-inforia-green hover:text-inforia-cream transition">Contacto</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacidad" className="text-inforia-green hover:text-inforia-cream transition">Privacidad</Link></li>
              <li><Link href="/terminos" className="text-inforia-green hover:text-inforia-cream transition">Términos</Link></li>
              <li><Link href="/seguridad" className="text-inforia-green hover:text-inforia-cream transition">Seguridad</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 pt-8">
          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-inforia-green">
              © {currentYear} INFORIA. Todos los derechos reservados. <span className="text-xs opacity-50 ml-2">v1.0.2</span>
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/" className="text-inforia-green hover:text-inforia-cream transition">
                Twitter
              </Link>
              <Link href="/" className="text-inforia-green hover:text-inforia-cream transition">
                LinkedIn
              </Link>
              <Link href="/" className="text-inforia-green hover:text-inforia-cream transition">
                Instagram
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
