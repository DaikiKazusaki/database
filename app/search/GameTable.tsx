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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGames = games.filter((game) => {
    const query = searchTerm.toLowerCase();
    return (
      game.sente_name.toLowerCase().includes(query) ||
      game.sente_univ.toLowerCase().includes(query) ||
      game.sente_grade.toLowerCase().includes(query) ||
      game.gote_name.toLowerCase().includes(query) ||
      game.gote_univ.toLowerCase().includes(query) ||
      game.gote_grade.toLowerCase().includes(query) ||
      game.event.toLowerCase().includes(query) ||
      game.date.toString().toLowerCase().includes(query) ||
      game.result.toLowerCase().includes(query)
    );
  });

  const handleSearch = () => {
    setSearchTerm(searchQuery);
  };

  const handleCopy = async (kifu: string) => {
    try {
      await navigator.clipboard.writeText(kifu);
      alert('棋譜をコピーしました');
    } catch {
      alert('コピーに失敗しました');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('この棋譜を削除しますか？')) return;
    try {
      const res = await fetch('/api/delete-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        alert('棋譜を削除しました');
      } else {
        alert('削除に失敗しました');
      }
    } catch {
      alert('エラーが発生しました');
    }
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">棋譜一覧</h1>

      {/* 🔍 検索エリア */}
      <div className="mb-6 flex flex-col md:flex-row gap-2 items-stretch">
        <input
          type="text"
          placeholder="名前、大学、大会名などで検索"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          検索
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="bg-white shadow rounded-xl p-4 border border-gray-200 flex flex-col"
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-2">
                  {new Date(game.date).toLocaleDateString('ja-JP')}・{game.event}
                </div>
                <div className="text-sm mb-1">
                  <strong>先手：</strong>
                  {game.sente_name}（{game.sente_univ}・{game.sente_grade}）
                </div>
                <div className="text-sm mb-1">
                  <strong>後手：</strong>
                  {game.gote_name}（{game.gote_univ}・{game.gote_grade}）
                </div>
                <div className="text-sm text-gray-700">
                  <strong>結果：</strong>
                  {game.result}
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 md:items-end w-full md:w-auto">
                <button
                  onClick={() => handleCopy(game.kifu)}
                  className="w-full md:w-[100px] px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  コピー
                </button>
                <button
                  onClick={() => setSelectedGame(game)}
                  className="w-full md:w-[100px] px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                >
                  棋譜表示
                </button>
                <button
                  onClick={() => handleDelete(game.id)}
                  className="w-full md:w-[100px] px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  削除
                </button>
              </div>
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
