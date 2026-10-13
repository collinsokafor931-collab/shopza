import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  MessageSquare,
  ShieldCheck,
  Maximize2,
  Clock,
  Store as StoreIcon,
  CheckCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { Store, Message } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';

interface StorefrontChatModalProps {
  store: Store;
  isOpen: boolean;
  onClose: () => void;
}

export const StorefrontChatModal: React.FC<StorefrontChatModalProps> = ({
  store,
  isOpen,
  onClose,
}) => {
  const {
    currentUser,
    conversations,
    messages,
    sendMessage,
    sendSellerManualReply,
    startStoreChat,
    navigate,
    addToast,
  } = useMarketplace();

  const [activeConvId, setActiveConvId] = useState<string>('');
  const [buyerText, setBuyerText] = useState('');
  const [sellerManualText, setSellerManualText] = useState('');
  const [replyMode, setReplyMode] = useState<'buyer' | 'seller'>('buyer');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or find conversation when modal opens
  useEffect(() => {
    if (isOpen && store) {
      const convId = startStoreChat(store);
      setActiveConvId(convId);
    }
  }, [isOpen, store]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeConvId]);

  if (!isOpen) return null;

  const currentConv = conversations.find((c) => c.id === activeConvId);
  const convMessages = messages.filter((m) => m.conversationId === activeConvId);

  const handleSendBuyer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerText.trim() || !activeConvId) return;
    sendMessage(activeConvId, buyerText.trim());
    setBuyerText('');
  };

  const handleSendSellerManual = (textToSend?: string) => {
    const text = (textToSend || sellerManualText).trim();
    if (!text || !activeConvId) return;
    sendSellerManualReply(activeConvId, text);
    setSellerManualText('');
    addToast('success', 'Merchant Replied', `${store.name} replied manually to the chat.`);
  };

  const quickReplies = [
    `Hello! Yes, items in our storefront are authentic and ready for dispatch.`,
    `We can offer express same-day courier delivery to your location!`,
    `Feel free to let us know your required size or color variant.`,
    `Thank you for reaching out! We are preparing your order details now.`,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full sm:max-w-xl bg-[#12121A] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col h-[90vh] sm:h-[650px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#181824] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={store.logo}
                alt={store.name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#5B35F5]/40"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#00C896] rounded-full border-2 border-[#12121A]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-[280px]">
                  {store.name}
                </h3>
                {store.isVerified && (
                  <span title="Verified Merchant">
                    <ShieldCheck className="w-4 h-4 text-[#00C896] shrink-0" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span>@{store.username}</span>
                <span>·</span>
                <span className="text-[#00C896] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Replies {store.responseTime}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                onClose();
                navigate(`/account/messages?id=${activeConvId}`);
              }}
              title="Open in full inbox"
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close chat"
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sender Role Switcher Tab (Allows testing manual seller reply seamlessly) */}
        <div className="px-4 py-2 bg-[#151520] border-b border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <span>Active Sender:</span>
          </div>
          <div className="flex items-center bg-[#1D1D2B] p-0.5 rounded-lg border border-white/10">
            <button
              type="button"
              onClick={() => setReplyMode('buyer')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                replyMode === 'buyer'
                  ? 'bg-[#5B35F5] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Buyer ({currentUser?.name || 'Customer'})
            </button>
            <button
              type="button"
              onClick={() => setReplyMode('seller')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition flex items-center gap-1 ${
                replyMode === 'seller'
                  ? 'bg-[#00C896] text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <StoreIcon className="w-3 h-3" />
              <span>Seller Reply (Manual)</span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#0F0F16]">
          {convMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <MessageSquare className="w-10 h-10 mb-2 text-[#5B35F5]/40" />
              <p className="text-xs text-slate-300 font-semibold">Start chatting with {store.name}</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                Inquire about items, sizes, custom orders, or delivery timing. The merchant replies manually.
              </p>
            </div>
          ) : (
            convMessages.map((msg) => {
              const isBuyerMsg =
                msg.senderId === (currentUser?.id || 'user-buyer-1') ||
                msg.senderId !== store.ownerId;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isBuyerMsg ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-end gap-2 max-w-[85%]">
                    {!isBuyerMsg && (
                      <img
                        src={store.logo}
                        alt={store.name}
                        className="w-6 h-6 rounded-md object-cover ring-1 ring-white/10 shrink-0 mb-1"
                      />
                    )}

                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isBuyerMsg
                          ? 'bg-[#5B35F5] text-white rounded-br-xs shadow-md shadow-[#5B35F5]/10'
                          : 'bg-[#1C1C28] text-slate-100 border border-white/10 rounded-bl-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="text-[10px] font-bold opacity-75">
                          {isBuyerMsg ? 'You' : store.name}
                        </span>
                        {!isBuyerMsg && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#00C896]/20 text-[#00C896] font-semibold">
                            Merchant
                          </span>
                        )}
                      </div>
                      <p className="break-words">{msg.text}</p>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-500 mt-1 px-1 flex items-center gap-1 font-mono-nums">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {isBuyerMsg && <CheckCheck className="w-3 h-3 text-[#00C896]" />}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Controls */}
        <div className="p-3 bg-[#151520] border-t border-white/10 space-y-2">
          {/* Quick Replies for Seller when Seller Mode is active */}
          {replyMode === 'seller' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-[#00C896] font-semibold">
                  <UserCheck className="w-3.5 h-3.5" /> Merchant Desk: Manual Seller Reply
                </span>
                <span className="text-[10px] text-slate-500">Replies as {store.name}</span>
              </div>

              {/* Quick suggestion pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendSellerManual(reply)}
                    className="shrink-0 px-2.5 py-1 text-[10px] rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition whitespace-nowrap"
                  >
                    {reply.slice(0, 36)}...
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={sellerManualText}
                  onChange={(e) => setSellerManualText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendSellerManual();
                    }
                  }}
                  placeholder={`Type manual reply as ${store.name}...`}
                  className="flex-1 bg-[#1A1A24] border border-[#00C896]/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00C896]"
                />
                <button
                  type="button"
                  onClick={() => handleSendSellerManual()}
                  disabled={!sellerManualText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#00C896] hover:bg-[#00b084] text-slate-950 text-xs font-bold transition disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendBuyer} className="flex items-center gap-2">
              <input
                type="text"
                value={buyerText}
                onChange={(e) => setBuyerText(e.target.value)}
                placeholder={`Ask ${store.name} about products or delivery...`}
                className="flex-1 bg-[#1A1A24] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
              />
              <button
                type="submit"
                disabled={!buyerText.trim()}
                className="p-2.5 rounded-xl bg-[#5B35F5] hover:bg-[#7C4DFF] text-white transition disabled:opacity-40 active:scale-95 cursor-pointer shrink-0 shadow-md shadow-[#5B35F5]/25"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
