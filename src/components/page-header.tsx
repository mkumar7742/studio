import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
                <Button>
                    <PlusCircle className="mr-2 size-4" /> Add Transaction
                </Button>
                )}
                <Avatar className="hidden sm:block">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="person portrait"/>
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </div>
        </header>
    )
}
