import React, { useState } from 'react';
import { X, Trophy, Star, Clock, CheckCircle2, Lock, Key, Sparkles, Crown, Trash2 } from 'lucide-react';
import { LEVEL_CONFIGS } from '../data/questions';
import { PodiumLeaderboard, PlayerScoreRecord } from './PodiumLeaderboard';

interface ScoreboardModalProps {
  onClose: () => void;
  highScores: Record<number, number>;
  bestTimes: Record<number, number>;
  doorsUnlockedCount: number; // Actual number of unlocked doors (0 to 4)
  doorRecords?: Record<number, { isUnlocked: boolean; scoreEarned: number; unlockedAt?: string }>;
  playerRecords?: PlayerScoreRecord[];
  currentPlayerName?: string;
  currentScore?: number;
  initialTab?: 'PODIUM' | number;
  onDeleteRecord?: (recordId: string) => void;
}

export const ScoreboardModal: React.FC<ScoreboardModalProps> = ({
  onClose,
  highScores,
  bestTimes,
  doorsUnlockedCount = 0,
  doorRecords = {},
  playerRecords = [],
  currentPlayerName = 'Pemain',
  currentScore = 0,
  initialTab = 'PODIUM',
  onDeleteRecord,
}) => {
  const [activeTab, setActiveTab] = useState<'PODIUM' | number>(initialTab);

  const formatTime = (seconds: number) => {
    if (!seconds || seconds <= 0) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  const doorsList = [
    { num: 1, name: 'Pintu 1 : Kamus Puan Siti', theme: 'Perpustakaan 📖', defaultScore: 300 },
    { num: 2, name: 'Pintu 2 : 20 Murid Lelaki & Perempuan', theme: 'Bilik Darjah 🚻', defaultScore: 300 },
    { num: 3, name: 'Pintu 3 : Tiket Muzium Danish & Alia', theme: 'Muzium Ilmu 🏛️', defaultScore: 300 },
    { num: 4, name: 'Pintu 4 : Hari Sukan Pasukan Merah & Biru', theme: 'Hari Sukan 🏃', defaultScore: 300 },
  ];

  const totalDoorsUnlocked = Math.min(4, Math.max(0, doorsUnlockedCount));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-900/20 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-amber-950 flex items-center justify-between border-b-2 border-amber-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/40 flex items-center justify-center shadow-xs">
              <Trophy className="w-6 h-6 text-amber-900" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">PAPAN SKOR (SCOREBOARD)</h2>
              <p className="text-xs font-bold text-amber-900/80">Pemain: {currentPlayerName} · Pintu Terbuka: {totalDoorsUnlocked}/4</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/40 hover:bg-white/60 active:scale-95 flex items-center justify-center cursor-pointer transition-all text-amber-950"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Door Progression Bar */}
        <div className="bg-amber-100/70 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-amber-700" />
              Kemajuan Pintu Terbuka:
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white font-mono font-black text-xs">
              {totalDoorsUnlocked} / 4 PINTU TERBUKA
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((d) => (
              <span
                key={d}
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                  d <= totalDoorsUnlocked
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-amber-200 text-amber-800'
                }`}
                title={`Pintu ${d}: ${d <= totalDoorsUnlocked ? 'Terbuka' : 'Terkunci'}`}
              >
                {d <= totalDoorsUnlocked ? '✓' : d}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-3 gap-1.5 sm:gap-2">
          {/* Podium Top 5 Tab */}
          <button
            onClick={() => setActiveTab('PODIUM')}
            className={`py-2.5 px-3 rounded-t-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border-t-2 border-x-2 ${
              activeTab === 'PODIUM'
                ? 'bg-white border-slate-200 border-b-transparent text-amber-950 shadow-xs'
                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>🏆 Podium Top 5</span>
          </button>

          {[1, 2, 3].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setActiveTab(lvl)}
              className={`flex-1 py-2.5 px-2 rounded-t-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border-t-2 border-x-2 ${
                activeTab === lvl
                  ? 'bg-white border-slate-200 border-b-transparent text-amber-950 shadow-xs'
                  : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Tahap {lvl}</span>
              {highScores[lvl] > 0 && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {activeTab === 'PODIUM' ? (
            <div className="space-y-4">
              <PodiumLeaderboard
                playerRecords={playerRecords}
                currentPlayerName={currentPlayerName}
                currentScore={currentScore}
              />

              {/* Rekod Skor Pemain (Player Name Leaderboard History) */}
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-600" />
                    <span>Sejarah Rekod Semua Pemain:</span>
                  </h4>
                  <span className="text-[11px] font-bold text-amber-800">
                    {playerRecords.length} Rekod Tersimpan
                  </span>
                </div>

                {playerRecords.length === 0 ? (
                  <div className="p-3 bg-white/80 rounded-xl border border-amber-100 text-center text-xs text-slate-500">
                    Belum ada rekod. Main permainan untuk mencatat nama dan skor anda!
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                    {playerRecords.map((rec, i) => (
                      <div
                        key={rec.id || i}
                        className="p-2.5 bg-white rounded-xl border border-amber-200 flex items-center justify-between text-xs shadow-xs hover:border-amber-400 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px] flex items-center justify-center">
                            {i + 1}
                          </span>
                          <div>
                            <span className="font-extrabold text-slate-800 block">
                              {rec.name}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              Tahap {rec.level} · {rec.doorsUnlocked > 0 ? `${rec.doorsUnlocked}/4 Pintu Terbuka` : '0 Pintu'} · {rec.date}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-black font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            {rec.score.toLocaleString()} Skor
                          </span>

                          {/* Individual Delete Button for this single record */}
                          {onDeleteRecord && (
                            <button
                              type="button"
                              onClick={() => onDeleteRecord(rec.id)}
                              className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 active:scale-90 text-rose-600 hover:text-rose-700 border border-rose-200 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                              title={`Padam rekod ${rec.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Level Info Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-amber-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    {LEVEL_CONFIGS[activeTab as number].subtitle}
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    {LEVEL_CONFIGS[activeTab as number].title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
                    {activeTab === 3 ? '4 Pintu Bilik' : 'Cabaran Linear'}
                  </span>
                  <span className="px-3 py-1 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700">
                    5 Nyawa
                  </span>
                </div>
              </div>

          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Skor Tertinggi
              </span>
              <span className="text-2xl font-black text-amber-600 font-mono">
                {(highScores[activeTab] || 0).toLocaleString()}
              </span>
            </div>

            {activeTab === 1 && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Masa Digunakan (2 Min)
                </span>
                <span className="text-2xl font-black text-emerald-700 font-mono">
                  {formatTime(bestTimes[1] || 0)}
                </span>
              </div>
            )}

            {activeTab === 2 && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Masa Meneliti
                </span>
                <span className="text-2xl font-black text-blue-700 font-mono">
                  10s / Soalan
                </span>
              </div>
            )}

            {activeTab === 3 && (
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Pintu Terbuka
                </span>
                <span className="text-2xl font-black text-orange-600 font-mono">
                  {totalDoorsUnlocked} / 4 Pintu
                </span>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Penarafan Bintang
              </span>
              <div className="flex items-center justify-center gap-1 mt-1">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      (highScores[activeTab] || 0) >= star * 300
                        ? 'fill-amber-400 text-amber-500'
                        : 'fill-slate-100 text-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Level 3 Specific Door Progression with Scores for Each Door */}
          {activeTab === 3 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-amber-600" />
                  <span>Papan Skor 4 Pintu Terbuka (Kunci Emas):</span>
                </h4>
                <span className="text-xs font-black text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full font-mono">
                  {totalDoorsUnlocked} / 4 Terbuka
                </span>
              </div>

              <div className="space-y-2">
                {doorsList.map((door) => {
                  const record = doorRecords[door.num];
                  const isUnlocked = totalDoorsUnlocked >= door.num || (record && record.isUnlocked);
                  return (
                    <div
                      key={door.num}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isUnlocked
                          ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300 shadow-xs'
                          : 'bg-white border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                          isUnlocked ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {door.num}
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                            <span>{door.name}</span>
                            <span className="text-[10px] font-bold text-slate-500">({door.theme})</span>
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600">
                            {isUnlocked ? (
                              <span className="text-emerald-700 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                                🔓 Pintu Terbuka · Kunci Emas Diperoleh!
                                {record?.unlockedAt && ` (${record.unlockedAt})`}
                              </span>
                            ) : (
                              <span className="text-slate-400 flex items-center gap-1">
                                <Lock className="w-3.5 h-3.5 text-slate-400 inline" />
                                🔒 Terkunci (Kumpul 5 Oren untuk Buka)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`inline-block px-2.5 py-1 rounded-xl text-xs font-black font-mono ${
                          isUnlocked ? 'bg-emerald-200 text-emerald-950' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {isUnlocked ? `+${record?.scoreEarned || door.defaultScore} Skor` : '0 Skor'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rekod Skor Pemain (Player Name Leaderboard History) */}
          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>Rekod Skor Mengikut Nama Murid / Pemain:</span>
              </h4>
              <span className="text-[11px] font-bold text-amber-800">
                {playerRecords.length} Rekod Tersimpan
              </span>
            </div>

            {playerRecords.length === 0 ? (
              <div className="p-3 bg-white/80 rounded-xl border border-amber-100 text-center text-xs text-slate-500">
                Belum ada rekod. Main permainan untuk mencatat nama dan skor anda!
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {playerRecords.map((rec, i) => (
                  <div
                    key={rec.id || i}
                    className="p-2.5 bg-white rounded-xl border border-amber-200 flex items-center justify-between text-xs shadow-xs hover:border-amber-400 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px] flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div>
                        <span className="font-extrabold text-slate-800 block">
                          {rec.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Tahap {rec.level} · {rec.doorsUnlocked > 0 ? `${rec.doorsUnlocked}/4 Pintu Terbuka` : '0 Pintu'} · {rec.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-black font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {rec.score.toLocaleString()} Skor
                      </span>

                      {/* Individual Delete Button for this single record */}
                      {onDeleteRecord && (
                        <button
                          type="button"
                          onClick={() => onDeleteRecord(rec.id)}
                          className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 active:scale-90 text-rose-600 hover:text-rose-700 border border-rose-200 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                          title={`Padam rekod ${rec.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tip Note */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
            💡 <strong>Petua Permainan:</strong> Kutip <strong>⭐ Bintang Emas</strong> di udara untuk +50 skor bonus, dan berhati-hati dengan <strong>⛈️ Awan Ribut</strong> yang boleh menolak 1 nyawa jika terlanggar!
          </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all"
          >
            Tutup Papan Skor
          </button>
        </div>
      </div>
    </div>
  );
};
