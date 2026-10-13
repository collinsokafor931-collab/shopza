import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { OrderTimeline } from '../components/marketplace/OrderTimeline';
import { ChevronRight, Printer, ShieldCheck, MapPin, CreditCard, Truck, MessageSquare } from 'lucide-react';

interface OrderDetailPageProps {
  orderId: string;
  navigate: (path: string) => void;
}

export const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ orderId, navigate }) => {
  const { orders, formatCurrency, startOrGetConversation, addToast } = useMarketplace();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white">Order not found</h2>
        <button onClick={() => navigate('/account/orders')} className="mt-4 rounded-xl bg-[#5B35F5] px-4 py-2 text-xs font-semibold text-white">
          Back to Orders
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleContactSeller = (storeUsername: string) => {
    const convId = startOrGetConversation(storeUsername, order.items[0]?.productId);
    navigate(`/account/messages?id=${convId}`);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
        <button onClick={() => navigate('/account')} className="hover:text-white transition">Account</button>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <button onClick={() => navigate('/account/orders')} className="hover:text-white transition">Orders</button>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <span className="text-white font-medium">#{order.orderNumber}</span>
      </nav>

      {/* Header with Print Receipt action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/8 gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Order #{order.orderNumber}
            </h1>
            <span className="rounded-lg bg-[#00C896]/15 px-2.5 py-1 text-xs font-bold text-[#00C896] capitalize">
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Placed on {new Date(order.createdAt).toLocaleString()} · Reference: <span className="font-mono-nums text-slate-300">{order.paymentReference}</span>
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print Receipt</span>
        </button>
      </div>

      {/* Visual Timeline Component */}
      <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 sm:p-8 mb-8 shadow-xl">
        <h3 className="font-bold text-base text-white mb-6">Fulfillment Timeline</h3>
        <OrderTimeline status={order.status} statusHistory={order.statusHistory} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Items purchased (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 shadow-xl">
            <h3 className="font-bold text-base text-white mb-4">Purchased Items</h3>

            <div className="divide-y divide-white/5">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-16 w-16 rounded-xl object-cover bg-[#1A1A24] ring-1 ring-white/10 shrink-0"
                    />
                    <div>
                      <h4
                        onClick={() => navigate(`/product/${item.productId}`)}
                        className="font-semibold text-xs text-white hover:text-[#7C4DFF] transition cursor-pointer line-clamp-1"
                      >
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                      <button
                        onClick={() => handleContactSeller(item.storeUsername)}
                        className="inline-flex items-center gap-1 text-[11px] text-[#00C896] hover:underline mt-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Chat with @{item.storeUsername}</span>
                      </button>
                    </div>
                  </div>

                  <span className="font-mono-nums text-sm font-bold text-white shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Address & Payment Details (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Shipping Address */}
          <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 text-xs text-slate-300 space-y-3 shadow-xl">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#00C896]" />
              <span>Delivery Details</span>
            </h3>
            <p className="font-semibold text-white">{order.shippingAddress.fullName}</p>
            <p className="text-slate-400">{order.shippingAddress.addressLine1}</p>
            <p className="text-slate-400">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
            <p className="text-slate-400 font-mono-nums">Tel: {order.shippingAddress.phone}</p>
            <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400">
              <span className="text-slate-300 font-medium">Tracking: </span>
              <span className="font-mono-nums">{order.trackingNumber || 'Awaiting courier assignment'}</span>
            </div>
          </div>

          {/* Payment & Breakdown */}
          <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 text-xs text-slate-300 space-y-3 shadow-xl">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#7C4DFF]" />
              <span>Payment & Escrow Breakdown</span>
            </h3>

            <dl className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <dt>Subtotal</dt>
                <dd className="font-mono-nums font-semibold text-white">{formatCurrency(order.subtotal)}</dd>
              </div>

              <div className="flex justify-between text-slate-400">
                <dt>Delivery Fee</dt>
                <dd className="font-mono-nums font-semibold text-white">{formatCurrency(order.deliveryFee)}</dd>
              </div>

              <div className="flex justify-between text-slate-500 text-[11px]">
                <dt>Platform Escrow Fee ({order.platformFee ? formatCurrency(order.platformFee) : 'Configured'})</dt>
                <dd>Covered</dd>
              </div>

              <div className="flex justify-between pt-3 border-t border-white/8 text-sm font-bold text-white">
                <dt>Total Amount</dt>
                <dd className="font-mono-nums text-base text-[#00C896]">{formatCurrency(order.total)}</dd>
              </div>
            </dl>

            <div className="rounded-xl bg-[#1A1A24] p-3 text-[11px] text-slate-400 flex items-center gap-2 mt-4">
              <ShieldCheck className="w-4 h-4 text-[#00C896] shrink-0" />
              <span>Escrow protection active until delivery verification.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
