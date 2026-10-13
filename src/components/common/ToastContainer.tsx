import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useMarketplace();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-4 h-4 text-[#00C896] shrink-0" />;
            case 'error':
              return <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />;
            case 'warning':
              return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
            default:
              return <Info className="w-4 h-4 text-[#7C4DFF] shrink-0" />;
          }
        };

        const getBorder = () => {
          switch (toast.type) {
            case 'success':
              return 'border-[#00C896]/30 bg-[#121E19]/95';
            case 'error':
              return 'border-rose-500/30 bg-[#221316]/95';
            case 'warning':
              return 'border-amber-500/30 bg-[#241C12]/95';
            default:
              return 'border-[#5B35F5]/30 bg-[#161426]/95';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-top-2 ${getBorder()}`}
          >
            <div className="mt-0.5">{getIcon()}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white tracking-tight leading-snug">{toast.title}</p>
              {toast.message && (
                <p className="mt-0.5 text-[11px] text-slate-300 line-clamp-2 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
