"use client"

import { useEffect, useState } from "react"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format, parse } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-hot-toast"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { Task } from "@/lib/types"

interface EditTaskModalProps {
    isOpen: boolean
    onClose: () => void
    task: Task | null
    onSave: (updatedTask: Task) => void
}

const formSchema = z.object({
    title: z
        .string()
        .min(2, {
            message: "Title must be at least 2 characters.",
        })
        .max(50, {
            message: "Title must not be longer than 50 characters.",
        }),
    description: z
        .string()
        .max(500, {
            message: "Description must not be longer than 500 characters.",
        })
        .optional(),
    dueDate: z.date({
        required_error: "Due date is required.",
    }),
    priority: z.enum(["low", "medium", "high"], {
        required_error: "Please select a priority.",
    })
})

export function EditTaskModal({ isOpen, onClose, task, onSave }: EditTaskModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            priority: "medium",
            dueDate: new Date(),
        },
    })

    // Map task status to form status
    function mapTaskStatusToFormStatus(status: string): "todo" | "in-progress" | "completed" | "overdue" {
        switch (status) {
            case "PENDING":
                return "todo"
            case "COMPLETED":
                return "completed"
            case "OVERDUE":
                return "overdue"
            case "CANCELLED": // Map cancelled to completed for form compatibility
                return "completed"
            default:
                return "todo"
        }
    }

    // Map task priority to form priority
    function mapTaskPriorityToFormPriority(priority: string | undefined): "low" | "medium" | "high" {
        switch (priority) {
            case "LOW":
                return "low"
            case "NORMAL":
                return "medium"
            case "HIGH":
                return "high"
            default:
                return "medium"
        }
    }

    // Map form status to task status
    function mapFormStatusToTaskStatus(status: string): "PENDING" | "COMPLETED" | "OVERDUE" | "CANCELLED" {
        switch (status) {
            case "todo":
            case "in-progress":
                return "PENDING"
            case "completed":
                return "COMPLETED"
            case "overdue":
                return "OVERDUE"
            default:
                return "PENDING"
        }
    }

    // Map form priority to task priority
    function mapFormPriorityToTaskPriority(priority: string): "LOW" | "NORMAL" | "HIGH" {
        switch (priority) {
            case "low":
                return "LOW"
            case "medium":
                return "NORMAL"
            case "high":
                return "HIGH"
            default:
                return "NORMAL"
        }
    }

    // Populate form when task changes
    useEffect(() => {
        if (task) {
            // Parse the date string to a Date object
            let dueDate: Date
            try {
                dueDate = parse(task.dueDate, "yyyy-MM-dd", new Date())
            } catch (error) {
                dueDate = new Date()
            }

            form.reset({
                title: task.title,
                description: task.description || "",
                dueDate: dueDate,
                priority: mapTaskPriorityToFormPriority(task.priority)
            })
        }
    }, [task, form])

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (!task) return

        setIsSubmitting(true)

        // Convert form values to task format
        const updatedTask: Task = {
            ...task,
            title: values.title,
            description: values.description || "",
            dueDate: format(values.dueDate, "yyyy-MM-dd"),
            priority: mapFormPriorityToTaskPriority(values.priority)
        }

        // Simulate API call
        setTimeout(() => {
            onSave(updatedTask)
            setIsSubmitting(false)
            toast.success("Task updated successfully!")
            onClose()
        }, 1000)
    }

    if (!task) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                    <DialogDescription>Make changes to the task details below.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Task title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Describe the task..." className="resize-none" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Due Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                                    >
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priority</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="low">Low</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
