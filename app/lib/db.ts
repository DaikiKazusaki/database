import { neon } from "@neondatabase/serverless"

/**
 * DB接続を取得する。
 * モジュール読み込み時ではなく呼び出し時に接続を作ることで、
 * DATABASE_URL の無い環境でもビルドが通るようにしている。
 */
export function getSql() {
  return neon(`${process.env.DATABASE_URL}`)
}
