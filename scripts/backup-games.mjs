/**
 * games テーブルを JSON に書き出す。
 *
 *   node --env-file=.env.local scripts/backup-games.mjs
 *   node --env-file=.env.local scripts/backup-games.mjs --out backup
 *
 * 論理削除済み（deleted_at あり）の行も含めて全件保存する。
 * 対局日は to_char で文字列に固定している。Dateオブジェクトを経由すると
 * 実行環境のタイムゾーン次第で1日ずれた値が保存されてしまうため。
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { neon } from "@neondatabase/serverless"

const args = process.argv.slice(2)
const outDir = args.includes("--out") ? args[args.indexOf("--out") + 1] : "backup"

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL が設定されていません．--env-file=.env.local を付けて実行してください．")
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

const games = await sql.query(`
  SELECT id,
         sente_name, sente_univ, sente_grade,
         gote_name, gote_univ, gote_grade,
         event,
         to_char(date, 'YYYY-MM-DD') AS date,
         result, kifu,
         to_char(deleted_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SSZ') AS deleted_at
    FROM games
   ORDER BY id
`)

const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" })
const path = join(outDir, `games-${today}.json`)

mkdirSync(outDir, { recursive: true })
writeFileSync(path, JSON.stringify(games, null, 2), "utf8")

const deleted = games.filter((g) => g.deleted_at).length
console.log(`${path} に ${games.length}件を保存しました（うち論理削除済み ${deleted}件）．`)
