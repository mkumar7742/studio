
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { AddMemberForm } from "./add-member-form";

export function AddMemberDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 size-4" /> Add Family Member
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a New Family Member</DialogTitle>
                    <DialogDescription>
                        Invite a new member to your family.
                    </DialogDescription>
                </DialogHeader>
                <AddMemberForm onFinished={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
