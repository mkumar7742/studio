
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RequirePermission } from "@/components/require-permission";

export default function RolesPage() {
    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Roles & Permissions" description="Define roles and manage what users can do." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>User Roles</CardTitle>
                                <CardDescription>Create and manage custom roles for your members.</CardDescription>
                            </div>
                            <RequirePermission permission="roles:manage">
                                <Button>
                                    <Plus className="mr-2 size-4" /> Create Role
                                </Button>
                            </RequirePermission>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Role management UI is coming soon.</p>
                            <p className="text-sm text-muted-foreground/80 mt-2">This page will allow administrators to create, edit, and assign permissions to roles.</p>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
