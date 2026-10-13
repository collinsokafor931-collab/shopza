import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Bell, Check, ShoppingBag, MessageSquare, ShieldCheck, Tag, Info, TrendingDown } from 'lucide-react';

export const NotificationsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useMarketplace();

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag className="w-4 h-4 text-[#00C896]" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-[#7C4DFF]" />;
      case 'security': return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      case 'promo': return <Tag className="w-4 h-4 text-rose-400" />;
      case 'price_drop': return <TrendingDown className="w-4 h-4 text-emerald-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/8">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
            Notification Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Order tracking alerts, seller messages, and platform security notices.
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          Mark all as read
        </button>
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationAsRead(notif.id);
                if (notif.link) navigate(notif.link);
              }}
              className={`rounded-2xl border p-4 transition cursor-pointer flex items-start gap-4 ${
                !notif.read
                  ? 'bg-[#181824] border-white/15 shadow-md'
                  : 'bg-[#14141B] border-white/5 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white/5 shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs sm:text-sm text-white">{notif.title}</h3>
                  <span className="font-mono-nums text-[10px] text-slate-500">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
              </div>

              {!notif.read && (
                <span className="h-2 w-2 rounded-full bg-[#00C896] mt-2 shrink-0" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-[#14141B] border border-white/8 p-12 text-center text-xs text-slate-500">
          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
          No notifications in your queue.
        </div>
      )}
    </div>
  );
};
