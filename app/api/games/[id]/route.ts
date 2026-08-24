import { NextResponse } from 'next/server';
import { getSql } from '../../../lib/db';

// 棋譜本文が必要なとき（コピーなど）に1件だけ取得する
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const gameId = Number(id);
  if (!Number.isInteger(gameId)) {
    return NextResponse.json({ error: 'IDが不正です．' }, { status: 400 });
  }

  try {
    const sql = getSql();
    const rows = await sql`
      SELECT id,
             sente_name, sente_univ, sente_grade,
             gote_name, gote_univ, gote_grade,
             event, date, result, kifu
        FROM games
       WHERE id = ${gameId} AND deleted_at IS NULL
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: '棋譜が見つかりません．' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('棋譜の取得に失敗しました:', error);
    return NextResponse.json({ error: '棋譜の取得に失敗しました．' }, { status: 500 });
  }
}
