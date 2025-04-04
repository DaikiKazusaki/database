"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import PasswordProtection from "./password"

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
  id: string
}

export default function SearchPage() {
  const router = useRouter()
  const [records, setRecords] = useState<GameRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<GameRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<GameRecord | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem("shogiAuth")
    if (authStatus === "authenticated") {
      setIsAuthenticated(true)

      // Load records from localStorage
      const storedRecords = localStorage.getItem("shogiRecords")
      if (storedRecords) {
        const parsedRecords: GameRecord[] = JSON.parse(storedRecords)
        setRecords(parsedRecords)
        setFilteredRecords(parsedRecords)
      }
    }
  }, [])

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredRecords(records)
      return
    }

    const term = searchTerm.toLowerCase()
    const filtered = records.filter(
      (record) =>
        record.sente.university.toLowerCase().includes(term) ||
        record.sente.name.toLowerCase().includes(term) ||
        record.sente.year.toLowerCase().includes(term) ||
        record.gote.university.toLowerCase().includes(term) ||
        record.gote.name.toLowerCase().includes(term) ||
        record.gote.year.toLowerCase().includes(term) ||
        record.date.includes(term),
    )

    setFilteredRecords(filtered)
  }

  const handleDelete = (id: string) => {
    const updatedRecords = records.filter((record) => record.id !== id)
    setRecords(updatedRecords)
    setFilteredRecords(updatedRecords.filter((record) => filteredRecords.some((fr) => fr.id === record.id)))
    localStorage.setItem("shogiRecords", JSON.stringify(updatedRecords))
  }

  const handleAuthentication = () => {
    setIsAuthenticated(true)

    // Load records from localStorage
    const storedRecords = localStorage.getItem("shogiRecords")
    if (storedRecords) {
      const parsedRecords: GameRecord[] = JSON.parse(storedRecords)
      setRecords(parsedRecords)
      setFilteredRecords(parsedRecords)
    }
  }

  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={handleAuthentication} />
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">棋譜検索</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>検索</CardTitle>
          <CardDescription>大学名、選手名、学年、日付などで検索できます</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">
                検索
              </Label>
              <Input
                id="search"
                placeholder="検索キーワードを入力"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>検索</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">検索結果: {filteredRecords.length}件</h2>

        {filteredRecords.length === 0 ? (
          <p className="text-muted-foreground">棋譜が見つかりませんでした。</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecords.map((record) => (
              <Card key={record.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {record.sente.university} {record.sente.name} vs {record.gote.university} {record.gote.name}
                  </CardTitle>
                  <CardDescription>{record.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p>
                        <span className="font-semibold">先手:</span> {record.sente.university} {record.sente.name} (
                        {record.sente.year}年)
                      </p>
                      <p>
                        <span className="font-semibold">後手:</span> {record.gote.university} {record.gote.name} (
                        {record.gote.year}年)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" onClick={() => setSelectedRecord(record)}>
                            詳細
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>
                              {selectedRecord?.sente.university} {selectedRecord?.sente.name} vs{" "}
                              {selectedRecord?.gote.university} {selectedRecord?.gote.name}
                            </DialogTitle>
                            <DialogDescription>{selectedRecord?.date}</DialogDescription>
                          </DialogHeader>
                          <div className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-semibold">先手</h3>
                                <p>大学: {selectedRecord?.sente.university}</p>
                                <p>名前: {selectedRecord?.sente.name}</p>
                                <p>学年: {selectedRecord?.sente.year}年</p>
                              </div>
                              <div>
                                <h3 className="font-semibold">後手</h3>
                                <p>大学: {selectedRecord?.gote.university}</p>
                                <p>名前: {selectedRecord?.gote.name}</p>
                                <p>学年: {selectedRecord?.gote.year}年</p>
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold">棋譜</h3>
                              <pre className="mt-2 p-4 bg-muted rounded-md overflow-auto whitespace-pre-wrap">
                                {selectedRecord?.record}
                              </pre>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="destructive" onClick={() => handleDelete(record.id)}>
                        削除
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

