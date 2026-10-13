import React from 'react';
import { Home, Compass, PlusCircle, Store, MessageSquare, User } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const BottomNav: React.FC<{ currentPath?: string; navigate?: (path: string) => void }> = ({
  currentPath: propCurrentPath,
  navigate: propNavigate,
}) => {
  const context = useMarketplace();
  const currentPath = propCurrentPath || context.currentPath;
  const navigate = propNavigate || context.navigate;
  const { currentUser, unreadMessagesCount } = context;

  const isHome = currentPath === '/';
  const isExplore = currentPath.startsWith('/explore') || currentPath.startsWith('/marketplace');
  const isSell = currentPath.startsWith('/sell') || currentPath.startsWith('/seller');
  const isMessages = currentPath.startsWith('/account/messages') || currentPath.startsWith('/seller/messages');
  const isAccount = currentPath.startsWith('/account') && !isMessages;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0B0F]/95 backdrop-blur-lg border-t border-white/[0.08] pb-safe">
      <div className="grid grid-cols-5 h-14 items-center">
        {/* 1. Home */}
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
            isHome ? 'text-[#7C4DFF]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        {/* 2. Explore */}
        <button
          onClick={() => navigate('/marketplace')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
            isExplore ? 'text-[#7C4DFF]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium">Explore</span>
        </button>

        {/* 3. Sell */}
        <button
          onClick={() => navigate(currentUser?.isSeller ? '/seller/dashboard' : '/sell')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
            isSell ? 'text-[#7C4DFF]' : 'text-slate-400 hover:text-white'
          }`}
        >
          {currentUser?.isSeller ? (
            <Store className="w-5 h-5 text-[#00C896]" />
          ) : (
            <PlusCircle className="w-5 h-5 text-[#7C4DFF]" />
          )}
          <span className="text-[10px] font-medium">{currentUser?.isSeller ? 'Store' : 'Sell'}</span>
        </button>

        {/* 4. Messages */}
        <button
          onClick={() => navigate('/account/messages')}
          className={`flex flex-col items-center justify-center gap-0.5 relative transition-colors ${
            isMessages ? 'text-[#7C4DFF]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-3.5 h-3.5 px-0.5 rounded-full bg-[#5B35F5] text-white text-[9px] font-bold font-mono-nums">
                {unreadMessagesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Inbox</span>
        </button>

        {/* 5. Account */}
        <button
          onClick={() => navigate(currentUser ? '/account' : '/login')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
            isAccount ? 'text-[#7C4DFF]' : 'text-slate-400 hover:text-white'
          }`}
        >
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className={`w-5 h-5 rounded-full object-cover border ${
                isAccount ? 'border-[#7C4DFF]' : 'border-transparent'
              }`}
            />
          ) : (
            <User className="w-5 h-5" />
          )}
          <span className="text-[10px] font-medium">{currentUser ? 'Account' : 'Sign In'}</span>
        </button>
      </div>
    </nav>
  );
};
