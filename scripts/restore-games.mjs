/**
 * backup-games.mjs が書き出した JSON からデータを復元する。
 *
 *   node --env-file=.env.local scripts/restore-games.mjs backup/games-2026-08-29.json
 *   node --env-file=.env.local scripts/restore-games.mjs backup/games-2026-08-29.json --yes
 *
 * --yes を付けるまでは何件入るかを表示するだけで、DBには一切書き込まない。
 * 既に同じ id が存在する行は飛ばす。上書きはしないので、
 * 「消えた分だけを戻す」用途に使える。
 *
 * 復元は年に一度、実際に試しておくこと（試していないバックアップはバックアップではない）。
 */
import { readFileSync } from "node:fs"
import { neon } from "@neondatabase/serverless"

const [file, ...flags] = process.argv.slice(2)
const confirmed = flags.includes("--yes")

if (!file) {
  console.error("使い方: node --env-file=.env.local scripts/restore-games.mjs <backup.json> [--yes]")
  process.exit(1)
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL が設定されていません．--env-file=.env.local を付けて実行してください．")
  process.exit(1)
}

const games = JSON.parse(readFileSync(file, "utf8"))
const sql = neon(process.env.DATABASE_URL)

const existing = await sql.query(`SELECT id FROM games`)
const existingIds = new Set(existing.map((row) => row.id))
const missing = games.filter((game) => !existingIds.has(game.id))

console.log(`バックアップ ${games.length}件 / DBに既存 ${existingIds.size}件 / 復元対象 ${missing.length}件`)

if (missing.length === 0) {
  console.log("復元するものはありません．")
  process.exit(0)
}
if (!confirmed) {
  console.log("実際に書き込むには --yes を付けて再実行してください．")
  process.exit(0)
}

for (const game of missing) {
  await sql.query(
    `INSERT INTO games (
       id, sente_name, sente_univ, sente_grade,
       gote_name, gote_univ, gote_grade,
       event, date, result, kifu, deleted_at
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [
      game.id, game.sente_name, game.sente_univ, game.sente_grade,
      game.gote_name, game.gote_univ, game.gote_grade,
      game.event, game.date, game.result, game.kifu, game.deleted_at,
    ]
  )
}

// id を明示して入れたぶん、シーケンスが実データより後ろに来ていないと次の登録で衝突する
await sql.query(`SELECT setval('games_id_seq', (SELECT max(id) FROM games))`)

console.log(`${missing.length}件を復元し、games_id_seq を振り直しました．`)
