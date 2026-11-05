import React, { useState } from 'react';
import { Download, Sparkles, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'full',
}) => {
  const {
    canInstall,
    isInstalled,
    isStandalone,
    isIOS,
    isAndroid,
    showIOSGuide,
    setShowIOSGuide,
    promptInstall,
  } = usePWAInstall();

  const [modalOpen, setModalOpen] = useState(false);

  // If already running in standalone mode, show subtle indicator or hide
  if (isStandalone) {
    return null;
  }

  const handleClick = () => {
    if (isIOS) {
      setModalOpen(true);
    } else if (canInstall) {
      // Trigger prompt, and if not possible open guide modal
      promptInstall();
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`group relative flex items-center justify-center gap-2 rounded-2xl font-black font-fredoka transition-all transform hover:scale-105 active:scale-95 shadow-lg border-2 border-amber-200 overflow-hidden cursor-pointer ${
          variant === 'compact'
            ? 'px-3 py-2 text-xs bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950'
            : 'px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-emerald-500/30 border-emerald-300'
        } ${className}`}
        title="Pasang aplikasi di telefon Android, iPhone atau Laptop"
      >
        <span className="absolute inset-0 w-full h-full bg-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
        
        {variant === 'compact' ? (
          <>
            <Smartphone className="w-3.5 h-3.5 text-amber-900 animate-pulse" />
            <span>Pasang App</span>
          </>
        ) : (
          <>
            <div className="w-6 h-6 rounded-lg bg-white/25 flex items-center justify-center">
              <Download className="w-3.5 h-3.5 text-white animate-bounce" />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-100 uppercase tracking-wider">
                Semua Peranti
              </span>
              <span className="text-xs sm:text-sm font-extrabold flex items-center gap-1 text-white">
                Pasang Aplikasi
                <Sparkles className="w-3 h-3 text-yellow-300" />
              </span>
            </div>
          </>
        )}
      </button>

      <PWAInstallModal
        isOpen={modalOpen || showIOSGuide}
        onClose={() => {
          setModalOpen(false);
          setShowIOSGuide(false);
        }}
        onInstall={promptInstall}
        canDirectInstall={canInstall}
        isIOS={isIOS}
        isAndroid={isAndroid}
      />
    </>
  );
};
