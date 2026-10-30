import React, { useState } from 'react';
import { Play, Settings, Music, VolumeX, User, BookOpen, Trophy, Layers, Sparkles, X } from 'lucide-react';
import { HowToPlayModal } from './HowToPlayModal';
import { CapybaraDuckIllustration } from './CapybaraDuckIllustration';
import menuBg from '../assets/images/capy_menu_bg_1792248852019.jpg';

interface TitleScreenProps {
  onStartGame: (level: number) => void;
  onOpenLevelSelect: () => void;
  onOpenScoreboard: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  highScores?: Record<number, number>;
  bestTimes?: Record<number, number>;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenLevelSelect,
  onOpenScoreboard,
  isMuted,
  onToggleMute,
  playerName,
  onPlayerNameChange,
}) => {
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  return (
    <div className="relative w-full h-full max-h-screen overflow-hidden select-none flex flex-col justify-between p-2.5 sm:p-4 bg-sky-200">
      {/* Background: User's Floating Island Art */}
      <div className="absolute inset-0 z-0">
        <img
          src={menuBg}
          alt="Capybara Linear Adventure Sky World"
          className="w-full h-full object-cover object-center pointer-events-none filter brightness-95"
          referrerPolicy="no-referrer"
        />
        {/* Subtle ambient lighting vignette that leaves islands vibrant */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/20 via-transparent to-amber-950/30 pointer-events-none" />
      </div>

      {/* TOP BAR: Controls & Malaysian Math Badge */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between">
        {/* Left Action Buttons: Level/Settings & Sound */}
        <div className="flex items-center gap-2">
          {/* Level Select / Settings Button */}
          <button
            onClick={onOpenLevelSelect}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-b from-amber-500 via-amber-600 to-amber-800 border-2 border-amber-300 shadow-lg shadow-amber-950/30 flex items-center justify-center text-amber-100 hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            title="Pilih Tahap / Tetapan"
          >
            <Settings className="w-5 h-5 drop-shadow-md group-hover:rotate-45 transition-transform" />
          </button>

          {/* Music Toggle Button */}
          <button
            onClick={onToggleMute}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-b from-amber-500 via-amber-600 to-amber-800 border-2 border-amber-300 shadow-lg shadow-amber-950/30 flex items-center justify-center text-amber-100 hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            title={isMuted ? 'Buka Bunyi' : 'Senyapkan Bunyi'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-rose-300 drop-shadow-md" />
            ) : (
              <Music className="w-5 h-5 text-amber-100 drop-shadow-md group-hover:scale-110 transition-transform" />
            )}
          </button>
        </div>

        {/* Right Badge: Malaysian Flag & Subject */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/75 backdrop-blur-xs border border-amber-400/50 text-white font-extrabold text-[11px] sm:text-xs shadow-md">
          <span>🇲🇾 Matematik KSSM · Persamaan Linear</span>
        </div>
      </div>

      {/* CENTER HERO CONTAINER: Perfectly sized to fit within viewport frame */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center justify-center my-auto px-2">
        {/* CUTE ADVENTURER CAPYBARA (Mascot riding duck with explorer backpack & spinning propeller hat!) */}
        <div className="relative -mb-3 sm:-mb-4 z-20 transform hover:scale-105 transition-transform duration-300 animate-float-soft cursor-pointer">
          <CapybaraDuckIllustration
            className="w-32 sm:w-40 h-auto drop-shadow-xl"
            eyeState="happy"
            hasBackpack={true}
            hasPropeller={true}
          />
        </div>

        {/* Title Wooden Banner with ULTRA 3D POPPING TEXT */}
        <div className="w-full relative bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 p-2 sm:p-2.5 rounded-3xl border-4 border-amber-900 shadow-2xl flex flex-col items-center text-center mb-2">
          {/* Green Leaf Corner Accents */}
          <div className="absolute -top-2 -left-2 w-5 h-5 bg-emerald-500 rounded-full border-2 border-emerald-700 shadow-xs rotate-45" />
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full border-2 border-emerald-700 shadow-xs -rotate-45" />

          {/* Line 1: CAPYBARA (Golden Yellow 3D Layered Extrusion) */}
          <h1 className="text-3xl sm:text-5xl font-black text-amber-300 tracking-widest uppercase font-sans drop-shadow-[0_4px_3px_rgba(0,0,0,0.9)] [text-shadow:_0_1px_0_#FEF08A,_0_2px_0_#F59E0B,_0_3px_0_#D97706,_0_4px_0_#B45309,_0_5px_0_#92400E,_0_6px_0_#78350F,_0_7px_0_#451A03,_0_9px_12px_rgba(0,0,0,0.85)] leading-none my-1 transform hover:scale-102 transition-transform">
            CAPYBARA
          </h1>

          {/* Line 2: LINEAR ADVENTURE (Sky-Blue 3D Layered Extrusion) */}
          <div className="text-xl sm:text-3xl md:text-4xl font-black text-sky-200 tracking-wider uppercase font-sans drop-shadow-[0_4px_3px_rgba(0,0,0,0.9)] [text-shadow:_0_1px_0_#E0F2FE,_0_2px_0_#38BDF8,_0_3px_0_#0284C7,_0_4px_0_#0369A1,_0_5px_0_#075985,_0_6px_0_#082F49,_0_7px_0_#0C1E33,_0_9px_12px_rgba(0,0,0,0.85)] leading-tight my-0.5">
            LINEAR ADVENTURE
          </div>

          {/* Ribbon: Kembara Persamaan Linear */}
          <div className="mt-1 px-3.5 py-0.5 bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 border-2 border-amber-800 rounded-xl shadow-md">
            <span className="text-[11px] sm:text-xs font-black text-amber-950 tracking-wider">
              • Kembara Persamaan Linear •
            </span>
          </div>
        </div>

        {/* INTERACTIVE CONTROLS CARD */}
        <div className="w-full flex flex-col items-center gap-2">
          {/* Player Name Input Card with Clear & Delete Rekod Buttons */}
          <div className="w-full relative bg-gradient-to-b from-amber-500 via-amber-600 to-amber-800 p-2 sm:p-2.5 rounded-2xl border-3 border-amber-900 shadow-lg">
            {/* Header Tag: NAMA PEMAIN */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 border-2 border-amber-800 px-3 py-0.5 rounded-full shadow-md text-[10px] sm:text-[11px] font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-amber-200">★</span>
              <span>NAMA PEMAIN</span>
              <span className="text-amber-200">★</span>
            </div>

            {/* Input Box with quick clear */}
            <div className="mt-2 flex items-center gap-2 bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-amber-800 rounded-xl px-3 py-1.5 shadow-inner">
              <User className="w-4 h-4 text-amber-800 shrink-0" />
              <input
                type="text"
                value={playerName}
                onChange={(e) => onPlayerNameChange(e.target.value)}
                placeholder="Tulis nama anda..."
                maxLength={24}
                className="w-full bg-transparent font-black text-xs sm:text-sm text-slate-800 placeholder-amber-900/40 focus:outline-none"
              />

              {/* Clear Name Button (X) if name exists */}
              {playerName && (
                <button
                  type="button"
                  onClick={() => onPlayerNameChange('')}
                  className="w-5 h-5 rounded-full bg-amber-200/80 hover:bg-amber-300 text-amber-900 flex items-center justify-center shrink-0 cursor-pointer text-xs font-black transition-colors"
                  title="Padam nama"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* LARGE JUICY PLAY BUTTON ("MULA") */}
          <button
            onClick={() => onStartGame(1)}
            className="w-full py-3 sm:py-3.5 px-6 rounded-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:scale-95 border-3 border-amber-900 shadow-xl shadow-amber-950/40 flex items-center justify-center gap-3 cursor-pointer transition-all group relative overflow-hidden"
          >
            {/* Leaf Accents */}
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-6 bg-emerald-500 rounded-r-full border border-emerald-700" />
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-6 bg-emerald-500 rounded-l-full border border-emerald-700" />

            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/30 border-2 border-white/60 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white translate-x-0.5" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] [text-shadow:_0_2px_0_#78350F,_0_3px_3px_rgba(0,0,0,0.5)]">
              Mula Bermain
            </span>
          </button>

          {/* SECONDARY ACTION BUTTONS: Pilih Tahap, Pencapaian, Cara Bermain */}
          <div className="w-full grid grid-cols-3 gap-1.5 sm:gap-2">
            {/* Pilih Tahap Button */}
            <button
              onClick={onOpenLevelSelect}
              className="py-2 px-1.5 sm:px-2 rounded-xl bg-gradient-to-b from-amber-200 via-amber-100 to-amber-200 hover:from-amber-100 hover:to-white active:scale-95 border-2 border-amber-800 shadow-md flex items-center justify-center gap-1 cursor-pointer transition-all text-amber-950 font-black text-[11px] sm:text-xs"
            >
              <Layers className="w-3.5 h-3.5 text-amber-800 shrink-0" />
              <span>Pilih Level</span>
            </button>

            {/* Podium Top 5 Button */}
            <button
              onClick={onOpenScoreboard}
              className="py-2 px-1.5 sm:px-2 rounded-xl bg-gradient-to-b from-amber-300 via-amber-200 to-amber-300 hover:from-amber-200 hover:to-white active:scale-95 border-2 border-amber-800 shadow-md flex items-center justify-center gap-1 cursor-pointer transition-all text-amber-950 font-black text-[11px] sm:text-xs"
              title="Lihat Podium Juara Top 5 Pemain"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-900 fill-amber-500 shrink-0" />
              <span>Podium Top 5</span>
            </button>

            {/* Cara Bermain Button */}
            <button
              onClick={() => setIsHowToPlayOpen(true)}
              className="py-2 px-1.5 sm:px-2 rounded-xl bg-gradient-to-b from-amber-200 via-amber-100 to-amber-200 hover:from-amber-100 hover:to-white active:scale-95 border-2 border-amber-800 shadow-md flex items-center justify-center gap-1 cursor-pointer transition-all text-amber-950 font-black text-[11px] sm:text-xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-800 shrink-0" />
              <span>Panduan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Flying Adventurer Capybara gliding across the sky world */}
      <div className="absolute left-6 md:left-14 top-1/3 -translate-y-1/2 z-10 pointer-events-none hidden xl:block animate-capy-fly-dynamic">
        <div className="relative transform hover:scale-105 transition-transform">
          <CapybaraDuckIllustration
            className="w-40 h-auto drop-shadow-2xl"
            eyeState="happy"
            hasBackpack={true}
            hasPropeller={true}
          />
          {/* Subtle wind speed trails */}
          <div className="absolute -left-6 top-1/2 w-10 h-1 bg-white/70 rounded-full blur-[0.5px]" />
          <div className="absolute -left-10 top-1/3 w-8 h-1 bg-white/60 rounded-full blur-[0.5px]" />
        </div>
      </div>

      {/* BOTTOM FOOTER: Controls Hint Bar (always fits in screen) */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-center pointer-events-none pb-0.5">
        <div className="bg-amber-950/80 backdrop-blur-xs px-3.5 py-1 rounded-full border border-amber-500/40 text-[10px] sm:text-[11px] text-amber-200 font-bold shadow-md text-center">
          <span>🎮 Kawalan: ▲▼ / W S Ketinggian · Space Kepak · 🐢 Perlahan · ⚡ Laju</span>
        </div>
      </div>

      {/* Cara Bermain Modal */}
      {isHowToPlayOpen && (
        <HowToPlayModal
          onClose={() => setIsHowToPlayOpen(false)}
          onStartGame={onStartGame}
        />
      )}
    </div>
  );
};
