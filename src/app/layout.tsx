import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/sidebar-nav';
import { BottomNavigation } from '@/components/bottom-navigation';

export const metadata: Metadata = {
  title: 'TrackWise',
  description: 'Smartly manage your income and expenses with AI-powered insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <div className="flex min-h-screen">
            <Sidebar>
              <SidebarNav />
            </Sidebar>
            <SidebarInset>
              <div className="h-screen pb-16 md:pb-0">
                {children}
              </div>
            </SidebarInset>
          </div>
          <BottomNavigation />
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
