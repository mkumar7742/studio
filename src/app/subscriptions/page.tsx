import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function SubscriptionsPage() {
    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Subscriptions" description="Manage your recurring subscriptions." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <Card className="text-center">
                    <CardHeader>
                        <div className="mx-auto bg-muted rounded-full p-3 w-fit">
                            <TrendingUp className="size-8 text-muted-foreground" />
                        </div>
                        <CardTitle className="mt-4">Subscription Management</CardTitle>
                        <CardDescription>
                            This feature is coming soon! Automatically detect and manage all your subscriptions from one place.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            You'll be able to see upcoming charges, get reminders, and easily cancel services you no longer need.
                        </p>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
