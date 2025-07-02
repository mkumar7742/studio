'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // This effect runs once on component mount.
    async function checkSetupAndRedirect() {
      try {
        const response = await fetch('http://localhost:5001/api/setup/status');
        
        if (!response.ok) {
          // If the server is not reachable, we can't determine setup status.
          // It's safer to assume login is the next step, or show an error page.
          // For this app, we'll redirect to login as a fallback.
          console.error("Failed to fetch setup status from server.");
          router.replace('/login');
          return;
        }

        const data = await response.json();
        if (data.needsSetup) {
          // If the server says setup is needed, we go to the setup page.
          router.replace('/setup');
        } else {
          // If setup is already complete, we redirect to the login page.
          // The AuthGuard on the protected routes will handle redirecting to the dashboard if already logged in.
          router.replace('/login');
        }
      } catch (error) {
        // Any other fetch error (e.g., network error)
        console.error("Error checking setup status:", error);
        router.replace('/login');
      }
    }

    checkSetupAndRedirect();
  }, [router]); // Only depends on the router, which is stable.

  // Display a loader until the check is complete and the redirect happens.
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
