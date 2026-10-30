import React from 'react';
import { Play, RotateCcw, Layers, Home, Volume2, VolumeX } from 'lucide-react';
import { LevelConfig } from '../types/game';

interface PauseModalProps {
  levelConfig: LevelConfig;
  isMuted: boolean;
  onResume: () => void;
  onRestart: () => void;
  onOpenLevelSelect: () => void;
  onGoHome: () => void;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  levelConfig,
  isMuted,
  onResume,
  onRestart,
  onOpenLevelSelect,
  onGoHome,
  onToggleMute,
}) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border-4 border-amber-900/15 overflow-hidden flex flex-col p-6 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-1">
          PERMAINAN DIJEDA
        </h2>
        <p className="text-xs text-slate-500 font-semibold mb-6">
          {levelConfig.title}
        </p>

        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={onResume}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-base shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Sambung Permainan</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mulakan Semula Level</span>
          </button>

          <button
            onClick={onOpenLevelSelect}
            className="w-full py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Layers className="w-4 h-4 text-sky-600" />
            <span>Pilih Level Lain (1, 2, 3)</span>
          </button>

          <button
            onClick={onToggleMute}
            className="w-full py-2.5 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-95 text-slate-600 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            <span>{isMuted ? 'Buka Bunyi Permainan' : 'Senyapkan Bunyi Permainan'}</span>
          </button>

          <button
            onClick={onGoHome}
            className="w-full py-2.5 px-6 rounded-xl text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
          >
            Kembali ke Menu Utama
          </button>
        </div>
      </div>
    </div>
  );
};
