
"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RoleForm } from "./role-form";
import type { Role } from "@/types";

interface RoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role?: Role | null;
}

export function RoleDialog({ open, onOpenChange, role }: RoleDialogProps) {
    const isEditing = !!role;
    const title = isEditing ? `Edit "${role.name}" Role` : "Create a New Role";
    const description = isEditing 
        ? "Update the name and permissions for this role."
        : "Define a new role by giving it a name and selecting its permissions.";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <RoleForm
                    role={role}
                    onFinished={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
