
"use client";

import { useState, useMemo } from "react";
import { useAppContext } from "@/context/app-provider";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, Plus, TrendingUp, CalendarDays } from "lucide-react";
import { format, parseISO } from "date-fns";
import { formatCurrency, convertToUsd } from "@/lib/currency";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import type { Subscription } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionDialog } from "@/components/subscription-dialog";
import { RequirePermission } from "@/components/require-permission";

export default function SubscriptionsPage() {
    const { subscriptions, deleteSubscription } = useAppContext();
    const [subscriptionToDelete, setSubscriptionToDelete] = useState<Subscription | null>(null);
    const [subscriptionToEdit, setSubscriptionToEdit] = useState<Subscription | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const summary = useMemo(() => {
        const monthlyTotal = subscriptions
            .filter(sub => sub.billingCycle === 'Monthly')
            .reduce((sum, sub) => sum + convertToUsd(sub.amount, sub.currency), 0);

        const yearlyTotal = subscriptions
            .filter(sub => sub.billingCycle === 'Yearly')
            .reduce((sum, sub) => sum + convertToUsd(sub.amount, sub.currency), 0);

        return { monthlyTotal, yearlyTotal };
    }, [subscriptions]);

    const handleNewClick = () => {
        setSubscriptionToEdit(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (sub: Subscription) => {
        setSubscriptionToEdit(sub);
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (subscriptionToDelete) {
            deleteSubscription(subscriptionToDelete.id);
            toast({
                title: "Subscription Cancelled",
                description: `The "${subscriptionToDelete.name}" subscription has been cancelled.`,
            });
            setSubscriptionToDelete(null);
        }
    };


    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Subscriptions" description="Manage your recurring subscriptions.">
                <RequirePermission permission="subscriptions:manage">
                    <Button onClick={handleNewClick}><Plus className="mr-2 size-4" /> New Subscription</Button>
                </RequirePermission>
            </PageHeader>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-2 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Recurring</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(summary.monthlyTotal, 'USD')}</div>
                            <p className="text-xs text-muted-foreground">Total of all monthly subscriptions</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Yearly Recurring</CardTitle>
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(summary.yearlyTotal, 'USD')}</div>
                            <p className="text-xs text-muted-foreground">Total of all yearly subscriptions</p>
                        </CardContent>
                    </Card>
                </div>
                {subscriptions.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {subscriptions.map((sub) => {
                            const Icon = sub.icon;
                            return (
                                <Card key={sub.id}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                                                <Icon className="size-5 text-muted-foreground" />
                                            </div>
                                            <CardTitle className="text-base font-semibold">{sub.name}</CardTitle>
                                        </div>
                                        <RequirePermission permission="subscriptions:manage">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="size-8">
                                                        <MoreHorizontal className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEditClick(sub)}><Pencil className="mr-2 size-4" /> Edit</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setSubscriptionToDelete(sub)}>
                                                        <Trash2 className="mr-2 size-4" /> Cancel
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </RequirePermission>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-4">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold">{formatCurrency(sub.amount, sub.currency)}</span>
                                            <span className="text-sm text-muted-foreground">/ {sub.billingCycle === 'Monthly' ? 'month' : 'year'}</span>
                                        </div>
                                        <CardDescription>
                                            Next payment on {format(parseISO(sub.nextPaymentDate), "MMMM d, yyyy")}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed border-border py-24">
                        <h3 className="text-2xl font-semibold tracking-tight">No Subscriptions Found</h3>
                        <p className="text-muted-foreground mt-2">You haven't added any subscriptions yet.</p>
                        <RequirePermission permission="subscriptions:manage">
                            <Button onClick={handleNewClick} className="mt-4"><Plus className="mr-2 size-4" /> Add Subscription</Button>
                        </RequirePermission>
                    </div>
                )}
            </main>
            <SubscriptionDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                subscription={subscriptionToEdit}
            />
            <DeleteConfirmationDialog 
                open={!!subscriptionToDelete}
                onOpenChange={(isOpen) => !isOpen && setSubscriptionToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Cancel Subscription"
                description={`Are you sure you want to cancel the "${subscriptionToDelete?.name}" subscription? This action cannot be undone.`}
            />
        </div>
    );
}
