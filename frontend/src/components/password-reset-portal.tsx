"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/hooks/useAuth"
import toast from "react-hot-toast"

export function PasswordResetPortal() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [step, setStep] = useState<"request" | "reset" | "success" | "error">("request")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { getOTP, resetPassword } = useAuth()

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    if (!email) {
      setError("Email is required")
      setLoading(false)
      return
    }
    getOTP(email, {
      onSuccess: () => {
        toast.success("OTP sent to your email")
        setStep("reset")
      },
      onError: (err) => {
        toast.error("Failed to send OTP. Please check your email and try again.")
        setError(err.message)
      },
      onSettled: () => {
        setLoading(false)
      },
    })
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    resetPassword({ email, OTP: otp, newPassword }, {
      onSuccess: () => {
        toast.success("Password reset successfully")
        setStep("success")
      },
      onError: (err) => {
        toast.error("Failed to reset password. Please try again.")
        setError(err.message)
      },
      onSettled: () => {
        setLoading(false)
      },
    })

  }

  const formatOTP = (value: string) => {
    const digits = value.replace(/\D/g, "")
    return digits.slice(0, 12)
  }

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(formatOTP(e.target.value))
  }

  return (
    <Card className="w-full">
      {step === "request" && (
        <>
          <CardHeader>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>Enter your email address to receive a one-time password</CardDescription>
          </CardHeader>
          <form onSubmit={handleRequestOTP}>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? "Sending..." : "Request OTP"}
              </Button>
            </CardFooter>
          </form>
        </>
      )}

      {step === "reset" && (
        <>
          <CardHeader>
            <CardTitle className="text-2xl">Enter OTP</CardTitle>
            <CardDescription>
              We've sent a 12-digit code to your email. Enter it below along with your new password.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleResetPassword}>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">12-Digit OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter your 12-digit OTP"
                    value={otp}
                    onChange={handleOTPChange}
                    required
                    maxLength={12}
                    pattern="\d{12}"
                    inputMode="numeric"
                  />
                  <p className="text-xs text-muted-foreground">{otp.length}/12 digits</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-confirm">Email</Label>
                  <Input
                    id="email-confirm"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </CardFooter>
          </form>
        </>
      )}

      {step === "success" && (
        <>
          <CardHeader>
            <CardTitle className="text-2xl">Password Reset Successful</CardTitle>
            <CardDescription>Your password has been successfully reset.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">You can now log in with your new password.</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button className="w-full mt-4" onClick={() => (window.location.href = "/")}>
              Go to Login
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
