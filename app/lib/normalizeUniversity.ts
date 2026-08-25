// よく使われる略称。ここに無い表記は末尾の「大学」を落とすだけに留める。
// （「神大」は神戸・神奈川のどちらとも取れるため、あえて入れていない）
const ALIASES: Record<string, string> = {
  阪大: "大阪",
  京大: "京都",
  神戸大: "神戸",
  同大: "同志社",
  同志社大: "同志社",
  立命: "立命館",
  立命館大: "立命館",
  関大: "関西",
  関西大: "関西",
  関学: "関西学院",
  関西学院大: "関西学院",
  近大: "近畿",
  近畿大: "近畿",
  龍大: "龍谷",
  龍谷大: "龍谷",
  北大: "北海道",
  北海道大: "北海道",
  東大: "東京",
  東京大: "東京",
  名大: "名古屋",
  名古屋大: "名古屋",
  阪公大: "大阪公立",
  大阪公立大: "大阪公立",
}

/**
 * 大学名の表記ゆれを揃える。
 * 「大阪大学」と「大阪」のように末尾の「大学」の有無で揺れるため、短縮形に統一する。
 * 「関西九州選抜」のように大学でない値もあるので、末尾が「大学」でなければ原則そのまま返す。
 */
export function normalizeUniversity(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ""

  let normalized = trimmed.replace(/大學$/, "大学")
  if (normalized.endsWith("大学")) {
    normalized = normalized.slice(0, -2)
  }

  normalized = ALIASES[normalized] ?? normalized

  // 「大学」だけが入力された場合など、空になってしまうときは元の値を残す
  return normalized || trimmed
}
