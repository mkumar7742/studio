import { PageHeader } from "@/components/page-header";

export default function AccountsPage() {
    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Accounts" description="Manage your connected bank accounts." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <p>Content for the accounts page will go here.</p>
            </main>
        </div>
    )
}
