'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const showNav = pathname !== "/"; // トップページ以外でナビゲーション表示

  return (
    <header className="bg-blue-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg md:text-2xl font-semibold">
          <Link href="/">大阪大学将棋部データベース</Link>
        </h1>

        {/* ハンバーガー：モバイル用 */}
        {showNav && (
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="メニュー切り替え"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        {/* ナビゲーション：PC表示 */}
        {showNav && (
          <nav className="hidden md:flex space-x-6">
            <Link href="/home" className="hover:underline">ホーム</Link>
            <Link href="/input" className="hover:underline">棋譜入力</Link>
            <Link href="/search" className="hover:underline">棋譜検索</Link>
          </nav>
        )}
      </div>

      {/* ナビゲーション：モバイル表示 */}
      {showNav && menuOpen && (
        <nav className="md:hidden bg-blue-800 px-4 pb-4 space-y-2">
          <Link href="/home" className="block">ホーム</Link>
          <Link href="/input" className="block">棋譜入力</Link>
          <Link href="/search" className="block">棋譜検索</Link>
        </nav>
      )}
    </header>
  );
}
