"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"

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

export default function RecordDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [record, setRecord] = useState<GameRecord | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const id = params.id as string
        const response = await fetch(`/api/records/${id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "棋譜の取得に失敗しました")
        }

        setRecord(data.record)
      } catch (error) {
        console.error("Error fetching record:", error)
        toast({
          title: "エラー",
          description: "棋譜の取得に失敗しました。もう一度お試しください。",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRecord()
  }, [params.id])

  if (loading) {
    return <div className="container mx-auto py-10 px-4 text-center">読み込み中...</div>
  }

  if (!record) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">棋譜が見つかりませんでした</h1>
        <Button onClick={() => router.push("/search")}>検索ページに戻る</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="outline" className="mb-4" onClick={() => router.push("/search")}>
        ← 検索ページに戻る
      </Button>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{record.tournament}</CardTitle>
          <CardDescription>{record.date}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">先手</h3>
              <div>
                <Label className="font-medium">大学名:</Label>
                <div>{record.sente.university}</div>
              </div>
              <div>
                <Label className="font-medium">名前:</Label>
                <div>{record.sente.name}</div>
              </div>
              <div>
                <Label className="font-medium">学年:</Label>
                <div>{record.sente.year}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">後手</h3>
              <div>
                <Label className="font-medium">大学名:</Label>
                <div>{record.gote.university}</div>
              </div>
              <div>
                <Label className="font-medium">名前:</Label>
                <div>{record.gote.name}</div>
              </div>
              <div>
                <Label className="font-medium">学年:</Label>
                <div>{record.gote.year}</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">棋譜</h3>
            <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap font-mono text-sm">{record.record}</div>
          </div>
        </CardContent>

        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => router.push("/search")}>
            検索ページに戻る
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  )
}

