import { normalizeUniversity } from "./normalizeUniversity"

export const GAME_FIELDS = [
  "sente_name",
  "sente_univ",
  "sente_grade",
  "gote_name",
  "gote_univ",
  "gote_grade",
  "event",
  "date",
  "result",
] as const

export type GameField = (typeof GAME_FIELDS)[number]
export type GameValues = Record<GameField, string>

export const FIELD_LABELS: Record<GameField, string> = {
  sente_name: "先手の氏名",
  sente_univ: "先手の大学名",
  sente_grade: "先手の学年",
  gote_name: "後手の氏名",
  gote_univ: "後手の大学名",
  gote_grade: "後手の学年",
  event: "大会名",
  date: "対局日",
  result: "結果",
}

export const RESULT_OPTIONS = [
  { value: "先手勝ち", label: "先手勝ち" },
  { value: "後手勝ち", label: "後手勝ち" },
  { value: "引き分け", label: "千日手" },
  { value: "持将棋", label: "持将棋" },
  { value: "先手宣言勝ち", label: "先手宣言勝ち" },
  { value: "後手宣言勝ち", label: "後手宣言勝ち" },
] as const

export const GRADES = ["1", "2", "3", "4", "5", "6"] as const

export const MAX_TEXT_LENGTH = 50
export const MAX_KIFU_LENGTH = 100000

export const EMPTY_GAME_VALUES: GameValues = {
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

// FormData から対局情報を取り出す（前後の空白は落とす）
export function readGameValues(formData: FormData): GameValues {
  const values = { ...EMPTY_GAME_VALUES }
  for (const field of GAME_FIELDS) {
    const input = formData.get(field)
    values[field] = typeof input === "string" ? input.trim() : ""
  }
  return values
}

// 保存前に大学名の表記を揃える（入力欄に何が打たれても正規形で保存する）
export function normalizeGameValues(values: GameValues): GameValues {
  return {
    ...values,
    sente_univ: normalizeUniversity(values.sente_univ),
    gote_univ: normalizeUniversity(values.gote_univ),
  }
}

/**
 * 登録・更新前の検証。問題があればエラーメッセージの配列を返す。
 */
export function validateGame(values: GameValues, kifu: string): string[] {
  const errors: string[] = []

  const missing = GAME_FIELDS.filter((field) => !values[field])
  if (missing.length > 0) {
    errors.push(
      `次の項目が入力されていません：${missing.map((field) => FIELD_LABELS[field]).join("・")}`
    )
  }

  const tooLong = GAME_FIELDS.filter(
    (field) => values[field].length > MAX_TEXT_LENGTH
  )
  if (tooLong.length > 0) {
    errors.push(
      `次の項目が長すぎます（${MAX_TEXT_LENGTH}文字以内）：${tooLong
        .map((field) => FIELD_LABELS[field])
        .join("・")}`
    )
  }

  for (const field of ["sente_grade", "gote_grade"] as const) {
    const value = values[field]
    if (value && !GRADES.includes(value as (typeof GRADES)[number])) {
      errors.push(`${FIELD_LABELS[field]}は1〜6で指定してください．`)
    }
  }

  if (values.result && !RESULT_OPTIONS.some((o) => o.value === values.result)) {
    errors.push("結果の値が不正です．")
  }

  if (values.date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date)) {
      errors.push("対局日はYYYY-MM-DD形式で指定してください．")
    } else {
      const date = new Date(`${values.date}T00:00:00Z`)
      const oldest = new Date("1950-01-01T00:00:00Z")
      const newest = new Date()
      newest.setFullYear(newest.getFullYear() + 1)
      if (Number.isNaN(date.getTime()) || date < oldest || date > newest) {
        errors.push("対局日が正しくありません．")
      }
    }
  }

  if (!kifu.trim()) {
    errors.push("棋譜が入力されていません．")
  } else if (kifu.length > MAX_KIFU_LENGTH) {
    errors.push(`棋譜が長すぎます（${MAX_KIFU_LENGTH}文字以内）．`)
  } else if (!/^\s*\d+\s+\S/m.test(kifu)) {
    errors.push("KIF形式の棋譜として読み取れません．指し手の行が見つかりませんでした．")
  }

  return errors
}

// 「*#」で始まる将棋所のコメント行を取り除く
export function cleanKifu(kifu: string) {
  return kifu
    .split("\n")
    .filter((line) => !line.trim().startsWith("*#"))
    .join("\n")
}
