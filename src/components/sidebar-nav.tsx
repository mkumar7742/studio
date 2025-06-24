'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  CreditCard,
  Plane,
  ClipboardCheck,
  Settings,
  LifeBuoy,
  Atom,
} from "lucide-react";
import { cn } from '@/lib/utils';

export function SidebarNav() {
    const pathname = usePathname();

    const menuItems = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/expenses', label: 'Expenses', icon: CreditCard },
        { href: '/trips', label: 'Trips', icon: Plane },
        { href: '/approvals', label: 'Approvals', icon: ClipboardCheck },
        { href: '/settings', label: 'Settings', icon: Settings },
        { href: '/support', label: 'Support', icon: LifeBuoy },
    ];

    return <>
        <SidebarHeader className="flex flex-col items-start gap-6 p-4">
            <Link href="/profile" className='flex items-center gap-3 w-full'>
                <Avatar className="size-12">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="person portrait" />
                    <AvatarFallback>JC</AvatarFallback>
                </Avatar>
                <div>
                    <p className='font-semibold text-base'>Janice Chandler</p>
                </div>
            </Link>
        </SidebarHeader>
        <SidebarContent className="flex-grow px-2">
            <SidebarMenu>
                {menuItems.map(item => {
                    const isActive = (item.href === '/') ? pathname === item.href : pathname.startsWith(item.href);
                    return (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                className={cn(
                                    "justify-start h-11",
                                    isActive && "bg-sidebar-accent text-primary-foreground font-semibold",
                                    !isActive && "hover:bg-sidebar-accent/50"
                                )}
                            >
                                <Link href={item.href}>
                                    <item.icon className={cn(isActive && "text-primary")} />
                                    {item.label}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
            <div className="flex items-center gap-2">
                <Atom className="size-6 text-primary" />
                <span className="text-xl font-bold text-foreground">EXPENSIO</span>
            </div>
        </SidebarFooter>
    </>
}
