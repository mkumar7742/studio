
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Approval } from "@/types";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";
import { useToast } from "@/hooks/use-toast";

interface ApprovalRequestDialogProps {
  approval: Approval | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (id: string, status: 'Approved' | 'Declined') => void;
}

const DetailRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className="grid grid-cols-[100px_1fr] items-start gap-4">
        <span className="font-bold text-foreground">{label}</span>
        <div className="text-foreground">
            {children}
        </div>
    </div>
);

const getCategoryDotColor = (category: Approval['category']) => {
    switch (category) {
        case 'Travel': return 'bg-indigo-400';
        case 'Food': return 'bg-red-400';
        case 'Software': return 'bg-pink-400';
        default: return 'bg-muted-foreground';
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
            <DialogContent className="max-w-md p-8 bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold tracking-tight flex items-center gap-4">
                        Expense Request
                        {approval.status === 'Pending' && (
                            <Badge className="bg-pink-600 hover:bg-pink-600/90 text-white border-none text-sm">{approval.status}</Badge>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 my-6">
                    <DetailRow label="Amount">
                        <span className="font-bold">{formatCurrency(approval.amount, approval.currency)}</span>
                    </DetailRow>
                    <DetailRow label="Category">
                        <div className="flex items-center gap-2">
                           <span className={cn("size-2 rounded-full", getCategoryDotColor(approval.category))}></span>
                           <span>{approval.category}</span>
                        </div>
                    </DetailRow>
                    <DetailRow label="Project">
                        {approval.project}
                    </DetailRow>
                    <DetailRow label="Description">
                        {approval.description}
                    </DetailRow>
                    <DetailRow label="Group">
                        {approval.team}
                    </DetailRow>
                </div>

                <DialogFooter className="gap-2 justify-start">
                    <Button 
                        type="button" 
                        variant="secondary" 
                        className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-none font-bold px-6"
                        onClick={() => handleAction('Approved')}
                        disabled={approval.status !== 'Pending'}
                    >
                        Approve
                    </Button>
                    <Button 
                        type="button" 
                        className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-none font-bold px-6"
                        onClick={() => handleAction('Declined')}
                        disabled={approval.status !== 'Pending'}
                    >
                        Decline
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
