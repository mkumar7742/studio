import { AddTransactionDialog } from "@/components/add-transaction-dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface PageHeaderProps {
    title: string;
    description: string;
    showAddTransaction?: boolean;
}

export function PageHeader({ title, description, showAddTransaction = false }: PageHeaderProps) {
    return (
        <header className="flex items-center justify-between p-4 sm:p-6 border-b bg-background sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                    <p className="text-muted-foreground">{description}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                {showAddTransaction && (
                    <AddTransactionDialog />
                )}
            </div>
        </header>
    )
}
