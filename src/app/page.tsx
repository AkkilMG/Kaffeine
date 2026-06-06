'use client';

import dynamic from 'next/dynamic';
import { useAuth } from '@/lib/auth-context';
import Navbar from '@/components/landing/navbar';
import HeroSection from '@/components/landing/hero-section';
import FeaturesSection from '@/components/landing/features-section';
import HowItWorksSection from '@/components/landing/how-it-works-section';
import TrustSection from '@/components/landing/trust-section';
import PricingSection from '@/components/landing/pricing-section';
import FAQSection from '@/components/landing/faq-section';
import Footer from '@/components/landing/footer';
import SectionDivider from '@/components/landing/section-divider';

const CustomCursor = dynamic(() => import('@/components/landing/custom-cursor'), { ssr: false });
const AmbientBackground = dynamic(() => import('@/components/landing/ambient-background'), { ssr: false });
const ScrollProgress = dynamic(() => import('@/components/landing/scroll-progress'), { ssr: false });
const BackToTop = dynamic(() => import('@/components/landing/back-to-top'), { ssr: false });

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
      <CustomCursor />
      <AmbientBackground />
      <ScrollProgress />
      <Navbar />
      <HeroSection />
      <SectionDivider />
      <FeaturesSection />
      <SectionDivider />
      <HowItWorksSection />
      <SectionDivider />
      <TrustSection />
      <SectionDivider />
      <PricingSection />
      <SectionDivider />
      <FAQSection />
      <BackToTop />
      <Footer />
    </main>
  );
}
