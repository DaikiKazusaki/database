import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const rawGames = await sql`
    SELECT
      id,
      sente_name, sente_univ, sente_grade,
      gote_name, gote_univ, gote_grade,
      event, date, result, kifu
    FROM games
    ORDER BY date DESC
  `;
  return NextResponse.json(rawGames);
}
