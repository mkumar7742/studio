import { PageHeader } from "@/components/page-header";

export default function SupportPage() {
    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Support" description="Get help and support." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Support page coming soon.</p>
                </div>
            </main>
        </div>
    )
}
