import type { Metadata } from "next";
import Link from "next/link";
import { Search, Eye, ClipboardList, Pencil, UploadCloud, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "ホーム",
  description: "大阪大学将棋部によるWeb棋譜データベース",
};

export default function Home() {
  return (
    <div className="min-h-screen p-8 sm:p-20 bg-gray-50 text-gray-800 font-sans">
      <main className="max-w-5xl mx-auto space-y-16">
        {/* Hero Section */}
        <header className="text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-blue-700">
            大阪大学将棋部 棋譜データベース
          </h1>
          <p className="text-lg sm:text-xl text-gray-700">
            過去の対局データを検索・閲覧・コピーできるWebアプリです。
          </p>
        </header>

        {/* How to Use Section */}
        {/* Input Section */}
        <section className="space-y-10">
          <h2 className="text-3xl font-semibold text-center">棋譜を入力するには？</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow p-6 text-center space-y-4">
              <Pencil className="mx-auto text-green-600 w-12 h-12" />
              <h3 className="text-xl font-bold">① 棋譜を記録</h3>
              <p className="text-gray-600">
                対局後、KIF形式で棋譜を記録します（将棋所などで保存可能）。
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 text-center space-y-4">
              <UploadCloud className="mx-auto text-green-600 w-12 h-12" />
              <h3 className="text-xl font-bold">② アップロードページへ</h3>
              <p className="text-gray-600">
                アップロード画面でファイルを選択、または直接ペーストします。
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 text-center space-y-4">
              <CheckCircle className="mx-auto text-green-600 w-12 h-12" />
              <h3 className="text-xl font-bold">③ 送信して保存完了</h3>
              <p className="text-gray-600">
                「アップロード」ボタンを押すとデータベースに保存され、検索対象になります。
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/input"
              className="inline-block mt-6 bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition text-lg"
            >
              棋譜を入力する
            </Link>
          </div>
        </section>

        {/* Search Section */}
        <section className="space-y-10">
          <h2 className="text-3xl font-semibold text-center">棋譜を検索するには？</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow p-6 text-center space-y-4">
              <Search className="mx-auto text-blue-600 w-12 h-12" />
              <h3 className="text-xl font-bold">① 検索ページにアクセス</h3>
              <p className="text-gray-600">
                上部メニューまたは「棋譜を検索する」ボタンから検索ページに進みます。
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 text-center space-y-4">
              <ClipboardList className="mx-auto text-blue-600 w-12 h-12" />
              <h3 className="text-xl font-bold">② 条件を入力して検索</h3>
              <p className="text-gray-600">
                対局日・対局者名・大学名を入力して検索ボタンを押してください。
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 text-center space-y-4">
              <Eye className="mx-auto text-blue-600 w-12 h-12" />
              <h3 className="text-xl font-bold">③ 棋譜を確認・コピー</h3>
              <p className="text-gray-600">
                棋譜表示やコピーで簡単に内容を確認・保存できます。
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/search"
              className="inline-block mt-6 bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition text-lg"
            >
              棋譜を検索する
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
