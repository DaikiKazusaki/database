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

/**
 * 棋譜再生盤。
 * iframe 内で shogi-player を読み込み、幅いっぱい・画面サイズに応じた高さで表示する。
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
        html, body { margin: 0; padding: 0; }
        .container {
          display: flex;
          justify-content: center;
          padding: 4px;
        }
        shogi-player-wc {
          width: 100%;
          max-width: 640px;
        }
      </style>
    </head>
    <body>
      <div class="container">
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
      </div>
    </body>
    </html>
  `

  return (
    <iframe
      title="棋譜再生"
      className="w-full h-[520px] sm:h-[640px] lg:h-[760px] border-0"
      srcDoc={srcDoc}
    />
  )
}
