"use client";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import emailAniData from "@/assets/lottie/email.json";
import SigninForm from "@/components/signin-form";
import ThemeToggle from "@/components/theme-toggle";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen">
      <div className="flex flex-1">
        <div className="flex-1 flex items-center justify-center p-8 relative">
          <Link href="/" className="absolute top-6 left-6">
            <div className="flex flex-col group">
              <div className="flex items-center gap-2.5">
                <Image src="/assets/logo/logo-nbg.png" alt="Kaffeine" width={32} height={32} className="size-9" />
                <span className="text-xl font-bold">Kaffeine</span>
              </div>
              <span className="text-[10px] text-muted-foreground/50 mt-0.5 ml-0.5 flex items-center gap-0.5">
                by Arkynox <ArrowUpRight size={8} />
              </span>
            </div>
          </Link>
          <div className="absolute top-6 right-6">
            <ThemeToggle />
          </div>

          <div className="w-full max-w-md">
            <div className="space-y-6">
              <div className="text-left">
                <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
                <p className="text-muted-foreground mt-2">Sign in to continue monitoring your services</p>
              </div>

              <SigninForm />

              <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Create one
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Free & Open Source — by Arkynox</span>
                </div>
              </div>

              <p className="text-center text-xs text-muted-foreground leading-relaxed">
                Monitor your websites and databases with real-time health checks. 
                End-to-end encrypted. 100% free.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 items-center justify-center p-8">
          <div className="relative w-120 h-120">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl" />
            <div className="w-120 h-120 relative" draggable={false}>
              <Lottie animationData={emailAniData} loop autoplay />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
