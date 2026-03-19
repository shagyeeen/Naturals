'use client';

import { useEffect } from 'react';

export function ClearCache() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.unregister());
      });
    }
    if (caches) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
  }, []);

  return null;
}
