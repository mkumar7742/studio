import { PageHeader } from "@/components/page-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Settings" description="Manage your application settings." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>
                            Customize the look and feel of your app.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <p className="font-medium">Theme</p>
                            <ThemeToggle />
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
