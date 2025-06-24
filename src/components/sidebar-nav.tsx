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
  ArrowRightLeft,
  Shapes,
} from "lucide-react";
import { cn } from '@/lib/utils';

export function SidebarNav() {
    const pathname = usePathname();

    const menuItems = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/expenses', label: 'Expenses', icon: CreditCard },
        { href: '/trips', label: 'Trips', icon: Plane },
        { href: '/approvals', label: 'Approvals', icon: ClipboardCheck },
        { href: '/categories', label: 'Categories', icon: Shapes },
        { href: '/settings', label: 'Settings', icon: Settings },
        { href: '/support', label: 'Support', icon: LifeBuoy },
    ];

    return <>
        <SidebarHeader className="p-4">
            <Link href="/profile" className='flex flex-col items-center gap-3 w-full text-center'>
                <Avatar className="size-16">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="person portrait" />
                    <AvatarFallback>JC</AvatarFallback>
                </Avatar>
                <div>
                    <p className='font-semibold text-base'>Janice Chandler</p>
                </div>
            </Link>
        </SidebarHeader>
        <SidebarContent className="flex-grow px-4">
            <SidebarMenu>
                {menuItems.map(item => {
                    const isActive = (item.href === '/') ? pathname === item.href : pathname.startsWith(item.href);
                    return (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                className={cn(
                                    "justify-start h-12 text-base",
                                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-semibold",
                                    !isActive && "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                                )}
                            >
                                <Link href={item.href}>
                                    <item.icon className="size-5" />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
            <div className="flex items-center gap-2">
                <ArrowRightLeft className="size-6 text-primary" />
                <span className="text-xl font-bold text-foreground">EXPENSIO</span>
            </div>
        </SidebarFooter>
    </>
}
