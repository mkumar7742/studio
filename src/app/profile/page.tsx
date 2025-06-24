"use client";

import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/context/app-provider";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
    const { currentUser, getMemberRole } = useAppContext();
    const role = getMemberRole(currentUser);

    return (
        <div className="flex flex-col h-full">
            <PageHeader title="User Profile" description="Manage your profile and account settings." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Details</CardTitle>
                        <CardDescription>Update your personal information here.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={currentUser.avatar} alt={currentUser.name} data-ai-hint={currentUser.avatarHint} />
                                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <Button variant="outline">Change Photo</Button>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" defaultValue={currentUser.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" defaultValue={currentUser.email} />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label>Role</Label>
                            <div>
                            {role && (
                                <Badge variant={role?.name === 'Administrator' ? 'default' : 'secondary'} className={role?.name === 'Administrator' ? 'bg-primary/80' : ''}>
                                    {role.name}
                                </Badge>
                            )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                placeholder="Tell us a little about yourself"
                                defaultValue="TrackWise user since 2024. Passionate about personal finance and budgeting."
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button>Save Changes</Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
