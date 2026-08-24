import { neon } from '@neondatabase/serverless';
import { parseKifu } from '../../lib/parseKifu';

const REQUIRED_FIELDS = {
  sente_name: '先手の氏名',
  sente_univ: '先手の大学名',
  sente_grade: '先手の学年',
  gote_name: '後手の氏名',
  gote_univ: '後手の大学名',
  gote_grade: '後手の学年',
  event: '大会名',
  date: '対局日',
  result: '結果',
} as const;

type RequiredField = keyof typeof REQUIRED_FIELDS;

function textResponse(body: string, status: number) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const kifuRaw = formData.get('kifu');

  if (typeof kifuRaw !== 'string' || !kifuRaw.trim()) {
    return textResponse('棋譜が入力されていません．', 400);
  }

  const kifu = kifuRaw
    .split("\n")
    .filter(line => !line.trim().startsWith("*#"))
    .join("\n");

  // フォームで空のまま送られた項目は棋譜から補完する
  const parsed = parseKifu(kifu);
  const values = {} as Record<RequiredField, string>;
  for (const field of Object.keys(REQUIRED_FIELDS) as RequiredField[]) {
    const input = formData.get(field);
    const trimmed = typeof input === 'string' ? input.trim() : '';
    values[field] = trimmed || parsed[field];
  }

  const missing = (Object.keys(REQUIRED_FIELDS) as RequiredField[]).filter(
    field => !values[field]
  );
  if (missing.length > 0) {
    const labels = missing.map(field => REQUIRED_FIELDS[field]).join('・');
    return textResponse(`次の項目が入力されていません：${labels}`, 400);
  }

  const sql = neon(`${process.env.DATABASE_URL}`);

  await sql`
    INSERT INTO games (
      sente_name, sente_univ, sente_grade,
      gote_name, gote_univ, gote_grade,
      event, date, result, kifu
    )
    VALUES (  
      ${values.sente_name}, ${values.sente_univ}, ${values.sente_grade},
      ${values.gote_name}, ${values.gote_univ}, ${values.gote_grade},
      ${values.event}, ${values.date}, ${values.result}, ${kifu}
    )
  `;

  return textResponse('OK', 200);
}
