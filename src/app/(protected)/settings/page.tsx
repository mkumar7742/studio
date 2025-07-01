
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from "@/components/page-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { useToast } from '@/hooks/use-toast';
import { User, Bell, Database, HardDrive, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleDeleteAccount = () => {
        setIsDeleteDialogOpen(false);
        toast({
            title: "Account Deletion Requested",
            description: "Your account is scheduled for deletion. You will be logged out.",
        });
        // In a real app, you would sign the user out and trigger backend deletion.
        setTimeout(() => router.push('/'), 2000); 
    };

    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Settings" description="Manage your account, preferences, and notifications." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                 <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-3 mx-auto">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="data">Data & Privacy</TabsTrigger>
                    </TabsList>
                    <TabsContent value="general" className="mt-6">
                        <Card>
                             <CardHeader>
                                <CardTitle>General Settings</CardTitle>
                                <CardDescription>
                                    Manage your public profile and application theme.
                                </CardDescription>
                            </CardHeader>
                             <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div>
                                        <h3 className="font-semibold">Profile Information</h3>
                                        <p className="text-sm text-muted-foreground">Update your name, photo, and contact details.</p>
                                    </div>
                                    <Button asChild variant="outline">
                                        <Link href="/profile">
                                            <User className="mr-2"/>
                                            Go to Profile
                                        </Link>
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div>
                                        <h3 className="font-semibold">Theme</h3>
                                        <p className="text-sm text-muted-foreground">Customize the look and feel of your app.</p>
                                    </div>
                                    <ThemeToggle />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="notifications" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notifications</CardTitle>
                                <CardDescription>
                                    Choose how you want to be notified.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div>
                                        <Label htmlFor="weekly-summary" className="font-semibold">Weekly Summary</Label>
                                        <p className="text-sm text-muted-foreground">Receive a summary of your weekly activity.</p>
                                    </div>
                                    <Switch id="weekly-summary" defaultChecked />
                                </div>
                                 <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div>
                                        <Label htmlFor="budget-alerts" className="font-semibold">Budget Alerts</Label>
                                        <p className="text-sm text-muted-foreground">Get notified when you're approaching your budget limits.</p>
                                    </div>
                                    <Switch id="budget-alerts" defaultChecked />
                                </div>
                                 <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div>
                                        <Label htmlFor="new-logins" className="font-semibold">New Logins</Label>
                                        <p className="text-sm text-muted-foreground">Get an alert when there's a login from a new device.</p>
                                    </div>
                                    <Switch id="new-logins" />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="data" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Data & Privacy</CardTitle>
                                <CardDescription>
                                    Manage your application data.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div>
                                        <h3 className="font-semibold">Export Data</h3>
                                        <p className="text-sm text-muted-foreground">Download a copy of all your transaction data.</p>
                                    </div>
                                    <Button variant="outline"><HardDrive className="mr-2"/> Export</Button>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/50 bg-destructive/10">
                                    <div>
                                        <h3 className="font-semibold text-destructive">Delete Account</h3>
                                        <p className="text-sm text-destructive/80">Permanently delete your account and all of your data.</p>
                                    </div>
                                    <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}><Trash2 className="mr-2"/> Delete</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
            <DeleteConfirmationDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDeleteAccount}
                title="Are you absolutely sure?"
                description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
            />
        </div>
    )
}
