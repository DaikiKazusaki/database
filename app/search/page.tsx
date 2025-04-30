import GameTable from './GameTable';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "棋譜検索",
  description: "大阪大学将棋部によるWeb棋譜データベース",
};

export default function SearchPage() {
  return <GameTable />;
}
