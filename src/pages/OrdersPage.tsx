import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ShoppingBag, ChevronRight, Package, Truck, CheckCheck, Clock } from 'lucide-react';

interface OrdersPageProps {
  navigate: (path: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ navigate }) => {
  const { orders, currentUser, formatCurrency } = useMarketplace();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const myOrders = orders.filter((o) => o.buyerId === currentUser?.id || !currentUser);

  const filtered = myOrders.filter((o) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return ['processing', 'shipped', 'out_for_delivery', 'payment_confirmed'].includes(o.status);
    if (statusFilter === 'delivered') return ['delivered', 'completed'].includes(o.status);
    return o.status === statusFilter;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
          Purchase History & Tracking
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Monitor your shipments, download receipts, and manage completed orders.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/8 pb-3 overflow-x-auto">
        {['all', 'active', 'delivered', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
              statusFilter === tab
                ? 'bg-[#5B35F5] text-white shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/account/orders/${order.id}`)}
              className="rounded-3xl bg-[#14141B] border border-white/8 p-6 hover:border-white/20 transition cursor-pointer shadow-sm hover:shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-2">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono-nums text-sm font-bold text-white">#{order.orderNumber}</span>
                    <span className="rounded-md bg-[#00C896]/10 px-2 py-0.5 text-[11px] font-semibold text-[#00C896] capitalize">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} · Courier: {order.courier || 'GIG Logistics'}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-400 block">Total Amount</span>
                  <span className="font-mono-nums text-base font-bold text-white">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>

              {/* Items Thumbnails Strip */}
              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-x-auto">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover bg-[#1A1A24] ring-1 ring-white/10"
                      />
                      <div className="text-xs">
                        <p className="font-semibold text-white truncate max-w-[150px]">{item.title}</p>
                        <p className="text-[11px] text-slate-400">Qty: {item.quantity} · @{item.storeUsername}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#7C4DFF]">
                  <span>Track Details</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-[#14141B] border border-white/8 p-12 text-center text-xs text-slate-400">
          <ShoppingBag className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          No orders found matching the filter.
        </div>
      )}
    </div>
  );
};
