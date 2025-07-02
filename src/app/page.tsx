'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // This effect runs once on component mount to determine the initial route.
    async function checkSetupStatus() {
      try {
        // We fetch the setup status from the server. This is the only way
        // to know if an admin account has been created yet.
        const response = await fetch('http://localhost:5001/api/setup/status');
        
        // If the server isn't running or there's a network error, we can't
        // determine the setup status. We'll default to the login page.
        if (!response.ok) {
          console.error("Could not reach server to check setup status. Defaulting to login.");
          router.replace('/login');
          return;
        }

        const data = await response.json();
        
        // The server response tells us if setup is needed.
        if (data.needsSetup) {
          // If true, an admin account needs to be created. Go to the setup page.
          router.replace('/setup');
        } else {
          // If false, setup is complete. Go to the login page.
          router.replace('/login');
        }
      } catch (error) {
        console.error("Error checking setup status:", error);
        // If the fetch fails for any reason, redirect to login as a safe fallback.
        router.replace('/login');
      }
    }

    checkSetupStatus();
  }, [router]); // The effect depends only on the router, so it runs once.

  // Display a loading spinner while the check is in progress.
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
