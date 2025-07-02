'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkSetupStatusWithRetry = async (retries = 5, delay = 1000): Promise<{ needsSetup: boolean } | null> => {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch('http://localhost:5001/api/setup/status');
          if (response.ok) {
            return await response.json();
          }
          // Log non-OK responses but continue to retry for server-side issues
          console.warn(`Attempt ${i + 1}: Server responded with status ${response.status}. Retrying in ${delay}ms...`);
        } catch (error) {
          // This catches network errors (e.g., server not up yet)
          console.warn(`Attempt ${i + 1}: Fetch failed. Retrying in ${delay}ms...`);
        }
        await new Promise(res => setTimeout(res, delay));
      }
      return null; // Return null after all retries have failed
    };

    const performCheck = async () => {
      const data = await checkSetupStatusWithRetry();
      
      // If data is null (all retries failed) or needsSetup is explicitly false, go to login.
      // Otherwise, if needsSetup is true, go to setup.
      if (data?.needsSetup) {
        router.replace('/setup');
      } else {
        router.replace('/login');
      }
    };

    performCheck();
  }, [router]); // The effect depends only on the router, so it runs once.

  // Display a loading spinner while the check is in progress.
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
