"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { verifyEmail, signIn } from "@/lib/auth"
import { CheckCircle, Loader2, Mail } from "lucide-react"

export default function SigninForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [step, setStep] = useState<"email" | "password">("email")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleEmailVerification = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setError("")
    setIsVerifying(true)

    try {
      const isValid = await verifyEmail(email, 0)

      if (isValid) {
        setIsEmailValid(true)
        setStep("password")
      } else {
        setError("This email address is not registered")
      }
    } catch {
      setError("An error occurred while verifying your email")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === "email") {
      await handleEmailVerification()
      return
    }

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setError("")
    setIsSubmitting(true)

    try {
      const result = await signIn(email, password)
      if (result.success) {
        window.location.href = "/dashboard"
      } else {
        setError(result.error || "Invalid email or password")
      }
    } catch {
      setError("Invalid email or password")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        {step === "email" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  className="pl-10 pr-10"
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setIsEmailValid(false)
                  }}
                />
                {isEmailValid && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
            </div>
            <Button
              type="button"
              className="w-full"
              onClick={handleEmailVerification}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        )}

        {error && <p className="text-sm text-red-500 mt-2 text-center">{error}</p>}
      </form>
    </div>
  )
}
