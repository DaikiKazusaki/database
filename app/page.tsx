import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-10 py-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">将棋棋譜データベース</h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
          対局の棋譜を保存し、簡単に検索できるオンラインデータベース
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="min-w-[150px]">
          <Link href="/input">棋譜を入力する</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="min-w-[150px]">
          <Link href="/search">棋譜を検索する</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-16">
        <div className="flex flex-col items-center text-center p-6 border rounded-lg">
          <h3 className="text-xl font-bold mb-2">簡単入力</h3>
          <p className="text-gray-500">対局者情報と棋譜を簡単に入力して保存できます。</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 border rounded-lg">
          <h3 className="text-xl font-bold mb-2">高速検索</h3>
          <p className="text-gray-500">対局者名や大会名から素早く棋譜を検索できます。</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 border rounded-lg">
          <h3 className="text-xl font-bold mb-2">クラウド保存</h3>
          <p className="text-gray-500">Vercelのクラウドストレージに安全に保存されます。</p>
        </div>
      </div>
    </div>
  )
}
