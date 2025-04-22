'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const showNav = pathname !== "/";

  return (
    <header className="bg-blue-900 text-white shadow-md relative z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg md:text-2xl font-semibold">
          <Link href="/">大阪大学将棋部データベース</Link>
        </h1>

        {showNav && (
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="メニュー切り替え"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        {showNav && (
          <nav className="hidden md:flex space-x-6">
            <Link href="/home" className="hover:underline">ホーム</Link>
            <Link href="/input" className="hover:underline">棋譜入力</Link>
            <Link href="/search" className="hover:underline">棋譜検索</Link>
          </nav>
        )}
      </div>

      {/* モバイル用スライドインナビゲーション */}
      {showNav && (
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-blue-800 transform transition-transform duration-300 ease-in-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          } md:hidden shadow-lg z-40`}
        >
          <div className="p-4 pt-6 flex flex-col space-y-4 h-full relative">
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="メニューを閉じる"
              className="absolute top-4 right-4"
            >
              <X size={24} />
            </button>

            <div className="mt-12 flex flex-col space-y-4">
              <Link href="/home" onClick={() => setMenuOpen(false)} className="block py-2">ホーム</Link>
              <hr className="border-white" />
              <Link href="/input" onClick={() => setMenuOpen(false)} className="block py-2">棋譜入力</Link>
              <hr className="border-white" />
              <Link href="/search" onClick={() => setMenuOpen(false)} className="block py-2">棋譜検索</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
