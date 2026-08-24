import { NextResponse } from 'next/server';
import { getSql } from '../../lib/db';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

// 「大阪」と「大阪大学」を同じものとして扱うため、比較前に「大学」を落とす
const HAYSTACK = `replace(concat_ws(' ',
  sente_name, sente_univ, sente_grade,
  gote_name, gote_univ, gote_grade,
  event, result), '大学', '')`;

const WHERE = `
  WHERE deleted_at IS NULL
    AND ($1::date IS NULL OR date >= $1::date)
    AND ($2::date IS NULL OR date <= $2::date)
    AND ($3 = '' OR ${HAYSTACK} ILIKE $4)
`;

function toDate(value: string | null) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

function toPattern(query: string) {
  // ILIKE のワイルドカードをエスケープしてから部分一致にする
  const escaped = query.replace(/[\\%_]/g, (char) => `\\${char}`);
  return `%${escaped.replace(/大学/g, '')}%`;
}

function toNumber(value: string | null, fallback: number) {
  // Number(null) や Number('') は 0 になるため、未指定は明示的に既定値へ倒す
  if (value === null || value.trim() === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') ?? '').trim();
  const limit = Math.min(MAX_LIMIT, Math.max(1, toNumber(searchParams.get('limit'), DEFAULT_LIMIT)));
  const offset = Math.max(0, toNumber(searchParams.get('offset'), 0));

  const filters = [
    toDate(searchParams.get('from')),
    toDate(searchParams.get('to')),
    query,
    toPattern(query),
  ];

  try {
    const sql = getSql();
    // 一覧では棋譜本文を返さない（1件あたり数KBあり、件数が増えると重くなるため）
    const games = await sql.query(
      `SELECT id,
              sente_name, sente_univ, sente_grade,
              gote_name, gote_univ, gote_grade,
              event, date, result
         FROM games
         ${WHERE}
        ORDER BY date DESC, id DESC
        LIMIT $5 OFFSET $6`,
      [...filters, limit, offset]
    );
    const totals = await sql.query(
      `SELECT count(*)::int AS total FROM games ${WHERE}`,
      filters
    );

    return NextResponse.json({
      games,
      total: totals[0].total as number,
      limit,
      offset,
    });
  } catch (error) {
    console.error('棋譜一覧の取得に失敗しました:', error);
    return NextResponse.json(
      { error: '棋譜一覧の取得に失敗しました．' },
      { status: 500 }
    );
  }
}
