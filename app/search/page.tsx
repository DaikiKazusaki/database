import { neon } from '@neondatabase/serverless';
import GameTable from './GameTable';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "棋譜検索",
  description: "大阪大学将棋部によるWeb棋譜データベース",
};

type Game = {
  id: number;
  sente_name: string;
  sente_univ: string;
  sente_grade: string;
  gote_name: string;
  gote_univ: string;
  gote_grade: string;
  event: string;
  date: string;
  result: string;
  kifu: string;
};

export default async function SearchPage() {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const rawGames = await sql`
    SELECT
      id,
      sente_name, sente_univ, sente_grade,
      gote_name, gote_univ, gote_grade,
      event, date, result, kifu
    FROM games
    ORDER BY date DESC
  `;
  const games: Game[] = rawGames.map(row => row as Game);

  return <GameTable games={games} />;
}
