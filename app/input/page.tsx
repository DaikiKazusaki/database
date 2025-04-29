import { neon } from '@neondatabase/serverless';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "棋譜入力",
  description: "大阪大学将棋部によるWeb棋譜データベース",
};

export default function Page() {
  async function create(formData: FormData) {
    'use server';
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
  
    // コメントアウト（*#系）を削除
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
  }  

  return (
    <form action={create} className="p-6 max-w-3xl mx-auto space-y-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">棋譜入力フォーム</h1>

      {/* 先手欄 */}
      <div>
        <label className="block font-semibold mb-1">先手</label>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <input type="text" name="sente_name" required className="border p-2 w-full rounded" placeholder="氏名" />
          <input type="text" name="sente_univ" required className="border p-2 w-full rounded" placeholder="大学名" />
          <input type="text" name="sente_grade" required className="border p-2 w-full rounded" placeholder="学年" />
        </div>
      </div>

      {/* 後手欄 */}
      <div>
        <label className="block font-semibold mb-1">後手</label>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <input type="text" name="gote_name" required className="border p-2 w-full rounded" placeholder="氏名" />
          <input type="text" name="gote_univ" required className="border p-2 w-full rounded" placeholder="大学名" />
          <input type="text" name="gote_grade" required className="border p-2 w-full rounded" placeholder="学年" />
        </div>
      </div>

      {/* 大会名・対局日・結果 */}
      <div>
        <label className="block font-semibold mb-1">大会情報</label>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <input type="text" name="event" required className="border p-2 w-full rounded" />
          <input type="date" name="date" required className="border p-2 w-full rounded" />
          <select name="result" required className="border p-2 w-full rounded">
            <option value="">結果を選択</option>
            <option value="先手勝ち">先手勝ち</option>
            <option value="後手勝ち">後手勝ち</option>
            <option value="引き分け">千日手</option>
            <option value="先手宣言勝ち">先手宣言勝ち</option>
            <option value="後手宣言勝ち">後手宣言勝ち</option>
          </select>
        </div>
      </div>

      {/* 棋譜 */}
      <div>
        <label htmlFor="kifu" className="block font-semibold mb-1">棋譜</label>
        <textarea
          name="kifu"
          id="kifu"
          placeholder='KIF形式で棋譜を入力してください。(これ以外の形式で入力すると棋譜の再生ができなくなります。)'
          required
          className="border p-2 w-full h-40 rounded resize-none overflow-auto"
        ></textarea>
      </div>

      <div className="text-center">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          送信
        </button>
      </div>
    </form>
  );
}
