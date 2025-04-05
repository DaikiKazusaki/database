import { NextResponse } from "next/server"
import redis from "@/lib/redis"

// 棋譜データの型定義
interface PlayerInfo {
  university: string
  name: string
  year: string
}

interface GameRecord {
  sente: PlayerInfo
  gote: PlayerInfo
  record: string
  date: string
  tournament: string
  id: string
}

// 特定のIDの棋譜を取得するAPI
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // 全ての棋譜を取得
    const records = (await redis.get("shogiRecords")) as GameRecord[] | null

    if (!records) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }

    // IDに一致する棋譜を検索
    const record = records.find((r) => r.id === id)

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }

    return NextResponse.json({ record })
  } catch (error) {
    console.error("Error fetching record:", error)
    return NextResponse.json({ error: "Failed to fetch record" }, { status: 500 })
  }
}

