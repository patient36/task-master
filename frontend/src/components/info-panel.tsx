import { CheckCircle, Clock, ListChecks} from "lucide-react"

export function InfoPanel() {
    return (
        <div className="flex w-full flex-col justify-center bg-gradient-to-br from-primary/90 to-primary px-4 py-12 text-primary-foreground md:w-1/2 md:px-6 lg:px-8 xl:px-12">
            <div className="mx-auto w-full max-w-md">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Task Master</h1>
                    <p className="mt-4 text-lg">The ultimate task management solution.</p>
                </div>

                <div className="space-y-8">
                    <div className="flex items-start gap-4">
                        <div className="rounded-full bg-primary-foreground/10 p-2">
                            <ListChecks className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium">Organize Your Tasks</h3>
                            <p className="mt-2 text-primary-foreground/80">
                                Create, organize, and prioritize your tasks with our intuitive interface. Never miss a deadline again.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="rounded-full bg-primary-foreground/10 p-2">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium">Time Management</h3>
                            <p className="mt-2 text-primary-foreground/80">
                                Set due dates, reminders, and track time spent on tasks to improve productivity and efficiency.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="rounded-full bg-primary-foreground/10 p-2">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium">Progress Tracking</h3>
                            <p className="mt-2 text-primary-foreground/80">
                                Monitor your progress with visual dashboards and reports to stay motivated and achieve your goals.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
