"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Game = {
  id: number
  sente_name: string
  sente_univ: string
  sente_grade: string
  gote_name: string
  gote_univ: string
  gote_grade: string
  event: string
  date: string
  result: string
  kifu: string
}

export default function GameReplayPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`/api/games/${params.id}`)
        const data = await res.json()
        setGame(data)
      } catch (err) {
        console.error("データ取得エラー:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchGame()
  }, [params.id])

  const handleReturnToSearch = () => {
    router.push("/search")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">読み込み中...</div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-xl">棋譜が見つかりませんでした</div>
        <button onClick={handleReturnToSearch} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          検索ページに戻る
        </button>
      </div>
    )
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">棋譜再生</h1>
        <button onClick={handleReturnToSearch} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          検索ページに戻る
        </button>
      </div>

      <div className="bg-white shadow rounded-xl p-4 border border-gray-200 mb-6">
        <div className="text-sm text-gray-600 mb-2">
          {new Date(game.date).toLocaleDateString("ja-JP")}・{game.event}
        </div>
        <div className="text-sm mb-1">
          <strong>先手：</strong>
          {game.sente_name}（{game.sente_univ}・{game.sente_grade}）
        </div>
        <div className="text-sm mb-1">
          <strong>後手：</strong>
          {game.gote_name}（{game.gote_univ}・{game.gote_grade}）
        </div>
        <div className="text-sm text-gray-700">
          <strong>結果：</strong>
          {game.result}
        </div>
      </div>

      <div className="relative w-full h-[600px] bg-white shadow rounded-xl overflow-hidden">
        <iframe
          className="w-full h-full"
          style={{ border: "none" }}
          srcDoc={`
            <!DOCTYPE html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script defer src="https://cdn.jsdelivr.net/npm/shogi-player@1.1.24"></script>
              <style>
                .container {
                  display: flex;
                  justify-content: center;
                }
                shogi-player-wc {
                  flex-basis: 640px;
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
                    "black": { name: "${(game.sente_name + "（" + game.sente_univ + "・" + game.sente_grade + "）").replace(/"/g, "&quot;")}"},
                    "white": { name: "${(game.gote_name + "（" + game.gote_univ + "・" + game.gote_grade + "）").replace(/"/g, "&quot;")}"}
                  }'
                  sp_body="${game.kifu.replace(/"/g, "&quot;")}"
                  ></shogi-player-wc>
              </div>
            </body>
            </html>  
          `}
        />
      </div>
    </main>
  )
}
