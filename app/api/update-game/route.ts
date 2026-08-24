import { getSql } from '../../lib/db';
import { cleanKifu, readGameValues, validateGame } from '../../lib/gameValidation';

function textResponse(body: string, status: number) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const gameId = Number(formData.get('id'));
  const kifuRaw = formData.get('kifu');

  if (!Number.isInteger(gameId)) {
    return textResponse('IDが不正です．', 400);
  }
  if (typeof kifuRaw !== 'string') {
    return textResponse('棋譜が入力されていません．', 400);
  }

  const kifu = cleanKifu(kifuRaw);
  const values = readGameValues(formData);

  const errors = validateGame(values, kifu);
  if (errors.length > 0) {
    return textResponse(errors.join('\n'), 400);
  }

  try {
    const sql = getSql();

    // 自分以外に同じ棋譜が無いか確認する
    const duplicated = await sql`
      SELECT id FROM games
       WHERE md5(kifu) = md5(${kifu}) AND deleted_at IS NULL AND id <> ${gameId}
       LIMIT 1
    `;
    if (duplicated.length > 0) {
      return textResponse(
        `同じ棋譜が既に登録されています（ID: ${duplicated[0].id}）．`,
        409
      );
    }

    const rows = await sql`
      UPDATE games
         SET sente_name = ${values.sente_name},
             sente_univ = ${values.sente_univ},
             sente_grade = ${values.sente_grade},
             gote_name = ${values.gote_name},
             gote_univ = ${values.gote_univ},
             gote_grade = ${values.gote_grade},
             event = ${values.event},
             date = ${values.date},
             result = ${values.result},
             kifu = ${kifu}
       WHERE id = ${gameId} AND deleted_at IS NULL
      RETURNING id
    `;

    if (rows.length === 0) {
      return textResponse('棋譜が見つかりません．', 404);
    }

    return textResponse('OK', 200);
  } catch (error) {
    console.error('棋譜の更新に失敗しました:', error);
    return textResponse('棋譜の更新に失敗しました．', 500);
  }
}
