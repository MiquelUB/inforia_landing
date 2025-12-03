import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-inforia-green text-inforia-cream py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          {/* Company */}
          <div className="text-center md:text-left space-y-2">
            <h1 className="font-serif text-2xl font-medium text-inforia-cream">iNFORiA</h1>
            <p className="text-sm text-inforia-green/80">
              IA para psicólogos. Recupera tu vocación.
            </p>
          </div>

          {/* Contacto */}
          <a 
            href="mailto:inforia@inforia.pro" 
            className="text-inforia-cream hover:text-white transition font-medium border border-inforia-cream/30 px-6 py-2 rounded-full hover:bg-inforia-cream/10"
          >
            Contacto
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-inforia-cream/20 pt-8">
          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-inforia-cream/60">
              © {currentYear} INFORIA. Todos los derechos reservados.
            </p>

            {/* Legal Links - Horizontal */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/privacidad" className="text-inforia-cream/80 hover:text-inforia-cream transition">Privacidad</Link>
              <Link href="/terminos" className="text-inforia-cream/80 hover:text-inforia-cream transition">Términos</Link>
              <Link href="/seguridad" className="text-inforia-cream/80 hover:text-inforia-cream transition">Seguridad</Link>
            </div>

            {/* Social - LinkedIn Only */}
            <div>
              <Link href="https://linkedin.com" target="_blank" className="text-inforia-cream/80 hover:text-inforia-cream transition">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
