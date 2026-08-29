import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { parseKifu } from "../parseKifu"

// フィクスチャは実在の対局ではなく、これまでに登録された棋譜に現れた
// 書式のバリエーションを再現した架空のもの。
// 新しい棋譜ソフトに対応したときは、ここに1つ追加すること。
function fixture(name: string) {
  return readFileSync(new URL(`./fixtures/${name}.kif`, import.meta.url), "utf8")
}

describe("parseKifu", () => {
  it("ぴよ将棋の標準的な出力を読み取る", () => {
    expect(parseKifu(fixture("piyo-standard"))).toEqual({
      sente_name: "架空太郎",
      sente_univ: "大阪",
      sente_grade: "3",
      gote_name: "仮名次郎",
      gote_univ: "京都",
      gote_grade: "2",
      event: "R6春季団体戦",
      date: "2026-04-18",
      result: "後手勝ち",
    })
  })

  it("全角括弧・全角数字でも同じ結果になり、大学名は短縮形に揃う", () => {
    const parsed = parseKifu(fixture("zenkaku-parens"))
    expect(parsed.sente_univ).toBe("関西学院")
    expect(parsed.sente_grade).toBe("4")
    // 「同志社大学」は末尾の「大学」を落として保存する
    expect(parsed.gote_univ).toBe("同志社")
    expect(parsed.gote_grade).toBe("1")
    expect(parsed.result).toBe("先手勝ち")
  })

  it("駒落ちの下手・上手を先手・後手として扱う", () => {
    const parsed = parseKifu(fixture("komaochi"))
    expect(parsed.sente_name).toBe("架空四郎")
    expect(parsed.gote_name).toBe("仮名五郎")
    // 「下手の勝ち」は先手勝ち
    expect(parsed.result).toBe("先手勝ち")
  })

  it("「3年」「2回生」のような学年表記を読み取る", () => {
    const parsed = parseKifu(fixture("sennichite"))
    expect(parsed.sente_univ).toBe("神戸")
    expect(parsed.sente_grade).toBe("3")
    expect(parsed.gote_univ).toBe("近畿")
    expect(parsed.gote_grade).toBe("2")
  })

  it("千日手を引き分けとして返す", () => {
    expect(parseKifu(fixture("sennichite")).result).toBe("引き分け")
  })

  it("入玉宣言勝ちを宣言勝ちとして返す", () => {
    expect(parseKifu(fixture("declaration")).result).toBe("後手宣言勝ち")
  })

  it("略称を正式な短縮形に直す", () => {
    const parsed = parseKifu(fixture("declaration"))
    expect(parsed.sente_univ).toBe("大阪") // 阪大
    expect(parsed.gote_univ).toBe("東京") // 東大
  })

  it("終局行が無い棋譜は最終手から勝敗を決める", () => {
    // 4手目（後手）が投了しているので先手勝ち
    expect(parseKifu(fixture("no-result-line")).result).toBe("先手勝ち")
  })

  it("ヘッダーがほとんど無い棋譜では、読めた項目だけを返す", () => {
    expect(parseKifu(fixture("minimal"))).toEqual({
      sente_name: "架空十二",
      sente_univ: "",
      sente_grade: "",
      gote_name: "仮名十三",
      gote_univ: "",
      gote_grade: "",
      event: "",
      date: "",
      result: "",
    })
  })

  it("空文字を渡しても落ちない", () => {
    expect(parseKifu("").sente_name).toBe("")
    expect(parseKifu("   ").result).toBe("")
  })

  it("消費時間のコロンを見出し行と取り違えない", () => {
    // 指し手の行は「( 0:13/00:00:13)」のようにコロンを含むが、
    // 「棋戦：」などのヘッダーとして拾ってはいけない
    expect(parseKifu(fixture("piyo-standard")).event).toBe("R6春季団体戦")
  })

  // 現状の挙動を書き留めておくためのテスト。
  // ぴよ将棋は詰みで終わった対局の最終手を「詰み」と書くが、
  // parseResult のフォールバックは投了・切れ負け・反則負け・時間切れしか見ていない。
  // 実データでは必ず「まで○手で…の勝ち」の行が付くため表面化していないだけで、
  // その行が無い棋譜では結果が空になる。直す場合はこのテストも書き換えること。
  it("【既知の穴】終局行が無く「詰み」で終わる棋譜は結果を判定できない", () => {
    const kifu = [
      "手合割：平手",
      "先手：架空十四",
      "後手：仮名十五",
      "手数----指手---------消費時間--",
      "   1 ７六歩(77)",
      "   2 詰み       ( 0:01/00:00:02)",
    ].join("\n")
    expect(parseKifu(kifu).result).toBe("")
  })
})
