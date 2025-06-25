
"use client";

import { PageHeader } from "@/components/page-header";
import { TransactionsCalendar } from "@/components/transactions-calendar";

export default function CalendarPage() {
    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Calendar" description="View your transactions on a calendar." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <TransactionsCalendar />
            </main>
        </div>
    )
}
