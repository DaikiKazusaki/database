import { NextResponse } from "next/server"

// 認証状態を確認するためのAPIエンドポイント
export async function GET() {
  return NextResponse.json({ authenticated: true })
}
