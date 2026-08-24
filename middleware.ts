import { NextRequest, NextResponse } from "next/server"

// 文字列長・内容に依存した早期リターンを避けるための比較
function safeEqual(a: string, b: string) {
  const encoder = new TextEncoder()
  const aBytes = encoder.encode(a)
  const bBytes = encoder.encode(b)

  let diff = aBytes.length ^ bBytes.length
  const length = Math.max(aBytes.length, bBytes.length)
  for (let i = 0; i < length; i++) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0)
  }
  return diff === 0
}

function unauthorized() {
  return new NextResponse("認証が必要です．", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Shogi Database", charset="UTF-8"',
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}

export function middleware(request: NextRequest) {
  const expectedUser = process.env.BASIC_AUTH_USER
  const expectedPassword = process.env.BASIC_AUTH_PASSWORD

  if (!expectedUser || !expectedPassword) {
    return new NextResponse("Basic認証の環境変数が設定されていません．", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }

  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Basic ")) return unauthorized()

  let credentials: string
  try {
    // atob はバイト列を返すため、UTF-8として解釈し直す
    const binary = atob(authHeader.slice("Basic ".length))
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    credentials = new TextDecoder().decode(bytes)
  } catch {
    return unauthorized()
  }

  const separatorIndex = credentials.indexOf(":")
  if (separatorIndex === -1) return unauthorized()

  const user = credentials.slice(0, separatorIndex)
  const password = credentials.slice(separatorIndex + 1)

  // 片方だけ先に判定すると差が漏れるため、両方を必ず評価する
  const userMatches = safeEqual(user, expectedUser)
  const passwordMatches = safeEqual(password, expectedPassword)
  if (!userMatches || !passwordMatches) return unauthorized()

  return NextResponse.next()
}

export const config = {
  // 静的アセット以外の全リクエスト（ページ・APIともに）を保護する
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
