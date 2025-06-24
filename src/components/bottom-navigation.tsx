'use client';

import { LayoutDashboard, Wallet, ArrowDownUp, PiggyBank, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/accounts', label: 'Accounts', icon: Wallet },
  { href: '/transactions', label: 'Transactions', icon: ArrowDownUp },
  { href: '/budgets', label: 'Budgets', icon: PiggyBank },
  { href: '/subscriptions', label: 'Subscriptions', icon: TrendingUp },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-card border-t">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
        {navItems.map((item) => {
           const isActive = (item.href === '/') ? pathname === item.href : pathname.startsWith(item.href);
          return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'inline-flex flex-col items-center justify-center px-2 hover:bg-muted group',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-[10px] text-center">{item.label}</span>
          </Link>
        )})}
      </div>
    </div>
  );
}
