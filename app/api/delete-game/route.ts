import { NextResponse } from 'next/server';
import { getSql } from '../../lib/db';

export async function POST(request: Request) {
  const { id } = await request.json();
  const gameId = Number(id);

  if (!Number.isInteger(gameId)) {
    return NextResponse.json({ success: false, error: 'IDが不正です．' }, { status: 400 });
  }

  try {
    const sql = getSql();
    // 物理削除ではなく deleted_at を立てる（誤削除しても復元できるようにするため）
    const rows = await sql`
      UPDATE games
         SET deleted_at = now()
       WHERE id = ${gameId} AND deleted_at IS NULL
      RETURNING id
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: '棋譜が見つかりません．' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '不明なエラーが発生しました';
    console.error('棋譜の削除に失敗しました:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
