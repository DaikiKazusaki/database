'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const resetTimeout = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        router.push('/');
      }, 1 * 60 * 1000); // 10分
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        resetTimeout();
      }
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimeout));
    document.addEventListener('visibilitychange', handleVisibilityChange);

    resetTimeout();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetTimeout)
      );
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [router]);

  return <>{children}</>;
}
