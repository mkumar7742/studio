
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { RequirePermission } from "@/components/require-permission";
import { useAppContext } from "@/context/app-provider";
import { RoleDialog } from "@/components/role-dialog";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import type { Role } from "@/types";

export default function RolesPage() {
    const { roles, deleteRole, members } = useAppContext();
    const [isCreating, setIsCreating] = useState(false);
    const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

    const openEditDialog = (role: Role) => {
        setRoleToEdit(role);
    };

    const openDeleteDialog = (role: Role) => {
        setRoleToDelete(role);
    };

    const handleConfirmDelete = () => {
        if (roleToDelete) {
            deleteRole(roleToDelete.id);
            setRoleToDelete(null);
        }
    };

    const isRoleInUse = (roleId: string) => {
        return members.some(member => member.roleId === roleId);
    }

    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Roles & Permissions" description="Define roles and manage what users can do." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>User Roles ({roles.length})</CardTitle>
                                <CardDescription>Create and manage custom roles for your members.</CardDescription>
                            </div>
                            <RequirePermission permission="roles:manage">
                                <Button onClick={() => setIsCreating(true)}>
                                    <Plus className="mr-2 size-4" /> Create Role
                                </Button>
                            </RequirePermission>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {roles.map(role => (
                            <Card key={role.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle>{role.name}</CardTitle>
                                    <CardDescription>{role.permissions.length} permissions</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {role.permissions.join(', ').replace(/:/g, ' ')}
                                    </p>
                                </CardContent>
                                <div className="flex items-center justify-end p-4 border-t">
                                     <RequirePermission permission="roles:manage">
                                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(role)}>
                                            <Pencil className="size-4" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => openDeleteDialog(role)}
                                            disabled={isRoleInUse(role.id)}
                                            title={isRoleInUse(role.id) ? "Cannot delete role in use" : "Delete role"}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </RequirePermission>
                                </div>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </main>
            
            <RoleDialog
                open={isCreating || !!roleToEdit}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setIsCreating(false);
                        setRoleToEdit(null);
                    }
                }}
                role={roleToEdit}
            />

            <DeleteConfirmationDialog
                open={!!roleToDelete}
                onOpenChange={(isOpen) => !isOpen && setRoleToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Role"
                description={`Are you sure you want to delete the "${roleToDelete?.name}" role? This action cannot be undone.`}
            />
        </div>
    );
}
