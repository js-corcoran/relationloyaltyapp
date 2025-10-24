"use client";
import * as React from 'react';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = React.useState(false);

  React.useEffect(() => {
    const initMSW = async () => {
      if (process.env.NODE_ENV !== 'production') {
        const { worker } = await import('@/mocks/browser');
        await worker.start({ onUnhandledRequest: 'bypass' });
        setMswReady(true);
      } else {
        setMswReady(true);
      }
    };

    initMSW();
  }, []);

  if (!mswReady) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}


