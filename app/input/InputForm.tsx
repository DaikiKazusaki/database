"use client";

import { useState, useEffect } from "react";

export default function InputForm() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const response = await fetch("/api/submit-kifu", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setSubmitted(true);
      e.currentTarget.reset();
    }
  }

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-3xl mx-auto space-y-6 bg-white rounded shadow-md"
    >
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
          <input type="text" name="event" required className="border p-2 w-full rounded" placeholder="大会名" />
          <input type="date" name="date" required className="border p-2 w-full rounded" placeholder="日付" />
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
          placeholder="KIF形式で棋譜を入力してください。(これ以外の形式で入力すると棋譜の再生ができなくなります。)"
          required
          className="border p-2 w-full h-40 rounded resize-none overflow-auto"
        ></textarea>
      </div>

      <div className="text-center">
        {submitted && (
          <p className="text-green-600 font-semibold mb-2">送信完了！</p>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          送信
        </button>
      </div>
    </form>
  );
}
