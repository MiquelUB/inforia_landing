import { Suspense } from 'react';
import { Header } from '@/components/sections/header';
import { HeroSection } from '@/components/sections/hero-section';
import { LeadForm } from '@/components/sections/lead-form';
import { VideoSection } from '@/components/sections/video-section';
import { ProblemSolutionSection } from '@/components/sections/problem-solution';
import { PricingSection } from '@/components/sections/pricing-section';
import { FAQSection } from '@/components/sections/faq-section';
import { Footer } from '@/components/sections/footer';
import { PromoActivator } from '@/components/promo-activator';

export const metadata = {
  title: 'INFORIA - IA para Psicólogos',
  description: 'Recupera tu vocación. El asistente clínico con IA que automatiza el papeleo.',
  keywords: ['psicología', 'IA', 'informes clínicos', 'asistente digital'],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Activador de promociones (invisible) */}
      <Suspense fallback={null}>
        <PromoActivator />
      </Suspense>

      <Header />
      <HeroSection />
      <LeadForm />
      <VideoSection />
      <ProblemSolutionSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
