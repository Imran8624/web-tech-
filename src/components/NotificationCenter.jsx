import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Trash2, 
  Sparkles, 
  Store, 
  Navigation, 
  Package, 
  MapPin, 
  CheckCircle2, 
  Award, 
  Clock, 
  ExternalLink,
  Volume2,
  VolumeX,
  Zap,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

// -------------------------------------------------------------
// 1. FLOATING PUSH NOTIFICATION TOAST
// -------------------------------------------------------------
export const NotificationToast = () => {
  const { latestToast, dismissToast, setCurrentView } = useApp();

  if (!latestToast) return null;

  const getRoleTheme = (role) => {
    switch (role) {
      case 'merchant': return { border: 'border-amber-500/70', badge: 'bg-amber-950 text-amber-300 border-amber-800', icon: '🏬' };
      case 'rider': return { border: 'border-cyan-500/70', badge: 'bg-cyan-950 text-cyan-300 border-cyan-800', icon: '🏍️' };
      case 'customer': return { border: 'border-emerald-500/70', badge: 'bg-emerald-950 text-emerald-300 border-emerald-800', icon: '👤' };
      default: return { border: 'border-purple-500/70', badge: 'bg-purple-950 text-purple-300 border-purple-800', icon: '🔔' };
    }
  };

  const theme = getRoleTheme(latestToast.targetRole);

  const handleGoToView = () => {
    if (latestToast.targetRole === 'merchant') setCurrentView('merchant');
    else if (latestToast.targetRole === 'rider') setCurrentView('rider');
    else if (latestToast.targetRole === 'customer') setCurrentView('customer');
    else setCurrentView('admin');
    dismissToast();
  };

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-bounce-soft">
      <div className={`glass-panel rounded-2xl p-4 bg-slate-950/95 border-2 ${theme.border} shadow-2xl backdrop-blur-xl flex flex-col gap-2.5`}>
        
        {/* Toast Top Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{theme.icon}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase border ${theme.badge}`}>
              {latestToast.targetRole} Alert
            </span>
            <span className="text-[10px] text-slate-500 font-mono">{latestToast.timestamp}</span>
          </div>

          <button 
            onClick={dismissToast}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toast Title & Message */}
        <div>
          <h4 className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5">
            <span>{latestToast.title}</span>
          </h4>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
            {latestToast.message}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-1.5 border-t border-slate-900 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500 font-medium">Click to view role dashboard</span>
          <button
            onClick={handleGoToView}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold rounded-lg border border-slate-700 flex items-center gap-1 transition text-[11px]"
          >
            <span>Open {latestToast.targetRole?.toUpperCase()}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. REAL-TIME NOTIFICATION CENTER MODAL / DRAWER
// -------------------------------------------------------------
export const NotificationCenter = ({ isOpen, onClose }) => {
  const { 
    notificationsList = [], 
    markAllNotificationsRead, 
    markNotificationRead, 
    clearNotifications, 
    setCurrentView,
    order,
    notifyOrderAppeared,
    notifyOrderReady,
    updateOrderStatus,
    t,
    language
  } = useApp();

  const [filterRole, setFilterRole] = useState('ALL');

  if (!isOpen) return null;

  const filteredNotifs = notificationsList.filter(n => {
    if (filterRole === 'ALL') return true;
    return n.targetRole === filterRole.toLowerCase();
  });

  const unreadCount = notificationsList.filter(n => !n.isRead).length;

  const handleSimulateNewOrder = () => {
    notifyOrderAppeared();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleSimulateOrderReady = () => {
    notifyOrderReady();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleSimulateRiderPickup = () => {
    updateOrderStatus('en_route');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleSimulateRiderDrop = () => {
    updateOrderStatus('arrived');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleSimulateDelivered = () => {
    updateOrderStatus('delivered');
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-cyan-500/60 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl animate-fadeIn max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xl">
              🔔
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base">SignShift Notification Center</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-[10px] font-extrabold font-mono">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">Real-time alerts for Rider Pick & Drop, Merchant Orders, and Customer ETAs</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs by Target Role */}
        <div className="flex items-center justify-between gap-2 flex-wrap flex-shrink-0">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold gap-1">
            {[
              { id: 'ALL', label: t('all', 'ALL') },
              { id: 'MERCHANT', label: t('merchantSector', 'Merchant') },
              { id: 'RIDER', label: t('riderSector', 'Rider') },
              { id: 'CUSTOMER', label: t('customerSector', 'Customer') }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterRole(tab.id)}
                className={`py-1.5 px-3 rounded-lg transition ${
                  filterRole === tab.id
                    ? 'bg-cyan-500 text-slate-950 font-extrabold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs rounded-xl border border-slate-800 transition flex items-center gap-1"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('markAllRead', 'Mark All Read')}</span>
            </button>

            <button
              onClick={clearNotifications}
              className="p-1.5 bg-slate-950 hover:bg-red-950 text-slate-400 hover:text-red-400 text-xs rounded-xl border border-slate-800 transition"
              title="Clear all notifications"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Interactive Simulation Bar for Instant Testing */}
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-2 flex-shrink-0">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            ⚡ Quick Test Role Notifications (VIVA / Demo Triggers):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[11px]">
            <button
              onClick={handleSimulateNewOrder}
              className="p-1.5 bg-amber-950/60 hover:bg-amber-900 border border-amber-700/60 text-amber-200 rounded-xl font-bold transition flex items-center justify-center gap-1 text-center"
              title="Alerts Merchant that order has appeared in kitchen"
            >
              <span>🔔 New Order</span>
            </button>

            <button
              onClick={handleSimulateOrderReady}
              className="p-1.5 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 rounded-xl font-bold transition flex items-center justify-center gap-1 text-center"
              title="Alerts Rider & Customer that meal is ready for pickup"
            >
              <span>🍳 Ready</span>
            </button>

            <button
              onClick={handleSimulateRiderPickup}
              className="p-1.5 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-200 rounded-xl font-bold transition flex items-center justify-center gap-1 text-center"
              title="Alerts Customer that rider picked up order and is en route"
            >
              <span>🚴 Picked Up</span>
            </button>

            <button
              onClick={handleSimulateRiderDrop}
              className="p-1.5 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 rounded-xl font-bold transition flex items-center justify-center gap-1 text-center"
              title="Alerts Customer that rider has arrived for drop-off at building"
            >
              <span>🚪 Drop-off</span>
            </button>

            <button
              onClick={handleSimulateDelivered}
              className="p-1.5 bg-purple-950/60 hover:bg-purple-900 border border-purple-700/60 text-purple-200 rounded-xl font-bold transition flex items-center justify-center gap-1 text-center col-span-2 sm:col-span-1"
              title="Alerts All Roles that order is completed"
            >
              <span>🎉 Delivered</span>
            </button>
          </div>
        </div>

        {/* Notifications Scrollable List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No notifications for this role. Use the quick test buttons above to trigger live alerts!
            </div>
          ) : (
            filteredNotifs.map((item) => {
              const isRider = item.targetRole === 'rider';
              const isMerchant = item.targetRole === 'merchant';
              const isCust = item.targetRole === 'customer';

              return (
                <div 
                  key={item.id}
                  onClick={() => markNotificationRead(item.id)}
                  className={`p-3.5 rounded-2xl border transition flex items-start justify-between gap-3 cursor-pointer ${
                    item.isRead 
                      ? 'bg-slate-950/60 border-slate-800 text-slate-400' 
                      : 'bg-slate-950 border-cyan-500/50 shadow-md text-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase border ${
                        isMerchant ? 'bg-amber-950 text-amber-300 border-amber-800' :
                        isRider ? 'bg-cyan-950 text-cyan-300 border-cyan-800' :
                        isCust ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                        'bg-purple-950 text-purple-300 border-purple-800'
                      }`}>
                        {item.targetRole}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5">
                        <span>{item.title}</span>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-300">{item.message}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isMerchant) setCurrentView('merchant');
                        else if (isRider) setCurrentView('rider');
                        else if (isCust) setCurrentView('customer');
                        onClose();
                      }}
                      className="text-[10px] text-cyan-400 hover:underline font-bold flex items-center gap-0.5 mt-1"
                    >
                      <span>View</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
