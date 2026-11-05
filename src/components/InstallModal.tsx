import React, { useState } from 'react';
import { X, Download, Smartphone, Apple, Laptop, Sparkles, CheckCircle2, Share, PlusSquare, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallModalProps {
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'ANDROID' | 'IOS' | 'DESKTOP'>(
    isIOS ? 'IOS' : 'ANDROID'
  );
  const [isInstalling, setIsInstalling] = useState(false);

  const handleDirectInstall = async () => {
    setIsInstalling(true);
    await install();
    setIsInstalling(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs select-none animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-900/20 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-sky-600 via-sky-500 to-amber-500 text-white flex items-center justify-between border-b-2 border-sky-700">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center shadow-inner">
              <Download className="w-5 h-5 text-amber-200 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-100 bg-sky-900/40 px-2 py-0.2 rounded-md">
                  PWA PROGRESSIVE APP
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <h2 className="text-lg font-black tracking-tight leading-tight">
                PASANG APLIKASI DI SEMUA PERANTI
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-white/20 hover:bg-white/40 active:scale-95 flex items-center justify-center cursor-pointer transition-all text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mascot App Preview Card */}
        <div className="bg-gradient-to-r from-sky-50 via-amber-50 to-orange-50 p-3 sm:p-4 border-b border-sky-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/pwa-192x192.png"
              alt="Capybara Linear Adventure Icon"
              className="w-14 h-14 rounded-2xl shadow-md border-2 border-amber-400 object-cover shrink-0"
            />
            <div>
              <h3 className="text-sm font-black text-slate-900 leading-tight">
                Capybara Linear Adventure
              </h3>
              <p className="text-[11px] font-bold text-slate-500">
                Kembara Persamaan Linear (Matematik KSSM)
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Percuma & Selamat
                </span>
                <span className="text-[10px] font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Mod Luar Talian
                </span>
              </div>
            </div>
          </div>

          {/* Quick Install Button if browser supports 1-tap install */}
          {isInstallable && !isInstalled && (
            <button
              onClick={handleDirectInstall}
              disabled={isInstalling}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-white font-black text-xs shadow-lg shadow-amber-500/30 border-2 border-amber-700 active:scale-95 transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>{isInstalling ? 'Memasang...' : 'Pasang Terus'}</span>
            </button>
          )}

          {isInstalled && (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-black text-xs shadow-xs flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Dipasang
            </span>
          )}
        </div>

        {/* Device Selection Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-3 pt-2.5 gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('ANDROID')}
            className={`flex-1 py-2 px-2 rounded-t-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border-t-2 border-x-2 ${
              activeTab === 'ANDROID'
                ? 'bg-white border-slate-200 border-b-transparent text-sky-700 shadow-xs'
                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Android / Tablet</span>
          </button>

          <button
            onClick={() => setActiveTab('IOS')}
            className={`flex-1 py-2 px-2 rounded-t-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border-t-2 border-x-2 ${
              activeTab === 'IOS'
                ? 'bg-white border-slate-200 border-b-transparent text-slate-900 shadow-xs'
                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Apple className="w-4 h-4 text-slate-800" />
            <span>iPhone / iPad</span>
          </button>

          <button
            onClick={() => setActiveTab('DESKTOP')}
            className={`flex-1 py-2 px-2 rounded-t-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border-t-2 border-x-2 ${
              activeTab === 'DESKTOP'
                ? 'bg-white border-slate-200 border-b-transparent text-blue-700 shadow-xs'
                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Laptop className="w-4 h-4 text-blue-600" />
            <span>Laptop / PC</span>
          </button>
        </div>

        {/* Tab Content Instructions */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5">
          {activeTab === 'ANDROID' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-bold">
                📱 Sesuai untuk semua telefon Android (Samsung, Xiaomi, Oppo, Vivo, Poco, Honor, dsb.) menggunakan <strong>Google Chrome</strong> atau <strong>Samsung Internet</strong>:
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="text-xs font-semibold text-slate-700">
                    Buka pautan permainan ini di pelayar <strong>Google Chrome</strong> pada telefon anda.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="text-xs font-semibold text-slate-700">
                    Tekan ikon <strong>tiga titik (⋮)</strong> di sudut atas sebelah kanan pelayar.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div className="text-xs font-semibold text-slate-700">
                    Pilih <strong>"Pasang aplikasi" (Install app)</strong> atau <strong>"Tambah ke Skrin Utama" (Add to Home screen)</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-emerald-100/70 border border-emerald-300 rounded-2xl shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="text-xs font-black text-emerald-950">
                    Selesai! Ikon Capybara kini muncul di skrin utama telefon anda seperti aplikasi Play Store biasa tanpa sebarang iklan!
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'IOS' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-950 font-bold">
                🍎 Sesuai untuk semua <strong>iPhone</strong> dan <strong>iPad</strong> menggunakan pelayar <strong>Safari</strong>:
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="text-xs font-semibold text-slate-700">
                    Buka laman permainan ini di pelayar <strong>Safari</strong> pada iPhone / iPad anda.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 flex-wrap">
                    <span>Tekan butang</span>
                    <span className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded-md font-black flex items-center gap-1 text-sky-700">
                      <Share className="w-3.5 h-3.5" /> Kongsi (Share)
                    </span>
                    <span>di bar bawah Safari.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 flex-wrap">
                    <span>Skrol ke bawah menu dan tekan</span>
                    <span className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded-md font-black flex items-center gap-1 text-slate-900">
                      <PlusSquare className="w-3.5 h-3.5" /> Tambah ke Skrin Utama (Add to Home Screen)
                    </span>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                    4
                  </div>
                  <div className="text-xs font-semibold text-slate-700">
                    Tekan <strong>Tambah (Add)</strong> di penjuru kanan atas.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-sky-100/70 border border-sky-300 rounded-2xl shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
                  <div className="text-xs font-black text-sky-950">
                    Tahniah! Ikon Capybara kini berada di skrin utama iOS anda dan akan dilancarkan dalam skrin penuh (fullscreen) tanpa bar Safari!
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'DESKTOP' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-950 font-bold">
                💻 Sesuai untuk <strong>Windows 10/11</strong>, <strong>MacBook / macOS</strong>, dan <strong>Chromebook</strong> (Google Chrome, Microsoft Edge, Brave):
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="text-xs font-semibold text-slate-700">
                    Buka laman ini menggunakan <strong>Google Chrome</strong> atau <strong>Microsoft Edge</strong> pada komputer anda.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 flex-wrap">
                    <span>Lihat di hujung kanan <strong>Bar Alamat URL</strong> di atas, anda akan melihat ikon</span>
                    <span className="px-2 py-0.5 bg-blue-50 border border-blue-300 rounded-md font-black text-blue-800 flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> Pasang (Install)
                    </span>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div className="text-xs font-semibold text-slate-700">
                    Tekan <strong>"Pasang" (Install)</strong>. Permainan akan dibuka dalam tetingkap aplikasi kendiri (standalone window) dan pintasan diletakkan di Desktop / Start Menu!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Key Advantages Info */}
          <div className="p-3.5 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl space-y-1.5">
            <h4 className="text-xs font-black text-amber-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Kelebihan Memasang Sebagai Aplikasi PWA:</span>
            </h4>
            <ul className="text-[11px] font-bold text-amber-900 space-y-1 list-disc list-inside">
              <li>Pemuatan sangat pantas dan boleh dimainkan bila-bila masa walaupun tiada internet.</li>
              <li>Paparan skrin penuh bersih tanpa bar pelayar yang mengganggu kawalan lompatan.</li>
              <li>Menyimpan rekod skor dan pintu bilik kelas terus pada peranti anda secara kekal.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500">
            KSSM Tingkatan 1 · Bab 6 Persamaan Linear
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all"
          >
            Faham & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
