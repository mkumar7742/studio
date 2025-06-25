
"use client";

import { useAppContext } from "@/context/app-provider";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function SubscriptionsPage() {
    const { subscriptions } = useAppContext();

    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Subscriptions" description="Manage your recurring subscriptions." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
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
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="size-8">
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem><Pencil className="mr-2 size-4" /> Edit</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                    <Trash2 className="mr-2 size-4" /> Cancel
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-4">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold">${sub.amount.toFixed(2)}</span>
                                            <span className="text-sm text-muted-foreground">/ {sub.billingCycle === 'Monthly' ? 'month' : 'year'}</span>
                                        </div>
                                        <CardDescription>
                                            Next payment on {format(new Date(sub.nextPaymentDate), "MMMM d, yyyy")}
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
                    </div>
                )}
            </main>
        </div>
    );
}
