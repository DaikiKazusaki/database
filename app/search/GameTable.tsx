"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { GameSummary } from "./types"

const PAGE_SIZE = 20

type GamesResponse = {
  games: GameSummary[]
  total: number
}

export default function GameTable() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [games, setGames] = useState<GameSummary[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState("")
  const [reloadKey, setReloadKey] = useState(0)

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "")
  const [startDate, setStartDate] = useState(searchParams.get("from") ?? "")
  const [endDate, setEndDate] = useState(searchParams.get("to") ?? "")
  const [deletingGameId, setDeletingGameId] = useState<number | null>(null)
  const [copiedGameId, setCopiedGameId] = useState<number | null>(null)

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

  const buildUrl = useCallback(
    (offset: number) => {
      const params = new URLSearchParams(queryString)
      params.set("limit", String(PAGE_SIZE))
      params.set("offset", String(offset))
      return `/api/games?${params.toString()}`
    },
    [queryString]
  )

  // 検索条件が変わるたびに先頭から取得し直す（入力中に連続リクエストしないよう少し待つ）
  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(buildUrl(0), { signal: controller.signal })
        if (!res.ok) throw new Error(`status ${res.status}`)
        const data: GamesResponse = await res.json()
        setGames(data.games)
        setTotal(data.total)
      } catch (err) {
        if (controller.signal.aborted) return
        console.error("データ取得エラー:", err)
        setError("棋譜の取得に失敗しました．")
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 300)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [buildUrl, reloadKey])

  const loadMore = async () => {
    setLoadingMore(true)
    setError("")
    try {
      const res = await fetch(buildUrl(games.length))
      if (!res.ok) throw new Error(`status ${res.status}`)
      const data: GamesResponse = await res.json()
      setGames((prev) => [...prev, ...data.games])
      setTotal(data.total)
    } catch (err) {
      console.error("データ取得エラー:", err)
      setError("続きの取得に失敗しました．")
    } finally {
      setLoadingMore(false)
    }
  }

  // 一覧では棋譜本文を持たないため、コピーするときだけ取得する
  const handleCopy = async (id: number) => {
    try {
      const res = await fetch(`/api/games/${id}`)
      if (!res.ok) throw new Error(`status ${res.status}`)
      const game = await res.json()
      await navigator.clipboard.writeText(game.kifu)
      setCopiedGameId(id)
      setTimeout(() => setCopiedGameId((prev) => (prev === id ? null : prev)), 2000)
    } catch {
      alert("コピーに失敗しました")
    }
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
        setGames((prev) => prev.filter((g) => g.id !== deletingGameId))
        setTotal((prev) => Math.max(0, prev - 1))
      } else {
        alert(data.error ?? "削除に失敗しました")
      }
    } catch {
      alert("エラーが発生しました")
    } finally {
      setDeletingGameId(null)
    }
  }

  const linkSuffix = queryString ? `?${queryString}` : ""

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">棋譜一覧</h1>

      {/* 検索エリア */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-end sm:gap-4">
        <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-0">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            aria-label="対局日の開始"
            className="p-2 border border-gray-300 rounded min-w-[120px] flex-1 sm:flex-none"
          />
          <span className="text-gray-700">～</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            aria-label="対局日の終了"
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

      {/* 状態表示 */}
      {error && (
        <div className="mb-4 flex items-center justify-between gap-4 rounded border border-red-300 bg-red-50 p-3">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => setReloadKey((key) => key + 1)}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm whitespace-nowrap"
          >
            再試行
          </button>
        </div>
      )}

      {loading && <p className="text-center text-gray-600 mb-4">読み込み中...</p>}

      {!loading && !error && (
        <p className="text-sm text-gray-600 mb-4">
          {total === 0
            ? "該当する棋譜が見つかりませんでした．"
            : `全${total}件中 ${games.length}件を表示`}
        </p>
      )}

      {/* 棋譜一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-white shadow rounded-xl p-4 border border-gray-200 flex flex-col text-gray-900"
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <Link href={`/search/${game.id}${linkSuffix}`} className="flex-1 hover:opacity-80">
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

              <div className="grid grid-cols-2 md:grid-cols-1 gap-2 mt-4 md:mt-0 md:items-end w-full md:w-auto">
                <button
                  onClick={() => handleCopy(game.id)}
                  className="w-full md:w-[100px] px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  {copiedGameId === game.id ? "コピー済み" : "コピー"}
                </button>
                <Link
                  href={`/search/${game.id}${linkSuffix}`}
                  className="w-full md:w-[100px] px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm text-center"
                >
                  棋譜再生
                </Link>
                <Link
                  href={`/search/${game.id}/edit${linkSuffix}`}
                  className="w-full md:w-[100px] px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm text-center"
                >
                  編集
                </Link>
                <button
                  onClick={() => setDeletingGameId(game.id)}
                  className="w-full md:w-[100px] px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {games.length < total && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loadingMore ? "読み込み中..." : "もっと見る"}
          </button>
        </div>
      )}

      {/* 削除確認ダイアログ */}
      {deletingGameId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-gray-900">
            <h3 className="text-lg font-medium mb-2">この棋譜を削除しますか？</h3>
            <p className="text-sm text-gray-600 mb-4">
              一覧からは見えなくなりますが、データは残るので後から復元できます．
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingGameId(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                いいえ
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                はい
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
