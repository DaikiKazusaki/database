"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Copy, Check } from "lucide-react"
import KifuPlayer from "../../components/KifuPlayer"
import type { Game } from "../types"

export default function GameDetail({ game, backHref }: { game: Game; backHref: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(game.kifu)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert("コピーに失敗しました")
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-blue-700 hover:underline mb-4"
      >
        <ArrowLeft size={18} />
        棋譜一覧に戻る
      </Link>

      {/* 対局情報 */}
      <div className="bg-white shadow rounded-xl border border-gray-200 p-4 sm:p-6 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="text-sm text-gray-600 mb-2">
              {new Date(game.date).toLocaleDateString("ja-JP")}・{game.event}
            </div>
            <div className="text-base mb-1">
              <strong>先手：</strong>
              {game.sente_name}（{game.sente_univ}・{game.sente_grade}）
            </div>
            <div className="text-base mb-1">
              <strong>後手：</strong>
              {game.gote_name}（{game.gote_univ}・{game.gote_grade}）
            </div>
            <div className="text-base text-gray-700">
              <strong>結果：</strong>
              {game.result}
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm w-full sm:w-auto"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "コピーしました" : "棋譜をコピー"}
          </button>
        </div>
      </div>

      {/* 棋譜再生 */}
      <div className="bg-white shadow rounded-xl border border-gray-200 p-2 sm:p-4">
        <KifuPlayer game={game} />
      </div>

      {/* 棋譜テキスト */}
      <details className="mt-4 bg-white shadow rounded-xl border border-gray-200 p-4">
        <summary className="cursor-pointer font-medium">棋譜テキスト（KIF形式）を表示</summary>
        <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-all text-sm text-gray-800 bg-gray-50 p-3 rounded">
          {game.kifu}
        </pre>
      </details>
    </div>
  )
}
