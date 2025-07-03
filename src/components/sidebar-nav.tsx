
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
import { Skeleton } from './ui/skeleton';
import {
  Home,
  CreditCard,
  Settings,
  LifeBuoy,
  Shapes,
  Users,
  ShieldCheck,
  TrendingUp,
  Calendar,
  MessageSquare,
  LogOut,
  ScrollText,
  CheckSquare,
  PiggyBank,
} from "lucide-react";
import { cn } from '@/lib/utils';
import { RequirePermission } from './require-permission';
import type { Permission } from '@/types';
import { useAppContext } from '@/context/app-provider';
import { Button } from './ui/button';

export function SidebarNav() {
    const pathname = usePathname();
    const { currentUser, logout, currentUserPermissions } = useAppContext();

    const menuItems: { href: string; label: string; icon: React.ElementType; color: string; permission?: Permission | Permission[] }[] = [
        { href: '/dashboard', label: 'Home', icon: Home, color: 'bg-sky-500', permission: 'dashboard:view' },
        { href: '/expenses', label: 'Expenses', icon: CreditCard, color: 'bg-red-500', permission: 'expenses:view' },
        { href: '/income', label: 'Income', icon: TrendingUp, color: 'bg-green-500', permission: 'income:view' },
        { href: '/approvals', label: 'Approvals', icon: CheckSquare, color: 'bg-blue-500', permission: ['approvals:request', 'approvals:manage'] },
        { href: '/budgets', label: 'Budgets', icon: PiggyBank, color: 'bg-orange-500', permission: 'budgets:view' },
        { href: '/calendar', label: 'Calendar', icon: Calendar, color: 'bg-indigo-500', permission: 'calendar:view' },
        { href: '/categories', label: 'Categories', icon: Shapes, color: 'bg-purple-500', permission: 'categories:view' },
        { href: '/members', label: 'Family', icon: Users, color: 'bg-green-500', permission: 'members:view' },
        { href: '/chat', label: 'Chat', icon: MessageSquare, color: 'bg-cyan-500' },
        { href: '/roles', label: 'Roles', icon: ShieldCheck, color: 'bg-yellow-500', permission: 'roles:manage' },
        { href: '/audit', label: 'Audit Log', icon: ScrollText, color: 'bg-gray-500', permission: 'audit:view' },
        { href: '/settings', label: 'Settings', icon: Settings, color: 'bg-slate-500' },
        { href: '/support', label: 'Support', icon: LifeBuoy, color: 'bg-orange-500' },
    ];
    
    if (!currentUser) {
        return (
            <>
                <SidebarHeader className="p-4">
                    <div className='flex flex-col items-center gap-3 w-full text-center'>
                        <Skeleton className="size-16 rounded-full" />
                        <Skeleton className="h-5 w-24 rounded-md" />
                    </div>
                </SidebarHeader>
                <SidebarContent className="flex-grow px-4 space-y-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </SidebarContent>
            </>
        )
    }

    const hasPermission = (permission?: Permission | Permission[]) => {
        if (!permission) return true; // No permission required
        const requiredPermissions = Array.isArray(permission) ? permission : [permission];
        return requiredPermissions.some(p => currentUserPermissions.includes(p));
    };

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
                    if (!hasPermission(item.permission)) {
                        return null;
                    }
                    
                    const isActive = pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard');
                    
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
                                    <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-md text-primary-foreground", item.color)}>
                                        <item.icon className="size-5" />
                                    </div>
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-sidebar-border/50">
            <Button variant="ghost" onClick={logout} className="w-full justify-start text-base h-12 text-sidebar-foreground hover:bg-sidebar-accent/50">
                <LogOut className="mr-2" /> Logout
            </Button>
        </SidebarFooter>
    </>
}
