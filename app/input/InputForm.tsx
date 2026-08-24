"use client";

import { useState, useEffect } from "react";
import { parseKifu, type ParsedKifu } from "../lib/parseKifu";

// 棋譜から自動入力する項目
const DERIVED_FIELDS = [
  "sente_name",
  "sente_univ",
  "sente_grade",
  "gote_name",
  "gote_univ",
  "gote_grade",
  "event",
  "date",
  "result",
] as const;

type DerivedField = (typeof DERIVED_FIELDS)[number];

const FIELD_LABELS: Record<DerivedField, string> = {
  sente_name: "先手の氏名",
  sente_univ: "先手の大学名",
  sente_grade: "先手の学年",
  gote_name: "後手の氏名",
  gote_univ: "後手の大学名",
  gote_grade: "後手の学年",
  event: "大会名",
  date: "対局日",
  result: "結果",
};

const EMPTY_FORM = {
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
};

// 自動入力された項目は色を変えて見分けられるようにする
function fieldClass(isAutoFilled: boolean) {
  return `border p-2 w-full rounded ${
    isAutoFilled ? "border-blue-400 bg-blue-50" : ""
  }`;
}

export default function InputForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [autoFilled, setAutoFilled] = useState<DerivedField[]>([]);
  const [missing, setMissing] = useState<DerivedField[]>([]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    // 手入力した項目は自動入力の表示から外す
    setAutoFilled((prev) => prev.filter((field) => field !== name));
    setMissing((prev) => prev.filter((field) => field !== name));
  }

  // 棋譜が入力されたらヘッダーを解析して各項目を埋める
  function handleKifuChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const kifu = e.target.value;
    const parsed: ParsedKifu = parseKifu(kifu);

    setFormValues((prev) => {
      const next = { ...prev, kifu };
      for (const field of DERIVED_FIELDS) {
        if (parsed[field]) next[field] = parsed[field];
      }
      return next;
    });

    if (!kifu.trim()) {
      setAutoFilled([]);
      setMissing([]);
      return;
    }
    setAutoFilled(DERIVED_FIELDS.filter((field) => parsed[field]));
    setMissing(DERIVED_FIELDS.filter((field) => !parsed[field]));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

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
      setFormValues(EMPTY_FORM);
      setAutoFilled([]);
      setMissing([]);
    } else {
      setError(await response.text());
    }
  }

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const isAuto = (field: DerivedField) => autoFilled.includes(field);

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-3xl mx-auto space-y-6 bg-white rounded shadow-md"
    >
      <h1 className="text-2xl font-bold text-center mb-4">棋譜入力フォーム</h1>

      {/* 棋譜 */}
      <div>
        <label htmlFor="kifu" className="block font-semibold mb-1">棋譜</label>
        <textarea
          name="kifu"
          id="kifu"
          placeholder="KIF形式の棋譜を貼り付けてください。(これ以外の形式で入力すると棋譜の再生ができなくなります。)"
          required
          value={formValues.kifu}
          onChange={handleKifuChange}
          className="border p-2 w-full h-56 rounded resize-y overflow-auto font-mono text-sm"
        ></textarea>
        <p className="text-sm text-gray-600 mt-1">
          棋譜を貼り付けると、氏名・大学名・学年・大会名・対局日・結果を自動で読み取ります。
        </p>
      </div>

      {/* 解析結果の案内 */}
      {autoFilled.length > 0 && (
        <div className="rounded border border-blue-300 bg-blue-50 p-3 text-sm space-y-1">
          <p className="text-blue-800 font-semibold">
            棋譜から{autoFilled.length}項目を自動入力しました．内容を確認してください．
          </p>
          {missing.length > 0 && (
            <p className="text-blue-900">
              読み取れなかった項目：{missing.map((field) => FIELD_LABELS[field]).join("・")}
            </p>
          )}
          {isAuto("date") && (
            <p className="text-blue-900">
              対局日は棋譜の開始日時から取得しています．棋譜を後から入力した場合は実際の対局日に修正してください．
            </p>
          )}
        </div>
      )}

      {/* 先手欄 */}
      <div>
        <label className="block font-semibold mb-1">先手</label>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <input type="text" name="sente_name" required value={formValues.sente_name} onChange={handleChange} className={fieldClass(isAuto("sente_name"))} placeholder="氏名" />
          <input type="text" name="sente_univ" required value={formValues.sente_univ} onChange={handleChange} className={fieldClass(isAuto("sente_univ"))} placeholder="大学名" />
          <select name="sente_grade" required value={formValues.sente_grade} onChange={handleChange} className={fieldClass(isAuto("sente_grade"))}>
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
          <input type="text" name="gote_name" required value={formValues.gote_name} onChange={handleChange} className={fieldClass(isAuto("gote_name"))} placeholder="氏名" />
          <input type="text" name="gote_univ" required value={formValues.gote_univ} onChange={handleChange} className={fieldClass(isAuto("gote_univ"))} placeholder="大学名" />
          <select name="gote_grade" required value={formValues.gote_grade} onChange={handleChange} className={fieldClass(isAuto("gote_grade"))}>
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
          <input type="text" name="event" required value={formValues.event} onChange={handleChange} className={fieldClass(isAuto("event"))} placeholder="大会名" />
          <input type="date" name="date" required value={formValues.date} onChange={handleChange} className={fieldClass(isAuto("date"))} />
          <select name="result" required value={formValues.result} onChange={handleChange} className={fieldClass(isAuto("result"))}>
            <option value="">結果を選択</option>
            <option value="先手勝ち">先手勝ち</option>
            <option value="後手勝ち">後手勝ち</option>
            <option value="引き分け">千日手</option>
            <option value="持将棋">持将棋</option>
            <option value="先手宣言勝ち">先手宣言勝ち</option>
            <option value="後手宣言勝ち">後手宣言勝ち</option>
          </select>
        </div>
      </div>

      <div className="text-center">
        {submitted && (
          <p className="text-green-600 font-semibold mb-2">送信完了！</p>
        )}
        {error && (
          <p className="text-red-600 font-semibold mb-2">{error}</p>
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
