import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Pencil } from "lucide-react"
import KifuPlayer from "../../components/KifuPlayer"
import { getGame } from "../../lib/getGame"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const game = await getGame(id)

  return {
    title: game ? `${game.sente_name} vs ${game.gote_name}` : "棋譜再生",
    description: "大阪大学将棋部によるWeb棋譜データベース",
  }
}

export default async function GamePage({ params, searchParams }: PageProps) {
  const { id } = await params
  const game = await getGame(id)

  if (!game) notFound()

  // 検索条件を引き継いで一覧に戻れるようにする
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === "string" && value !== "") query.set(key, value)
  }
  const suffix = query.toString() ? `?${query.toString()}` : ""

  return (
    <div className="p-2 sm:p-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <Link
          href={`/search${suffix}`}
          className="inline-flex items-center gap-1 text-blue-700 hover:underline"
        >
          <ArrowLeft size={18} />
          棋譜一覧に戻る
        </Link>
        <Link
          href={`/search/${game.id}/edit${suffix}`}
          className="inline-flex items-center gap-1 text-blue-700 hover:underline"
        >
          <Pencil size={16} />
          編集
        </Link>
      </div>

      <KifuPlayer game={game} />
    </div>
  )
}
