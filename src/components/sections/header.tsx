'use client';

import React from 'react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="hover:opacity-80 transition-calm">
            <h1 className="font-serif text-2xl font-medium text-primary">iNFORiA</h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-inforia-green hover:text-inforia-burgundy transition">
            Características
          </a>
          <a href="#pricing" className="text-inforia-green hover:text-inforia-burgundy transition">
            Precios
          </a>
          <a href="#faqs" className="text-inforia-green hover:text-inforia-burgundy transition">
            FAQ's
          </a>
          <a href="#contact" className="text-inforia-green hover:text-inforia-burgundy transition">
            Contacto
          </a>
        </nav>

      </div>
    </header>
  );
}
