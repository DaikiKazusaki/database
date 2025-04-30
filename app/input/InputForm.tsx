"use client";

import { useState, useEffect } from "react";

export default function InputForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({
    sente_name: "",
    sente_univ: "",
    sente_grade: "",
    gote_name: "",
    gote_univ: "",
    gote_grade: "",
    event: "",
    date: "",
    result: "",
    kifu: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    for (const [key, value] of Object.entries(formValues)) {
      formData.append(key, value);
    }

    const response = await fetch("/api/submit-kifu", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setSubmitted(true);
      setFormValues({
        sente_name: "",
        sente_univ: "",
        sente_grade: "",
        gote_name: "",
        gote_univ: "",
        gote_grade: "",
        event: "",
        date: "",
        result: "",
        kifu: "",
      });
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
          <input type="text" name="sente_name" required value={formValues.sente_name} onChange={handleChange} className="border p-2 w-full rounded" placeholder="氏名" />
          <input type="text" name="sente_univ" required value={formValues.sente_univ} onChange={handleChange} className="border p-2 w-full rounded" placeholder="大学名" />
          <select name="sente_grade" required value={formValues.sente_grade} onChange={handleChange} className="border p-2 w-full rounded">
            <option value="">学年を選択</option>
            {[...Array(6)].map((_, i) => (
              <option key={i + 1} value={`${i + 1}`}>{i + 1}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 後手欄 */}
      <div>
        <label className="block font-semibold mb-1">後手</label>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <input type="text" name="gote_name" required value={formValues.gote_name} onChange={handleChange} className="border p-2 w-full rounded" placeholder="氏名" />
          <input type="text" name="gote_univ" required value={formValues.gote_univ} onChange={handleChange} className="border p-2 w-full rounded" placeholder="大学名" />
          <select name="gote_grade" required value={formValues.gote_grade} onChange={handleChange} className="border p-2 w-full rounded">
            <option value="">学年を選択</option>
            {[...Array(6)].map((_, i) => (
              <option key={i + 1} value={`${i + 1}`}>{i + 1}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 大会情報 */}
      <div>
        <label className="block font-semibold mb-1">大会情報</label>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <input type="text" name="event" required value={formValues.event} onChange={handleChange} className="border p-2 w-full rounded" placeholder="大会名" />
          <input type="date" name="date" required value={formValues.date} onChange={handleChange} className="border p-2 w-full rounded" />
          <select name="result" required value={formValues.result} onChange={handleChange} className="border p-2 w-full rounded">
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
          value={formValues.kifu}
          onChange={handleChange}
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
