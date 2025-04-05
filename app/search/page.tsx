"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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

export default function SearchPage() {
  const [records, setRecords] = useState<GameRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<GameRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch("/api/records")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "棋譜の取得に失敗しました")
        }

        setRecords(data.records)
        setFilteredRecords(data.records)
      } catch (error) {
        console.error("Error fetching records:", error)
        toast({
          title: "エラー",
          description: "棋譜の取得に失敗しました。もう一度お試しください。",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRecords()
  }, [])

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredRecords(records)
      return
    }

    const term = searchTerm.toLowerCase()
    const filtered = records.filter(
      (record) =>
        record.sente.name.toLowerCase().includes(term) ||
        record.sente.university.toLowerCase().includes(term) ||
        record.gote.name.toLowerCase().includes(term) ||
        record.gote.university.toLowerCase().includes(term) ||
        record.tournament.toLowerCase().includes(term) ||
        record.date.includes(term),
    )

    setFilteredRecords(filtered)
  }

  const viewRecord = (id: string) => {
    window.location.href = `/record/${id}`
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">棋譜検索</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>検索</CardTitle>
          <CardDescription>名前、大学名、大会名、日付などで検索できます</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="検索キーワードを入力"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                // Enterキーでの自動検索を削除
              />
            </div>
            <Button onClick={handleSearch}>検索</Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-10">読み込み中...</div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-10">棋譜が見つかりませんでした</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{record.tournament}</CardTitle>
                <CardDescription>{record.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Label className="font-semibold">先手:</Label>
                    <div>
                      {record.sente.university} {record.sente.name} ({record.sente.year})
                    </div>
                  </div>
                  <div>
                    <Label className="font-semibold">後手:</Label>
                    <div>
                      {record.gote.university} {record.gote.name} ({record.gote.year})
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => viewRecord(record.id)}>
                  詳細を見る
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <Toaster />
    </div>
  )
}

