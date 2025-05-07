import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // Basic認証のヘッダーを取得
  const authHeader = request.headers.get("authorization")

  // 環境変数からユーザー名とパスワードを取得
  const username = process.env.BASIC_AUTH_USER
  const password = process.env.BASIC_AUTH_PASSWORD

  // 環境変数が設定されていない場合は認証をスキップ
  if (!username || !password) {
    console.warn("Basic認証の環境変数が設定されていません。認証をスキップします。")
    return NextResponse.next()
  }

  if (authHeader) {
    // Basic認証のヘッダーを解析
    const authValue = authHeader.split(" ")[1]
    const [authUser, authPass] = atob(authValue).split(":")

    // 認証情報が一致する場合はアクセスを許可
    if (authUser === username && authPass === password) {
      return NextResponse.next()
    }
  }

  // 認証失敗時はBasic認証のプロンプトを表示
  return new NextResponse("認証が必要です", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="将棋データベースへのアクセスには認証が必要です"',
    },
  })
}

// 全てのルートに対してミドルウェアを適用
export const config = {
  matcher: "/:path*",
}
