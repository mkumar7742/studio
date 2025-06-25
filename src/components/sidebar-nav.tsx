
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
  Users,
  ShieldCheck,
  PiggyBank,
  TrendingUp,
} from "lucide-react";
import { cn } from '@/lib/utils';
import { RequirePermission } from './require-permission';
import type { Permission } from '@/types';
import { useAppContext } from '@/context/app-provider';

export function SidebarNav() {
    const pathname = usePathname();
    const { currentUser } = useAppContext();

    const menuItems: { href: string; label: string; icon: React.ElementType; color: string; permission?: Permission }[] = [
        { href: '/', label: 'Home', icon: Home, color: 'bg-sky-500', permission: 'dashboard:view' },
        { href: '/expenses', label: 'Expenses', icon: CreditCard, color: 'bg-red-500', permission: 'expenses:view' },
        { href: '/income', label: 'Income', icon: TrendingUp, color: 'bg-green-500', permission: 'income:view' },
        { href: '/trips', label: 'Trips', icon: Plane, color: 'bg-blue-500', permission: 'trips:view' },
        { href: '/approvals', label: 'Approvals', icon: ClipboardCheck, color: 'bg-pink-500', permission: 'approvals:view' },
        { href: '/budgets', label: 'Budgets', icon: PiggyBank, color: 'bg-teal-500', permission: 'budgets:manage' },
        { href: '/categories', label: 'Categories', icon: Shapes, color: 'bg-purple-500', permission: 'categories:view' },
        { href: '/members', label: 'Members', icon: Users, color: 'bg-green-500', permission: 'members:view' },
        { href: '/roles', label: 'Roles', icon: ShieldCheck, color: 'bg-yellow-500', permission: 'roles:manage' },
        { href: '/settings', label: 'Settings', icon: Settings, color: 'bg-slate-500' },
        { href: '/support', label: 'Support', icon: LifeBuoy, color: 'bg-orange-500' },
    ];

    return <>
        <SidebarHeader className="p-4">
            <Link href="/profile" className='flex flex-col items-center gap-3 w-full text-center'>
                <Avatar className="size-16">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} data-ai-hint={currentUser.avatarHint} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className='font-semibold text-base'>{currentUser.name}</p>
                </div>
            </Link>
        </SidebarHeader>
        <SidebarContent className="flex-grow px-4">
            <SidebarMenu>
                {menuItems.map(item => {
                    const isActive = (item.href === '/') ? pathname === item.href : pathname.startsWith(item.href);
                    
                    const menuItemContent = (
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
                                <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-md text-primary-foreground", item.color)}>
                                    <item.icon className="size-5" />
                                </div>
                                <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    );

                    if (item.permission) {
                        return (
                            <RequirePermission key={item.label} permission={item.permission}>
                                <SidebarMenuItem>
                                    {menuItemContent}
                                </SidebarMenuItem>
                            </RequirePermission>
                        );
                    }
                    
                    return (
                        <SidebarMenuItem key={item.label}>
                            {menuItemContent}
                        </SidebarMenuItem>
                    );
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
