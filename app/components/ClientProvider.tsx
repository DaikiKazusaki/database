"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

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
        router.push("/");
      }, 30 * 60 * 1000); // 30分間の非アクティブでログアウト
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
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
