import React from 'react';
import { LEVEL_CONFIGS } from '../data/questions';
import { X, Play, Clock, Heart, Zap, Sparkles, Unlock } from 'lucide-react';

interface LevelSelectModalProps {
  onSelectLevel: (level: number) => void;
  onClose: () => void;
  highScores: Record<number, number>;
  bestTimes: Record<number, number>;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  onSelectLevel,
  onClose,
  highScores,
  bestTimes,
}) => {
  const levels = [1, 2, 3] as const;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-amber-900/15 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>PILIH TAHAP KEMBARA LINEAR</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Pilih mana-mana tahap untuk memulakan cabaran matematik Capybara!
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 active:scale-95 flex items-center justify-center cursor-pointer transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Cards */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {levels.map((lvl) => {
            const config = LEVEL_CONFIGS[lvl];
            const bestScore = highScores[lvl] || 0;
            const bestTime = bestTimes[lvl] || 0;

            return (
              <div
                key={lvl}
                className="group relative flex flex-col justify-between p-5 rounded-2xl border-2 border-slate-200 hover:border-sky-500 hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div>
                  {/* Badge & Number */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center text-lg">
                      {lvl}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      5 Nyawa
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors">
                    Tahap {lvl}
                  </h3>
                  <p className="text-xs text-amber-700 font-bold mb-2">
                    {config.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    {config.description}
                  </p>

                  {/* Level Unique Mechanics Highlight */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 mb-4 text-xs space-y-1.5">
                    {lvl === 1 && (
                      <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                        <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Kira Masa Digunakan (Stopwatch)</span>
                      </div>
                    )}
                    {lvl === 2 && (
                      <div className="flex items-center gap-2 text-blue-800 font-semibold">
                        <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>10s Teliti Soalan Baharu Sebelum Terbang</span>
                      </div>
                    )}
                    {lvl === 3 && (
                      <div className="flex items-center gap-2 text-orange-800 font-semibold">
                        <Unlock className="w-4 h-4 text-orange-600 shrink-0" />
                        <span>Kumpul 5 Oren Pembuka Pintu 🍊</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-slate-700">
                      <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Butang Speed (Pecut ke gerbang)</span>
                    </div>
                  </div>

                  {/* Stats Record */}
                  <div className="text-[11px] text-slate-500 font-medium space-y-1 pt-1 border-t border-slate-100">
                    {lvl === 1 && bestTime > 0 && (
                      <div className="flex justify-between">
                        <span>Masa Terpantas:</span>
                        <span className="font-bold text-emerald-700">{bestTime.toFixed(1)}s</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Skor Tertinggi:</span>
                      <span className="font-bold text-slate-800">{bestScore.toLocaleString()} pts</span>
                    </div>
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={() => onSelectLevel(lvl)}
                  className={`mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 ${
                    lvl === 1
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : lvl === 2
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-orange-600 hover:bg-orange-700'
                  }`}
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Main Tahap {lvl}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Pemain boleh memulakan permainan dengan mana-mana tahap secara bebas!</span>
          <button
            onClick={onClose}
            className="hover:underline text-slate-700 font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
