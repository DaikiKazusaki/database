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

// 全ての棋譜を取得するAPI
export async function GET() {
  try {
    // 'shogiRecords'キーから全ての棋譜を取得
    const records = (await redis.get("shogiRecords")) as GameRecord[] | null

    return NextResponse.json({ records: records || [] })
  } catch (error) {
    console.error("Error fetching records:", error)
    return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 })
  }
}

// 新しい棋譜を保存するAPI
export async function POST(request: Request) {
  try {
    const gameRecord = (await request.json()) as GameRecord

    // 既存の棋譜を取得
    const existingRecords = (await redis.get("shogiRecords")) as GameRecord[] | null
    const records = existingRecords || []

    // 新しい棋譜を追加
    records.push(gameRecord)

    // Redisに保存
    await redis.set("shogiRecords", records)

    return NextResponse.json({ success: true, message: "棋譜が正常に保存されました" })
  } catch (error) {
    console.error("Error saving record:", error)
    return NextResponse.json({ error: "Failed to save record" }, { status: 500 })
  }
}

