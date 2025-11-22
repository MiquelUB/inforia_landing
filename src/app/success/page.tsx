'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { NeuButton } from '@/components/ui/neu-button';
import { NeuCard } from '@/components/ui/neu-card';
import { CheckCircle } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-inforia-cream flex items-center justify-center px-4 py-20">
      <NeuCard className="max-w-md text-center space-y-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-inforia-green">
            ¡Bienvenido a INFORIA!
          </h1>
          <p className="text-gray-600">
            Tu suscripción ha sido procesada exitosamente.
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-700">
          <p className="font-semibold mb-2">ID de sesión:</p>
          <p className="font-mono text-xs break-all">{sessionId || 'N/A'}</p>
        </div>

        <div className="space-y-3 pt-4">
          <p className="text-gray-600">
            Recibirás un email con instrucciones para acceder a tu cuenta en los próximos 5 minutos.
          </p>
          
          <div className="space-y-2">
            <p className="font-semibold text-inforia-green">Próximos pasos:</p>
            <ol className="text-left text-gray-600 space-y-1 text-sm">
              <li>1. Verifica tu email</li>
              <li>2. Accede a tu dashboard</li>
              <li>3. Comienza a usar INFORIA</li>
            </ol>
          </div>
        </div>

        <Link href="/">
          <NeuButton variant="primary" size="lg" className="w-full">
            Volver al inicio
          </NeuButton>
        </Link>

        <p className="text-xs text-gray-500">
          ¿Necesitas ayuda? Contáctanos a support@inforia.com
        </p>
      </NeuCard>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-inforia-cream flex items-center justify-center">Cargando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
