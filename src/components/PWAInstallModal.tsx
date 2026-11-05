import React, { useState } from 'react';
import { Download, Smartphone, Laptop, Apple, CheckCircle2, X, ExternalLink, Sparkles } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  canDirectInstall: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onInstall,
  canDirectInstall,
  isIOS,
  isAndroid,
}) => {
  // Default active tab based on user's device
  const defaultTab = isIOS ? 'ios' : isAndroid ? 'android' : 'desktop';
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-gradient-to-b from-sky-50 via-white to-sky-50/60 rounded-3xl border-4 border-sky-400 shadow-2xl p-5 sm:p-6 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-sky-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-amber-400 p-0.5 shadow-md flex items-center justify-center">
              <img
                src="/pwa-192x192.png"
                alt="Capybara App"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <div>
              <h2 className="text-xl font-black text-sky-950 font-fredoka flex items-center gap-2">
                Pasang Aplikasi
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
              </h2>
              <p className="text-xs text-sky-700 font-medium">
                Main lancar di Android, iPhone/iPad & Laptop!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-800 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Device Switcher Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-sky-100/80 rounded-2xl mt-4 border border-sky-200">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'android'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android</span>
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'ios'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-slate-600 hover:text-sky-700'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>iOS / Apple</span>
          </button>
          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'desktop'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                : 'text-slate-600 hover:text-amber-700'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Laptop / PC</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1 text-slate-700 text-xs sm:text-sm">
          {activeTab === 'android' && (
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <div>
                  <p className="font-bold text-emerald-950">Pasang Terus (Paling Cepat):</p>
                  <p className="text-emerald-800 text-xs mt-0.5">
                    Tekan butang hijau <strong>&quot;Pasang Sekarang&quot;</strong> di bahagian bawah modal ini untuk memasang terus ke skrin telefon Android anda.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-xs">
                  2
                </span>
                <div>
                  <p className="font-bold text-slate-900">Atau Melalui Menu Chrome:</p>
                  <p className="text-slate-600 text-xs mt-0.5">
                    Tekan ikon menu <strong>tiga titik (⋮)</strong> di penjuru atas penyemak imbas Chrome, kemudian pilih <strong>&quot;Install app&quot;</strong> atau <strong>&quot;Tambah ke Skrin Utama&quot;</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="space-y-3">
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <div>
                  <p className="font-bold text-sky-950">Buka di Safari:</p>
                  <p className="text-sky-800 text-xs mt-0.5">
                    Pastikan anda membuka laman game ini di penyemak imbas <strong>Safari</strong> pada iPhone atau iPad anda.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-xs">
                  2
                </span>
                <div>
                  <p className="font-bold text-slate-900">Tekan Butang Kongsi (Share):</p>
                  <p className="text-slate-600 text-xs mt-0.5">
                    Tekan ikon <strong>Kongsi (petak dengan anak panah ke atas <ExternalLink className="w-3.5 h-3.5 inline mx-0.5 text-sky-600" />)</strong> di bar navigasi Safari.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-xs">
                  3
                </span>
                <div>
                  <p className="font-bold text-slate-900">Pilih &quot;Tambah ke Skrin Utama&quot;:</p>
                  <p className="text-slate-600 text-xs mt-0.5">
                    Tatal pilihan ke bawah dan tekan <strong>&quot;Add to Home Screen&quot; (Tambah ke Skrin Utama)</strong>, kemudian tekan <strong>&quot;Add&quot;</strong> di penjuru atas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'desktop' && (
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <div>
                  <p className="font-bold text-amber-950">Pasang di Chrome / Edge:</p>
                  <p className="text-amber-800 text-xs mt-0.5">
                    Klik butang <strong>&quot;Pasang Sekarang&quot;</strong> di bawah, atau klik ikon <strong>Pasang (monitor / download)</strong> yang terdapat di hujung kanan bar alamat URL penyemak imbas anda.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs">
                  2
                </span>
                <div>
                  <p className="font-bold text-slate-900">Kelebihan Aplikasi Desktop:</p>
                  <p className="text-slate-600 text-xs mt-0.5">
                    Game akan dibuka dalam tetingkap khusus tanpa bar carian, animasi lebih lancar 60 FPS, dan menyokong kekunci papan kekunci penuh (Space, W/S/A/D, Panah).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Offline benefit reminder */}
          <div className="bg-gradient-to-r from-sky-100 to-amber-100 rounded-2xl p-3 border border-sky-300/60 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-xs text-slate-800 font-medium">
              <strong>Sokongan Luar Talian Penuh:</strong> Selepas dipasang, game disimpan terus pada peranti dan boleh dimainkan pada bila-bila masa walaupun tiada sambungan internet!
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-sky-200 flex flex-col sm:flex-row gap-2">
          {canDirectInstall && activeTab !== 'ios' ? (
            <button
              onClick={() => {
                onInstall();
                onClose();
              }}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95"
            >
              <Download className="w-4 h-4 animate-bounce" />
              <span>Pasang Sekarang (Satu Klik)</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <span>Faham & Sedia Main</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
