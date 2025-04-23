import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(`${process.env.DATABASE_URL}`);

export async function POST(req: Request) {
  const { id } = await req.json();

  try {
    await sql`DELETE FROM games WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    // 型をチェックして message を取得
    const errorMessage =
      error instanceof Error ? error.message : '不明なエラーが発生しました';

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
