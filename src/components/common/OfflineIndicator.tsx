import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 z-50 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/95 text-slate-950 font-medium text-xs shadow-xl backdrop-blur-md border border-amber-400">
      <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
      <span>Offline Mode — Browsing locally cached marketplace catalog.</span>
    </div>
  );
};
