import Link from "next/link"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            将棋棋譜データベース
          </Link>
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
      </div>
    </header>
  )
}

