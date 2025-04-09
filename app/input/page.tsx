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
    name: z.string(),
    university: z.string(),
    grade: z.string(),
  }),
  gote: z.object({
    name: z.string(),
    university: z.string(),
    grade: z.string(),
  }),
  tournament: z.string(),
  date: z.string(),
  result: z.enum(["先手勝ち", "後手勝ち", "千日手", "持将棋", "中断"] as const),
  kifu: z.string(),
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
    <div className="max-w-3xl mx-auto p-4 bg-gray-100 min-h-screen">
      <Card className="bg-white shadow-md">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle>棋譜入力</CardTitle>
          <CardDescription>対局情報と棋譜を入力してください</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* 先手情報 - 横並び */}
              <div className="space-y-2">
                <h3 className="font-medium">先手</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="sente.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>名前</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* 後手情報 - 横並び */}
              <div className="space-y-2">
                <h3 className="font-medium">後手</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="gote.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>名前</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* 対局情報 - 横並び1行 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="tournament"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>大会名</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                <FormField
                  control={form.control}
                  name="result"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>勝敗</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
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
              </div>

              <FormField
                control={form.control}
                name="kifu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>棋譜</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[200px]" {...field} />
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
