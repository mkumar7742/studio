
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { MemberProfile } from "@/types";
import { EditMemberForm } from "./edit-member-form";

interface EditMemberDialogProps {
    member: MemberProfile | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditMemberDialog({ member, open, onOpenChange }: EditMemberDialogProps) {
    if (!member) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit {member.name}'s Profile</DialogTitle>
                    <DialogDescription>
                        Update the profile details for this member.
                    </DialogDescription>
                </DialogHeader>
                <EditMemberForm 
                    member={member} 
                    onFinished={() => onOpenChange(false)} 
                />
            </DialogContent>
        </Dialog>
    );
}
