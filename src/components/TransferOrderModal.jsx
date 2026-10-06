import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NEARBY_RIDERS, TRANSFER_REASONS } from '../constants/nearbyRiders.js';
import { 
  X, 
  ArrowRightLeft, 
  MapPin, 
  Clock, 
  Battery, 
  Bike, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Sparkles,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TransferOrderModal = ({ isOpen, onClose, initiatedBy = 'rider' }) => {
  const { 
    order, 
    transferOrderToRider, 
    triggerVisualAlert, 
    speakText,
    language = 'en',
    nearbyRidersList = NEARBY_RIDERS
  } = useApp();

  const currentRiderId = order?.riderInfo?.id || "USR-101";
  const availableRiders = nearbyRidersList.filter(r => r.id !== currentRiderId);

  const [selectedRiderId, setSelectedRiderId] = useState(availableRiders[0]?.id || "");
  const reasonsList = TRANSFER_REASONS[initiatedBy] || TRANSFER_REASONS.rider;
  const [selectedReason, setSelectedReason] = useState(reasonsList[0]?.label || "Proximity Optimization");
  const [customNote, setCustomNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize selection whenever modal opens or available riders change
  React.useEffect(() => {
    if (isOpen) {
      const available = nearbyRidersList.filter(r => r.id !== (order?.riderInfo?.id || "USR-101"));
      if (available.length > 0 && (!selectedRiderId || !available.some(r => r.id === selectedRiderId))) {
        setSelectedRiderId(available[0].id);
      }
      const reasons = TRANSFER_REASONS[initiatedBy] || TRANSFER_REASONS.rider;
      if (reasons.length > 0 && !selectedReason) {
        setSelectedReason(reasons[0].label);
      }
    }
  }, [isOpen, nearbyRidersList, order?.riderInfo?.id, initiatedBy]);

  // Support pressing Escape to close modal
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedRider = nearbyRidersList.find(r => r.id === selectedRiderId);

  const handleConfirmTransfer = (e) => {
    e.preventDefault();
    if (!selectedRiderId) return;

    setIsSubmitting(true);
    const finalReason = customNote.trim() ? `${selectedReason} - ${customNote.trim()}` : selectedReason;

    setTimeout(() => {
      const result = transferOrderToRider(selectedRiderId, initiatedBy, finalReason);
      setIsSubmitting(false);

      if (result.success) {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        onClose();
      }
    }, 400);
  };

  const getActorTitle = () => {
    if (initiatedBy === 'merchant') return { title: 'Kitchen Merchant Reassignment', badge: 'Merchant Initiated', color: 'from-amber-500 to-orange-500' };
    if (initiatedBy === 'admin') return { title: 'Admin Master Re-dispatch', badge: 'Admin Override', color: 'from-blue-500 to-indigo-500' };
    return { title: 'Rider Handoff to Nearby Courier', badge: 'Rider Request', color: 'from-cyan-500 to-emerald-500' };
  };

  const actorInfo = getActorTitle();

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-cyan-500/60 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/30 shadow-md">
              <ArrowRightLeft className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  {actorInfo.title}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {actorInfo.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transfer active delivery <strong className="text-cyan-300">#{order.id}</strong> to a closer available courier
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Current Order & Active Rider Summary */}
        <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-lg">
              📦
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Current Active Courier</span>
              <span className="font-extrabold text-white text-sm flex items-center gap-1.5">
                <span>🤟</span> {order.riderInfo?.name || "Alex Rivera"}
                <span className="text-slate-400 font-normal">({order.riderInfo?.vehicle || "E-Bike"})</span>
              </span>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="text-slate-400 block text-[10px]">Destination</span>
            <span className="text-emerald-400 font-bold truncate max-w-[200px] block">{order.customerAddress}</span>
          </div>
        </div>

        {/* Content Body */}
        <form onSubmit={handleConfirmTransfer} className="flex-1 overflow-y-auto pr-1 space-y-4">
          
          {/* Reason Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Select Transfer Reason:</span>
              <span className="text-[10px] text-slate-400 font-normal">Required for audit log</span>
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none cursor-pointer font-medium"
            >
              {reasonsList.map(r => (
                <option key={r.id} value={r.label} className="bg-slate-900 text-white">
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Note */}
          <div className="space-y-1.5">
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Optional handoff note (e.g., 'Met rider at 4th St corner with hot food bag')..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          {/* List of Nearby Riders */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Nearby Couriers Ranked by Proximity ({availableRiders.length}):
              </span>
              <span className="text-emerald-400 text-[10px] font-mono">Real-time GPS telemetry</span>
            </div>

            <div className="space-y-2.5">
              {availableRiders.map((r) => {
                const isSelected = selectedRiderId === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRiderId(r.id)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-950/70 to-slate-900 border-cyan-400 ring-2 ring-cyan-500/50 shadow-xl scale-[1.01]'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={r.avatar}
                          alt={r.name}
                          className="w-11 h-11 rounded-xl object-cover border-2 border-slate-700"
                        />
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-white">{r.name}</span>
                          <span className="text-xs text-amber-400 font-bold">{r.rating}</span>
                          {r.isDeafMute && (
                            <span className="px-1.5 py-0.2 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded text-[9px] font-bold">
                              🤟 Deaf Pro
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Bike className="w-3.5 h-3.5 text-slate-400" /> {r.vehicle}
                          </span>
                          <span>•</span>
                          <span className="text-slate-300">{r.deliveriesCount} deliveries</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:text-right w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800/80 pt-2 sm:pt-0">
                      <div>
                        <div className="text-xs font-black text-cyan-300 font-mono flex items-center gap-1 sm:justify-end">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" /> {r.etaStr}
                        </div>
                        <div className="text-[11px] text-emerald-400 font-bold font-mono">
                          {r.distanceStr}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 sm:justify-end">
                          <Battery className="w-3 h-3 text-emerald-400" /> {r.battery}% battery
                        </div>
                      </div>

                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition ${
                        isSelected 
                          ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold' 
                          : 'border-slate-700 bg-slate-900'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-slate-950" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transfer Preview Callout */}
          {selectedRider && (
            <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-500/40 text-xs text-cyan-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>
                  Reassigning to <strong className="text-white">{selectedRider.name}</strong> will update ETA to <strong>{selectedRider.etaStr}</strong> and alert customer Sarah Jenkins.
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !selectedRiderId}
              className={`px-6 py-2.5 bg-gradient-to-r ${actorInfo.color} text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:brightness-110 transition flex items-center gap-2 disabled:opacity-50`}
            >
              <UserCheck className="w-4 h-4 text-slate-950" />
              <span>{isSubmitting ? "Executing Transfer..." : `Confirm Transfer to ${selectedRider?.name || 'Rider'}`}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
