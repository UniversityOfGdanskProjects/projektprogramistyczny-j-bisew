'use client';

import { useEffect, useState } from 'react';

interface LeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  timeSpent: number;
  timestamp: number;
}

export default function Leaderboard({ quizId }: { quizId: string }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  
  useEffect(() => {
    const updateLeaderboard = () => {
      const leaderboard = localStorage.getItem(`quiz_${quizId}_leaderboard`);
      if (leaderboard) {
        let allScores: LeaderboardEntry[] = JSON.parse(leaderboard);
        const userBestScores = allScores.reduce((acc, score) => {
          if (!acc[score.userId] || acc[score.userId].score < score.score) {
            acc[score.userId] = score;
          }
          return acc;
        }, {} as Record<string, LeaderboardEntry>);

        const bestScores = Object.values(userBestScores)
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);

        setEntries(bestScores);
      }
    };

    updateLeaderboard();
    window.addEventListener('storage', updateLeaderboard);
    return () => window.removeEventListener('storage', updateLeaderboard);
  }, [quizId]);

  return (
    <div className="bg-slate-800 rounded-lg p-4 mt-6">
      <h3 className="text-xl font-bold text-slate-100 mb-4">Leaderboard (Top 10)</h3>
      {entries.length > 0 ? (
        <div className="space-y-2">
          {entries.map((entry, index) => (
            <div 
              key={entry.userId + entry.timestamp}
              className="flex items-center justify-between p-2 bg-slate-700 rounded"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-slate-400">#{index + 1}</span>
                <span className="text-slate-100">{entry.userName}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-green-400">{entry.score.toFixed(1)}%</span>
                <span className="text-slate-400">
                  {Math.floor(entry.timeSpent / 60)}m {entry.timeSpent % 60}s
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 text-center">No entries yet</p>
      )}
    </div>
  );
}