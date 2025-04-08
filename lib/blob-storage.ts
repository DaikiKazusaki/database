"use server"

import { put, list, del } from "@vercel/blob"
import type { GameRecord } from "./types"

// Save a game record to Vercel Blob
export async function saveGameRecord(gameRecord: Omit<GameRecord, "id" | "createdAt">) {
  const id = crypto.randomUUID()
  const createdAt = new Date().toISOString()

  const record: GameRecord = {
    ...gameRecord,
    id,
    createdAt,
  }

  const blob = await put(`kifu-${id}.json`, JSON.stringify(record), {
    access: "public", // 必須のプロパティ
    contentType: "application/json",
  })

  return { ...record, url: blob.url }
}

// Get all game records
export async function getAllGameRecords(): Promise<GameRecord[]> {
  const { blobs } = await list({ prefix: "kifu-" })

  const records: GameRecord[] = []

  for (const blob of blobs) {
    try {
      const response = await fetch(blob.url)
      const record = await response.json()
      records.push(record)
    } catch (error) {
      console.error(`Failed to fetch record: ${blob.url}`, error)
    }
  }

  // Sort by date, newest first
  return records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Delete a game record
export async function deleteGameRecord(id: string): Promise<boolean> {
  try {
    await del(`kifu-${id}.json`)
    return true
  } catch (error) {
    console.error(`Failed to delete record: ${id}`, error)
    return false
  }
}
