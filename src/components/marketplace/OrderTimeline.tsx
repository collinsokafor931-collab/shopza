import React from 'react';
import { CheckCircle2, Clock, Truck, Package, Home, XCircle, RotateCcw } from 'lucide-react';
import { OrderStatus } from '../../types';

export const OrderTimeline: React.FC<{
  currentStatus?: OrderStatus;
  status?: OrderStatus;
  history?: { status: OrderStatus; timestamp: string; note: string }[];
  statusHistory?: { status: OrderStatus; timestamp: string; note: string }[];
}> = (props) => {
  const currentStatus = props.currentStatus || props.status || 'pending_payment';
  const history = props.history || props.statusHistory || [];
  const steps: { status: OrderStatus; label: string; icon: React.FC<{ className?: string }> }[] = [
    { status: 'pending_payment', label: 'Order Placed', icon: Clock },
    { status: 'payment_confirmed', label: 'Payment Verified', icon: CheckCircle2 },
    { status: 'processing', label: 'Processing & Packing', icon: Package },
    { status: 'shipped', label: 'In Transit', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: Home },
  ];

  const getStepIndex = (s: OrderStatus) => {
    switch (s) {
      case 'pending_payment':
        return 0;
      case 'payment_confirmed':
        return 1;
      case 'processing':
      case 'ready_for_pickup':
        return 2;
      case 'shipped':
      case 'out_for_delivery':
        return 3;
      case 'delivered':
      case 'completed':
        return 4;
      case 'cancelled':
        return -1;
      case 'refund_requested':
      case 'refunded':
        return -2;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);
  const isCancelled = currentStatus === 'cancelled';
  const isRefunded = currentStatus === 'refunded' || currentStatus === 'refund_requested';

  return (
    <div className="w-full py-4">
      {/* Special alert if cancelled or refunded */}
      {isCancelled && (
        <div className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
          <XCircle className="w-4 h-4 shrink-0" />
          <span>This order has been cancelled.</span>
        </div>
      )}

      {isRefunded && (
        <div className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
          <RotateCcw className="w-4 h-4 shrink-0" />
          <span>Refund has been processed back to original payment channel.</span>
        </div>
      )}

      {/* Progress Bars & Icons */}
      <div className="relative flex items-center justify-between">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-white/10 z-0">
          <div
            className="h-full bg-gradient-to-r from-[#5B35F5] to-[#00C896] transition-all duration-500"
            style={{
              width: currentIndex >= 0 ? `${(currentIndex / (steps.length - 1)) * 100}%` : '0%',
            }}
          />
        </div>

        {/* Step Nodes */}
        {steps.map((step, idx) => {
          const isDone = currentIndex >= idx;
          const isCurrent = currentIndex === idx;
          const Icon = step.icon;

          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-300 ${
                  isCurrent
                    ? 'bg-[#5B35F5] border-white text-white shadow-lg shadow-[#5B35F5]/50 scale-110'
                    : isDone
                    ? 'bg-[#00C896] border-[#00C896] text-slate-950 font-bold'
                    : 'bg-[#14141B] border-white/20 text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span
                className={`mt-2 text-[10px] sm:text-xs font-medium text-center max-w-[70px] sm:max-w-[100px] leading-tight ${
                  isCurrent
                    ? 'text-white font-semibold'
                    : isDone
                    ? 'text-slate-300'
                    : 'text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Historical Log Details */}
      {history.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/[0.06] space-y-3">
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Tracking Updates</h4>
          <div className="space-y-2">
            {history.map((item, i) => (
              <div key={i} className="flex items-start justify-between gap-4 text-xs">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00C896] mt-1.5 shrink-0" />
                  <span className="text-slate-300">{item.note}</span>
                </div>
                <span className="text-[11px] text-slate-500 shrink-0 font-mono-nums">
                  {new Date(item.timestamp).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
