import React from 'react';
import { GameStats, LevelConfig, Level2Phase } from '../types/game';
import { getActiveLevel1Data, getActiveLevel2Data, getActiveLevel3Data } from '../data/questions';
import { Heart, Volume2, VolumeX, Pause, Sparkles, Trophy, Zap, Clock, Lock, Unlock, Play, PlusCircle, Snail, Home, Gauge } from 'lucide-react';

interface HUDProps {
  stats: GameStats;
  levelConfig: LevelConfig;
  feedbackText: string | null;
  isFeedbackCorrect: boolean;
  isMuted: boolean;
  isSpeedBoostActive: boolean;
  isSlowBoostActive: boolean;
  onToggleSpeedBoost: () => void;
  onSetSpeedBoost: (active: boolean) => void;
  onToggleSlowBoost: () => void;
  onSetSlowBoost: (active: boolean) => void;
  onSetNormalSpeed?: () => void;
  onToggleMute: () => void;
  onPause: () => void;
  onOpenScoreboard: () => void;
  onAddLevel1Time: () => void;
  onGoHome?: () => void;
  level2Phase: Level2Phase;
  level2TimeLeft: number;
  onSkipLevel2Phase: () => void;
  level3DoorNumber: number;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  levelConfig,
  feedbackText,
  isFeedbackCorrect,
  isMuted,
  isSpeedBoostActive,
  isSlowBoostActive,
  onToggleSpeedBoost,
  onSetSpeedBoost,
  onToggleSlowBoost,
  onSetSlowBoost,
  onSetNormalSpeed,
  onToggleMute,
  onPause,
  onOpenScoreboard,
  onAddLevel1Time,
  onGoHome,
  level2Phase,
  level2TimeLeft,
  onSkipLevel2Phase,
  level3DoorNumber,
}) => {
  const formatCountdown = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const l1List = getActiveLevel1Data();
  const l2List = getActiveLevel2Data();
  const l3List = getActiveLevel3Data();
  const currentL1 = l1List[stats.currentQuestionIndex % l1List.length];
  const currentL2 = l2List[stats.currentQuestionIndex % l2List.length];
  const currentL3 = l3List[(level3DoorNumber - 1) % l3List.length];

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-3 sm:p-5 z-20">
      {/* Top Bar */}
      <div className="w-full flex items-start justify-between gap-2 sm:gap-4">
        {/* Left Cluster: 5 Nyawa & Level 1 5-Min Timer or Score */}
        <div className="flex flex-col gap-1.5 pointer-events-auto">
          {/* 5 Hearts */}
          <div className="flex items-center gap-1.5 bg-white/95 border-2 border-amber-900/15 px-3 py-1.5 rounded-2xl shadow-md">
            <span className="text-[11px] font-black text-rose-600 mr-1 uppercase">Nyawa:</span>
            <div className="flex items-center gap-0.5 sm:gap-1">
              {[0, 1, 2, 3, 4].map((idx) => (
                <Heart
                  key={idx}
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                    idx < stats.hearts
                      ? 'fill-rose-500 text-rose-600 scale-100'
                      : 'fill-slate-200 text-slate-300 scale-75 opacity-40'
                  }`}
                />
              ))}
            </div>

            {stats.streak > 1 && (
              <div className="ml-1 flex items-center gap-1 bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full text-xs animate-bounce">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{stats.streak}x</span>
              </div>
            )}
          </div>

          {/* Always display current score prominently across ALL levels during gameplay! */}
          <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 border-2 border-amber-500/80 px-3.5 py-1.5 rounded-2xl shadow-md flex items-center justify-between min-w-[140px] pointer-events-auto">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-900 fill-amber-700" />
              <span className="text-xs font-black text-amber-950 uppercase tracking-wide">Skor:</span>
            </div>
            <span className="text-lg font-black text-amber-950 font-mono tabular-nums drop-shadow-xs">
              {stats.score.toLocaleString()}
            </span>
          </div>

          {/* Level 1: 2-minute timer & Add time button */}
          {levelConfig.level === 1 && (
            <div className="flex flex-col gap-1">
              <div className={`px-3 py-1.5 rounded-2xl shadow-md flex items-center justify-between border-2 min-w-[170px] ${
                stats.level1TotalTimeLeft <= 30
                  ? 'bg-rose-50 border-rose-500 text-rose-950 animate-pulse'
                  : 'bg-emerald-50 border-emerald-500 text-emerald-950'
              }`}>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Masa 2 Min:</span>
                </div>
                <span className="text-base font-black font-mono">
                  {formatCountdown(stats.level1TotalTimeLeft)}
                </span>
              </div>

              {/* Tambah masa button: "pemain blh tambah masa tapi nyawa akan ditolak 1" */}
              {stats.hearts > 1 && (
                <button
                  onClick={onAddLevel1Time}
                  className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl text-[11px] font-extrabold text-amber-950 flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shadow-xs"
                  title="Tambah 60 saat dengan menolak 1 nyawa"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-amber-700" />
                  <span>+60s Masa (-1 Nyawa)</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Center: Question Billboard */}
        <div className="flex-1 max-w-2xl px-1">
          <div className="bg-white/95 border-2 border-sky-600/30 rounded-2xl shadow-lg px-4 py-2 sm:px-6 sm:py-2.5 transition-all duration-300">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold text-white bg-sky-600 shadow-xs">
                {levelConfig.level === 1
                  ? 'Tahap 1: Cari Nilai (X, Y)'
                  : levelConfig.level === 2
                  ? 'Tahap 2: Bentukkan Persamaan'
                  : `Tahap 3: 🚪 Pintu ${level3DoorNumber} / 4`}
              </span>

              {levelConfig.level === 3 ? (
                <div className={`flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border transition-all ${
                  stats.orangesCollected >= 5
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse'
                    : 'bg-orange-100 text-orange-950 border-orange-300'
                }`}>
                  {stats.orangesCollected >= 5 ? (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Pintu Terbuka! Terbang Masuk</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-orange-600" />
                      <span>Kumpul Oren: {stats.orangesCollected} / 5</span>
                    </>
                  )}
                </div>
              ) : (
                <span className="text-xs font-bold text-slate-500">
                  Soalan {stats.currentQuestionIndex + 1} / {levelConfig.targetQuestions}
                </span>
              )}
            </div>

            {/* Level 1 Question */}
            {levelConfig.level === 1 && currentL1 && (
              <div className="text-center space-y-0.5">
                <div className="flex items-center justify-center gap-2">
                  <span className="px-2.5 py-0.5 bg-amber-100 border border-amber-300 rounded-lg text-base sm:text-lg font-black text-amber-950 font-mono">
                    {currentL1.eq1}
                  </span>
                  <span className="text-xs font-bold text-slate-400">DAN</span>
                  <span className="px-2.5 py-0.5 bg-amber-100 border border-amber-300 rounded-lg text-base sm:text-lg font-black text-amber-950 font-mono">
                    {currentL1.eq2}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-700">
                  Terbangkan Capy melepasi gerbang koordinat (x, y) yang tepat!
                </p>
              </div>
            )}

            {/* Level 2 Question: Large & complete text */}
            {levelConfig.level === 2 && currentL2 && (
              <div className="text-center space-y-1 max-w-xl mx-auto">
                <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                  {currentL2.story}
                </p>
                <div className="text-xs sm:text-sm font-black text-blue-950 bg-blue-100/95 py-1 px-3 rounded-xl inline-block border border-blue-300 shadow-xs">
                  ❓ {currentL2.question}
                </div>
              </div>
            )}

            {/* Level 3 Question */}
            {levelConfig.level === 3 && currentL3 && (
              <div className="text-center space-y-0.5">
                <div className="text-sm font-extrabold text-amber-950">
                  {currentL3.doorTitle}
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  Kumpul sekurang-kurangnya 5 oren untuk membuka pintu bilik ini dan plot graf!
                </div>
              </div>
            )}
          </div>

          {/* Feedback Toast (No correct answer spoiler!) */}
          {feedbackText && (
            <div
              className={`mt-2 mx-auto w-fit px-4 py-1.5 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all animate-bounce ${
                isFeedbackCorrect
                  ? 'bg-emerald-500 text-white border border-emerald-400'
                  : 'bg-rose-500 text-white border border-rose-400'
              }`}
            >
              {feedbackText}
            </div>
          )}

          {/* Level 2: 10s study timer banner */}
          {levelConfig.level === 2 && level2Phase === 'STUDY' && (
            <div className="mt-2 pointer-events-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2.5 rounded-2xl shadow-xl flex items-center justify-between gap-2 border-2 border-white/40">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-black text-base animate-pulse">
                  {level2TimeLeft}s
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-sky-200">
                    Masa 10 Saat Meneliti Soalan
                  </div>
                  <div className="text-xs text-white/90 font-medium">
                    Teliti soalan di atas sebelum Capy mula terbang ke arah gerbang jawapan!
                  </div>
                </div>
              </div>

              <button
                onClick={onSkipLevel2Phase}
                className="px-3.5 py-1.5 bg-white text-indigo-900 font-extrabold text-xs rounded-xl shadow-md hover:bg-amber-100 active:scale-95 flex items-center gap-1 cursor-pointer transition-all shrink-0"
              >
                <Play className="w-3 h-3 fill-indigo-900" />
                <span>Terbang Sekarang 🚀</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Cluster: Menu Utama, Scoreboard, Audio & Pause */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Quick Menu Utama Button */}
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="h-10 px-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-white border-2 border-amber-300 active:scale-95 shadow-md flex items-center gap-1.5 transition-all cursor-pointer font-bold text-xs"
              title="Kembali ke Menu Utama"
            >
              <Home className="w-4 h-4 text-amber-100" />
              <span className="hidden sm:inline">Menu Utama</span>
            </button>
          )}

          {/* Scoreboard Button */}
          <button
            onClick={onOpenScoreboard}
            className="w-10 h-10 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white active:scale-95 shadow-md flex items-center justify-center transition-all cursor-pointer border-2 border-amber-300"
            title="Buka Papan Skor (Scoreboard)"
          >
            <Trophy className="w-5 h-5 fill-white" />
          </button>

          <button
            onClick={onToggleMute}
            className="w-10 h-10 rounded-2xl bg-white/95 border-2 border-amber-900/15 text-slate-700 hover:text-amber-800 hover:bg-amber-50 active:scale-95 shadow-md flex items-center justify-center transition-all cursor-pointer"
            title={isMuted ? 'Buka Bunyi' : 'Senyapkan Bunyi'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
          </button>

          <button
            onClick={onPause}
            className="w-10 h-10 rounded-2xl bg-white/95 border-2 border-amber-900/15 text-slate-700 hover:text-amber-800 hover:bg-amber-50 active:scale-95 shadow-md flex items-center justify-center transition-all cursor-pointer"
            title="Jeda (Pause)"
          >
            <Pause className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Area: Controls Hint + THE SPEED & SLOW DOWN BUTTONS */}
      <div className="w-full flex items-end justify-between pointer-events-auto gap-2">
        <div className="bg-white/90 border border-slate-300 px-3 py-1.5 rounded-2xl shadow-xs text-xs text-slate-600 font-medium hidden md:flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-semibold text-[11px]">W/S</kbd>
          <span>atau</span>
          <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-semibold text-[11px]">▲/▼</kbd>
          <span>Ketinggian ·</span>
          <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-semibold text-[11px]">Space</kbd>
          <span>Kepak ·</span>
          <kbd className="px-1.5 py-0.5 bg-teal-100 border border-teal-300 rounded font-bold text-teal-900 text-[11px]">A</kbd>
          <span>Perlahan ·</span>
          <kbd className="px-1.5 py-0.5 bg-sky-100 border border-sky-300 rounded font-bold text-sky-900 text-[11px]">S</kbd>
          <span>Biasa ·</span>
          <kbd className="px-1.5 py-0.5 bg-amber-100 border border-amber-300 rounded font-bold text-amber-900 text-[11px]">D</kbd>
          <span>Laju</span>
        </div>

        {/* Action Flight Control Buttons: SLOW DOWN, NORMAL & SPEED UP (Boleh sentiasa bertukar mode mengikut kesesuaian!) */}
        <div 
          className="flex items-center gap-1.5 sm:gap-2 ml-auto bg-slate-900/60 backdrop-blur-xs p-1.5 rounded-3xl border border-white/30 shadow-2xl"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* SLOW DOWN BUTTON */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSlowBoost();
            }}
            className={`py-2.5 px-3 sm:py-3 sm:px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md border-2 transition-all cursor-pointer select-none active:scale-95 ${
              isSlowBoostActive
                ? 'bg-teal-500 text-white border-white ring-4 ring-teal-400/80 shadow-teal-500/50 scale-105 animate-pulse'
                : 'bg-teal-950/70 text-teal-200 border-teal-600/50 hover:bg-teal-900/90 hover:text-white'
            }`}
            title="Klik untuk bertukar kepada Mod Perlahan (Slow Mode)"
          >
            <Snail className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>{isSlowBoostActive ? '🐢 PERLAHAN' : '🐢 SLOW'}</span>
          </button>

          {/* NORMAL SPEED BUTTON */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onSetNormalSpeed) {
                onSetNormalSpeed();
              } else {
                onSetSpeedBoost(false);
                onSetSlowBoost(false);
              }
            }}
            className={`py-2.5 px-3 sm:py-3 sm:px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md border-2 transition-all cursor-pointer select-none active:scale-95 ${
              !isSlowBoostActive && !isSpeedBoostActive
                ? 'bg-sky-500 text-white border-white ring-4 ring-sky-400/80 shadow-sky-500/50 scale-105'
                : 'bg-sky-950/70 text-sky-200 border-sky-600/50 hover:bg-sky-900/90 hover:text-white'
            }`}
            title="Klik untuk kembali ke Kelajuan Biasa (Normal Speed)"
          >
            <Gauge className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>{!isSlowBoostActive && !isSpeedBoostActive ? '✈️ BIASA' : '✈️ NORMAL'}</span>
          </button>

          {/* SPEED UP BUTTON */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSpeedBoost();
            }}
            className={`py-2.5 px-3 sm:py-3 sm:px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md border-2 transition-all cursor-pointer select-none active:scale-95 ${
              isSpeedBoostActive
                ? 'bg-amber-500 text-white border-white ring-4 ring-amber-400/80 shadow-amber-500/50 scale-105 animate-pulse'
                : 'bg-amber-950/70 text-amber-200 border-amber-600/50 hover:bg-amber-900/90 hover:text-white'
            }`}
            title="Klik untuk bertukar kepada Mod Laju (Speed Mode)"
          >
            <Zap className={`w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0 transition-transform ${isSpeedBoostActive ? 'scale-125' : ''}`} />
            <span>{isSpeedBoostActive ? '⚡ LAJU' : '⚡ SPEED'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
