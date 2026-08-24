"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import GameFormFields from "../../../components/GameFormFields"
import { useSuggestions } from "../../../lib/useSuggestions"
import type { GameValues } from "../../../lib/gameValidation"

type Props = {
  id: number
  initialValues: GameValues
  initialKifu: string
  backSuffix: string
}

export default function EditForm({ id, initialValues, initialKifu, backSuffix }: Props) {
  const router = useRouter()
  const suggestions = useSuggestions()
  const [values, setValues] = useState<GameValues>(initialValues)
  const [kifu, setKifu] = useState(initialKifu)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSaving(true)

    const formData = new FormData()
    formData.append("id", String(id))
    for (const [key, value] of Object.entries(values)) {
      formData.append(key, value)
    }
    formData.append("kifu", kifu)

    try {
      const response = await fetch("/api/update-game", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        router.push(`/search/${id}${backSuffix}`)
        router.refresh()
      } else {
        setError(await response.text())
      }
    } catch {
      setError("保存に失敗しました．通信環境を確認してください．")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Link
        href={`/search/${id}${backSuffix}`}
        className="inline-flex items-center gap-1 text-blue-700 hover:underline mb-2"
      >
        <ArrowLeft size={18} />
        棋譜に戻る
      </Link>

      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-6 bg-white rounded shadow-md text-gray-900"
      >
        <h1 className="text-2xl font-bold text-center mb-4">棋譜の編集</h1>

        <GameFormFields
          values={values}
          onChange={handleChange}
          suggestions={suggestions}
        />

        <div>
          <label htmlFor="kifu" className="block font-semibold mb-1">棋譜</label>
          <textarea
            name="kifu"
            id="kifu"
            required
            value={kifu}
            onChange={(e) => setKifu(e.target.value)}
            className="border p-2 w-full h-56 rounded resize-y overflow-auto font-mono text-sm"
          ></textarea>
        </div>

        <div className="text-center">
          {error && (
            <p className="text-red-600 font-semibold mb-2 whitespace-pre-line">{error}</p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
          >
            {saving ? "保存中..." : "保存"}
          </button>
        </div>
      </form>
    </div>
  )
}
