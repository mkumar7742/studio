
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/app-provider';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAppContext();
  const router = useRouter();
  const [isCheckingSetup, setIsCheckingSetup] = useState(true);

  useEffect(() => {
    async function checkSetup() {
      try {
        const response = await fetch('http://localhost:5001/api/setup/status');
        if (!response.ok) {
            // If the server is down or there's an issue, we can't proceed.
            // For now, we'll just log it. A better implementation might show an error page.
            console.error("Failed to check setup status");
            setIsCheckingSetup(false);
            return;
        }
        const data = await response.json();
        if (data.needsSetup) {
          router.replace('/setup');
        } else {
            // Only check for authentication if setup is complete
            if (!isAuthLoading) {
                if (isAuthenticated) {
                    router.replace('/dashboard');
                } else {
                    router.replace('/login');
                }
            }
        }
      } catch (error) {
        console.error("Error checking setup status:", error);
        // Maybe redirect to an error page or show a message
      } finally {
        // This only applies if we don't redirect to /setup
        if (!isAuthLoading) {
            setIsCheckingSetup(false);
        }
      }
    }

    checkSetup();
  }, [isAuthLoading, isAuthenticated, router]);

  // Show a loader while we determine where to go
  if (isCheckingSetup || isAuthLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // This fallback will be shown briefly during redirects
  return (
     <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
  );
}
