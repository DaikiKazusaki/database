import { Suspense } from 'react';
import GameTable from './GameTable';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "棋譜検索",
  description: "大阪大学将棋部によるWeb棋譜データベース",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="p-6 text-center text-gray-600">読み込み中...</p>}>
      <GameTable />
    </Suspense>
  );
}
