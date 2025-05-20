"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"

export function AuthForm() {
  return (
    <Tabs defaultValue="login" className="w-full">
      <div className="flex justify-center mb-8">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="login">
        <LoginForm />
      </TabsContent>

      <TabsContent value="register">
        <RegisterForm />
      </TabsContent>
    </Tabs>
  )
}
