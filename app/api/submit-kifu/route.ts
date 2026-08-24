import { getSql } from '../../lib/db';
import { parseKifu } from '../../lib/parseKifu';
import {
  GAME_FIELDS,
  cleanKifu,
  readGameValues,
  validateGame,
} from '../../lib/gameValidation';

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

  const kifu = cleanKifu(kifuRaw);

  // フォームで空のまま送られた項目は棋譜から補完する
  const parsed = parseKifu(kifu);
  const values = readGameValues(formData);
  for (const field of GAME_FIELDS) {
    if (!values[field]) values[field] = parsed[field];
  }

  const errors = validateGame(values, kifu);
  if (errors.length > 0) {
    return textResponse(errors.join('\n'), 400);
  }

  try {
    const sql = getSql();

    // 同じ棋譜の二重登録を防ぐ
    const duplicated = await sql`
      SELECT id FROM games WHERE md5(kifu) = md5(${kifu}) AND deleted_at IS NULL LIMIT 1
    `;
    if (duplicated.length > 0) {
      return textResponse(
        `同じ棋譜が既に登録されています（ID: ${duplicated[0].id}）．`,
        409
      );
    }

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
  } catch (error) {
    console.error('棋譜の登録に失敗しました:', error);
    return textResponse('棋譜の登録に失敗しました．', 500);
  }
}
