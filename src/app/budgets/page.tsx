import { PageHeader } from "@/components/page-header";

export default function BudgetsPage() {
    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Budgets" description="Create and manage your spending budgets." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <p>Content for the budgets page will go here.</p>
            </main>
        </div>
    )
}
