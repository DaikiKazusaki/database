"use client";
import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            将棋棋譜データベース
          </Link>

          {/* PC用ナビゲーション */}
          <nav className="hidden md:flex gap-6">
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

          {/* ハンバーガーメニュー（スマホ用） */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-xl"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* モバイルメニュー（開閉制御） */}
        {isOpen && (
          <nav className="md:hidden mt-4 flex flex-col items-center gap-4 border-t pt-4">
            <Link href="/" className="font-medium hover:underline" onClick={() => setIsOpen(false)}>
              ホーム
            </Link>
            <Link href="/input" className="font-medium hover:underline" onClick={() => setIsOpen(false)}>
              棋譜入力
            </Link>
            <Link href="/search" className="font-medium hover:underline" onClick={() => setIsOpen(false)}>
              棋譜検索
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
