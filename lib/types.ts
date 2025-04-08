export type GameResult = "先手勝ち" | "後手勝ち" | "千日手" | "持将棋" | "中断"

export interface Player {
  name: string
  university: string
  grade: string
}

export interface GameRecord {
  id: string
  sente: Player
  gote: Player
  tournament: string
  date: string
  result: GameResult
  kifu: string
  createdAt: string
}
