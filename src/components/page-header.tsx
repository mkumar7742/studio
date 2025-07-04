
import { AddTransactionDialog } from "@/components/add-transaction-dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface PageHeaderProps {
    title: string;
    description: string;
    showAddTransaction?: boolean;
    children?: React.ReactNode;
}

export function PageHeader({ title, description, showAddTransaction = false, children }: PageHeaderProps) {
    return (
        <header className="flex items-center justify-between py-3 px-4 sm:px-6 border-b bg-background sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <div>
                    <h1 className="text-xl font-bold tracking-tight">{title}</h1>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                {children}
                {showAddTransaction && (
                    <AddTransactionDialog />
                )}
            </div>
        </header>
    )
}
