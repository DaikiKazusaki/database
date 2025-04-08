"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { saveGameRecord } from "@/lib/blob-storage"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  sente: z.object({
    name: z.string().min(1, { message: "先手の名前を入力してください" }),
    university: z.string().min(1, { message: "先手の大学を入力してください" }),
    grade: z.string().min(1, { message: "先手の学年を入力してください" }),
  }),
  gote: z.object({
    name: z.string().min(1, { message: "後手の名前を入力してください" }),
    university: z.string().min(1, { message: "後手の大学を入力してください" }),
    grade: z.string().min(1, { message: "後手の学年を入力してください" }),
  }),
  tournament: z.string().min(1, { message: "大会名を入力してください" }),
  date: z.string().min(1, { message: "対局日を入力してください" }),
  result: z.enum(["先手勝ち", "後手勝ち", "千日手", "持将棋", "中断"] as const),
  kifu: z.string().min(1, { message: "棋譜を入力してください" }),
})

export default function InputPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sente: { name: "", university: "", grade: "" },
      gote: { name: "", university: "", grade: "" },
      tournament: "",
      date: new Date().toISOString().split("T")[0],
      result: "先手勝ち",
      kifu: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      await saveGameRecord(values)
      toast({
        title: "保存完了",
        description: "棋譜が正常に保存されました",
      })
      form.reset()
      router.refresh()
    } catch (error) {
      console.error("Failed to save game record:", error)
      toast({
        title: "エラー",
        description: "棋譜の保存に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>棋譜入力</CardTitle>
          <CardDescription>対局情報と棋譜を入力してください</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 先手情報 */}
                <div className="space-y-4">
                  <h3 className="font-medium">先手</h3>
                  <FormField
                    control={form.control}
                    name="sente.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>名前</FormLabel>
                        <FormControl>
                          <Input placeholder="例: 佐藤太郎" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sente.university"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>大学</FormLabel>
                        <FormControl>
                          <Input placeholder="例: 東京大学" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sente.grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>学年</FormLabel>
                        <FormControl>
                          <Input placeholder="例: 3年" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* 後手情報 */}
                <div className="space-y-4">
                  <h3 className="font-medium">後手</h3>
                  <FormField
                    control={form.control}
                    name="gote.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>名前</FormLabel>
                        <FormControl>
                          <Input placeholder="例: 鈴木次郎" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gote.university"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>大学</FormLabel>
                        <FormControl>
                          <Input placeholder="例: 京都大学" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gote.grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>学年</FormLabel>
                        <FormControl>
                          <Input placeholder="例: 2年" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* 対局情報 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="tournament"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>大会名</FormLabel>
                      <FormControl>
                        <Input placeholder="例: 全日本大学対抗戦" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>対局日</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="result"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>勝敗</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="勝敗を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="先手勝ち">先手勝ち</SelectItem>
                        <SelectItem value="後手勝ち">後手勝ち</SelectItem>
                        <SelectItem value="千日手">千日手</SelectItem>
                        <SelectItem value="持将棋">持将棋</SelectItem>
                        <SelectItem value="中断">中断</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kifu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>棋譜</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="例: ▲７六歩 △３四歩 ▲２六歩 △８四歩..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "保存中..." : "棋譜を保存"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
