import React from 'react';
import { X, BookOpen, Heart, Zap, Clock, Key, ShieldAlert, Award } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
  onStartGame: (level: number) => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose, onStartGame }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-amber-50 to-orange-50 rounded-3xl shadow-2xl border-4 border-amber-900/20 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-white flex items-center justify-between border-b-2 border-amber-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/25 flex items-center justify-center shadow-xs">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight drop-shadow-xs">CARA BERMAIN</h2>
              <p className="text-xs font-bold text-amber-100">Panduan & Peraturan Capybara Linear Adventure</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/40 active:scale-95 flex items-center justify-center cursor-pointer transition-all text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-800 text-xs sm:text-sm">
          {/* Objective Card */}
          <div className="p-4 bg-white/90 border-2 border-amber-200 rounded-2xl shadow-xs">
            <h3 className="text-sm font-black text-amber-900 mb-1 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Objektif Permainan</span>
            </h3>
            <p className="text-slate-600 leading-relaxed text-xs">
              Bantu Capybara terbang melepasi gerbang jawapan yang tepat bagi menyelesaikan persamaan linear dua pemboleh ubah. Pilih jawapan yang betul untuk mara ke soalan seterusnya!
            </p>
          </div>

          {/* 3 Game Levels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl">
              <div className="flex items-center gap-1.5 font-black text-emerald-900 text-xs mb-1">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Tahap 1: Nilai (x, y)</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-tight">
                Masa 2 minit (120 saat) keseluruhan. Boleh tambah masa (+60s) dengan menolak 1 nyawa.
              </p>
            </div>

            <div className="p-3 bg-blue-50/80 border-2 border-blue-300 rounded-2xl">
              <div className="flex items-center gap-1.5 font-black text-blue-900 text-xs mb-1">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>Tahap 2: Bentuk Persamaan</span>
              </div>
              <p className="text-[11px] text-blue-800 leading-tight">
                Masa 10 saat meneliti setiap soalan baharu sebelum mula terbang. Pilihan jawapan dipaparkan besar & kemas.
              </p>
            </div>

            <div className="p-3 bg-orange-50/80 border-2 border-orange-300 rounded-2xl">
              <div className="flex items-center gap-1.5 font-black text-orange-900 text-xs mb-1">
                <Key className="w-4 h-4 text-orange-600" />
                <span>Tahap 3: 4 Pintu & Oren</span>
              </div>
              <p className="text-[11px] text-orange-800 leading-tight">
                Kumpul 5 biji oren untuk buka setiap pintu bilik (Perpustakaan, Sekolah, Muzium, Hari Sukan) & peroleh Kunci Emas!
              </p>
            </div>
          </div>

          {/* Controls & Mode Switching */}
          <div className="p-4 bg-white/90 border-2 border-amber-200 rounded-2xl space-y-2 shadow-xs">
            <h3 className="text-sm font-black text-amber-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Kawalan Kelajuan & Mod Penerbangan</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200">
                <span className="font-extrabold text-teal-900 block mb-0.5">🐢 Mod Perlahan (Slow Down):</span>
                <span className="text-teal-700 text-[11px]">
                  Tekan butang <strong>PERLAHAN</strong> atau kekunci <strong>A / Ctrl</strong> untuk melambatkan terbang supaya mudah mengira jawapan.
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <span className="font-extrabold text-amber-900 block mb-0.5">⚡ Mod Laju (Speed Up):</span>
                <span className="text-amber-700 text-[11px]">
                  Tekan butang <strong>LAJU</strong> atau kekunci <strong>Shift / D</strong> untuk memecut ke gerbang sebaik sahaja mendapat jawapan!
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
              Ketinggian: Gunakan kekunci <strong>▲/▼</strong> atau <strong>W/S</strong> atau <strong>Sentuh/Klik Skrin</strong> untuk mengawal posisi Capybara.
            </p>
          </div>

          {/* Hearts & Hazards */}
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-950 text-xs">5 Nyawa Penuh</h4>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                Pemain bermula dengan 5 nyawa. Memilih gerbang salah atau melanggar ribut awan akan menolak 1 nyawa. Jawapan disusun rawak setiap kali bermain supaya murid lebih memahami konsep!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-amber-100/60 border-t border-amber-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onStartGame(1);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
          >
            Faham, Mula Main Sekarang!
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 cursor-pointer transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
