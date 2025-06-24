import { PageHeader } from "@/components/page-header";

export default function TripsPage() {
    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Trips" description="Manage your trips." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Trips page coming soon.</p>
                </div>
            </main>
        </div>
    )
}
