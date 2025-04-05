"use client"
import { useState } from "react"
import Link from "next/link"
import { FaBars, FaTimes } from "react-icons/fa"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

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
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-xl z-50">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* モバイルメニュー（右側からスライドイン） */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden`}
        >
          <div className="flex flex-col pt-20 px-6">
            <Link href="/" className="font-medium hover:underline py-4 border-b" onClick={() => setIsOpen(false)}>
              ホーム
            </Link>
            <Link href="/input" className="font-medium hover:underline py-4 border-b" onClick={() => setIsOpen(false)}>
              棋譜入力
            </Link>
            <Link href="/search" className="font-medium hover:underline py-4 border-b" onClick={() => setIsOpen(false)}>
              棋譜検索
            </Link>
          </div>
        </div>

        {/* オーバーレイ背景（メニュー表示時） */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setIsOpen(false)} />
        )}
      </div>
    </header>
  )
}

