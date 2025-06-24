import { PageHeader } from "@/components/page-header";

export default function TransactionsPage() {
    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Transactions" description="View and manage your transactions." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <p>Content for the transactions page will go here.</p>
            </main>
        </div>
    )
}
