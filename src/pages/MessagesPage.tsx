import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Send, MessageSquare, Search, ShoppingBag, CheckCheck, Clock, ExternalLink } from 'lucide-react';

interface MessagesPageProps {
  navigate: (path: string) => void;
  selectedConversationId?: string;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({ navigate, selectedConversationId }) => {
  const {
    conversations,
    messages,
    sendMessage,
    sendSellerManualReply,
    currentUser,
    formatCurrency,
    addToast,
  } = useMarketplace();

  const [activeConvId, setActiveConvId] = useState<string>(
    selectedConversationId || conversations[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');
  const [chatMode, setChatMode] = useState<'buyer' | 'seller'>('buyer');

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const activeMessages = messages.filter((m) => m.conversationId === activeConv?.id);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    if (chatMode === 'seller') {
      sendSellerManualReply(activeConv.id, inputText.trim());
      addToast('success', 'Seller Replied', 'Manual merchant reply sent to conversation.');
    } else {
      sendMessage(activeConv.id, inputText.trim(), activeConv.productId);
    }
    setInputText('');
  };

  const otherParticipant = activeConv?.participants.find((p) => p.id !== currentUser?.id) || activeConv?.participants[1];

  const filteredConversations = (conversations || []).filter((c) => {
    if (!c) return false;
    if (!search || !search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (c.participants || []).some(
      (p) =>
        (p?.name && (p.name || '').toLowerCase().includes(q)) ||
        (p?.username && (p.username || '').toLowerCase().includes(q))
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 min-h-[80vh]">
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Direct Messages
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Inquire directly with verified merchants, discuss product sizing, or receive shipment updates.
        </p>
      </div>

      <div className="rounded-3xl bg-[#14141B] border border-white/8 overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[620px] max-h-[750px]">
        {/* Left Side: Conversations List (4 cols) */}
        <div className="md:col-span-4 border-r border-white/8 flex flex-col bg-[#111117]">
          {/* Search bar in chat list */}
          <div className="p-4 border-b border-white/8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full rounded-xl bg-[#1A1A24] border border-white/10 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Conversation Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {filteredConversations.map((conv) => {
              const other = conv.participants.find((p) => p.id !== currentUser?.id) || conv.participants[1];
              const isSelected = conv.id === activeConv?.id;

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full p-4 flex items-start gap-3 text-left transition cursor-pointer ${
                    isSelected ? 'bg-white/5 border-l-2 border-[#5B35F5]' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <img
                    src={other?.avatar}
                    alt={other?.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">{other?.name}</h4>
                      <span className="text-[10px] text-slate-500">
                        {new Date(conv.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {conv.lastMessage}
                    </p>
                    {conv.productTitle && (
                      <span className="inline-block mt-1 text-[10px] text-[#00C896] truncate max-w-[180px]">
                        Re: {conv.productTitle}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            {filteredConversations.length === 0 && (
              <p className="p-6 text-center text-xs text-slate-500">No conversations found.</p>
            )}
          </div>
        </div>

        {/* Right Side: Active Chat Window (8 cols) */}
        <div className="md:col-span-8 flex flex-col bg-[#14141B]">
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/8 flex items-center justify-between bg-[#111117]">
                <div className="flex items-center gap-3">
                  <img
                    src={otherParticipant?.avatar}
                    alt={otherParticipant?.name}
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/10"
                  />
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-white">{otherParticipant?.name}</h3>
                    <p className="text-[10px] text-slate-400">@{otherParticipant?.username} · Typically replies in &lt; 15m</p>
                  </div>
                </div>

                {otherParticipant?.role === 'seller' && (
                  <button
                    onClick={() => navigate(`/store/${otherParticipant.username}`)}
                    className="text-xs text-[#00C896] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Store Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Referenced Product Attachment Pill (Requirement 29) */}
              {activeConv.productTitle && (
                <div className="bg-[#1A1A24] border-b border-white/8 px-4 py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 truncate max-w-[80%]">
                    {activeConv.productImage && (
                      <img
                        src={activeConv.productImage}
                        alt="Product"
                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <div className="truncate">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Inquiring About Item:</span>
                      <span className="font-semibold text-white truncate block">{activeConv.productTitle}</span>
                    </div>
                  </div>
                  {activeConv.productPrice && (
                    <span className="font-mono-nums font-bold text-[#00C896] shrink-0">
                      {formatCurrency(activeConv.productPrice)}
                    </span>
                  )}
                </div>
              )}

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {activeMessages.map((msg) => {
                  const isMe = msg.senderId === currentUser?.id || msg.senderId === 'user-buyer-1';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md rounded-2xl p-3.5 text-xs leading-relaxed ${
                          isMe
                            ? 'bg-[#5B35F5] text-white rounded-br-xs shadow-md'
                            : 'bg-[#1E1E2B] text-slate-200 border border-white/5 rounded-bl-xs'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                      <span className="font-mono-nums text-[10px] text-slate-500 mt-1 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Message Input Bar & Sender Switcher */}
              <div className="p-3 sm:p-4 border-t border-white/8 bg-[#111117] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span>Sender:</span>
                    <button
                      type="button"
                      onClick={() => setChatMode('buyer')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                        chatMode === 'buyer'
                          ? 'bg-[#5B35F5] text-white shadow-sm'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      Buyer ({currentUser?.name || 'Customer'})
                    </button>
                    <button
                      type="button"
                      onClick={() => setChatMode('seller')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                        chatMode === 'seller'
                          ? 'bg-[#00C896] text-slate-950 font-bold shadow-sm'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      Seller ({otherParticipant?.name || 'Merchant'} Manual Reply)
                    </button>
                  </div>

                  {chatMode === 'seller' && (
                    <span className="text-[10px] text-[#00C896] font-medium hidden sm:inline">
                      ● Replying manually as merchant
                    </span>
                  )}
                </div>

                {chatMode === 'seller' && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[10px]">
                    {[
                      'Yes, this item is authentic & in stock!',
                      'Same-day courier dispatch available.',
                      'What size or specifications would you like?',
                      'Thank you! Your order is being prepared.',
                    ].map((snippet, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (activeConv) {
                            sendSellerManualReply(activeConv.id, snippet);
                            addToast('success', 'Seller Replied', 'Manual merchant reply sent.');
                          }
                        }}
                        className="shrink-0 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition whitespace-nowrap cursor-pointer"
                      >
                        {snippet}
                      </button>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      chatMode === 'seller'
                        ? `Type manual seller reply as ${otherParticipant?.name || 'Merchant'}...`
                        : 'Type a message to the merchant...'
                    }
                    className={`flex-1 rounded-xl bg-[#1A1A24] border px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                      chatMode === 'seller'
                        ? 'border-[#00C896]/40 focus:border-[#00C896]'
                        : 'border-white/10 focus:border-[#5B35F5]'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className={`rounded-xl p-2.5 text-white disabled:opacity-40 transition active:scale-95 cursor-pointer font-bold text-xs flex items-center gap-1.5 ${
                      chatMode === 'seller'
                        ? 'bg-[#00C896] text-slate-950 hover:bg-[#00b084]'
                        : 'bg-[#5B35F5] hover:bg-[#4d2ad4]'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {chatMode === 'seller' ? 'Seller Reply' : 'Send'}
                    </span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-slate-500 text-xs">
              <MessageSquare className="w-10 h-10 mb-2" />
              <span>Select a conversation to start chatting</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
