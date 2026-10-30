import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Medal, Crown, Star, Sparkles, Trash2, RotateCcw, Flame, Check, AlertCircle } from 'lucide-react';
import { CapybaraMascot } from './CapybaraMascot';

export interface PlayerScoreRecord {
  id: string;
  name: string;
  score: number;
  level: number;
  doorsUnlocked: number;
  date: string;
}

interface PodiumLeaderboardProps {
  playerRecords?: PlayerScoreRecord[];
  currentPlayerName: string;
  currentScore?: number;
  onClearRecords?: () => void;
  onPlayAgain?: () => void;
}

const DEFAULT_TOP_PLAYERS: PlayerScoreRecord[] = [
  { id: 'def_1', name: 'Capy Wira', score: 2850, level: 3, doorsUnlocked: 4, date: 'Terhebat' },
  { id: 'def_2', name: 'Danish Matematik', score: 2400, level: 3, doorsUnlocked: 3, date: 'Terhebat' },
  { id: 'def_3', name: 'Alia Pintar', score: 1950, level: 2, doorsUnlocked: 2, date: 'Terhebat' },
  { id: 'def_4', name: 'Siti Cemerlang', score: 1600, level: 2, doorsUnlocked: 1, date: 'Terhebat' },
  { id: 'def_5', name: 'Ahmad Bijak', score: 1250, level: 1, doorsUnlocked: 0, date: 'Terhebat' },
];

export const PodiumLeaderboard: React.FC<PodiumLeaderboardProps> = ({
  playerRecords = [],
  currentPlayerName = 'Pemain',
  currentScore = 0,
  onClearRecords,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Combine real user records with baseline scores
  const allRecords = [...playerRecords];

  const sanitizedCurrentName = currentPlayerName.trim() || 'Pemain';
  const playerHasRecord = allRecords.some(
    (r) => r.name.trim().toLowerCase() === sanitizedCurrentName.toLowerCase()
  );

  if (!playerHasRecord && currentScore > 0) {
    allRecords.unshift({
      id: 'current_session',
      name: sanitizedCurrentName,
      score: currentScore,
      level: 1,
      doorsUnlocked: 0,
      date: 'Sesi Ini',
    });
  }

  // Combine with default top players to guarantee 5 entries
  const combined = [...allRecords, ...DEFAULT_TOP_PLAYERS];

  // Group by name taking highest score per player
  const playerBestMap = new Map<string, PlayerScoreRecord>();
  combined.forEach((rec) => {
    const key = rec.name.trim().toLowerCase();
    const existing = playerBestMap.get(key);
    if (!existing || rec.score > existing.score) {
      playerBestMap.set(key, rec);
    }
  });

  // Sort descending by score
  const sortedPlayers = Array.from(playerBestMap.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Pad to ensure 5 players
  while (sortedPlayers.length < 5) {
    const idx = sortedPlayers.length;
    sortedPlayers.push(DEFAULT_TOP_PLAYERS[idx] || {
      id: `pad_${idx}`,
      name: `Murid Pintar ${idx + 1}`,
      score: 1000 - idx * 100,
      level: 1,
      doorsUnlocked: 0,
      date: 'Terhebat',
    });
  }

  const rank1 = sortedPlayers[0];
  const rank2 = sortedPlayers[1];
  const rank3 = sortedPlayers[2];
  const rank4 = sortedPlayers[3];
  const rank5 = sortedPlayers[4];

  // Check if current player is in top 5 and at which rank (0 to 4)
  const playerRankIndex = sortedPlayers.findIndex(
    (p) => p.name.trim().toLowerCase() === sanitizedCurrentName.toLowerCase()
  );

  // Trigger celebratory confetti if player is on the podium or on mount!
  useEffect(() => {
    try {
      const colors = ['#F59E0B', '#3B82F6', '#EC4899', '#10B981', '#6366F1'];
      confetti({
        particleCount: playerRankIndex !== -1 ? 80 : 40,
        spread: 70,
        origin: { y: 0.6 },
        colors,
      });
    } catch {}
  }, [playerRankIndex]);

  // Player's best score from records or current
  const playerRecord = playerBestMap.get(sanitizedCurrentName.toLowerCase());
  const playerBestScore = Math.max(playerRecord?.score || 0, currentScore);

  return (
    <div className="w-full flex flex-col items-center">
      {/* 3D WOODEN ARCHED TOP 5 BANNER (Matching Capybara's Victory Stage Art!) */}
      <div className="relative mb-3 flex flex-col items-center">
        {/* Crown on top of sign */}
        <div className="relative -mb-2 z-10">
          <Crown className="w-8 h-8 text-amber-400 fill-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] animate-bounce" />
        </div>

        {/* Curved Wooden Plaque */}
        <div className="relative bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 px-8 py-2 rounded-3xl border-4 border-amber-900 shadow-2xl flex items-center gap-3">
          {/* Wood grain highlight */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 via-transparent to-white/15 pointer-events-none" />

          {/* Golden Star Left */}
          <Star className="w-5 h-5 text-yellow-300 fill-amber-300 drop-shadow-md animate-pulse" />

          {/* 3D Text: TOP 5 */}
          <h2 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wider font-sans uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] [text-shadow:_0_2px_0_#78350F,_0_4px_0_#451A03,_0_6px_6px_rgba(0,0,0,0.7)]">
            TOP 5
          </h2>

          {/* Golden Star Right */}
          <Star className="w-5 h-5 text-yellow-300 fill-amber-300 drop-shadow-md animate-pulse" />
        </div>
      </div>

      {/* TOP CELEBRATORY MASCOT SPEECH BANNER */}
      <div className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 p-2.5 sm:p-3 rounded-2xl border-2 border-amber-600 shadow-md text-amber-950 flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-white/70 flex items-center justify-center shrink-0 shadow-xs">
            <Trophy className="w-6 h-6 text-amber-800 animate-bounce" />
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>PENTAS JUARA MASCOT CAPYBARA LINEAR MATH</span>
            </div>
            <p className="text-xs sm:text-sm font-extrabold text-amber-950 leading-tight">
              {playerRankIndex === 0 ? (
                <span>🎉 Tahniah <span className="underline decoration-amber-800 font-black">{sanitizedCurrentName}</span>! Capybara anda melompat ke Puncak Tempat #1 Emas memegang Trofi! 👑</span>
              ) : playerRankIndex > 0 ? (
                <span>🌟 Hebat <span className="underline decoration-amber-800 font-black">{sanitizedCurrentName}</span>! Capybara anda berjaya naik ke Podium Tempat #{playerRankIndex + 1}!</span>
              ) : (
                <span>🐾 Capybara <span className="underline decoration-amber-800 font-black">{sanitizedCurrentName}</span> (Skor: {playerBestScore.toLocaleString()} pts) sedang bersedia mendaki ke Top 5!</span>
              )}
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-amber-950 text-amber-100 font-black text-[11px] shrink-0 shadow-inner">
          TOP 5 JUARA
        </span>
      </div>

      {/* 5-TIER 3D PODIUM STAGE (Matching the provided picture layout!) */}
      <div className="w-full max-w-xl mx-auto flex flex-col items-center">
        {/* UPPER TIER: #2 (Silver), #1 (Center Gold & Tallest), #3 (Bronze) */}
        <div className="w-full flex items-end justify-center gap-2 sm:gap-3 px-1">
          {/* RANK 2: SILVER PODIUM (Left) */}
          <div className="flex-1 flex flex-col items-center max-w-[155px]">
            {/* Mascot Capybara Holding Silver Medal */}
            <div className="relative -mb-3 z-10 flex flex-col items-center">
              {playerRankIndex === 1 && (
                <span className="px-2 py-0.5 bg-sky-500 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-md mb-1 animate-pulse border border-white">
                  ★ CAPY ANDA ★
                </span>
              )}
              <CapybaraMascot
                rank={2}
                isPlayer={playerRankIndex === 1}
                className="w-24 sm:w-28 h-32 sm:h-36"
              />
            </div>

            {/* Silver Podium Pedestal */}
            <div className={`w-full h-28 sm:h-34 rounded-t-3xl border-3 flex flex-col items-center justify-between p-2 shadow-xl transition-all ${
              playerRankIndex === 1
                ? 'bg-gradient-to-b from-slate-100 via-slate-200 to-slate-400 border-sky-400 ring-4 ring-sky-300/70 shadow-sky-500/30'
                : 'bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 border-slate-400 shadow-slate-400/20'
            }`}>
              {/* Silver Rim & Number */}
              <div className="flex items-center gap-1.5 bg-white/90 px-3 py-0.5 rounded-full border border-slate-300 shadow-xs">
                <Medal className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-sm font-black text-slate-800">2</span>
                <Star className="w-3 h-3 text-slate-400 fill-slate-400" />
              </div>

              {/* Player Name & Score */}
              <div className="text-center w-full px-1 py-0.5 bg-white/70 rounded-xl border border-slate-200">
                <span className="text-xs sm:text-sm font-black text-slate-900 block truncate" title={rank2.name}>
                  {rank2.name}
                </span>
                <span className="text-xs sm:text-sm font-black text-blue-800 font-mono block">
                  {rank2.score.toLocaleString()} pts
                </span>
              </div>

              <div className="text-[10px] font-bold text-slate-600 bg-white/60 px-2 py-0.5 rounded-lg border border-slate-200">
                Tahap {rank2.level} {rank2.doorsUnlocked > 0 ? `· 🚪${rank2.doorsUnlocked}` : ''}
              </div>
            </div>
          </div>

          {/* RANK 1: GOLD PODIUM (Center, Highest & Crowned Champion Mascot!) */}
          <div className="flex-1 flex flex-col items-center max-w-[190px] z-20">
            {/* Champion Capybara Mascot Holding Trophy with Spinning Propeller! */}
            <div className="relative -mb-4 z-10 flex flex-col items-center">
              <span className={`px-2.5 py-0.5 text-white rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-md mb-1 ${
                playerRankIndex === 0
                  ? 'bg-amber-600 ring-2 ring-yellow-300 animate-pulse border border-yellow-200'
                  : 'bg-amber-800'
              }`}>
                {playerRankIndex === 0 ? '👑 CAPY ANDA (JUARA 1) 👑' : '★ JUARA 1 EMAS ★'}
              </span>

              <CapybaraMascot
                rank={1}
                isPlayer={playerRankIndex === 0}
                hasCrown={true}
                className="w-28 sm:w-34 h-38 sm:h-44 cursor-pointer"
              />
            </div>

            {/* Gold Podium Pedestal (Tallest, with Laurel Wreath & Crown!) */}
            <div className={`w-full h-38 sm:h-48 rounded-t-3xl border-4 flex flex-col items-center justify-between p-2.5 shadow-2xl transition-all ${
              playerRankIndex === 0
                ? 'bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 border-amber-300 ring-4 ring-yellow-300 shadow-amber-500/50'
                : 'bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 border-amber-600 shadow-amber-950/25'
            }`}>
              {/* Crown & Laurel Numeral 1 */}
              <div className="flex items-center gap-1.5 bg-amber-950 text-amber-200 px-3 py-0.5 rounded-full border border-amber-600 shadow-xs">
                <Crown className="w-3.5 h-3.5 text-yellow-300 fill-yellow-400" />
                <span className="text-base font-black text-amber-300">1</span>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              </div>

              {/* Player Name & Score */}
              <div className="text-center w-full px-1 py-1 bg-amber-950/15 rounded-xl border border-amber-700/30">
                <span className="text-sm sm:text-base font-black text-amber-950 block truncate leading-tight" title={rank1.name}>
                  {rank1.name}
                </span>
                <span className="text-sm sm:text-base font-black text-amber-900 font-mono block drop-shadow-xs">
                  {rank1.score.toLocaleString()} pts
                </span>
              </div>

              <div className="text-[10px] font-black text-amber-950 bg-amber-100/90 px-2.5 py-0.5 rounded-lg border border-amber-300 shadow-xs">
                Tahap {rank1.level} · 🚪 {rank1.doorsUnlocked}/4 Pintu
              </div>
            </div>
          </div>

          {/* RANK 3: BRONZE PODIUM (Right) */}
          <div className="flex-1 flex flex-col items-center max-w-[155px]">
            {/* Mascot Capybara Holding Bronze Medal */}
            <div className="relative -mb-3 z-10 flex flex-col items-center">
              {playerRankIndex === 2 && (
                <span className="px-2 py-0.5 bg-orange-500 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-md mb-1 animate-pulse border border-white">
                  ★ CAPY ANDA ★
                </span>
              )}
              <CapybaraMascot
                rank={3}
                isPlayer={playerRankIndex === 2}
                className="w-24 sm:w-28 h-32 sm:h-36"
              />
            </div>

            {/* Bronze Podium Pedestal */}
            <div className={`w-full h-24 sm:h-30 rounded-t-3xl border-3 flex flex-col items-center justify-between p-2 shadow-xl transition-all ${
              playerRankIndex === 2
                ? 'bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 border-orange-400 ring-4 ring-orange-400/70 shadow-orange-500/30'
                : 'bg-gradient-to-b from-amber-600 via-amber-700 to-amber-800 border-amber-900 shadow-amber-950/20'
            }`}>
              {/* Bronze Rim & Number */}
              <div className="flex items-center gap-1.5 bg-white/90 px-3 py-0.5 rounded-full border border-amber-800 shadow-xs">
                <Medal className="w-3.5 h-3.5 text-amber-800" />
                <span className="text-sm font-black text-amber-950">3</span>
                <Star className="w-3 h-3 text-amber-700 fill-amber-700" />
              </div>

              {/* Player Name & Score */}
              <div className="text-center w-full px-1 py-0.5 bg-amber-950/40 rounded-xl border border-amber-700/40">
                <span className="text-xs sm:text-sm font-black text-amber-100 block truncate" title={rank3.name}>
                  {rank3.name}
                </span>
                <span className="text-xs sm:text-sm font-black text-yellow-200 font-mono block">
                  {rank3.score.toLocaleString()} pts
                </span>
              </div>

              <div className="text-[10px] font-bold text-amber-200 bg-amber-950/50 px-2 py-0.5 rounded-lg border border-amber-700">
                Tahap {rank3.level} {rank3.doorsUnlocked > 0 ? `· 🚪${rank3.doorsUnlocked}` : ''}
              </div>
            </div>
          </div>
        </div>

        {/* LOWER TIER (FOREGROUND PEDESTALS): #4 (Left) and #5 (Right) - Exactly like user's picture! */}
        <div className="w-full max-w-md grid grid-cols-2 gap-3 -mt-3 z-30 px-2">
          {/* RANK 4 STEPPED PEDESTAL */}
          <div className="flex flex-col items-center">
            {/* Rank 4 Cheerful Encouraging Capybara */}
            <div className="relative -mb-3 z-10 flex flex-col items-center">
              {playerRankIndex === 3 && (
                <span className="px-2 py-0.2 bg-emerald-600 text-white rounded-full text-[9px] font-black uppercase shadow-xs mb-0.5 animate-bounce">
                  ★ ANDA ★
                </span>
              )}
              <CapybaraMascot
                rank={4}
                isPlayer={playerRankIndex === 3}
                className="w-20 sm:w-24 h-26 sm:h-30"
              />
            </div>

            {/* Stepped Wooden Block #4 */}
            <div className={`w-full h-22 sm:h-26 rounded-2xl border-3 flex flex-col items-center justify-between p-2 shadow-lg transition-all ${
              playerRankIndex === 3
                ? 'bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 border-emerald-400 ring-4 ring-emerald-300 shadow-emerald-500/30'
                : 'bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 border-amber-950 shadow-amber-950/30'
            }`}>
              <div className="flex items-center gap-1 bg-amber-950/80 px-2.5 py-0.2 rounded-full border border-amber-700 text-amber-200 text-xs font-black">
                <span>4</span>
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              </div>

              <div className="text-center w-full px-1">
                <span className="text-xs font-black text-amber-100 block truncate" title={rank4.name}>
                  {rank4.name}
                </span>
                <span className="text-xs font-black text-yellow-300 font-mono block">
                  {rank4.score.toLocaleString()} pts
                </span>
              </div>

              <span className="text-[9px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.2 rounded-md">
                Tahap {rank4.level} · 🚪{rank4.doorsUnlocked}/4
              </span>
            </div>
          </div>

          {/* RANK 5 STEPPED PEDESTAL */}
          <div className="flex flex-col items-center">
            {/* Rank 5 Cheerful Encouraging Capybara */}
            <div className="relative -mb-3 z-10 flex flex-col items-center">
              {playerRankIndex === 4 && (
                <span className="px-2 py-0.2 bg-blue-600 text-white rounded-full text-[9px] font-black uppercase shadow-xs mb-0.5 animate-bounce">
                  ★ ANDA ★
                </span>
              )}
              <CapybaraMascot
                rank={5}
                isPlayer={playerRankIndex === 4}
                className="w-20 sm:w-24 h-26 sm:h-30"
              />
            </div>

            {/* Stepped Wooden Block #5 */}
            <div className={`w-full h-22 sm:h-26 rounded-2xl border-3 flex flex-col items-center justify-between p-2 shadow-lg transition-all ${
              playerRankIndex === 4
                ? 'bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 border-blue-400 ring-4 ring-blue-300 shadow-blue-500/30'
                : 'bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 border-amber-950 shadow-amber-950/30'
            }`}>
              <div className="flex items-center gap-1 bg-amber-950/80 px-2.5 py-0.2 rounded-full border border-amber-700 text-amber-200 text-xs font-black">
                <span>5</span>
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              </div>

              <div className="text-center w-full px-1">
                <span className="text-xs font-black text-amber-100 block truncate" title={rank5.name}>
                  {rank5.name}
                </span>
                <span className="text-xs font-black text-yellow-300 font-mono block">
                  {rank5.score.toLocaleString()} pts
                </span>
              </div>

              <span className="text-[9px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.2 rounded-md">
                Tahap {rank5.level} · 🚪{rank5.doorsUnlocked}/4
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CLIMBING STATUS CARD (If current player is not yet in Top 5) */}
      {playerRankIndex === -1 && (
        <div className="w-full max-w-xl mt-3 p-3 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 rounded-2xl border-2 border-amber-300 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <CapybaraMascot rank={5} className="w-14 h-16 shrink-0" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-amber-950">
                  Capybara {sanitizedCurrentName} (Anda)
                </span>
                <span className="px-1.5 py-0.2 bg-amber-600 text-white rounded text-[9px] font-black">
                  MENDAKI PODIUM
                </span>
              </div>
              <span className="text-[10px] font-medium text-amber-800">
                Skor Anda: <strong className="font-mono">{playerBestScore.toLocaleString()} pts</strong> · Kumpul {(rank5.score - playerBestScore + 10).toLocaleString()} pts lagi untuk rebut tempat di Top 5!
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-black text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-xl border border-amber-300 shadow-xs shrink-0">
            <Flame className="w-3.5 h-3.5 text-orange-600 animate-bounce" />
            <span>Terus Berjuang!</span>
          </div>
        </div>
      )}
    </div>
  );
};
