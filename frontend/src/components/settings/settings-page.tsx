"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "react-hot-toast"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {user} from "@/lib/data"

// Form validation schemas
const nameFormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
})

const emailFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
})

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

export default function SettingsPage() {
    const [nameSuccess, setNameSuccess] = useState(false)
    const [emailSuccess, setEmailSuccess] = useState(false)
    const [passwordSuccess, setPasswordSuccess] = useState(false)
    const [nameLoading, setNameLoading] = useState(false)
    const [emailLoading, setEmailLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [error, setError] = useState("")

    // Name form
    const nameForm = useForm<z.infer<typeof nameFormSchema>>({
        resolver: zodResolver(nameFormSchema),
        defaultValues: {
            name: "",
        },
    })

    // Email form
    const emailForm = useForm<z.infer<typeof emailFormSchema>>({
        resolver: zodResolver(emailFormSchema),
        defaultValues: {
            email: "",
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

    // Form submission handlers
    async function onNameSubmit(values: z.infer<typeof nameFormSchema>) {
        setNameLoading(true)
        setError("")

        try {
            // This would be replaced with your actual API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Simulate successful update
            console.log("Name updated:", values)
            setNameSuccess(true)
            toast.success("Name updated")

            // Reset success message after 3 seconds
            setTimeout(() => setNameSuccess(false), 3000)
        } catch (err) {
            setError("Failed to update name. Please try again.")
        } finally {
            setNameLoading(false)
        }
    }

    async function onEmailSubmit(values: z.infer<typeof emailFormSchema>) {
        setEmailLoading(true)
        setError("")

        try {
            // This would be replaced with your actual API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Simulate successful update
            console.log("Email updated:", values)
            setEmailSuccess(true)
            toast.success("Email updated")

            // Reset success message after 3 seconds
            setTimeout(() => setEmailSuccess(false), 3000)
        } catch (err) {
            setError("Failed to update email. Please try again.")
        } finally {
            setEmailLoading(false)
        }
    }

    async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
        setPasswordLoading(true)
        setError("")

        try {
            // This would be replaced with your actual API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Simulate successful update
            console.log("Password updated")
            setPasswordSuccess(true)

            toast.success("Password updated")

            // Reset form
            passwordForm.reset()

            // Reset success message after 3 seconds
            setTimeout(() => setPasswordSuccess(false), 3000)
        } catch (err) {
            setError("Failed to update password. Please try again.")
        } finally {
            setPasswordLoading(false)
        }
    }

    return (
        <div className="container w-full py-10">
            <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-6">
                {/* Name Update Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Update Name</CardTitle>
                        <CardDescription>Change your display name</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...nameForm}>
                            <form onSubmit={nameForm.handleSubmit(onNameSubmit)} className="space-y-4">
                                <FormField
                                    control={nameForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your new name" {...field} />
                                            </FormControl>
                                            <FormDescription>This is the name that will be displayed on your profile.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={nameLoading}>
                                    {nameLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : nameSuccess ? (
                                        <>
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            Updated
                                        </>
                                    ) : (
                                        "Update Name"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Email Update Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Update Email</CardTitle>
                        <CardDescription>Change your email address</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...emailForm}>
                            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                                <FormField
                                    control={emailForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your new email" type="email" {...field} />
                                            </FormControl>
                                            <FormDescription>This email will be used for account-related notifications.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={emailLoading}>
                                    {emailLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : emailSuccess ? (
                                        <>
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            Updated
                                        </>
                                    ) : (
                                        "Update Email"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Password Update Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Update Password</CardTitle>
                        <CardDescription>Change your account password</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...passwordForm}>
                            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                                <FormField
                                    control={passwordForm.control}
                                    name="currentPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Current Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your current password" type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={passwordForm.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your new password" type="password" {...field} />
                                            </FormControl>
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
                                                <Input placeholder="Confirm your new password" type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={passwordLoading}>
                                    {passwordLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : passwordSuccess ? (
                                        <>
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            Updated
                                        </>
                                    ) : (
                                        "Update Password"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
