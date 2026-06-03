"use client";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import emailAniData from "@/assets/lottie/email.json";
import SigninForm from "@/components/signin-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen">
      <div className="flex flex-1">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="absolute top-5 left-5">
              <div className="flex items-center gap-2">
                <img src="/android-chrome-512x512.png" draggable={false} className="h-12 w-12" alt="Logo" />
                <h1 className="text-2xl font-bold">Kaffeine</h1>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-left mb-6">
                <h1 className="text-2xl font-bold">Welcome Back</h1>
                <p className="text-muted-foreground">Let&apos;s not keep the login box waiting—your details, please!</p>
              </div>

              <SigninForm />

              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </div>

              <div className="mt-8 text-justify text-sm text-muted-foreground">
                <p>
                  Welcome to Kaffeine! Monitor your services with real-time health checks. Log in to track your monitors,
                  manage notifications, and keep your services running smoothly—all in one place.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:flex-1 bg-gradient-to-br from-blue-400 to-blue-600">
          <div className="h-full w-full flex items-center justify-center p-8">
            <div className="relative w-120 h-120">
              <div className="w-120 h-120" draggable={false}>
                <Lottie animationData={emailAniData} loop autoplay />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
