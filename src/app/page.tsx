'use client';

import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform, useSpring, useVelocity } from 'motion/react';
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
import SectionTransition from '@/components/landing/section-transition';

const CustomCursor = dynamic(() => import('@/components/landing/custom-cursor'), { ssr: false });
const AmbientBackground = dynamic(() => import('@/components/landing/ambient-background'), { ssr: false });
const ScrollProgress = dynamic(() => import('@/components/landing/scroll-progress'), { ssr: false });
const BackToTop = dynamic(() => import('@/components/landing/back-to-top'), { ssr: false });

export default function LandingPage() {
  const { loading } = useAuth();
  const { scrollYProgress, scrollY } = useScroll();
  const scrollYVelocity = useVelocity(scrollY);

  const bgParallax = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [1, 0.6, 0.6, 1]);

  const blurAmount = useTransform(scrollYVelocity, [-500, 0, 500], [2, 0, 2]);
  const smoothBlur = useSpring(blurAmount, { stiffness: 200, damping: 30 });
  const blurStyle = useTransform(smoothBlur, (v) => `blur(${v}px)`);

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
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--primary) 4%, transparent), transparent 60%)',
          translateY: bgParallax,
          opacity: bgOpacity,
          filter: blurStyle,
        }}
      />

      <CustomCursor />
      <AmbientBackground />
      <ScrollProgress />
      <Navbar />

      <div className="relative z-10">
        <SectionTransition><HeroSection /></SectionTransition>
        <SectionDivider />
        <SectionTransition><FeaturesSection /></SectionTransition>
        <SectionDivider />
        <SectionTransition><HowItWorksSection /></SectionTransition>
        <SectionDivider />
        <SectionTransition><TrustSection /></SectionTransition>
        <SectionDivider />
        <SectionTransition><PricingSection /></SectionTransition>
        <SectionDivider />
        <SectionTransition><FAQSection /></SectionTransition>
      </div>

      <BackToTop />
      <Footer />
    </main>
  );
}
