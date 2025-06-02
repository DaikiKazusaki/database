import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Ensure POSTGRES_URL is set in your environment variables
})

export const db = {
  query: (text: string, params: any[]) => pool.query(text, params),
}
