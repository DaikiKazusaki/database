export type ParsedKifu = {
  sente_name: string
  sente_univ: string
  sente_grade: string
  gote_name: string
  gote_univ: string
  gote_grade: string
  event: string
  date: string
  result: string
}

export const EMPTY_PARSED_KIFU: ParsedKifu = {
  sente_name: "",
  sente_univ: "",
  sente_grade: "",
  gote_name: "",
  gote_univ: "",
  gote_grade: "",
  event: "",
  date: "",
  result: "",
}

// 全角英数字を半角に揃える（学年・日付の判定用）
function toHalfWidth(value: string) {
  return value.replace(/[０-９]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0xfee0)
  )
}

// 「棋戦：R8春季個人戦」のようなヘッダー行から値を取り出す
function headerValue(lines: string[], key: string) {
  for (const line of lines) {
    const matched = line.match(/^\s*([^：:]+?)\s*[：:]\s*(.*)$/)
    if (!matched) continue
    if (matched[1].trim() !== key) continue

    const value = matched[2].trim()
    if (value) return value
  }
  return ""
}

// 「西村(大阪3)」→ 氏名・大学名・学年
function parsePlayer(value: string) {
  if (!value) return { name: "", univ: "", grade: "" }

  const matched = value.match(/^(.*?)\s*[（(]\s*(.*?)\s*[）)]\s*$/)
  if (!matched) return { name: value.trim(), univ: "", grade: "" }

  const name = matched[1].trim()
  const detail = toHalfWidth(matched[2].trim())

  // 「大阪3」「大阪 3年」「大阪・3回生」などから学年を切り出す
  const withGrade = detail.match(/^(.*?)[\s・,、]*([1-6])\s*(?:年生|回生|年)?$/)
  if (!withGrade) return { name, univ: detail, grade: "" }

  return { name, univ: withGrade[1].trim(), grade: withGrade[2] }
}

function parseDate(lines: string[]) {
  const raw =
    headerValue(lines, "対局日") ||
    headerValue(lines, "開始日時") ||
    headerValue(lines, "終了日時")
  if (!raw) return ""

  const matched = toHalfWidth(raw).match(
    /(\d{4})\s*[/\-年.]\s*(\d{1,2})\s*[/\-月.]\s*(\d{1,2})/
  )
  if (!matched) return ""

  const [, year, month, day] = matched
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
}

// 駒落ちの「下手」は先手、「上手」は後手として扱う
function isSenteSide(side: string) {
  return side === "先手" || side === "下手"
}

function parseResult(lines: string[]) {
  // 「まで113手で先手の勝ち」のような終局行を優先する
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim()
    if (!line.startsWith("まで")) continue

    if (line.includes("千日手")) return "引き分け"
    if (line.includes("持将棋")) return "持将棋"

    const declared = line.match(/(先手|後手|下手|上手)の(?:入玉)?宣言勝ち/)
    if (declared) return isSenteSide(declared[1]) ? "先手宣言勝ち" : "後手宣言勝ち"

    const won = line.match(/(先手|後手|下手|上手)の(?:反則)?勝ち/)
    if (won) return isSenteSide(won[1]) ? "先手勝ち" : "後手勝ち"

    return ""
  }

  // 終局行が無い棋譜は最終手から判定する（奇数手が先手）
  for (let i = lines.length - 1; i >= 0; i--) {
    const matched = lines[i].match(/^\s*(\d+)\s+(\S+)/)
    if (!matched) continue

    const senteMoved = Number(matched[1]) % 2 === 1
    const move = matched[2]

    if (/^(投了|切れ負け|反則負け|時間切れ)/.test(move)) {
      return senteMoved ? "後手勝ち" : "先手勝ち"
    }
    if (/^(入玉宣言|宣言勝ち)/.test(move)) {
      return senteMoved ? "先手宣言勝ち" : "後手宣言勝ち"
    }
    if (move.startsWith("千日手")) return "引き分け"
    if (move.startsWith("持将棋")) return "持将棋"

    // 特殊な指し手で終わっていなければ判定しない
    return ""
  }

  return ""
}

/**
 * KIF形式の棋譜から対局者・大会名・対局日・結果を取り出す。
 * 取得できなかった項目は空文字を返す。
 */
export function parseKifu(kifu: string): ParsedKifu {
  if (!kifu.trim()) return { ...EMPTY_PARSED_KIFU }

  const lines = kifu.split(/\r?\n/)
  const sente = parsePlayer(
    headerValue(lines, "先手") || headerValue(lines, "下手")
  )
  const gote = parsePlayer(
    headerValue(lines, "後手") || headerValue(lines, "上手")
  )

  return {
    sente_name: sente.name,
    sente_univ: sente.univ,
    sente_grade: sente.grade,
    gote_name: gote.name,
    gote_univ: gote.univ,
    gote_grade: gote.grade,
    event: headerValue(lines, "棋戦") || headerValue(lines, "大会"),
    date: parseDate(lines),
    result: parseResult(lines),
  }
}
