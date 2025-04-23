import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ホーム",
  description: "大阪大学将棋部によるWeb棋譜データベース",
};

export default function Home() {
  return (
    <div className="min-h-screen p-8 sm:p-20 bg-gray-50 text-gray-800 font-sans">
      <main className="max-w-4xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">大阪大学将棋部 棋譜データベース</h1>
          <p className="text-lg sm:text-xl text-gray-600">
            過去の対局データを検索・閲覧・コピーできるWebアプリです。
          </p>
        </header>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">このサイトの使い方</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 leading-relaxed">
            <li>「<strong>検索ページ</strong>」にアクセスします。</li>
            <li>対局日、対局者名、大学名のいずれかを入力して検索ボタンを押します。</li>
            <li>条件に一致する棋譜が一覧で表示されます。</li>
            <li>「<strong>棋譜表示</strong>」ボタンで棋譜の内容を確認できます。</li>
            <li>「<strong>コピー</strong>」ボタンで棋譜をクリップボードにコピーできます。</li>
          </ol>
          <div className="text-center mt-6">
            <Link
              href="/search"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              棋譜を検索する
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
