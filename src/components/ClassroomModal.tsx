import React, { useState, useRef, useEffect } from 'react';
import { Level3ClassroomQuestion } from '../types/game';
import { sounds } from '../utils/audio';
import { Key, Sparkles, CheckCircle2, ArrowRight, BookOpen, Lock, Unlock, Home } from 'lucide-react';

interface ClassroomModalProps {
  question: Level3ClassroomQuestion;
  hearts: number;
  onDeductHeart: () => void;
  onSolveDoor: (doorNum: number) => void;
  onGoHome?: () => void;
}

export const ClassroomModal: React.FC<ClassroomModalProps> = ({
  question,
  hearts,
  onDeductHeart,
  onSolveDoor,
  onGoHome,
}) => {
  const [step, setStep] = useState<'EQUATION' | 'GRAPH' | 'KEY_EARNED'>('EQUATION');
  const [selectedEqIdx, setSelectedEqIdx] = useState<number | null>(null);
  const [eqError, setEqError] = useState(false);

  // Graph state
  const [plottedPoint, setPlottedPoint] = useState<[number, number] | null>(null);
  const [hoverPoint, setHoverPoint] = useState<[number, number] | null>(null);
  const [graphError, setGraphError] = useState<string | null>(null);
  const [showLines, setShowLines] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Play serious music on entering room
  useEffect(() => {
    sounds.startSeriousBgm();
    return () => {
      // When leaving room, return to gameplay bgm
      sounds.startGameBgm();
    };
  }, []);

  useEffect(() => {
    setStep('EQUATION');
    setSelectedEqIdx(null);
    setEqError(false);
    setPlottedPoint(null);
    setHoverPoint(null);
    setGraphError(null);
    setShowLines(false);
  }, [question]);

  const handleSelectEquation = (idx: number) => {
    setSelectedEqIdx(idx);
    if (idx === question.correctEqIndex) {
      setEqError(false);
      sounds.playCorrect();
      setTimeout(() => {
        setStep('GRAPH');
      }, 700);
    } else {
      setEqError(true);
      sounds.playWrong();
      onDeductHeart();
      // "jangan paparkan jawapan sekiranya salah jawab"
      setTimeout(() => setEqError(false), 1400);
    }
  };

  // Draw Cartesian Graph
  useEffect(() => {
    if (step !== 'GRAPH' && step !== 'KEY_EARNED') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const paddingLeft = 50;
    const paddingBottom = 40;
    const paddingTop = 25;
    const paddingRight = 30;

    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;

    const maxX = question.xRange[1];
    const maxY = question.yRange[1];

    const toScreenX = (x: number) => paddingLeft + (x / maxX) * plotWidth;
    const toScreenY = (y: number) => height - paddingBottom - (y / maxY) * plotHeight;

    // Clear
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // 1. Grid
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;

    for (let x = 0; x <= maxX; x++) {
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, paddingTop);
      ctx.lineTo(sx, height - paddingBottom);
      ctx.stroke();
    }

    for (let y = 0; y <= maxY; y++) {
      const sy = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(paddingLeft, sy);
      ctx.lineTo(width - paddingRight, sy);
      ctx.stroke();
    }

    // 2. Axes
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2.5;

    // X Axis
    ctx.beginPath();
    ctx.moveTo(paddingLeft, height - paddingBottom);
    ctx.lineTo(width - paddingRight + 10, height - paddingBottom);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(paddingLeft, height - paddingBottom);
    ctx.lineTo(paddingLeft, paddingTop - 10);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 12px "Fredoka", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let x = 0; x <= maxX; x += maxX > 15 ? 2 : 1) {
      const sx = toScreenX(x);
      ctx.fillText(`${x}`, sx, height - paddingBottom + 6);
    }
    ctx.fillText('Paksi-x', width - paddingRight, height - paddingBottom + 20);

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let y = 0; y <= maxY; y += maxY > 15 ? 2 : 1) {
      const sy = toScreenY(y);
      ctx.fillText(`${y}`, paddingLeft - 6, sy);
    }
    ctx.textAlign = 'center';
    ctx.fillText('Paksi-y', paddingLeft - 8, paddingTop - 15);

    // 3. Draw Intersecting Lines if solved
    if (showLines) {
      ctx.save();
      ctx.lineWidth = 3.5;

      // Line 1: Blue
      ctx.strokeStyle = '#2563EB';
      ctx.beginPath();
      if (question.doorNumber === 1) {
        ctx.moveTo(toScreenX(0), toScreenY(6));
        ctx.lineTo(toScreenX(6), toScreenY(0));
      } else if (question.doorNumber === 2) {
        ctx.moveTo(toScreenX(2), toScreenY(8));
        ctx.lineTo(toScreenX(10), toScreenY(0));
      } else if (question.doorNumber === 3) {
        ctx.moveTo(toScreenX(0), toScreenY(8));
        ctx.lineTo(toScreenX(8), toScreenY(0));
      } else {
        ctx.moveTo(toScreenX(0), toScreenY(24));
        ctx.lineTo(toScreenX(24), toScreenY(0));
      }
      ctx.stroke();

      // Line 2: Orange
      ctx.strokeStyle = '#EA580C';
      ctx.beginPath();
      if (question.doorNumber === 1) {
        ctx.moveTo(toScreenX(0), toScreenY(4));
        ctx.lineTo(toScreenX(8), toScreenY(0));
      } else if (question.doorNumber === 2) {
        ctx.moveTo(toScreenX(2), toScreenY(0));
        ctx.lineTo(toScreenX(10), toScreenY(8));
      } else if (question.doorNumber === 3) {
        ctx.moveTo(toScreenX(2), toScreenY(8));
        ctx.lineTo(toScreenX(6), toScreenY(0));
      } else {
        ctx.moveTo(toScreenX(0), toScreenY(6));
        ctx.lineTo(toScreenX(24), toScreenY(18));
      }
      ctx.stroke();
      ctx.restore();
    }

    // 4. Hover cursor
    if (hoverPoint && !showLines) {
      const [hx, hy] = hoverPoint;
      if (hx >= 0 && hx <= maxX && hy >= 0 && hy <= maxY) {
        const sx = toScreenX(hx);
        const sy = toScreenY(hy);

        ctx.strokeStyle = '#38BDF8';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx, height - paddingBottom);
        ctx.lineTo(sx, sy);
        ctx.lineTo(paddingLeft, sy);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#0284C7';
        ctx.beginPath();
        ctx.arc(sx, sy, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`(${hx}, ${hy})`, sx + 8, sy - 8);
      }
    }

    // 5. Plotted Point
    if (plottedPoint) {
      const [px, py] = plottedPoint;
      const sx = toScreenX(px);
      const sy = toScreenY(py);

      ctx.save();
      ctx.shadowColor = '#10B981';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(sx, sy, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = '#065F46';
      ctx.font = 'bold 12px "Fredoka", sans-serif';
      ctx.fillText(`Titik Persilangan (${px}, ${py})`, sx + 10, sy - 12);
    }
  }, [step, plottedPoint, hoverPoint, showLines, question]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (step !== 'GRAPH' || showLines) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const paddingLeft = 50;
    const paddingBottom = 40;
    const paddingTop = 25;
    const paddingRight = 30;

    const plotWidth = canvas.width - paddingLeft - paddingRight;
    const plotHeight = canvas.height - paddingTop - paddingBottom;

    const rawX = ((clickX - paddingLeft) / plotWidth) * question.xRange[1];
    const rawY = ((canvas.height - paddingBottom - clickY) / plotHeight) * question.yRange[1];

    const coordX = Math.round(rawX);
    const coordY = Math.round(rawY);
    const [targetX, targetY] = question.correctPoint;

    if (coordX === targetX && coordY === targetY) {
      setPlottedPoint([targetX, targetY]);
      setShowLines(true);
      setGraphError(null);
      sounds.playCorrect();

      setTimeout(() => {
        setStep('KEY_EARNED');
        sounds.playKeyObtain();
      }, 1200);
    } else {
      // "jangan paparkan jawapan sekiranya salah jawab"
      setGraphError(`Titik (${coordX}, ${coordY}) kurang tepat! -1 Nyawa. Selesaikan semula persamaan linear.`);
      sounds.playWrong();
      onDeductHeart();
      setTimeout(() => setGraphError(null), 2500);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (step !== 'GRAPH' || showLines) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const paddingLeft = 50;
    const paddingBottom = 40;
    const paddingTop = 25;
    const paddingRight = 30;

    const plotWidth = canvas.width - paddingLeft - paddingRight;
    const plotHeight = canvas.height - paddingTop - paddingBottom;

    const rawX = ((mouseX - paddingLeft) / plotWidth) * question.xRange[1];
    const rawY = ((canvas.height - paddingBottom - mouseY) / plotHeight) * question.yRange[1];

    setHoverPoint([Math.round(rawX), Math.round(rawY)]);
  };

  // Determine scene specific styling matching the user's uploaded image:
  const themeStyles = {
    library: {
      bg: 'bg-amber-100/90',
      doorColor: 'from-amber-400 to-yellow-300',
      doorBorder: 'border-amber-600',
      archIcon: '📖',
      bannerTitle: 'Pintu 1 : Kamus Puan Siti',
      tagText: 'Ilmu Membuka Dunia 📖',
    },
    school: {
      bg: 'bg-sky-100/90',
      doorColor: 'from-sky-500 to-blue-400',
      doorBorder: 'border-blue-600',
      archIcon: '🚻',
      bannerTitle: 'Pintu 2 : 20 Murid Lelaki & Perempuan',
      tagText: 'Bersama Membina Kejayaan 💙',
    },
    museum: {
      bg: 'bg-purple-100/90',
      doorColor: 'from-purple-500 to-indigo-400',
      doorBorder: 'border-purple-600',
      archIcon: '🏛️',
      bannerTitle: 'Pintu 3 : Tiket Muzium Danish & Alia',
      tagText: 'Muzium Ilmu Warisan Kita 🏛️',
    },
    sports: {
      bg: 'bg-rose-100/90',
      doorColor: 'from-rose-500 to-red-400',
      doorBorder: 'border-rose-600',
      archIcon: '🏃',
      bannerTitle: 'Pintu 4 : Hari Sukan Pasukan Merah & Biru',
      tagText: 'MERAH vs BIRU 🏆',
    },
  }[question.theme];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border-4 border-amber-900/30 overflow-hidden flex flex-col max-h-[96vh]">
        {/* Wooden Signboard Header Matching User Image */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-amber-100 flex items-center justify-between border-b-4 border-amber-950 shadow-md">
          <div className="flex items-center gap-3">
            {/* Wooden Plaque */}
            <div className="px-4 py-1.5 rounded-2xl bg-amber-200 border-2 border-amber-950 text-amber-950 font-black text-sm sm:text-base shadow-inner">
              {question.doorTitle}
            </div>
            <span className="text-xs font-bold text-amber-200 hidden sm:inline">
              Muzik Serius Dimainkan · Selesaikan Persamaan di Bilik Ini
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-rose-600 text-white rounded-xl text-xs font-black shadow-xs">
              Nyawa: {hearts} / 5
            </span>

            {onGoHome && (
              <button
                onClick={onGoHome}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white border border-amber-400 rounded-xl text-xs font-extrabold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                title="Kembali ke Menu Utama"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Menu Utama</span>
              </button>
            )}
          </div>
        </div>

        {/* The Scene Canvas & Workstation matching the uploaded picture! */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Top Visual Room Art Banner */}
          <div className={`p-4 rounded-3xl border-2 ${themeStyles.doorBorder} ${themeStyles.bg} flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm`}>
            {/* Left: Glowing Arch Portal */}
            <div className="flex items-center gap-4">
              <div className={`w-20 h-28 sm:w-24 sm:h-32 rounded-t-full bg-gradient-to-b ${themeStyles.doorColor} border-4 ${themeStyles.doorBorder} flex flex-col items-center justify-between py-2 shadow-lg shrink-0`}>
                <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-lg shadow-xs">
                  {themeStyles.archIcon}
                </div>
                <div className="w-full text-center text-[10px] font-black text-white bg-black/30 py-0.5">
                  PINTU {question.doorNumber}
                </div>
              </div>

              {/* Classroom Art & Motto */}
              <div>
                <span className="px-3 py-1 bg-white/90 border border-amber-800/20 rounded-full text-xs font-bold text-amber-950 inline-block mb-1.5 shadow-xs">
                  {themeStyles.tagText}
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed max-w-md">
                  {question.story}
                </p>
              </div>
            </div>

            {/* Right: Capybara studying at wooden desk with blue backpack and propeller beanie! */}
            <div className="flex items-center gap-3 bg-white/85 p-3 rounded-2xl border border-amber-900/15 shadow-sm shrink-0">
              {/* Capybara illustration at desk */}
              <div className="relative">
                <svg viewBox="0 0 120 100" className="w-20 h-16 overflow-visible">
                  {/* Wooden Desk */}
                  <rect x="5" y="70" width="110" height="15" rx="3" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
                  {/* Notebook on desk */}
                  <rect x="25" y="65" width="30" height="18" rx="2" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
                  <line x1="30" y1="71" x2="50" y2="71" stroke="#94A3B8" strokeWidth="1.5" />
                  <line x1="30" y1="76" x2="46" y2="76" stroke="#94A3B8" strokeWidth="1.5" />

                  {/* Blue Backpack */}
                  <rect x="42" y="32" width="22" height="34" rx="8" fill="#0284C7" stroke="#0369A1" strokeWidth="2.5" />
                  <rect x="46" y="38" width="14" height="12" rx="4" fill="#38BDF8" />

                  {/* Capybara Body */}
                  <ellipse cx="75" cy="50" rx="28" ry="22" fill="#C48E58" stroke="#1E1E1E" strokeWidth="3" />
                  {/* Snout */}
                  <ellipse cx="98" cy="55" rx="14" ry="12" fill="#A46E3E" stroke="#1E1E1E" strokeWidth="2.5" />
                  {/* Nose */}
                  <circle cx="106" cy="52" r="2.5" fill="#3B2314" />
                  {/* Closed Eye studying */}
                  <path d="M 88 45 Q 94 40 98 46" fill="none" stroke="#1E1E1E" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Rosy Cheek */}
                  <ellipse cx="86" cy="54" rx="4.5" ry="3.5" fill="#FF8D8D" opacity="0.8" />
                  {/* Ear */}
                  <circle cx="70" cy="34" r="5" fill="#945F34" stroke="#1E1E1E" strokeWidth="2.5" />

                  {/* Propeller Beanie on Capybara's head (as in the image!) */}
                  <ellipse cx="78" cy="30" rx="9" ry="5" fill="#38BDF8" stroke="#0369A1" strokeWidth="2" />
                  <line x1="78" y1="30" x2="78" y2="20" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Propeller blades */}
                  <ellipse cx="74" cy="20" rx="6" ry="2" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
                  <ellipse cx="82" cy="20" rx="6" ry="2" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
                  <circle cx="78" cy="20" r="2" fill="#E11D48" />

                  {/* Little paw holding pencil */}
                  <ellipse cx="62" cy="68" rx="5" ry="4" fill="#A46E3E" stroke="#1E1E1E" strokeWidth="2" />
                  <line x1="58" y1="72" x2="50" y2="67" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>

              <div className="text-left">
                <span className="text-[11px] font-black text-amber-900 block uppercase">
                  Capy Sedang Mengira
                </span>
                <span className="text-xs font-bold text-slate-600">
                  {step === 'EQUATION' ? 'Langkah 1: Pilih Persamaan' : step === 'GRAPH' ? 'Langkah 2: Plot Graf' : 'Kunci Diperoleh!'}
                </span>
              </div>
            </div>
          </div>

          {/* STEP 1: BENTUKKAN PERSAMAAN LINEAR */}
          {step === 'EQUATION' && (
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-800">
                Pilih pasangan persamaan linear yang tepat bagi situasi di atas:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {question.equationOptions.map((opt, idx) => {
                  const isSelected = selectedEqIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectEquation(idx)}
                      className={`p-4 rounded-2xl border-2 font-mono font-bold text-sm sm:text-base transition-all text-center cursor-pointer active:scale-95 shadow-sm ${
                        isSelected && !eqError
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400'
                          : isSelected && eqError
                          ? 'bg-rose-100 border-rose-500 text-rose-950 animate-shake'
                          : 'bg-white hover:bg-amber-50 border-slate-300 text-slate-800 hover:border-amber-500'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {eqError && (
                <div className="p-2.5 bg-rose-50 text-rose-800 border border-rose-300 rounded-xl text-xs font-bold text-center">
                  Jawapan kurang tepat! 1 nyawa ditolak. Kira semula dan pilih persamaan yang betul.
                </div>
              )}
            </div>
          )}

          {/* STEP 2: PLOT GRAF INTERAKTIF */}
          {(step === 'GRAPH' || step === 'KEY_EARNED') && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-sky-50 border border-sky-200 rounded-2xl p-3">
                <div>
                  <div className="text-xs font-black text-sky-900 uppercase tracking-wide">
                    Plotkan Titik Persilangan (x, y) pada Graf Kosong
                  </div>
                  <div className="text-xs text-sky-700 font-semibold">
                    Persamaan: <span className="font-mono font-bold">{question.eq1Label}</span> & <span className="font-mono font-bold">{question.eq2Label}</span>.
                    Klik koordinat persilangan untuk memunculkan dua garis bersilang!
                  </div>
                </div>

                {showLines && (
                  <div className="flex items-center gap-3 text-xs font-bold shrink-0">
                    <span className="flex items-center gap-1 text-blue-600">
                      <span className="w-3 h-1 bg-blue-600 inline-block rounded-xs" /> {question.eq1Label}
                    </span>
                    <span className="flex items-center gap-1 text-orange-600">
                      <span className="w-3 h-1 bg-orange-600 inline-block rounded-xs" /> {question.eq2Label}
                    </span>
                  </div>
                )}
              </div>

              <div className="relative w-full overflow-hidden bg-white border-2 border-slate-300 rounded-2xl shadow-inner flex items-center justify-center p-2">
                <canvas
                  ref={canvasRef}
                  width={680}
                  height={360}
                  onClick={handleCanvasClick}
                  onMouseMove={handleCanvasMouseMove}
                  className="w-full max-w-2xl h-auto block cursor-crosshair"
                />
              </div>

              {graphError && (
                <div className="p-2.5 bg-rose-50 text-rose-800 border border-rose-300 rounded-xl text-xs font-bold text-center">
                  {graphError}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: KUNCI EMAS DIPEROLEH */}
          {step === 'KEY_EARNED' && (
            <div className="p-5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-2xl border-4 border-amber-600 text-amber-950 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center">
                  <Key className="w-8 h-8 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div>
                  <h4 className="text-lg font-black tracking-tight text-amber-950">
                    TAHNIAH! KUNCI EMAS DIPEROLEH 🗝️
                  </h4>
                  <p className="text-xs font-bold text-amber-900">
                    Garis bersilang berjaya dimunculkan! Kunci emas ini membuka pintu keluar untuk terbang semula ke langit.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onGoHome && (
                  <button
                    onClick={onGoHome}
                    className="px-4 py-3 bg-white/90 hover:bg-white text-slate-800 font-extrabold text-xs sm:text-sm rounded-xl shadow-md border border-amber-800 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  >
                    <Home className="w-4 h-4 text-amber-700" />
                    <span>Menu Utama</span>
                  </button>
                )}

                <button
                  onClick={() => onSolveDoor(question.doorNumber)}
                  className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <span>{question.doorNumber < 4 ? `Buka Pintu Keluar & Kumpul Oren Untuk Pintu ${question.doorNumber + 1}` : 'Tamatkan Level 3! 🎉'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
