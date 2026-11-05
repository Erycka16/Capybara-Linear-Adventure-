import React from 'react';
import { Play, RotateCcw, Layers, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { LevelConfig } from '../types/game';

interface PauseModalProps {
  levelConfig: LevelConfig;
  isMuted: boolean;
  onResume: () => void;
  onRestart: () => void;
  onSelectLevel: (level: number) => void;
  onGoHome: () => void;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  levelConfig,
  isMuted,
  onResume,
  onRestart,
  onSelectLevel,
  onGoHome,
  onToggleMute,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border-4 border-amber-900/15 overflow-hidden flex flex-col p-6 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-1">
          PERMAINAN DIJEDA
        </h2>
        <p className="text-xs text-slate-500 font-semibold mb-4">
          {levelConfig.title}
        </p>

        <div className="flex flex-col gap-2.5 w-full">
          {/* Resume Button */}
          <button
            onClick={onResume}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-base shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Sambung Permainan</span>
          </button>

          {/* Restart Current Level */}
          <button
            onClick={onRestart}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
            <span>Mulakan Semula Level Ini</span>
          </button>

          {/* DIRECT LEVEL SWITCHER (Pilihan Tukar Level Terus!) */}
          <div className="w-full bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-3 my-1 text-center shadow-xs">
            <div className="text-xs font-black text-amber-950 uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-700" />
              <span>Tukar Level Sekarang:</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onSelectLevel(1)}
                className={`py-2 px-1 rounded-xl font-black text-xs transition-all cursor-pointer border-2 active:scale-95 flex flex-col items-center justify-center gap-0.5 shadow-xs ${
                  levelConfig.level === 1
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400'
                    : 'bg-white hover:bg-emerald-50 text-emerald-950 border-emerald-300'
                }`}
                title="Pindah ke Tahap 1"
              >
                <span className="text-[10px] font-bold opacity-80">TAHAP</span>
                <span className="text-base font-black">1</span>
                <span className="text-[9px] font-semibold opacity-75">Nilai (x, y)</span>
              </button>

              <button
                onClick={() => onSelectLevel(2)}
                className={`py-2 px-1 rounded-xl font-black text-xs transition-all cursor-pointer border-2 active:scale-95 flex flex-col items-center justify-center gap-0.5 shadow-xs ${
                  levelConfig.level === 2
                    ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-400'
                    : 'bg-white hover:bg-blue-50 text-blue-950 border-blue-300'
                }`}
                title="Pindah ke Tahap 2"
              >
                <span className="text-[10px] font-bold opacity-80">TAHAP</span>
                <span className="text-base font-black">2</span>
                <span className="text-[9px] font-semibold opacity-75">Persamaan</span>
              </button>

              <button
                onClick={() => onSelectLevel(3)}
                className={`py-2 px-1 rounded-xl font-black text-xs transition-all cursor-pointer border-2 active:scale-95 flex flex-col items-center justify-center gap-0.5 shadow-xs ${
                  levelConfig.level === 3
                    ? 'bg-orange-600 text-white border-orange-700 shadow-md ring-2 ring-orange-400'
                    : 'bg-white hover:bg-orange-50 text-orange-950 border-orange-300'
                }`}
                title="Pindah ke Tahap 3"
              >
                <span className="text-[10px] font-bold opacity-80">TAHAP</span>
                <span className="text-base font-black">3</span>
                <span className="text-[9px] font-semibold opacity-75">Bilik & Graf</span>
              </button>
            </div>
          </div>

          {/* Audio Mute/Unmute */}
          <button
            onClick={onToggleMute}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-95 text-slate-600 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            <span>{isMuted ? 'Buka Bunyi Permainan' : 'Senyapkan Bunyi Permainan'}</span>
          </button>

          {/* Go to Main Menu */}
          <button
            onClick={onGoHome}
            className="w-full py-2 px-4 rounded-xl text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer transition-colors"
          >
            Kembali ke Menu Utama
          </button>
        </div>
      </div>
    </div>
  );
};
