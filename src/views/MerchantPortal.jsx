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
  AlertCircle,
  Volume2,
  Navigation,
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MerchantPortal = () => {
  const { 
    order, 
    updateOrderStatus, 
    triggerVisualAlert, 
    speakText, 
    notifyOrderAppeared, 
    notifyOrderReady,
    notificationsList = []
  } = useApp();

  const [orderReady, setOrderReady] = useState(order.status === 'en_route' || order.status === 'arrived' || order.status === 'delivered');

  // Triggered when merchant marks order ready for pickup
  const handleNotifyRiderAndCustomer = () => {
    setOrderReady(true);
    notifyOrderReady();
    updateOrderStatus('en_route');
    triggerVisualAlert('cyan');
    speakText(`Order number ${order.id} is packed and ready for pickup! Notification sent to rider Alex and customer.`);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
  };

  // Triggered when a new order appears in the kitchen
  const handleSimulateNewOrderAppeared = () => {
    notifyOrderAppeared();
    setOrderReady(false);
    triggerVisualAlert('gold');
    speakText("Ding! New incoming order ticket received in the kitchen from Sarah Jenkins.");
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
  };

  // Filter merchant relevant notifications
  const merchantNotifs = notificationsList.filter(n => n.targetRole === 'merchant' || n.targetRole === 'all');

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-20">
      
      {/* MERCHANT HEADER BAR */}
      <div className="glass-panel rounded-3xl p-6 border-2 border-amber-500/40 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-2xl shadow-inner">
            🏬
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">{order.merchantName}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-950 text-amber-300 border border-amber-800">
                Kitchen Live
              </span>
            </div>
            <p className="text-xs text-slate-400">Order Dispatch, Kitchen Telemetry & Real-Time Handoff Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSimulateNewOrderAppeared}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            title="Simulate receiving a new order in the kitchen with chime & visual notification"
          >
            <Bell className="w-4 h-4 text-slate-950 animate-bounce" />
            <span>Simulate Order Appear (Chime)</span>
          </button>

          <div className="flex items-center gap-1.5 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs text-amber-400 font-bold">
            <Clock className="w-4 h-4" /> Avg Prep: 12m
          </div>
        </div>
      </div>

      {/* NEW ORDER APPEARED LIVE TICKET BANNER */}
      <div className="p-4 rounded-3xl bg-amber-950/40 border-2 border-amber-500/60 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 text-xl font-bold">
            🔔
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block font-mono">Kitchen Order Telemetry</span>
            <h4 className="font-extrabold text-sm text-white">Order #{order.id} is Live on Kitchen Screen</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Customer <strong className="text-amber-300">{order.customerName}</strong> placed this order for <strong className="text-emerald-400">{order.totalAmount}</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Status:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
            orderReady ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
          }`}>
            {orderReady ? '✅ Ready For Pickup' : '🍳 Cooking In Kitchen'}
          </span>
        </div>
      </div>

      {/* ACTIVE ORDER CARD */}
      <div className="glass-panel rounded-3xl p-6 border-2 border-slate-800 bg-slate-900/95 space-y-6 shadow-2xl">
        
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-white font-mono">Ticket #{order.id}</span>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-800">
                Delivery Destination: {order.customerAddress}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Customer Contact: {order.customerPhone} (Gate Code: {order.gateCode})</p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-bold">Designated Courier</span>
            <span className="text-cyan-400 font-bold text-sm flex items-center gap-1">
              🤟 Alex Rivera (Deaf Partner Pro)
            </span>
          </div>
        </div>

        {/* DEAF RIDER VISUAL HANDOFF NOTICE FOR RESTAURANT STAFF */}
        <div className="p-4 rounded-2xl bg-cyan-950/60 border-2 border-cyan-500/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/20 rounded-xl border border-cyan-400 text-cyan-300 text-xl font-bold">
              🤟
            </div>
            <div>
              <h4 className="font-bold text-sm text-cyan-200">Accessibility Rider Handoff Bridge</h4>
              <p className="text-xs text-slate-300">
                Rider Alex uses visual cues. When you mark this order as READY, Alex's phone receives an instant bright screen flash & chime!
              </p>
            </div>
          </div>

          <button
            onClick={() => triggerVisualAlert('cyan')}
            className="px-4 py-2 bg-cyan-500 text-slate-950 text-xs font-extrabold rounded-xl hover:bg-cyan-400 transition flex items-center gap-1 whitespace-nowrap shadow"
          >
            <Zap className="w-4 h-4" /> Flash Rider Screen ⚡
          </button>
        </div>

        {/* ORDER ITEMS LIST */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kitchen Ticket Items ({order.orderItems?.length || 0})</h4>
            <span className="text-xs font-mono text-emerald-400 font-extrabold">Total: {order.totalAmount}</span>
          </div>

          <div className="space-y-2">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-sm font-semibold text-white">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400 font-bold text-xs">
                    {item.qty}x
                  </span>
                  <span>{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-amber-400 font-normal italic bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/40">
                    Notes: {item.notes || 'Standard Preparation'}
                  </span>
                  <span className="text-xs font-mono text-slate-300">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KITCHEN PICKUP ACTION BUTTONS */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Clicking <strong>Mark Ready</strong> will notify both <span className="text-cyan-300">Rider Alex</span> and <span className="text-emerald-300">Customer Sarah</span> with audio chimes.
          </div>

          <button
            onClick={handleNotifyRiderAndCustomer}
            disabled={orderReady}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-extrabold text-sm transition flex items-center justify-center gap-2 shadow-xl ${
              orderReady
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 hover:scale-105'
            }`}
          >
            <PackageCheck className="w-5 h-5" />
            <span>{orderReady ? 'Order Marked Ready & Notifications Sent' : '🍳 Mark Order Ready & Notify Rider for Pickup'}</span>
          </button>
        </div>

      </div>

      {/* RECENT MERCHANT NOTIFICATIONS LOG */}
      <div className="glass-panel rounded-3xl p-5 border border-slate-800 bg-slate-900/80 space-y-3">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase font-mono">
            <Bell className="w-3.5 h-3.5 text-amber-400" /> Recent Kitchen Notifications ({merchantNotifs.length}):
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Auto-logged</span>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {merchantNotifs.slice(0, 4).map((n) => (
            <div key={n.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">🔔</span>
                <div>
                  <span className="font-bold text-white block">{n.title}</span>
                  <span className="text-slate-400 text-[11px] block">{n.message}</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">{n.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
