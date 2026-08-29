import { describe, expect, it } from "vitest"
import { normalizeUniversity } from "../normalizeUniversity"

describe("normalizeUniversity", () => {
  it("末尾の「大学」を落として短縮形に揃える", () => {
    expect(normalizeUniversity("大阪大学")).toBe("大阪")
    expect(normalizeUniversity("関西学院大学")).toBe("関西学院")
  })

  it("既に短縮形なら何もしない", () => {
    expect(normalizeUniversity("大阪")).toBe("大阪")
    expect(normalizeUniversity("関西学院")).toBe("関西学院")
  })

  it("よく使われる略称を短縮形に直す", () => {
    expect(normalizeUniversity("阪大")).toBe("大阪")
    expect(normalizeUniversity("京大")).toBe("京都")
    expect(normalizeUniversity("関学")).toBe("関西学院")
    expect(normalizeUniversity("阪公大")).toBe("大阪公立")
  })

  it("旧字体の「大學」も同じ扱いにする", () => {
    expect(normalizeUniversity("大阪大學")).toBe("大阪")
  })

  it("前後の空白を落とす", () => {
    expect(normalizeUniversity("  京大  ")).toBe("京都")
  })

  it("大学でない値はそのまま返す", () => {
    // 選抜チームなど、大学名以外も同じ欄に入る
    expect(normalizeUniversity("関西九州選抜")).toBe("関西九州選抜")
    expect(normalizeUniversity("")).toBe("")
  })

  it("「神大」は神戸とも神奈川とも取れるので変換しない", () => {
    expect(normalizeUniversity("神大")).toBe("神大")
  })

  it("「大学」だけが入力されても空にならない", () => {
    expect(normalizeUniversity("大学")).toBe("大学")
  })

  it("検索と保存で同じ結果になる（どの表記で検索しても一致する）", () => {
    const forms = ["大阪大学", "大阪", "阪大", "大阪大學", " 阪大 "]
    const normalized = forms.map(normalizeUniversity)
    expect(new Set(normalized)).toEqual(new Set(["大阪"]))
  })
})
