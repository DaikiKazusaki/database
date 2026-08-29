/**
 * 本番DBのスキーマを db/schema.sql として書き出す。
 *
 *   node --env-file=.env.local scripts/dump-schema.mjs
 *
 * pg_dump を入れずに済ませるため、カタログを引いてDDLを組み立てている。
 * データは一切読まない（列の定義・制約・インデックスのみ）。
 */
import { writeFileSync } from "node:fs"
import { neon } from "@neondatabase/serverless"

const OUTPUT = "db/schema.sql"

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL が設定されていません．--env-file=.env.local を付けて実行してください．")
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

const tables = await sql.query(`
  SELECT c.relname AS table_name
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
   WHERE n.nspname = 'public' AND c.relkind = 'r'
   ORDER BY c.relname
`)

const columns = await sql.query(`
  SELECT table_name, column_name, ordinal_position,
         data_type, udt_name, character_maximum_length,
         numeric_precision, numeric_scale, datetime_precision,
         is_nullable, column_default, is_identity, identity_generation
    FROM information_schema.columns
   WHERE table_schema = 'public'
   ORDER BY table_name, ordinal_position
`)

// 制約は pg_get_constraintdef がそのまま使える形で返してくれる
const constraints = await sql.query(`
  SELECT rel.relname AS table_name, con.conname AS name,
         con.contype AS type, pg_get_constraintdef(con.oid) AS definition
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace n ON n.oid = rel.relnamespace
   WHERE n.nspname = 'public'
   ORDER BY rel.relname, con.contype DESC, con.conname
`)

// 制約が裏で作るインデックス（主キーなど）は重複するので除く
const indexes = await sql.query(`
  SELECT i.tablename AS table_name, i.indexname AS name, i.indexdef AS definition
    FROM pg_indexes i
   WHERE i.schemaname = 'public'
     AND NOT EXISTS (
       SELECT 1 FROM pg_constraint con
        WHERE con.conname = i.indexname AND con.contype IN ('p', 'u')
     )
   ORDER BY i.tablename, i.indexname
`)

/** information_schema の断片から、SQLに書ける型名へ戻す */
function formatType(col) {
  const type = col.data_type

  if (type === "character varying" || type === "character") {
    const base = type === "character" ? "char" : "varchar"
    return col.character_maximum_length ? `${base}(${col.character_maximum_length})` : base
  }
  if (type === "numeric" && col.numeric_precision !== null) {
    return `numeric(${col.numeric_precision}, ${col.numeric_scale})`
  }
  if (type === "ARRAY") return `${col.udt_name.replace(/^_/, "")}[]`
  if (type === "USER-DEFINED") return col.udt_name
  return type
}

function formatColumn(col) {
  const parts = [`  ${col.column_name}`, formatType(col)]

  if (col.is_identity === "YES") {
    parts.push(`GENERATED ${col.identity_generation} AS IDENTITY`)
  } else if (col.column_default !== null) {
    parts.push(`DEFAULT ${col.column_default}`)
  }
  if (col.is_nullable === "NO") parts.push("NOT NULL")

  return parts.join(" ")
}

const lines = [
  "-- 棋譜データベースのスキーマ（自動生成）",
  "--",
  "-- 手で編集しないこと。変更は db/migrations/ にSQLを追加して本番へ適用し、",
  "-- そのあと次のコマンドで再生成する：",
  "--   node --env-file=.env.local scripts/dump-schema.mjs",
  "",
]

for (const { table_name } of tables) {
  const cols = columns.filter((c) => c.table_name === table_name)
  const tableConstraints = constraints.filter(
    // 外部キーは参照先が出揃った後にまとめて足す
    (c) => c.table_name === table_name && c.type !== "f"
  )

  lines.push(`CREATE TABLE ${table_name} (`)
  const body = cols.map(formatColumn)
  for (const con of tableConstraints) {
    body.push(`  CONSTRAINT ${con.name} ${con.definition}`)
  }
  lines.push(body.join(",\n"))
  lines.push(");", "")

  for (const index of indexes.filter((i) => i.table_name === table_name)) {
    lines.push(`${index.definition};`)
  }
  if (indexes.some((i) => i.table_name === table_name)) lines.push("")
}

const foreignKeys = constraints.filter((c) => c.type === "f")
for (const fk of foreignKeys) {
  lines.push(`ALTER TABLE ${fk.table_name} ADD CONSTRAINT ${fk.name} ${fk.definition};`)
}
if (foreignKeys.length > 0) lines.push("")

writeFileSync(OUTPUT, lines.join("\n"), "utf8")
console.log(`${OUTPUT} を書き出しました（テーブル${tables.length}件、インデックス${indexes.length}件）．`)
