'use client';

import { useEffect, useState } from 'react';
import GameTable from './GameTable';

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

export default function SearchClient() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [university, setUniversity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      const res = await fetch('/api/games');
      const data = await res.json();
      setGames(data);
      setFilteredGames(data);
    };
    fetchGames();
  }, []);

  const handleSearch = () => {
    const filtered = games.filter(game => {
      const matchName =
        game.sente_name.includes(playerName) ||
        game.gote_name.includes(playerName);
      const matchUniv =
        game.sente_univ.includes(university) ||
        game.gote_univ.includes(university);
      const matchDate =
        (!startDate || new Date(game.date) >= new Date(startDate)) &&
        (!endDate || new Date(game.date) <= new Date(endDate));

      return matchName && matchUniv && matchDate;
    });
    setFilteredGames(filtered);
  };

  return (
    <div className="p-4">
      <div className="mb-4 space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <input
            type="text"
            placeholder="対局者名"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="大学名"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            検索
          </button>
        </div>
      </div>
      <GameTable games={filteredGames} />
    </div>
  );
}
