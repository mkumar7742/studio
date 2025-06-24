import { AddTransactionDialog } from "@/components/add-transaction-dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AddTransactionValues } from "./add-transaction-form";

interface PageHeaderProps {
    title: string;
    description: string;
    showAddTransaction?: boolean;
    onAddTransaction?: (values: AddTransactionValues) => void;
}

export function PageHeader({ title, description, showAddTransaction = false, onAddTransaction }: PageHeaderProps) {
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
                {showAddTransaction && onAddTransaction && (
                    <AddTransactionDialog onAddTransaction={onAddTransaction} />
                )}
                <Avatar className="hidden sm:block">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="person portrait"/>
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </div>
        </header>
    )
}
