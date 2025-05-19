"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Save, User, Lock, Mail, Key, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "react-hot-toast"

// Mock user data
const userData = {
    id: "user_123456",
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@example.com",
    createdAt: "2023-01-15T00:00:00Z",
}

// Profile form schema
const profileFormSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
})

// Password change schema
const passwordFormSchema = z
    .object({
        currentPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
        newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
        confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: "New password must be different from current password",
        path: ["newPassword"],
    })

// Password reset schema
const resetPasswordSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
})

export default function SettingsPage() {
    const [isUpdating, setIsUpdating] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [isResettingPassword, setIsResettingPassword] = useState(false)
    const [showResetForm, setShowResetForm] = useState(false)

    // Profile form
    const profileForm = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
        },
    })

    // Password form
    const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    // Reset password form
    const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    // Handle profile update
    function onProfileSubmit(data: z.infer<typeof profileFormSchema>) {
        setIsUpdating(true)

        // Simulate API call
        setTimeout(() => {
            setIsUpdating(false)
            toast.success("Profile updated")
            console.log("Profile data:", data)
        }, 1500)
    }

    // Handle password change
    function onPasswordSubmit(data: z.infer<typeof passwordFormSchema>) {
        setIsChangingPassword(true)

        // Simulate API call
        setTimeout(() => {
            setIsChangingPassword(false)
            toast.success("Password changed")
            passwordForm.reset({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            })
            console.log("Password data:", data)
        }, 1500)
    }

    // Handle password reset
    function onResetPasswordSubmit(data: z.infer<typeof resetPasswordSchema>) {
        setIsResettingPassword(true)

        // Simulate API call
        setTimeout(() => {
            setIsResettingPassword(false)
            toast.success("Reset link sent")
            setShowResetForm(false)
            resetPasswordForm.reset()
            console.log("Reset password data:", data)
        }, 1500)
    }

    return (
        <div className="container max-w-4xl py-10 mx-auto">
            <div className="mb-8 flex items-center">
                <Button variant="ghost" size="sm" asChild className="mr-2">
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>

            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarFallback>
                            {userData.firstName[0]}
                            {userData.lastName[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {userData.firstName} {userData.lastName}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Member since {new Date(userData.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>

                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>View and update your account details.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...profileForm}>
                                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={profileForm.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>First Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter your first name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={profileForm.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter your last name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={profileForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your email" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    This email will be used for account notifications and password resets.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={isUpdating}>
                                            {isUpdating ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password Settings</CardTitle>
                            <CardDescription>Change your password or reset it if you've forgotten it.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!showResetForm ? (
                                <Form {...passwordForm}>
                                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                                        <FormField
                                            control={passwordForm.control}
                                            name="currentPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Current Password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="Enter your current password" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Separator />

                                        <FormField
                                            control={passwordForm.control}
                                            name="newPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>New Password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="Enter your new password" {...field} />
                                                    </FormControl>
                                                    <FormDescription>Password must be at least 8 characters long.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={passwordForm.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirm New Password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="Confirm your new password" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
                                            <Button
                                                type="button"
                                                variant="link"
                                                onClick={() => setShowResetForm(true)}
                                                className="px-0 sm:px-4"
                                            >
                                                Forgot your password?
                                            </Button>
                                            <Button type="submit" disabled={isChangingPassword}>
                                                {isChangingPassword ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Changing Password...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock className="mr-2 h-4 w-4" />
                                                        Change Password
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-muted/50 p-4 rounded-lg">
                                        <h3 className="font-medium flex items-center">
                                            <Key className="mr-2 h-4 w-4" />
                                            Reset Your Password
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Enter your email address and we'll send you a link to reset your password.
                                        </p>
                                    </div>

                                    <Form {...resetPasswordForm}>
                                        <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-6">
                                            <FormField
                                                control={resetPasswordForm.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter your email address" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
                                                <Button type="button" variant="ghost" onClick={() => setShowResetForm(false)}>
                                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                                    Back to Change Password
                                                </Button>
                                                <Button type="submit" disabled={isResettingPassword}>
                                                    {isResettingPassword ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Sending Reset Link...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Mail className="mr-2 h-4 w-4" />
                                                            Send Reset Link
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </form>
                                    </Form>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
