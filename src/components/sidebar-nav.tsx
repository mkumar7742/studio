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
  LayoutDashboard,
  Wallet,
  ArrowDownUp,
  PiggyBank,
  Settings,
  Banknote,
  Shapes,
} from "lucide-react";

export function SidebarNav() {
    const pathname = usePathname();

    const menuItems = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/accounts', label: 'Accounts', icon: Wallet },
        { href: '/transactions', label: 'Transactions', icon: ArrowDownUp },
        { href: '/budgets',label: 'Budgets', icon: PiggyBank },
        { href: '/categories', label: 'Categories', icon: Shapes },
    ];

    return <>
        <SidebarHeader className="flex flex-col items-start gap-4 p-4">
            <Link href="/profile" className='flex items-center gap-3'>
                <Avatar className="size-10">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="person portrait" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                    <p className='font-semibold'>John Doe</p>
                    <p className='text-xs text-muted-foreground'>john.doe@example.com</p>
                </div>
            </Link>

            <Link href="/" className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-lg bg-card text-foreground">
                    <Banknote className="size-5 text-primary" />
                </div>
                <span className="text-lg font-semibold text-foreground">TrackWise</span>
            </Link>
        </SidebarHeader>
        <SidebarContent className="flex-grow">
            <SidebarMenu>
                {menuItems.map(item => (
                    <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild isActive={(item.href === '/') ? pathname === item.href : pathname.startsWith(item.href)}>
                            <Link href={item.href}>
                                <item.icon />
                                {item.label}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/settings')}>
                        <Link href="/settings">
                            <Settings />
                            Settings
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </>
}
