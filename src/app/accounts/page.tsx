"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/context/app-provider";

export default function AccountsPage() {
    const { accounts } = useAppContext();

    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Accounts" description="Manage your connected bank accounts." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {accounts.map(account => (
                        <Card key={account.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
                                <account.icon className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                <p className="text-xs text-muted-foreground">
                                    Available Balance
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    )
}
