
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Check, X, Clock } from 'lucide-react';
import { useAppContext } from '@/context/app-provider';
import type { Approval } from '@/types';
import { RequirePermission } from '@/components/require-permission';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/currency';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const StatusBadge = ({ status }: { status: Approval['status'] }) => {
    const statusStyles = {
        pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
        approved: 'bg-green-500/20 text-green-500 border-green-500/30',
        rejected: 'bg-red-500/20 text-red-500 border-red-500/30',
    };
    const statusIcons = {
        pending: <Clock className="size-3" />,
        approved: <Check className="size-3" />,
        rejected: <X className="size-3" />,
    }
    return (
        <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full border", statusStyles[status])}>
            {statusIcons[status]}
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export default function ApprovalsPage() {
    const { approvals, currentUserPermissions, updateApproval } = useAppContext();
    const { toast } = useToast();
    const [dialogState, setDialogState] = useState<{ open: boolean; approval: Approval | null; action: 'approved' | 'rejected' | null, notes: string }>({ open: false, approval: null, action: null, notes: '' });

    const isManager = currentUserPermissions.includes('approvals:manage');

    const handleActionClick = (approval: Approval, action: 'approved' | 'rejected') => {
        setDialogState({ open: true, approval, action, notes: '' });
    };

    const handleConfirmAction = async () => {
        if (dialogState.approval && dialogState.action) {
            await updateApproval(dialogState.approval.id, dialogState.action, dialogState.notes);
            toast({
                title: `Request ${dialogState.action}`,
                description: `The request "${dialogState.approval.description}" has been ${dialogState.action}.`,
            });
            setDialogState({ open: false, approval: null, action: null, notes: '' });
        }
    };
    
    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Approvals" description="Manage expense approval requests." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Expense Requests</CardTitle>
                                <CardDescription>
                                    {isManager 
                                        ? "Review and decide on pending requests from family members."
                                        : "Track the status of your expense approval requests."
                                    }
                                </CardDescription>
                            </div>
                            <RequirePermission permission="approvals:request">
                                <Button asChild>
                                    <Link href="/approvals/new">
                                        <Plus className="mr-2 size-4" /> New Request
                                    </Link>
                                </Button>
                            </RequirePermission>
                        </div>
                    </CardHeader>
                    <CardContent>
                       <div className="space-y-4">
                            {approvals.map(approval => (
                                <div key={approval.id} className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex-grow">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-semibold">{approval.description}</p>
                                            <p className="font-bold text-lg">{formatCurrency(approval.amount, approval.currency)}</p>
                                        </div>
                                        <div className="text-sm text-muted-foreground flex items-center justify-between">
                                            <span>
                                                Requested by <strong>{approval.memberName}</strong> on {format(new Date(approval.requestDate), 'PP')}
                                            </span>
                                            <StatusBadge status={approval.status} />
                                        </div>
                                        {approval.status !== 'pending' && approval.approverName && (
                                            <p className="text-xs text-muted-foreground mt-2 italic">
                                                {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)} by {approval.approverName} on {format(new Date(approval.decisionDate), 'PP')}
                                                {approval.notes && <> &mdash; "{approval.notes}"</>}
                                            </p>
                                        )}
                                    </div>
                                    {isManager && approval.status === 'pending' && (
                                        <div className="flex gap-2 shrink-0">
                                            <Button variant="outline" size="sm" onClick={() => handleActionClick(approval, 'rejected')}>
                                                <X className="mr-1 size-4" /> Reject
                                            </Button>
                                            <Button size="sm" onClick={() => handleActionClick(approval, 'approved')}>
                                                <Check className="mr-1 size-4" /> Approve
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {approvals.length === 0 && (
                                <div className="text-center text-muted-foreground py-10">
                                    <p>No approval requests found.</p>
                                </div>
                            )}
                       </div>
                    </CardContent>
                </Card>
            </main>
            
            <AlertDialog open={dialogState.open} onOpenChange={(open) => !open && setDialogState({ ...dialogState, open: false })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                        <AlertDialogDescription>
                           Are you sure you want to {dialogState.action} this request? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea 
                            id="notes"
                            placeholder="Add a reason for the decision..."
                            value={dialogState.notes}
                            onChange={(e) => setDialogState(prev => ({ ...prev, notes: e.target.value }))}
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmAction}>Confirm {dialogState.action}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
