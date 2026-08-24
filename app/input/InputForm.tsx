"use client";

import { useState, useEffect } from "react";
import { parseKifu } from "../lib/parseKifu";
import { readKifuFile } from "../lib/readKifuFile";
import { useSuggestions } from "../lib/useSuggestions";
import GameFormFields from "../components/GameFormFields";
import {
  EMPTY_GAME_VALUES,
  FIELD_LABELS,
  GAME_FIELDS,
  type GameField,
  type GameValues,
} from "../lib/gameValidation";

export default function InputForm() {
  const suggestions = useSuggestions();
  const [values, setValues] = useState<GameValues>({ ...EMPTY_GAME_VALUES });
  const [kifu, setKifu] = useState("");
  const [autoFilled, setAutoFilled] = useState<GameField[]>([]);
  const [missing, setMissing] = useState<GameField[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // 手入力した項目は自動入力の表示から外す
    setAutoFilled((prev) => prev.filter((field) => field !== name));
    setMissing((prev) => prev.filter((field) => field !== name));
  }

  // 棋譜が入力されたらヘッダーを解析して各項目を埋める
  function applyKifu(text: string) {
    setKifu(text);
    const parsed = parseKifu(text);

    setValues((prev) => {
      const next = { ...prev };
      for (const field of GAME_FIELDS) {
        if (parsed[field]) next[field] = parsed[field];
      }
      return next;
    });

    if (!text.trim()) {
      setAutoFilled([]);
      setMissing([]);
      return;
    }
    setAutoFilled(GAME_FIELDS.filter((field) => parsed[field]));
    setMissing(GAME_FIELDS.filter((field) => !parsed[field]));
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    try {
      applyKifu(await readKifuFile(file));
    } catch {
      setError("ファイルを読み込めませんでした．");
    } finally {
      // 同じファイルを選び直せるようにする
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
      formData.append(key, value);
    }
    formData.append("kifu", kifu);

    try {
      const response = await fetch("/api/submit-kifu", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSubmitted(true);
        setValues({ ...EMPTY_GAME_VALUES });
        setKifu("");
        setAutoFilled([]);
        setMissing([]);
      } else {
        setError(await response.text());
      }
    } catch {
      setError("送信に失敗しました．通信環境を確認してください．");
    } finally {
      setSubmitting(false);
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
      className="p-6 max-w-3xl mx-auto space-y-6 bg-white rounded shadow-md text-gray-900"
    >
      <h1 className="text-2xl font-bold text-center mb-4">棋譜入力フォーム</h1>

      {/* 棋譜 */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
          <label htmlFor="kifu" className="block font-semibold">棋譜</label>
          <label className="text-sm text-blue-700 cursor-pointer hover:underline">
            .kifファイルを選択
            <input
              type="file"
              accept=".kif,.kifu,.txt"
              onChange={handleFile}
              className="hidden"
            />
          </label>
        </div>
        <textarea
          name="kifu"
          id="kifu"
          placeholder="KIF形式の棋譜を貼り付けてください。(これ以外の形式で入力すると棋譜の再生ができなくなります。)"
          required
          value={kifu}
          onChange={(e) => applyKifu(e.target.value)}
          className="border p-2 w-full h-56 rounded resize-y overflow-auto font-mono text-sm"
        ></textarea>
        <p className="text-sm text-gray-600 mt-1">
          棋譜を貼り付ける（またはファイルを選ぶ）と、氏名・大学名・学年・大会名・対局日・結果を自動で読み取ります。
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
          {autoFilled.includes("date") && (
            <p className="text-blue-900">
              対局日は棋譜の開始日時から取得しています．棋譜を後から入力した場合は実際の対局日に修正してください．
            </p>
          )}
        </div>
      )}

      <GameFormFields
        values={values}
        onChange={handleChange}
        suggestions={suggestions}
        autoFilled={autoFilled}
      />

      <div className="text-center">
        {submitted && (
          <p className="text-green-600 font-semibold mb-2">送信完了！</p>
        )}
        {error && (
          <p className="text-red-600 font-semibold mb-2 whitespace-pre-line">{error}</p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
        >
          {submitting ? "送信中..." : "送信"}
        </button>
      </div>
    </form>
  );
}
