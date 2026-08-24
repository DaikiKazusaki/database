import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getGame, toDateInputValue } from "../../../lib/getGame"
import EditForm from "./EditForm"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "棋譜の編集",
  description: "大阪大学将棋部によるWeb棋譜データベース",
}

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function EditGamePage({ params, searchParams }: PageProps) {
  const { id } = await params
  const game = await getGame(id)

  if (!game) notFound()

  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === "string" && value !== "") query.set(key, value)
  }
  const suffix = query.toString() ? `?${query.toString()}` : ""

  return (
    <EditForm
      id={game.id}
      initialValues={{
        sente_name: game.sente_name,
        sente_univ: game.sente_univ,
        sente_grade: game.sente_grade,
        gote_name: game.gote_name,
        gote_univ: game.gote_univ,
        gote_grade: game.gote_grade,
        event: game.event,
        date: toDateInputValue(game.date),
        result: game.result,
      }}
      initialKifu={game.kifu}
      backSuffix={suffix}
    />
  )
}
