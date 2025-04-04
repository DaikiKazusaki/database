import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-10">将棋棋譜データベース</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>棋譜入力</CardTitle>
            <CardDescription>新しい棋譜を入力して保存します</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">対局者の情報と棋譜を入力して、データベースに保存します。</p>
            <Link href="/input">
              <Button className="w-full">棋譜入力へ</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>棋譜検索</CardTitle>
            <CardDescription>保存された棋譜を検索します</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">大学名、選手名、学年などで棋譜を検索できます。</p>
            <Link href="/search">
              <Button className="w-full">棋譜検索へ</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

