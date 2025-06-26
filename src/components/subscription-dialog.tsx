
"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Subscription } from "@/types";
import { SubscriptionForm } from "./subscription-form";

interface SubscriptionDialogProps {
    subscription?: Subscription | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SubscriptionDialog({ subscription, open, onOpenChange }: SubscriptionDialogProps) {
    const isEditing = !!subscription;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? `Edit "${subscription.name}"` : "Add a New Subscription"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Update the details for this subscription." : "Fill in the details to add a new recurring payment."}
                    </DialogDescription>
                </DialogHeader>
                <SubscriptionForm
                    subscription={subscription}
                    onFinished={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
