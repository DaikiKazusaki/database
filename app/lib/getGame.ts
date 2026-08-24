import { cache } from "react"
import { getSql } from "./db"
import type { Game } from "../search/types"

// 同一リクエスト内で複数回呼ばれても1回だけ問い合わせる
export const getGame = cache(async (id: string): Promise<Game | null> => {
  const gameId = Number(id)
  if (!Number.isInteger(gameId)) return null

  const sql = getSql()
  const rows = await sql`
    SELECT
      id,
      sente_name, sente_univ, sente_grade,
      gote_name, gote_univ, gote_grade,
      event, date, result, kifu
    FROM games
    WHERE id = ${gameId} AND deleted_at IS NULL
  `
  return (rows[0] as Game) ?? null
})

// <input type="date"> に渡せる YYYY-MM-DD 形式へ変換する（サーバーのタイムゾーンに依存させない）
export function toDateInputValue(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleDateString("sv-SE")
}
