import { NextResponse } from "next/server"
import { db } from "@/app/lib/db" // Adjust this import based on your database setup

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Fetch the specific game by ID
    const game = await db.query("SELECT * FROM games WHERE id = $1", [id])

    if (!game || game.length === 0) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    return NextResponse.json(game[0])
  } catch (error) {
    console.error("Error fetching game:", error)
    return NextResponse.json({ error: "Failed to fetch game" }, { status: 500 })
  }
}
