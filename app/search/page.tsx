import { neon } from '@neondatabase/serverless';

type Game = {
  id: number;
  sente_name: string;
  sente_univ: string;
  sente_grade: string;
  gote_name: string;
  gote_univ: string;
  gote_grade: string;
  event: string;
  date: string;
  result: string;
  kifu: string;
};

export default async function SearchPage() {
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
  const games: Game[] = rawGames.map(row => row as Game);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">棋譜一覧</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">対局日</th>
              <th className="border px-3 py-2 text-left">大会名</th>
              <th className="border px-3 py-2 text-left">先手</th>
              <th className="border px-3 py-2 text-left">後手</th>
              <th className="border px-3 py-2 text-left">結果</th>
              <th className="border px-3 py-2 text-left">棋譜</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game: Game) => (
              <tr key={game.id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">
                  {new Date(game.date).toLocaleDateString('ja-JP')}
                </td>
                <td className="border px-3 py-2">{game.event}</td>
                <td className="border px-3 py-2">
                  {game.sente_name}（{game.sente_univ}・{game.sente_grade}）
                </td>
                <td className="border px-3 py-2">
                  {game.gote_name}（{game.gote_univ}・{game.gote_grade}）
                </td>
                <td className="border px-3 py-2">{game.result}</td>
                <td className="border px-3 py-2 whitespace-pre-wrap break-words max-w-xs">
                  {game.kifu}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}