import { NextResponse } from 'next/server';
import { getSql } from '../../lib/db';

/**
 * 入力時の候補（氏名・大学名・大会名）を返す。
 * 表記ゆれを新たに増やさないための入力補助。
 */
export async function GET() {
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT 'name' AS kind, sente_name AS value, count(*) AS n FROM games WHERE deleted_at IS NULL GROUP BY 2
      UNION ALL
      SELECT 'name', gote_name, count(*) FROM games WHERE deleted_at IS NULL GROUP BY 2
      UNION ALL
      SELECT 'univ', sente_univ, count(*) FROM games WHERE deleted_at IS NULL GROUP BY 2
      UNION ALL
      SELECT 'univ', gote_univ, count(*) FROM games WHERE deleted_at IS NULL GROUP BY 2
      UNION ALL
      SELECT 'event', event, count(*) FROM games WHERE deleted_at IS NULL GROUP BY 2
    `;

    const counts = { name: new Map<string, number>(), univ: new Map<string, number>(), event: new Map<string, number>() };
    for (const row of rows as { kind: keyof typeof counts; value: string | null; n: string }[]) {
      if (!row.value) continue;
      const target = counts[row.kind];
      target.set(row.value, (target.get(row.value) ?? 0) + Number(row.n));
    }

    // よく使われている表記を先に並べる
    const sorted = (map: Map<string, number>) =>
      [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ja')).map(([value]) => value);

    return NextResponse.json({
      names: sorted(counts.name),
      universities: sorted(counts.univ),
      events: sorted(counts.event),
    });
  } catch (error) {
    console.error('入力候補の取得に失敗しました:', error);
    return NextResponse.json({ names: [], universities: [], events: [] }, { status: 500 });
  }
}
