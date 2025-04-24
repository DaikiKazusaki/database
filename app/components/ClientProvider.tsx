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

  // ページリロード時にトップへリダイレクト
  useEffect(() => {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navEntry?.type === 'reload') {
      router.push('/');
    }
  }, [router]);

  // 非アクティブ時の自動リダイレクト（10分）
  useEffect(() => {
    const resetTimeout = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        router.push('/');
      }, 10 * 60 * 1000); // 10分
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimeout));
    resetTimeout();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetTimeout)
      );
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [router]);

  return <>{children}</>;
}
