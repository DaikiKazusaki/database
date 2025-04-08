"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { GameRecord } from "@/lib/types"
import { getAllGameRecords, deleteGameRecord } from "@/lib/blob-storage"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Search, Copy, Trash2, Eye } from "lucide-react"

export default function SearchPage() {
  const [records, setRecords] = useState<GameRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<GameRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState<GameRecord | null>(null)

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getAllGameRecords()
        setRecords(data)
        setFilteredRecords(data)
      } catch (error) {
        console.error("Failed to fetch records:", error)
        toast({
          title: "エラー",
          description: "棋譜の取得に失敗しました",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecords()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRecords(records)
      return
    }

    const term = searchTerm.toLowerCase()
    const filtered = records.filter(
      (record) =>
        record.sente.name.toLowerCase().includes(term) ||
        record.gote.name.toLowerCase().includes(term) ||
        record.tournament.toLowerCase().includes(term) ||
        record.sente.university.toLowerCase().includes(term) ||
        record.gote.university.toLowerCase().includes(term),
    )

    setFilteredRecords(filtered)
  }, [searchTerm, records])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already handled by the useEffect
  }

  const handleCopyKifu = (kifu: string) => {
    navigator.clipboard.writeText(kifu)
    toast({
      title: "コピー完了",
      description: "棋譜をクリップボードにコピーしました",
    })
  }

  const handleDeleteRecord = async (id: string) => {
    if (!confirm("この棋譜を削除してもよろしいですか？")) {
      return
    }

    try {
      setIsLoading(true)
      const success = await deleteGameRecord(id)

      if (success) {
        setRecords((prev) => prev.filter((record) => record.id !== id))
        toast({
          title: "削除完了",
          description: "棋譜が正常に削除されました",
        })
      } else {
        throw new Error("Failed to delete record")
      }
    } catch (error) {
      console.error("Failed to delete record:", error)
      toast({
        title: "エラー",
        description: "棋譜の削除に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>棋譜検索</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <Input
              placeholder="対局者名、大学、大会名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              検索
            </Button>
          </form>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm ? "検索結果が見つかりませんでした" : "棋譜が登録されていません"}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <Card key={record.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{record.tournament}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{formatDate(record.date)}</p>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium">先手</p>
                            <p>{record.sente.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {record.sente.university} {record.sente.grade}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">後手</p>
                            <p>{record.gote.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {record.gote.university} {record.gote.grade}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between">
                        <div>
                          <p className="font-medium">結果</p>
                          <p className="text-lg">{record.result}</p>
                        </div>

                        <div className="flex gap-2 mt-4 justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedRecord(record)}>
                                <Eye className="h-4 w-4 mr-2" />
                                詳細
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>棋譜詳細</DialogTitle>
                              </DialogHeader>
                              {selectedRecord && (
                                <div className="mt-4 space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h3 className="font-semibold">{selectedRecord.tournament}</h3>
                                      <p className="text-sm text-muted-foreground">{formatDate(selectedRecord.date)}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold">{selectedRecord.result}</p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4 py-2 border-t border-b">
                                    <div>
                                      <p className="font-medium">先手</p>
                                      <p>{selectedRecord.sente.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedRecord.sente.university} {selectedRecord.sente.grade}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="font-medium">後手</p>
                                      <p>{selectedRecord.gote.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedRecord.gote.university} {selectedRecord.gote.grade}
                                      </p>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-medium mb-2">棋譜</h4>
                                    <pre className="bg-muted p-4 rounded-md overflow-auto whitespace-pre-wrap">
                                      {selectedRecord.kifu}
                                    </pre>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button variant="outline" size="sm" onClick={() => handleCopyKifu(record.kifu)}>
                            <Copy className="h-4 w-4 mr-2" />
                            コピー
                          </Button>

                          <Button variant="outline" size="sm" onClick={() => handleDeleteRecord(record.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            削除
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
