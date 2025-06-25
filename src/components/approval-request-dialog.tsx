
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Approval } from "@/types";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";

interface ApprovalRequestDialogProps {
  approval: Approval | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (id: string, status: 'Approved' | 'Declined') => void;
}

const DetailRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className="grid grid-cols-[100px_1fr] items-start gap-4">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="text-sm font-semibold text-foreground">
            {children}
        </div>
    </div>
);

const getCategoryBadgeClasses = (category: Approval['category']) => {
    switch (category) {
        case 'Travel': return 'bg-indigo-500/20 text-indigo-400 border-transparent hover:bg-indigo-500/30';
        case 'Food': return 'bg-red-500/20 text-red-400 border-transparent hover:bg-red-500/30';
        case 'Software': return 'bg-pink-500/20 text-pink-400 border-transparent hover:bg-pink-500/30';
        default: return 'bg-muted text-muted-foreground border-transparent';
    }
}

export function ApprovalRequestDialog({ approval, open, onOpenChange, onAction }: ApprovalRequestDialogProps) {
    if (!approval) {
        return null;
    }

    const handleAction = (status: 'Approved' | 'Declined') => {
        onAction(approval.id, status);
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight">
                        Approval Request Details
                    </DialogTitle>
                    <DialogDescription>
                        Review the details for the request from {approval.owner.name}.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 my-6">
                    <DetailRow label="Description">
                        {approval.description}
                    </DetailRow>
                     <DetailRow label="Amount">
                        <span className="font-bold">{formatCurrency(approval.amount, approval.currency)}</span>
                    </DetailRow>
                    <DetailRow label="Category">
                        <Badge variant="outline" className={cn("rounded-md font-semibold", getCategoryBadgeClasses(approval.category))}>
                            {approval.category}
                        </Badge>
                    </DetailRow>
                    <DetailRow label="Frequency">
                        {approval.frequency}
                    </DetailRow>
                    <DetailRow label="Project">
                        {approval.project}
                    </DetailRow>
                    <DetailRow label="Team">
                        {approval.team}
                    </DetailRow>
                </div>

                {approval.status === 'Pending' && (
                     <DialogFooter className="gap-2">
                        <Button 
                            type="button" 
                            variant="outline"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/50"
                            onClick={() => handleAction('Declined')}
                        >
                            Decline
                        </Button>
                        <Button 
                            type="button" 
                            className="bg-primary hover:bg-primary/90"
                            onClick={() => handleAction('Approved')}
                        >
                            Approve
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
