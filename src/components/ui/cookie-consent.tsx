'use client';

import React, { useEffect, useState } from 'react';
import { NeuButton } from '@/components/ui/neu-button';
import { Cookie } from 'lucide-react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('inforia-cookie-consent');
    if (!consent) {
      // Show popup after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('inforia-cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDeny = () => {
    localStorage.setItem('inforia-cookie-consent', 'denied');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex justify-end pointer-events-none">
      <div className="bg-background rounded-xl shadow-neu-flat p-5 max-w-sm w-full pointer-events-auto border border-white/50 animate-in slide-in-from-right-10 fade-in duration-500">
        <div className="flex flex-col gap-4">
          
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-background shadow-neu-pressed flex items-center justify-center flex-shrink-0 text-inforia-green mt-1">
              <Cookie className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-inforia-green text-sm">
                Uso de Cookies
              </h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                Usamos cookies para mejorar tu experiencia.
              </p>
              <div className="text-[10px] text-gray-500">
                <a href="/politica-privacidad" className="underline hover:text-inforia-green transition-colors">
                  Política
                </a>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <NeuButton 
              variant="default" 
              size="sm"
              onClick={handleDeny}
              className="text-xs h-8 px-3 text-gray-600 hover:text-red-500"
            >
              No Cookies
            </NeuButton>
            <NeuButton 
              variant="primary" 
              size="sm"
              onClick={handleAccept}
              className="text-xs h-8 px-3"
            >
              Cookies
            </NeuButton>
          </div>
        </div>
      </div>
    </div>
  );
}
