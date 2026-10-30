import React from 'react';
import { GameStats, LevelConfig } from '../types/game';
import { CapybaraDuckIllustration } from './CapybaraDuckIllustration';
import { RotateCcw, Layers, Home, HeartCrack } from 'lucide-react';

interface GameOverModalProps {
  stats: GameStats;
  levelConfig: LevelConfig;
  failedReason?: string;
  onRestart: () => void;
  onOpenLevelSelect: () => void;
  onGoHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  levelConfig,
  failedReason,
  onRestart,
  onOpenLevelSelect,
  onGoHome,
}) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-900/15 overflow-hidden flex flex-col p-6 sm:p-7 text-center">
        {/* Dizzy Capybara & Duck */}
        <div className="mx-auto my-1 transform scale-90 sm:scale-100">
          <CapybaraDuckIllustration className="w-44 h-auto" eyeState="dizzy" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 font-bold text-xs rounded-full mx-auto mb-2">
          <HeartCrack className="w-4 h-4 text-rose-600" />
          <span>{failedReason || 'Kehabisan 5 Nyawa!'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
          CUBA LAGI!
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-4">
          Setiap kesalahan menolak 1 nyawa. Teliti konsep persamaan linear dan cuba lagi dengan 5 nyawa penuh!
        </p>

        {/* Quick Stats */}
        <div className="flex justify-around bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-2 mb-4 text-center">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Soalan Selesai</span>
            <span className="text-base font-extrabold text-slate-800 tabular-nums">
              {stats.correctCount} / {levelConfig.targetQuestions}
            </span>
          </div>
          <div className="w-px bg-slate-200" />
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Skor Dicapai</span>
            <span className="text-base font-extrabold text-amber-600 tabular-nums">
              {stats.score.toLocaleString()} pts
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 w-full mt-1">
          <button
            onClick={onRestart}
            className="w-full py-3 px-5 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Cuba Tahap {levelConfig.level} Sekali Lagi (5 Nyawa Penuh)</span>
          </button>

          <button
            onClick={onGoHome}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md border-2 border-amber-300 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Home className="w-4 h-4 text-amber-100" />
            <span>Kembali ke Menu Utama</span>
          </button>

          <button
            onClick={onOpenLevelSelect}
            className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-sky-600" />
            <span>Tukar Level</span>
          </button>
        </div>
      </div>
    </div>
  );
};
