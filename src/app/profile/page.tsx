import { PageHeader } from "@/components/page-header";

export default function ProfilePage() {
    return (
        <div className="flex flex-col h-full">
            <PageHeader title="User Profile" description="Manage your profile information." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <p>Content for the profile page will go here.</p>
            </main>
        </div>
    )
}
