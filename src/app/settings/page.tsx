import { PageHeader } from "@/components/page-header";

export default function SettingsPage() {
    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Settings" description="Manage your application settings." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <p>Content for the settings page will go here.</p>
            </main>
        </div>
    )
}
