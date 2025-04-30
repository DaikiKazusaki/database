import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  const formData = await request.formData();

  const sql = neon(`${process.env.DATABASE_URL}`);
  const sente_name = formData.get('sente_name');
  const sente_univ = formData.get('sente_univ');
  const sente_grade = formData.get('sente_grade');
  const gote_name = formData.get('gote_name');
  const gote_univ = formData.get('gote_univ');
  const gote_grade = formData.get('gote_grade');
  const event = formData.get('event');
  const date = formData.get('date');
  const result = formData.get('result');
  const kifuRaw = formData.get('kifu') as string;

  const kifu = kifuRaw
    .split("\n")
    .filter(line => !line.trim().startsWith("*#"))
    .join("\n");

  await sql`
    INSERT INTO games (
      sente_name, sente_univ, sente_grade,
      gote_name, gote_univ, gote_grade,
      event, date, result, kifu
    )
    VALUES (  
      ${sente_name}, ${sente_univ}, ${sente_grade},
      ${gote_name}, ${gote_univ}, ${gote_grade},
      ${event}, ${date}, ${result}, ${kifu}
    )
  `;

  return new Response("OK", { status: 200 });
}
