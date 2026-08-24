export type Game = {
  id: number
  sente_name: string
  sente_univ: string
  sente_grade: string
  gote_name: string
  gote_univ: string
  gote_grade: string
  event: string
  date: string
  result: string
  kifu: string
}

// 一覧では棋譜本文を扱わない（1件あたり数KBあるため）
export type GameSummary = Omit<Game, "kifu">
