"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PasswordProtectionProps {
  onAuthenticated: () => void
}

export default function PasswordProtection({ onAuthenticated }: PasswordProtectionProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

  const correctPassword = "UOsaka-shogi"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password === correctPassword) {
      // Set authentication in localStorage
      localStorage.setItem("shogiAuth", "authenticated")
      // Call the callback
      onAuthenticated()
    } else {
      setError(true)
      setPassword("")
    }
  }

  return (
    <div className="container mx-auto py-20 px-4 flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">パスワード保護</CardTitle>
          <CardDescription className="text-center">
            棋譜検索ページにアクセスするにはパスワードを入力してください
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>パスワードが正しくありません。もう一度お試しください。</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(false)
                }}
                placeholder="パスワードを入力"
                autoComplete="off"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              アクセス
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

