import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Store, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Bell, 
  ShoppingBag, 
  Sparkles, 
  User,
  Check,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MerchantPortal = () => {
  const { order, updateOrderStatus, triggerVisualAlert, speakText } = useApp();
  const [orderReady, setOrderReady] = useState(order.status === 'en_route' || order.status === 'arrived' || order.status === 'delivered');

  const handleNotifyRider = () => {
    setOrderReady(true);
    updateOrderStatus('en_route');
    triggerVisualAlert('cyan');
    speakText("Order is ready for pickup! Visual signal dispatched to rider Alex.");
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-20">
      
      {/* MERCHANT HEADER BAR */}
      <div className="glass-panel rounded-3xl p-6 border-2 border-amber-500/40 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-2xl">
            🏬
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">{order.merchantName}</h2>
            <p className="text-xs text-slate-400">Kitchen & Order Pickup Management Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-full border border-slate-800 text-xs text-amber-400 font-bold">
          <Clock className="w-4 h-4" /> Average Prep Time: 12 mins
        </div>
      </div>

      {/* ACTIVE ORDER CARD */}
      <div className="glass-panel rounded-3xl p-6 border-2 border-slate-800 bg-slate-900/95 space-y-6 shadow-2xl">
        
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-white font-mono">Order #{order.id}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${orderReady ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
                {orderReady ? '✅ READY FOR PICKUP' : '🍳 PREPARING IN KITCHEN'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Customer: {order.customerName} • 3 items ({order.totalAmount})</p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-bold">Assigned Rider</span>
            <span className="text-cyan-400 font-bold text-sm flex items-center gap-1">
              🤟 Alex Rivera (Deaf Partner)
            </span>
          </div>
        </div>

        {/* DEAF RIDER VISUAL HANDOFF NOTICE FOR RESTAURANT STAFF */}
        <div className="p-4 rounded-2xl bg-cyan-950/60 border-2 border-cyan-500/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/20 rounded-xl border border-cyan-400 text-cyan-300 text-xl">
              🤟
            </div>
            <div>
              <h4 className="font-bold text-sm text-cyan-200">Deaf Rider Handoff Alert</h4>
              <p className="text-xs text-slate-300">
                Rider Alex uses visual cues. When order is ready, tap below to flash Alex's phone screen brightly!
              </p>
            </div>
          </div>

          <button
            onClick={() => triggerVisualAlert('cyan')}
            className="px-4 py-2 bg-cyan-500 text-slate-950 text-xs font-extrabold rounded-xl hover:bg-cyan-400 transition flex items-center gap-1 whitespace-nowrap"
          >
            <Zap className="w-4 h-4" /> Flash Rider Screen ⚡
          </button>
        </div>

        {/* ORDER ITEMS LIST */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kitchen Ticket Items</h4>
          <div className="space-y-2">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-sm font-semibold text-white">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400 font-bold text-xs">
                    {item.qty}x
                  </span>
                  <span>{item.name}</span>
                </div>
                <span className="text-xs text-amber-400 font-normal italic bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/40">
                  Notes: {item.notes}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* KITCHEN PICKUP ACTION BUTTON */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleNotifyRider}
            disabled={orderReady}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-base transition flex items-center justify-center gap-2 shadow-xl ${
              orderReady
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 hover:scale-105'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{orderReady ? 'Order Marked Ready & Dispatched' : 'Mark Ready & Send Visual Signal to Rider'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
