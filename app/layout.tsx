"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "./components/header";
import Footer from "./components/footer";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const resetTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        router.push("/");
      }, 30 * 60 * 1000); // 30分
    };

    // アクティビティ検出対象のイベント
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimeout));

    resetTimeout(); // 初期タイマー起動

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimeout));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [router]);

  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <main className="p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
