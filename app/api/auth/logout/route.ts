import { NextResponse } from "next/server"

export async function GET() {
  // 401ステータスコードを返すことで認証を要求
  return new NextResponse("ログアウトしました", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="セッションがタイムアウトしました。再度ログインしてください。"',
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
    },
  })
}
