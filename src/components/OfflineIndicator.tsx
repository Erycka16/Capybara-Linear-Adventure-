import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-2xl bg-amber-600/95 backdrop-blur-xs px-3.5 py-2 text-xs font-black text-white shadow-xl border border-amber-300 pointer-events-none animate-bounce">
      <WifiOff className="w-4 h-4 text-amber-200" />
      <span>Mod Luar Talian (Offline) — Permainan dicache & boleh dimainkan!</span>
    </div>
  );
};
