import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ShoppingBag, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const SellerOrdersPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { orders, currentUser, updateOrderStatus, formatCurrency } = useMarketplace();

  const myOrders = orders.filter((o) =>
    currentUser?.id ? o.sellerIds.includes(currentUser.id) : false
  );

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<any>('shipped');
  const [statusNote, setStatusNote] = useState('');

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, newStatus, statusNote || `Status updated by merchant to ${newStatus}`);
    setSelectedOrder(null);
    setStatusNote('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
          Fulfillment & Merchant Orders
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review incoming buyer purchases, assign tracking numbers, and update fulfillment milestones.
        </p>
      </div>

      {myOrders.length > 0 ? (
        <div className="space-y-4">
          {myOrders.map((ord) => (
            <div
              key={ord.id}
              className="rounded-3xl bg-[#14141B] border border-white/8 p-6 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-nums text-sm font-bold text-white">#{ord.orderNumber}</span>
                    <span className="rounded-md bg-[#00C896]/10 px-2 py-0.5 text-[11px] font-semibold text-[#00C896] capitalize">
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Customer: <strong className="text-white">{ord.buyerName}</strong> ({ord.buyerPhone}) · {new Date(ord.createdAt).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Destination: {ord.shippingAddress.addressLine1}, {ord.shippingAddress.city}, {ord.shippingAddress.state}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Gross Order</span>
                    <span className="font-mono-nums text-base font-bold text-white">{formatCurrency(ord.total)}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedOrder(ord);
                      setNewStatus(ord.status === 'processing' ? 'shipped' : 'delivered');
                    }}
                    className="rounded-xl bg-[#5B35F5] px-4 py-2 text-xs font-bold text-white hover:bg-[#4d2ad4] transition cursor-pointer"
                  >
                    Update Status
                  </button>
                </div>
              </div>

              {/* Items in order */}
              <div className="pt-4 divide-y divide-white/5">
                {ord.items.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={it.image} alt={it.title} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-white">{it.title}</p>
                        <p className="text-[11px] text-slate-400">Qty: {it.quantity}</p>
                      </div>
                    </div>
                    <span className="font-mono-nums font-semibold text-slate-300">
                      {formatCurrency(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-[#14141B] border border-white/8 p-16 text-center text-slate-400 text-xs">
          <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          No orders received yet for this store.
        </div>
      )}

      {/* Status Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#14141B] border border-white/10 p-6 shadow-2xl text-slate-200">
            <h3 className="font-bold text-sm text-white mb-4">
              Update Order #{selectedOrder.orderNumber}
            </h3>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">New Fulfillment State</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="processing">Processing & Packing</option>
                  <option value="shipped">Shipped & In Transit</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered to Recipient</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tracking Note / Courier Info</label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Dispatched with GIG Express tracker GIG-99120"
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-xl px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#00C896] px-5 py-2 text-xs font-bold text-black hover:bg-[#05e2aa]"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
