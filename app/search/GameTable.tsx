"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { Game } from "./types"

export default function GameTable() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [gameList, setGameList] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "")
  const [startDate, setStartDate] = useState(searchParams.get("from") ?? "")
  const [endDate, setEndDate] = useState(searchParams.get("to") ?? "")
  const [deletingGameId, setDeletingGameId] = useState<number | null>(null)
  const [copiedGameId, setCopiedGameId] = useState<number | null>(null)

  // データ取得
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch("/api/games")
        const data = await res.json()
        setGameList(data)
      } catch (err) {
        console.error("データ取得エラー:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchGames()
  }, [])

  // 検索条件をURLに保持し、棋譜ページから戻っても条件が消えないようにする
  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("q", searchQuery)
    if (startDate) params.set("from", startDate)
    if (endDate) params.set("to", endDate)
    return params.toString()
  }, [searchQuery, startDate, endDate])

  useEffect(() => {
    router.replace(queryString ? `/search?${queryString}` : "/search", { scroll: false })
  }, [queryString, router])

  const filteredGames = gameList.filter((game) => {
    const query = searchQuery.toLowerCase()
    const gameDate = new Date(game.date)
    const start = startDate ? new Date(startDate) : null
    const end = endDate ? new Date(endDate + "T23:59:59") : null

    const inDateRange = (!start || start <= gameDate) && (!end || gameDate <= end)
    const matchesQuery =
      game.sente_name.toLowerCase().includes(query) ||
      game.sente_univ.toLowerCase().includes(query) ||
      game.sente_grade.toLowerCase().includes(query) ||
      game.gote_name.toLowerCase().includes(query) ||
      game.gote_univ.toLowerCase().includes(query) ||
      game.gote_grade.toLowerCase().includes(query) ||
      game.event.toLowerCase().includes(query) ||
      game.result.toLowerCase().includes(query)

    return inDateRange && matchesQuery
  })

  const handleCopy = async (game: Game) => {
    try {
      await navigator.clipboard.writeText(game.kifu)
      setCopiedGameId(game.id)
      setTimeout(() => setCopiedGameId((prev) => (prev === game.id ? null : prev)), 2000)
    } catch {
      alert("コピーに失敗しました")
    }
  }

  const handleDelete = async (id: number) => {
    setDeletingGameId(id)
  }

  const confirmDelete = async () => {
    if (!deletingGameId) return

    try {
      const res = await fetch("/api/delete-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deletingGameId }),
      })
      const data = await res.json()
      if (data.success) {
        alert("棋譜を削除しました")
        setGameList((prev) => prev.filter((g) => g.id !== deletingGameId))
      } else {
        alert("削除に失敗しました")
      }
    } catch {
      alert("エラーが発生しました")
    } finally {
      setDeletingGameId(null)
    }
  }

  const cancelDelete = () => {
    setDeletingGameId(null)
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">棋譜一覧</h1>

      {/* 検索エリア */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:gap-4">
        <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-0">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded min-w-[120px] flex-1 sm:flex-none"
          />
          <span className="text-gray-700">～</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded min-w-[120px] flex-1 sm:flex-none"
          />
        </div>

        <div className="flex gap-2 flex-col sm:flex-row flex-1">
          <input
            type="text"
            placeholder="名前、大学、大会名などで検索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded flex-1 min-w-[200px]"
          />
        </div>
      </div>

      {loading && <p className="text-center text-gray-600">読み込み中...</p>}

      {!loading && filteredGames.length === 0 && (
        <p className="text-center text-gray-600">該当する棋譜が見つかりませんでした．</p>
      )}

      {/* 棋譜一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGames.map((game) => (
          <div key={game.id} className="bg-white shadow rounded-xl p-4 border border-gray-200 flex flex-col">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <Link
                href={`/search/${game.id}${queryString ? `?${queryString}` : ""}`}
                className="flex-1 hover:opacity-80"
              >
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
              </Link>

              <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 md:items-end w-full md:w-auto">
                <button
                  onClick={() => handleCopy(game)}
                  className="w-full md:w-[100px] px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  {copiedGameId === game.id ? "コピー済み" : "コピー"}
                </button>
                <Link
                  href={`/search/${game.id}${queryString ? `?${queryString}` : ""}`}
                  className="w-full md:w-[100px] px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm text-center"
                >
                  棋譜再生
                </Link>
                <button
                  onClick={() => handleDelete(game.id)}
                  className="w-full md:w-[100px] px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 削除確認ダイアログ */}
      {deletingGameId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4">この棋譜を削除しますか？</h3>
            <div className="flex justify-end gap-3">
              <button onClick={cancelDelete} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                いいえ
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                はい
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
