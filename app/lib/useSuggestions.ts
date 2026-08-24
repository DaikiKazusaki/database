"use client"

import { useEffect, useState } from "react"

export type Suggestions = {
  names: string[]
  universities: string[]
  events: string[]
}

const EMPTY: Suggestions = { names: [], universities: [], events: [] }

/**
 * 既に登録されている氏名・大学名・大会名を入力候補として取得する。
 * 表記ゆれを新たに増やさないための入力補助なので、取得に失敗しても致命的ではない。
 */
export function useSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestions>(EMPTY)

  useEffect(() => {
    let active = true
    fetch("/api/suggestions")
      .then((res) => res.json())
      .then((data: Suggestions) => {
        if (active) setSuggestions(data)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  return suggestions
}
