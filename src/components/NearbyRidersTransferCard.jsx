import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NEARBY_RIDERS, TRANSFER_REASONS } from '../constants/nearbyRiders.js';
import { 
  ArrowRightLeft, 
  MapPin, 
  Clock, 
  Battery, 
  Bike, 
  UserCheck, 
  Sparkles, 
  CheckCircle2, 
  Zap,
  AlertTriangle,
  Radio,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const NearbyRidersTransferCard = ({ initiatedBy = 'rider', title, subtitle, className = '' }) => {
  const { 
    order, 
    transferOrderToRider, 
    openTransferModal, 
    triggerVisualAlert, 
    speakText,
    nearbyRidersList = NEARBY_RIDERS 
  } = useApp();

  const currentRiderId = order?.riderInfo?.id || "USR-101";
  const currentRiderName = order?.riderInfo?.name || "Alex Rivera";
  const availableRiders = nearbyRidersList.filter(r => r.id !== currentRiderId);

  const [transferringId, setTransferringId] = useState(null);
  const [successBanner, setSuccessBanner] = useState(null);

  const handleQuickTransfer = (rider) => {
    setTransferringId(rider.id);
    const defaultReason = initiatedBy === 'merchant'
      ? "Kitchen Proximity Reassignment (Closer Pickup & Hot Food)"
      : initiatedBy === 'admin'
      ? "Fleet Telemetry Load Balancing & Proximity Override"
      : "Rider Proximity Handoff (Faster Delivery)";

    setTimeout(() => {
      const res = transferOrderToRider(rider.id, initiatedBy, defaultReason);
      setTransferringId(null);
      if (res.success) {
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
        setSuccessBanner({
          riderName: rider.name,
          eta: rider.etaStr,
          distance: rider.distanceStr,
          initiatedBy
        });
        setTimeout(() => setSuccessBanner(null), 7000);
      }
    }, 350);
  };

  const getRoleHeader = () => {
    if (initiatedBy === 'merchant') {
      return {
        badge: 'Kitchen Merchant Reassign',
        badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
        title: title || 'Nearby Couriers for Kitchen Handoff',
        subtitle: subtitle || 'Reassign order to a closer courier to guarantee fresh, hot food delivery',
        accentColor: 'border-amber-500/50',
        btnBg: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950'
      };
    }
    if (initiatedBy === 'admin') {
      return {
        badge: 'Admin Dispatch Control',
        badgeColor: 'bg-blue-950 text-blue-300 border-blue-800',
        title: title || 'Fleet Telemetry & Courier Reassignment',
        subtitle: subtitle || 'Admin override: dynamically reassign this delivery to the nearest fleet courier',
        accentColor: 'border-blue-500/50',
        btnBg: 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950'
      };
    }
    return {
      badge: 'Rider Handoff Radar',
      badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
      title: title || 'Transfer Order to Nearby Courier',
      subtitle: subtitle || 'Need a handoff? (Puncture, low EV battery, or traffic) Reassign to a nearby rider in 1 tap',
      accentColor: 'border-cyan-500/50',
      btnBg: 'bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950'
    };
  };

  const roleMeta = getRoleHeader();

  return (
    <div className={`glass-panel rounded-3xl p-5 sm:p-6 border-2 ${roleMeta.accentColor} bg-slate-900/95 space-y-4 shadow-xl ${className}`}>
      
      {/* CARD HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-inner">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                {roleMeta.title}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${roleMeta.badgeColor}`}>
                {roleMeta.badge}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {roleMeta.subtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openTransferModal(initiatedBy)}
          className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
          title="Open advanced order transfer popup with reason options and handoff notes"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
          <span>Detailed Transfer Popup 🔄</span>
        </button>
      </div>

      {/* SUCCESS CONFIRMATION BANNER */}
      {successBanner && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border-2 border-emerald-500/70 text-xs text-emerald-200 flex items-center justify-between gap-3 animate-fadeIn shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 text-sm">
              ✅
            </div>
            <div>
              <span className="font-extrabold text-white block">
                Order #{order.id} Successfully Transferred to {successBanner.riderName}!
              </span>
              <span className="text-[11px] text-emerald-300 block">
                New courier is {successBanner.distance} ({successBanner.eta}). Telemetry and live customer notifications updated.
              </span>
            </div>
          </div>
          <span className="px-2 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono uppercase font-bold">
            Live Dispatched
          </span>
        </div>
      )}

      {/* CURRENTLY ASSIGNED COURIER BADGE */}
      <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-slate-400 font-mono text-[11px] uppercase">Currently Assigned:</span>
          <span className="text-white font-extrabold flex items-center gap-1">
            <span>🤟</span> {currentRiderName}
            <span className="text-cyan-400 font-normal">({order.riderInfo?.vehicle || 'Courier'})</span>
          </span>
          <span className="text-amber-400 font-bold">{order.riderInfo?.rating || '4.98 ⭐'}</span>
        </div>
        <div className="text-slate-400 text-[11px] font-mono">
          Order ID: <strong className="text-cyan-300">#{order.id}</strong> | Destination: <strong className="text-emerald-300 truncate">{order.customerAddress?.split(',')[0]}</strong>
        </div>
      </div>

      {/* NEARBY COURIERS LIST */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            Closer Nearby Couriers Available ({availableRiders.length}):
          </span>
          <span className="text-emerald-400 font-mono text-[10px]">Ranked by GPS Distance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableRiders.map((rider) => {
            const isBusy = transferringId === rider.id;
            return (
              <div 
                key={rider.id}
                className="p-3.5 bg-slate-950/90 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition flex flex-col justify-between space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={rider.avatar} 
                        alt={rider.name} 
                        className="w-11 h-11 rounded-xl object-cover border-2 border-slate-700"
                      />
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-white">{rider.name}</span>
                        <span className="text-xs text-amber-400 font-bold">{rider.rating}</span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Bike className="w-3.5 h-3.5 text-slate-400" />
                        <span>{rider.vehicle}</span>
                      </div>
                      {rider.isDeafMute && (
                        <span className="inline-block mt-1 px-1.5 py-0.2 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded text-[9px] font-bold">
                          🤟 Deaf Partner Pro
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Telemetry Numbers */}
                  <div className="text-right font-mono">
                    <div className="text-xs font-black text-emerald-400 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3 text-emerald-400" /> {rider.etaStr}
                    </div>
                    <div className="text-[11px] text-cyan-300 font-bold">
                      {rider.distanceStr}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                      <Battery className="w-3 h-3 text-emerald-400" /> {rider.battery}%
                    </div>
                  </div>
                </div>

                {/* Transfer Action Button */}
                <button
                  type="button"
                  onClick={() => handleQuickTransfer(rider)}
                  disabled={isBusy}
                  className={`w-full py-2 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 shadow ${roleMeta.btnBg} disabled:opacity-50`}
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>
                    {isBusy 
                      ? "Transferring..." 
                      : `Transfer Order to ${rider.name.split(' ')[0]} (${rider.distanceStr})`}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
