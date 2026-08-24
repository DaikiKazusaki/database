import type { Game } from "../search/types"

// HTML属性値として安全に埋め込めるようにエスケープする
function escapeAttr(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function playerLabel(name: string, univ: string, grade: string) {
  return `${name}（${univ}・${grade}）`
}

// 盤・駒台・操作ボタンを含めた表示領域の縦横比（実測値に少し余裕を持たせている）
const ASPECT_RATIO = 1.48

// ヘッダー・戻るリンク・余白の分だけ差し引いた高さに盤を収める
const RESERVED_HEIGHT = "130px"

/**
 * 棋譜再生盤。
 * iframe 内で shogi-player を読み込み、画面の高さに収まる最大サイズで表示する。
 */
export default function KifuPlayer({ game }: { game: Game }) {
  const srcDoc = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script defer src="https://cdn.jsdelivr.net/npm/shogi-player@1.1.24"></script>
      <style>
        /* 数px幅がはみ出して横スクロールバーが出るのを防ぐ */
        html, body { margin: 0; padding: 0; overflow-x: hidden; }
        shogi-player-wc {
          width: 100%;
        }
      </style>
    </head>
    <body>
      <shogi-player-wc
        id="player"
        sp_turn="0"
        sp_controller="true"
        sp_piece_variant="portella"
        sp_board_variant="wood_normal"
        sp_coordinate="true"
        sp_autoplay="false"
        sp_player_info='{
          "black": { name: "${escapeAttr(playerLabel(game.sente_name, game.sente_univ, game.sente_grade))}"},
          "white": { name: "${escapeAttr(playerLabel(game.gote_name, game.gote_univ, game.gote_grade))}"}
        }'
        sp_body="${escapeAttr(game.kifu)}"
      ></shogi-player-wc>
    </body>
    </html>
  `

  return (
    <div className="flex justify-center">
      <iframe
        title="棋譜再生"
        className="border-0"
        // 画面の高さから決まる幅と横幅いっぱいの小さい方を採用する
        style={{
          width: `min(100%, calc((100dvh - ${RESERVED_HEIGHT}) / ${ASPECT_RATIO}))`,
          aspectRatio: `1 / ${ASPECT_RATIO}`,
        }}
        srcDoc={srcDoc}
      />
    </div>
  )
}
