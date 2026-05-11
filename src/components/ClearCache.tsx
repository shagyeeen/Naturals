'use client';

import { useEffect, useRef } from 'react';

export function ClearCache() {
  const hasRun = useRef(false);

  useEffect(() => {
    // Only run once per app lifecycle, not on every navigation
    if (hasRun.current) return;
    hasRun.current = true;

    const cleanup = async () => {
      try {
        // Guard: only proceed if document is fully ready
        if (typeof window === 'undefined' || document.readyState === 'loading') return;

        if ('serviceWorker' in navigator && navigator.serviceWorker) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
          }
        }
      } catch (e) {
        // Silently ignore — this commonly fails during page transitions
        console.debug('[ClearCache] Service worker cleanup skipped:', (e as Error).message);
      }

      try {
        if (typeof caches !== 'undefined') {
          const names = await caches.keys();
          for (const name of names) {
            await caches.delete(name);
          }
        }
      } catch (e) {
        console.debug('[ClearCache] Cache cleanup skipped:', (e as Error).message);
      }
    };

    cleanup();
  }, []);

  return null;
}
