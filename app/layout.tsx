import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "大阪大学将棋部棋譜データベース",
  description: "大学将棋の棋譜データベース",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <header className="border-b">
          <div className="container mx-auto py-4 px-4">
            <nav className="flex gap-6">
              <Link href="/" className="font-medium hover:underline">
                ホーム
              </Link>
              <Link href="/input" className="font-medium hover:underline">
                棋譜入力
              </Link>
              <Link href="/search" className="font-medium hover:underline">
                棋譜検索
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}

