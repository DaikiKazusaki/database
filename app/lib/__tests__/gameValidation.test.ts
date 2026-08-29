import { describe, expect, it } from "vitest"
import {
  MAX_KIFU_LENGTH,
  MAX_TEXT_LENGTH,
  cleanKifu,
  normalizeGameValues,
  readGameValues,
  validateGame,
  type GameValues,
} from "../gameValidation"

const VALID_KIFU = ["手合割：平手", "手数----指手---------消費時間--", "   1 ７六歩(77)"].join("\n")

const VALID: GameValues = {
  sente_name: "架空太郎",
  sente_univ: "大阪",
  sente_grade: "3",
  gote_name: "仮名次郎",
  gote_univ: "京都",
  gote_grade: "2",
  event: "R6春季団体戦",
  date: "2026-04-18",
  result: "先手勝ち",
}

describe("validateGame", () => {
  it("正しい入力ならエラーを返さない", () => {
    expect(validateGame(VALID, VALID_KIFU)).toEqual([])
  })

  it("未入力の項目を日本語のラベルで指摘する", () => {
    const errors = validateGame({ ...VALID, sente_name: "", event: "" }, VALID_KIFU)
    expect(errors).toHaveLength(1)
    expect(errors[0]).toContain("先手の氏名")
    expect(errors[0]).toContain("大会名")
  })

  it("長すぎる項目を弾く", () => {
    const errors = validateGame({ ...VALID, event: "あ".repeat(MAX_TEXT_LENGTH + 1) }, VALID_KIFU)
    expect(errors.some((e) => e.includes("長すぎます"))).toBe(true)
  })

  it("学年は1〜6だけを受け付ける", () => {
    expect(validateGame({ ...VALID, sente_grade: "7" }, VALID_KIFU)).toContain(
      "先手の学年は1〜6で指定してください．"
    )
    for (const grade of ["1", "6"]) {
      expect(validateGame({ ...VALID, sente_grade: grade }, VALID_KIFU)).toEqual([])
    }
  })

  it("選択肢にない結果を弾く", () => {
    expect(validateGame({ ...VALID, result: "勝ち" }, VALID_KIFU)).toContain("結果の値が不正です．")
  })

  it("対局日はYYYY-MM-DD形式に限る", () => {
    expect(validateGame({ ...VALID, date: "2026/04/18" }, VALID_KIFU)).toContain(
      "対局日はYYYY-MM-DD形式で指定してください．"
    )
  })

  it("古すぎる対局日を弾く", () => {
    expect(validateGame({ ...VALID, date: "1940-01-01" }, VALID_KIFU)).toContain(
      "対局日が正しくありません．"
    )
  })

  it("来年より先の対局日を弾く", () => {
    const farFuture = new Date()
    farFuture.setFullYear(farFuture.getFullYear() + 2)
    const date = farFuture.toISOString().slice(0, 10)
    expect(validateGame({ ...VALID, date }, VALID_KIFU)).toContain("対局日が正しくありません．")
  })

  it("棋譜が空、または指し手の行が無いものを弾く", () => {
    expect(validateGame(VALID, "   ")).toContain("棋譜が入力されていません．")
    expect(validateGame(VALID, "手合割：平手\n先手：架空太郎")).toContain(
      "KIF形式の棋譜として読み取れません．指し手の行が見つかりませんでした．"
    )
  })

  it("長すぎる棋譜を弾く", () => {
    const errors = validateGame(VALID, "1 ７六歩\n" + "あ".repeat(MAX_KIFU_LENGTH))
    expect(errors.some((e) => e.includes("棋譜が長すぎます"))).toBe(true)
  })
})

describe("normalizeGameValues", () => {
  it("保存前に両者の大学名だけを正規化する", () => {
    const normalized = normalizeGameValues({
      ...VALID,
      sente_univ: "大阪大学",
      gote_univ: "京大",
      event: "関西学院大学杯",
    })
    expect(normalized.sente_univ).toBe("大阪")
    expect(normalized.gote_univ).toBe("京都")
    // 大会名は正規化の対象外
    expect(normalized.event).toBe("関西学院大学杯")
  })
})

describe("readGameValues", () => {
  it("FormDataから値を取り出し、前後の空白を落とす", () => {
    const form = new FormData()
    form.append("sente_name", "  架空太郎  ")
    form.append("kifu", "無視される")

    const values = readGameValues(form)
    expect(values.sente_name).toBe("架空太郎")
    // 送られてこなかった項目は空文字になる
    expect(values.gote_name).toBe("")
  })
})

describe("cleanKifu", () => {
  it("将棋所の「*#」で始まるコメント行を落とす", () => {
    const kifu = ["手合割：平手", "*#評価値 120", "   1 ７六歩(77)", "*# コメント"].join("\n")
    expect(cleanKifu(kifu)).toBe(["手合割：平手", "   1 ７六歩(77)"].join("\n"))
  })

  it("「*」だけのコメント行は残す（棋譜の一部として表示されるため）", () => {
    const kifu = ["*本譜は相掛かり", "   1 ７六歩(77)"].join("\n")
    expect(cleanKifu(kifu)).toBe(kifu)
  })
})
