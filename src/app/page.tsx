'use client';

import { useAuth } from '@/lib/auth-context';
import Navbar from '@/components/landing/navbar';
import HeroSection from '@/components/landing/hero-section';
import FeaturesSection from '@/components/landing/features-section';
import HowItWorksSection from '@/components/landing/how-it-works-section';
import TrustSection from '@/components/landing/trust-section';
import PricingSection from '@/components/landing/pricing-section';
import FAQSection from '@/components/landing/faq-section';
import Footer from '@/components/landing/footer';

export default function LandingPage() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="relative mx-auto size-10">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
          </div>
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TrustSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
