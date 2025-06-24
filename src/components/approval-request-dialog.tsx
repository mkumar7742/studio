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

interface ApprovalRequestDialogProps {
  approval: Approval | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function ApprovalRequestDialog({ approval, open, onOpenChange }: ApprovalRequestDialogProps) {
    if (!approval) {
        return null;
    }
    
    const euroFormatter = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
    });

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
                        <span className="font-bold">{euroFormatter.format(approval.amount)}</span>
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
                    <DetailRow label="Team">
                        {approval.team}
                    </DetailRow>
                </div>

                <DialogFooter className="gap-2 justify-start">
                    <Button type="button" variant="secondary" className="bg-muted hover:bg-border/50 text-muted-foreground font-bold px-6">
                        Approve
                    </Button>
                    <Button type="button" className="bg-cyan-400 hover:bg-cyan-500 text-black border-none font-bold px-6">
                        Decline
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
