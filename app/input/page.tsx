"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface PlayerInfo {
  university: string
  name: string
  year: string
}

interface GameRecord {
  sente: PlayerInfo
  gote: PlayerInfo
  record: string
  date: string
  tournament: string
  id: string
}

export default function InputPage() {
  const router = useRouter()
  const [sente, setSente] = useState<PlayerInfo>({ university: "", name: "", year: "" })
  const [gote, setGote] = useState<PlayerInfo>({ university: "", name: "", year: "" })
  const [record, setRecord] = useState("")
  const [date, setDate] = useState("")
  const [tournament, setTournament] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // バリデーション
    if (
      !sente.university ||
      !sente.name ||
      !sente.year ||
      !gote.university ||
      !gote.name ||
      !gote.year ||
      !record ||
      !date ||
      !tournament
    ) {
      toast({
        title: "入力エラー",
        description: "すべての項目を入力してください",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // ユニークIDの作成
    const id = `${date}_${tournament}_${sente.university}_${sente.name}_vs_${gote.university}_${gote.name}`

    // 棋譜オブジェクトの作成
    const gameRecord: GameRecord = {
      sente,
      gote,
      record,
      date,
      tournament,
      id,
    }

    try {
      // APIを使用して棋譜を保存
      const response = await fetch("/api/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameRecord),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "棋譜の保存に失敗しました")
      }

      toast({
        title: "保存完了",
        description: "棋譜が正常に保存されました",
      })

      // フォームのリセット
      setSente({ university: "", name: "", year: "" })
      setGote({ university: "", name: "", year: "" })
      setRecord("")
      setDate("")
      setTournament("")

      // 検索ページへリダイレクト
      setTimeout(() => {
        router.push("/search")
      }, 1500)
    } catch (error) {
      console.error("Error saving record:", error)
      toast({
        title: "エラー",
        description: "棋譜の保存に失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">棋譜入力</h1>

      <Card className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>対局情報入力</CardTitle>
            <CardDescription>対局者の情報と棋譜を入力してください</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">先手</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sente-university">大学名</Label>
                  <Input
                    id="sente-university"
                    value={sente.university}
                    onChange={(e) => setSente({ ...sente, university: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sente-name">名前</Label>
                  <Input
                    id="sente-name"
                    value={sente.name}
                    onChange={(e) => setSente({ ...sente, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sente-year">学年</Label>
                  <Input
                    id="sente-year"
                    value={sente.year}
                    onChange={(e) => setSente({ ...sente, year: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">後手</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gote-university">大学名</Label>
                  <Input
                    id="gote-university"
                    value={gote.university}
                    onChange={(e) => setGote({ ...gote, university: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gote-name">名前</Label>
                  <Input
                    id="gote-name"
                    value={gote.name}
                    onChange={(e) => setGote({ ...gote, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gote-year">学年</Label>
                  <Input
                    id="gote-year"
                    value={gote.year}
                    onChange={(e) => setGote({ ...gote, year: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tournament">大会名</Label>
                <Input id="tournament" value={tournament} onChange={(e) => setTournament(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">対局日</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="record">棋譜</Label>
              <Textarea
                id="record"
                placeholder="ここに棋譜を入力してください"
                className="min-h-[200px]"
                value={record}
                onChange={(e) => setRecord(e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "保存中..." : "棋譜を保存"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Toaster />
    </div>
  )
}

