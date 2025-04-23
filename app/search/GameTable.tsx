'use client';

import { useState } from 'react';

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

export default function GameTable({ games }: { games: Game[] }) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const handleCopy = async (kifu: string) => {
    try {
      await navigator.clipboard.writeText(kifu);
      alert('棋譜をコピーしました');
    } catch {
      alert('コピーに失敗しました');
    }
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">棋譜一覧</h1>
      <div className="space-y-4">
        {games.map((game) => (
          <div key={game.id} className="bg-white shadow rounded-xl p-4 border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
              <div className="text-sm text-gray-600">
                {new Date(game.date).toLocaleDateString('ja-JP')}・{game.event}
              </div>
              <div className="text-sm text-gray-700">
                {game.result}
              </div>
            </div>
            <div className="text-sm mb-1">
              <strong>先手：</strong>{game.sente_name}（{game.sente_univ}・{game.sente_grade}）
            </div>
            <div className="text-sm mb-2">
              <strong>後手：</strong>{game.gote_name}（{game.gote_univ}・{game.gote_grade}）
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleCopy(game.kifu)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                コピー
              </button>
              <button
                onClick={() => setSelectedGame(game)}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
              >
                棋譜表示
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setSelectedGame(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-4">棋譜</h2>
            <pre className="whitespace-pre-wrap break-words max-h-[70vh] overflow-y-auto bg-gray-50 p-4 rounded border border-gray-200">
              {selectedGame.kifu}
            </pre>
          </div>
        </div>
      )}
    </main>
  );
}
