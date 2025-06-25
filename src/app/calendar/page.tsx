
"use client";

import { PageHeader } from "@/components/page-header";
import { TransactionsCalendar } from "@/components/transactions-calendar";
import { ActivitySidebar } from "@/components/activity-sidebar";

export default function CalendarPage() {
    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Calendar" description="View your transactions on a calendar." />
            <main className="grid flex-1 grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-4">
                <div className="lg:col-span-3">
                    <TransactionsCalendar />
                </div>
                <div className="lg:col-span-1">
                    <ActivitySidebar showCalendar={false} />
                </div>
            </main>
        </div>
    )
}
