import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameStats, LevelConfig } from '../types/game';
import { CapybaraDuckIllustration } from './CapybaraDuckIllustration';
import { Trophy, Star, Sparkles, RotateCcw, ArrowRight, Layers, Clock, Heart, Home } from 'lucide-react';

interface VictoryModalProps {
  stats: GameStats;
  levelConfig: LevelConfig;
  onRestart: () => void;
  onNextLevel: () => void;
  onOpenLevelSelect: () => void;
  onGoHome: () => void;
  onOpenScoreboard?: () => void;
  playerName?: string;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  stats,
  levelConfig,
  onRestart,
  onNextLevel,
  onOpenLevelSelect,
  onGoHome,
  onOpenScoreboard,
  playerName = 'Pemain',
}) => {
  useEffect(() => {
    try {
      const count = 200;
      const defaults = { origin: { y: 0.7 } };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    } catch {}
  }, []);

  const starsEarned = stats.hearts >= 4 ? 3 : stats.hearts >= 2 ? 2 : 1;

  const timeUsedSeconds = Math.max(0, 600 - stats.level1TotalTimeLeft);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(0);
    return mins > 0 ? `${mins} minit ${secs} saat` : `${secs} saat`;
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-900/15 overflow-hidden flex flex-col p-6 sm:p-8 text-center animate-float-soft">
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-100 border border-amber-300 text-amber-900 font-black text-xs rounded-full mx-auto mb-2 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Hebat! Selesai Semua {levelConfig.targetQuestions} Soalan Tahap {levelConfig.level}</span>
        </div>

        {/* Happy Capybara & Duck with Explorer Hat on Podium */}
        <div className="relative mx-auto my-1 flex flex-col items-center">
          <span className="px-3 py-0.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white font-black text-[11px] rounded-full uppercase tracking-wider shadow-md mb-1 animate-pulse border border-yellow-200">
            👑 Capybara {playerName} Menaiki Podium! 👑
          </span>
          <div className="transform scale-95 sm:scale-105 hover:scale-110 transition-transform cursor-pointer">
            <CapybaraDuckIllustration
              className="w-44 sm:w-52 h-auto drop-shadow-xl"
              eyeState="happy"
              hasBackpack={true}
              hasPropeller={true}
            />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
          CAPY {playerName.toUpperCase()} MENANG!
        </h2>
        <p className="text-xs sm:text-sm font-bold text-amber-950 mb-3">
          Tahniah! Anda telah menguasai persamaan linear & mendaki podium juara!
        </p>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={`w-8 h-8 transition-transform duration-500 ${
                s <= starsEarned
                  ? 'fill-amber-400 text-amber-500 scale-110 drop-shadow-md'
                  : 'fill-slate-100 text-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Level 1 Highlight: Time taken */}
        {levelConfig.level === 1 && (
          <div className="mb-4 p-3 bg-emerald-50 border-2 border-emerald-400 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span>Masa yang Digunakan:</span>
            </div>
            <span className="text-lg font-black text-emerald-700 font-mono">
              {formatTime(timeUsedSeconds)}
            </span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-5 text-left">
          <div className="p-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Baki Nyawa
            </span>
            <span className="text-base font-extrabold text-rose-600 flex items-center gap-1">
              <Heart className="w-4 h-4 fill-rose-500" />
              <span>{stats.hearts} / 5 Nyawa</span>
            </span>
          </div>

          <div className="p-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Jumlah Skor
            </span>
            <span className="text-base font-extrabold text-amber-600 tabular-nums">
              {stats.score.toLocaleString()} pts
            </span>
          </div>

          <div className="p-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Soalan Selesai
            </span>
            <span className="text-base font-extrabold text-emerald-600">
              {stats.correctCount} / {levelConfig.targetQuestions}
            </span>
          </div>

          <div className="p-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Kombo Tertinggi
            </span>
            <span className="text-base font-extrabold text-blue-600">
              {stats.maxStreak}x Kombo
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 w-full mt-2">
          {levelConfig.level < 3 ? (
            <button
              onClick={onNextLevel}
              className="w-full py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Teruskan ke Tahap {levelConfig.level + 1}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="py-2.5 px-4 rounded-xl bg-purple-50 text-purple-900 font-bold text-xs border border-purple-200">
              🎉 Tahniah! Anda telah membuka kesemua 4 Pintu Bilik Kelas & Menamatkan Capy Linear Math!
            </div>
          )}

          {/* View Podium Top 5 Button */}
          {onOpenScoreboard && (
            <button
              onClick={onOpenScoreboard}
              className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 active:scale-95 text-amber-950 font-black text-xs sm:text-sm shadow-md border-2 border-amber-600 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Trophy className="w-4 h-4 text-amber-900 fill-amber-500" />
              <span>🏆 Lihat Kedudukan di Podium Top 5</span>
            </button>
          )}

          {/* Dedicated Prominent "Kembali ke Menu Utama" Button */}
          <button
            onClick={onGoHome}
            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md border-2 border-amber-300 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Home className="w-4 h-4 text-amber-100" />
            <span>Kembali ke Menu Utama</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onRestart}
              className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Main Semula</span>
            </button>

            <button
              onClick={onOpenLevelSelect}
              className="py-2 px-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 active:scale-95 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-sky-600" />
              <span>Pilih Level</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
