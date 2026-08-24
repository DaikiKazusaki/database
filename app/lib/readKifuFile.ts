/**
 * .kif ファイルを文字列として読み込む。
 * KIFファイルはShift_JISで保存されていることが多いため、
 * UTF-8として読めなかった場合はShift_JISとして読み直す。
 */
export async function readKifuFile(file: File) {
  const buffer = await file.arrayBuffer()

  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer)
  } catch {
    return new TextDecoder("shift_jis").decode(buffer)
  }
}
