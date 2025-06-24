import { PageHeader } from "@/components/page-header";

export default function ApprovalsPage() {
    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Approvals" description="Manage your approvals." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Approvals page coming soon.</p>
                </div>
            </main>
        </div>
    )
}
