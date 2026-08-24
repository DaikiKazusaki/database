import { cache } from "react"
import { notFound } from "next/navigation"
import { neon } from "@neondatabase/serverless"
import type { Metadata } from "next"
import type { Game } from "../types"
import GameDetail from "./GameDetail"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

// メタデータ生成と本体で二重にクエリが走らないようキャッシュする
const getGame = cache(async (id: string): Promise<Game | null> => {
  const gameId = Number(id)
  if (!Number.isInteger(gameId)) return null

  const sql = neon(`${process.env.DATABASE_URL}`)
  const rows = await sql`
    SELECT
      id,
      sente_name, sente_univ, sente_grade,
      gote_name, gote_univ, gote_grade,
      event, date, result, kifu
    FROM games
    WHERE id = ${gameId}
  `
  return (rows[0] as Game) ?? null
})

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const game = await getGame(id)

  return {
    title: game ? `${game.sente_name} vs ${game.gote_name}` : "棋譜再生",
    description: "大阪大学将棋部によるWeb棋譜データベース",
  }
}

export default async function GamePage({ params, searchParams }: PageProps) {
  const { id } = await params
  const game = await getGame(id)

  if (!game) notFound()

  // 検索条件を引き継いで一覧に戻れるようにする
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === "string" && value !== "") query.set(key, value)
  }
  const backHref = query.toString() ? `/search?${query.toString()}` : "/search"

  return <GameDetail game={game} backHref={backHref} />
}
