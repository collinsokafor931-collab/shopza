import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ variant?: 'nav' | 'banner' | 'menu' }> = ({ variant = 'nav' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running standalone, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Fallback for browsers that require standard browser menu install
      alert('To install SHOPZA: Open your browser settings menu (⋮) and tap "Install App" or "Add to Home screen".');
    }
  };

  if (variant === 'banner') {
    return (
      <>
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-[#5B35F5]/20 via-[#7C4DFF]/15 to-transparent border border-[#5B35F5]/30">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#5B35F5] text-white shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Install SHOPZA Mobile App</p>
              <p className="text-xs text-slate-400">Lightning-fast browsing, instant order updates & offline catalog.</p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#5B35F5] hover:bg-[#7C4DFF] transition-colors rounded-lg whitespace-nowrap shadow-sm shrink-0"
          >
            {isIOS ? 'Install on iOS' : 'Install App'}
          </button>
        </div>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#14141B] border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-semibold text-white">Install on iPhone / iPad</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  1. Tap the <strong className="text-white">Share</strong> icon at the bottom of Safari.
                </p>
                <p>
                  2. Scroll down and select <strong className="text-white">"Add to Home Screen"</strong>.
                </p>
                <p>
                  3. Tap <strong className="text-[#00C896]">Add</strong> in the top-right corner to launch SHOPZA like a native app.
                </p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full py-2.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Install SHOPZA PWA"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors whitespace-nowrap"
      >
        <Download className="w-3.5 h-3.5 text-[#00C896]" />
        <span>Install App</span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#14141B] border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-semibold text-white">Install on iPhone / iPad</h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                1. Tap the <strong className="text-white">Share</strong> icon in the Safari navigation bar.
              </p>
              <p>
                2. Select <strong className="text-white">"Add to Home Screen"</strong>.
              </p>
              <p>
                3. Tap <strong className="text-[#00C896]">Add</strong> to place SHOPZA on your home screen.
              </p>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-6 w-full py-2.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
