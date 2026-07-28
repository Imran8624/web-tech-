import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SignAvatar3D, SIGN_DICTIONARY } from '../components/SignAvatar3D';
import { SUPPORTED_LANGUAGES, RIDER_QUICK_SIGNS } from '../constants/languages';
import { 
  CheckCircle2, 
  Navigation, 
  MapPin, 
  Phone, 
  PhoneCall,
  MessageSquare, 
  Zap, 
  Activity, 
  ChevronDown, 
  Send, 
  Volume2, 
  Globe, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight,
  AlertTriangle,
  Clock,
  ThumbsUp,
  User,
  ShoppingBag,
  Mic,
  Maximize2,
  Edit3,
  Plus,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RiderDashboard = ({ onOpenVoiceAgent }) => {
  const { 
    user,
    updateUserProfile,
    order, 
    updateOrderStatus, 
    sendRiderResponse, 
    sendCustomerMessage,
    triggerVisualAlert, 
    isTranslating 
  } = useApp();

  const [activeSignKey, setActiveSignKey] = useState("HELLO");
  const [selectedLanguage, setSelectedLanguage] = useState(SUPPORTED_LANGUAGES[0]);
  const [customSimText, setCustomSimText] = useState("");

  // Custom Rider Quick Signs state
  const [riderSignsList, setRiderSignsList] = useState(RIDER_QUICK_SIGNS);
  const [showAddSignModal, setShowAddSignModal] = useState(false);
  const [newSignLabel, setNewSignLabel] = useState("");
  const [newSignIcon, setNewSignIcon] = useState("👋");

  // Profile Editor Modal State
  const [showRiderProfileEditor, setShowRiderProfileEditor] = useState(false);
  const [editName, setEditName] = useState(user?.name || 'Alex Rivera');
  const [editEmail, setEditEmail] = useState(user?.email || 'alex.rivera@signshift.io');
  const [editVehicle, setEditVehicle] = useState(user?.vehicle || 'Electric Delivery Bike');
  const [editIsDeaf, setEditIsDeaf] = useState(user?.isDeafMute !== undefined ? user.isDeafMute : true);

  const handleSimulateCustomerInput = (e) => {
    e.preventDefault();
    if (!customSimText.trim()) return;
    sendCustomerMessage(customSimText);
    setCustomSimText("");
    setActiveSignKey("LEAVE AT DOOR");
  };

  const handleSimulateLanguageMsg = (lang) => {
    setSelectedLanguage(lang);
    sendCustomerMessage(`[${lang.name}] ${lang.sampleMsg}`);
    setActiveSignKey(lang.code === 'ja' ? 'THANK YOU' : 'LEAVE AT DOOR');
  };

  const handleRiderQuickTap = (signItem) => {
    setActiveSignKey(signItem.key || "HELLO");
    const translatedMsg = signItem.translations ? (signItem.translations[selectedLanguage.code] || signItem.translations['en']) : signItem.label;
    sendRiderResponse(translatedMsg, signItem.key || signItem.label);
  };

  const handleAddCustomSign = (e) => {
    e.preventDefault();
    if (!newSignLabel.trim()) return;
    const newSignObj = {
      key: newSignLabel.toUpperCase(),
      label: newSignLabel,
      icon: newSignIcon || "🤟",
      category: "CUSTOM",
      translations: {
        en: newSignLabel,
        es: newSignLabel,
        fr: newSignLabel,
        de: newSignLabel,
        hi: newSignLabel,
        kn: newSignLabel
      }
    };
    setRiderSignsList(prev => [...prev, newSignObj]);
    confetti({ particleCount: 50, spread: 60 });
    setShowAddSignModal(false);
    setNewSignLabel("");
  };

  const handleSaveRiderProfile = (e) => {
    e.preventDefault();
    if (!user) return;
    updateUserProfile(user.id, {
      name: editName,
      email: editEmail,
      vehicle: editVehicle,
      isDeafMute: editIsDeaf
    });
    confetti({ particleCount: 60, spread: 70 });
    setShowRiderProfileEditor(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pickup': return { bg: 'bg-emerald-500', text: 'text-emerald-400', label: '1. RESTAURANT PICKUP' };
      case 'en_route': return { bg: 'bg-cyan-500', text: 'text-cyan-400', label: '2. EN ROUTE TO CUSTOMER' };
      case 'arrived': return { bg: 'bg-amber-500', text: 'text-amber-400', label: '3. ARRIVED OUTSIDE' };
      case 'delivered': return { bg: 'bg-purple-500', text: 'text-purple-400', label: '4. ORDER DELIVERED 🎉' };
      default: return { bg: 'bg-cyan-500', text: 'text-cyan-400', label: 'IN PROGRESS' };
    }
  };

  const currentStatusObj = getStatusColor(order.status);

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 space-y-4 pb-24">
      
      {/* TOP RIDER HEADER BAR WITH CREDENTIALS EDITOR */}
      <div className="glass-panel rounded-2xl p-4 border-2 border-cyan-500/40 flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 shadow-xl">
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 font-extrabold text-xl shadow-lg">
            🤟
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-lg text-white">{user?.name || "Alex Rivera"}</h2>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/40 uppercase">
                {user?.isDeafMute ? 'Deaf Rider Mode' : 'Hearing Rider'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
              <span>Vehicle: <strong className="text-slate-200">{user?.vehicle || 'Electric Bike'}</strong></span> • 
              <span className="text-cyan-400 font-semibold">Order #{order.id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditName(user?.name || 'Alex Rivera');
              setEditEmail(user?.email || 'alex.rivera@signshift.io');
              setEditVehicle(user?.vehicle || 'Electric Bike');
              setEditIsDeaf(user?.isDeafMute !== undefined ? user.isDeafMute : true);
              setShowRiderProfileEditor(true);
            }}
            className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>

          <button
            onClick={onOpenVoiceAgent}
            className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-extrabold rounded-xl shadow-lg hover:scale-105 transition flex items-center gap-1.5 text-xs"
          >
            <PhoneCall className="w-4 h-4 text-slate-950" />
            <span>AI Voice Call 📞</span>
          </button>
        </div>

      </div>

      {/* ACCESSIBLE STATUS PROGRESS INDICATOR */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="flex justify-between items-center text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-full ${currentStatusObj.bg} animate-ping`} />
            <span className={`${currentStatusObj.text} font-mono text-sm tracking-wider uppercase`}>{currentStatusObj.label}</span>
          </span>
          <span className="text-slate-400">ETA: <strong className="text-white">{order.status === 'pickup' ? order.pickupEta : order.deliveryEta}</strong></span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {[
            { id: 'pickup', label: '1. Pickup', icon: '🛍️' },
            { id: 'en_route', label: '2. En Route', icon: '🏍️' },
            { id: 'arrived', label: '3. Arrived', icon: '📍' },
            { id: 'delivered', label: '4. Delivered', icon: '✅' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => updateOrderStatus(st.id)}
              className={`p-3 rounded-xl font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 border-2 ${
                order.status === st.id
                  ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 border-white shadow-lg scale-[1.02]'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              <span>{st.icon}</span>
              <span>{st.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MAP & ADDRESS BOX */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        <div className="md:col-span-5 glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-cyan-400" /> Delivery Address</span>
              <span className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                {order.distance}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-white">{order.customerAddress}</h3>
            <p className="text-xs text-slate-300 mt-1">Customer: <strong>{order.customerName}</strong> ({order.customerPhone})</p>

            <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border-2 border-amber-500/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔢</span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 block">Gate / Intercom Code</span>
                  <span className="text-xl font-mono font-extrabold text-amber-300">{order.gateCode}</span>
                </div>
              </div>
              <button 
                onClick={() => handleRiderQuickTap(RIDER_QUICK_SIGNS[1])}
                className="px-3 py-1.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg hover:brightness-110"
              >
                Sign Back 🚪
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Merchant: <strong className="text-white">{order.merchantName}</strong></span>
            <span className="text-cyan-400 font-semibold">{order.totalAmount}</span>
          </div>
        </div>

        {/* Visual GPS Map */}
        <div className="md:col-span-7 relative glass-panel rounded-2xl overflow-hidden border border-slate-800 min-h-[220px] flex items-center justify-center bg-slate-950">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]" />

          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path 
              d="M 60 160 Q 180 80 320 120" 
              fill="none" 
              stroke="#06b6d4" 
              strokeWidth="4" 
              strokeDasharray="8 6" 
              className="animate-pulse"
            />
          </svg>

          <div className="absolute left-10 bottom-10 flex flex-col items-center">
            <div className="p-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-full shadow-lg animate-bounce">
              🏬
            </div>
            <span className="text-[10px] bg-slate-900 text-amber-300 px-1.5 py-0.5 rounded font-bold mt-1 border border-amber-500/40">
              {order.merchantName}
            </span>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
            <div className="p-3 bg-cyan-400 text-slate-950 font-black text-sm rounded-full shadow-xl shadow-cyan-400/40 ring-4 ring-cyan-500/20">
              🏍️
            </div>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded font-bold mt-1 border border-cyan-500">
              {user?.name || 'Rider'}
            </span>
          </div>

          <div className="absolute right-10 top-10 flex flex-col items-center">
            <div className="p-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-full shadow-lg">
              🏡
            </div>
            <span className="text-[10px] bg-slate-900 text-emerald-300 px-1.5 py-0.5 rounded font-bold mt-1 border border-emerald-500/40">
              Destination
            </span>
          </div>

          <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-[11px] text-slate-300 flex items-center gap-1.5 font-bold">
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            Live GPS Active
          </div>
        </div>

      </div>

      {/* 3D SIGN LANGUAGE AVATAR & TRANSLATOR */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 border-2 border-cyan-500/60 bg-slate-900/95 space-y-6 shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                AI Sign Translator & Visual Bridge
                {isTranslating && (
                  <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/40 animate-pulse">
                    Translating...
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Speech ➔ Real-Time 3D Sign Language (ASL/ISL)
              </p>
            </div>
          </div>

          <button
            onClick={() => triggerVisualAlert('cyan')}
            className="p-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-bold rounded-xl flex items-center gap-1"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Flash Alert</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6">
            <SignAvatar3D activeSignKey={activeSignKey} height="320px" />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> Simulate Customer Input in Any Language:
              </span>

              <div className="grid grid-cols-2 gap-2">
                {SUPPORTED_LANGUAGES.slice(0, 4).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSimulateLanguageMsg(lang)}
                    className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 rounded-xl text-xs text-left transition text-slate-200 font-semibold"
                  >
                    <span className="block font-bold text-white mb-0.5">{lang.name}</span>
                    <span className="text-[11px] text-slate-400 truncate block">"{lang.sampleMsg.slice(0, 24)}..."</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSimulateCustomerInput} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={customSimText}
                  onChange={(e) => setCustomSimText(e.target.value)}
                  placeholder="Type any message..."
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition"
                >
                  Translate 🤟
                </button>
              </form>
            </div>

            {/* Chat Log */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 max-h-[160px] overflow-y-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Live Message Transcript</span>
              {order.chatMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`p-2.5 rounded-xl text-xs ${
                    msg.sender === 'customer'
                      ? 'bg-cyan-950/60 border border-cyan-800 text-cyan-200'
                      : msg.sender === 'rider'
                      ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-200'
                      : 'bg-slate-900 text-slate-400 text-center italic'
                  }`}
                >
                  <div className="flex justify-between items-center font-bold text-[10px] opacity-80 mb-1">
                    <span>{msg.sender === 'customer' ? '👤 Customer' : msg.sender === 'rider' ? `🤟 ${user?.name || 'Rider'}` : '⚙️ System'}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="font-semibold">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* OUTGOING RIDER TAP-TO-SIGN GRID WITH CUSTOM SIGN ADDER */}
        <div className="border-t border-slate-800 pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <span>🤟</span> Rider Quick Tap-to-Sign Response (Auto-Translates to Customer Language)
            </span>
            
            <button
              onClick={() => setShowAddSignModal(true)}
              className="px-3 py-1 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/40 rounded-lg text-xs font-bold transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Custom Sign Phrase
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {riderSignsList.map((item, idx) => (
              <button
                key={item.key || idx}
                onClick={() => handleRiderQuickTap(item)}
                className={`p-3 rounded-2xl text-left border-2 transition flex flex-col justify-between h-[100px] ${
                  activeSignKey === item.key
                    ? 'bg-cyan-500 text-slate-950 border-white shadow-lg scale-105 font-extrabold'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-cyan-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.icon || '🤟'}</span>
                  <span className="text-[10px] opacity-70 uppercase font-mono">{item.category || 'SIGN'}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold leading-tight">{item.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* RIDER PROFILE EDITOR MODAL */}
      {showRiderProfileEditor && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-cyan-500/60 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <span>✏️ Edit Rider Profile Credentials</span>
              </h3>
              <button onClick={() => setShowRiderProfileEditor(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRiderProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Rider Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Vehicle Type</label>
                <input
                  type="text"
                  required
                  value={editVehicle}
                  onChange={(e) => setEditVehicle(e.target.value)}
                  placeholder="e.g. Electric Scooter / Motorbike"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="riderDeafCheck"
                  checked={editIsDeaf}
                  onChange={(e) => setEditIsDeaf(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-cyan-500"
                />
                <label htmlFor="riderDeafCheck" className="text-xs text-slate-200 font-bold">
                  🤟 Enable Deaf / Non-Verbal Accessibility Badge
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowRiderProfileEditor(false)}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 font-bold text-xs rounded-xl border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CUSTOM SIGN MODAL */}
      {showAddSignModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-cyan-500/60 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <span>➕ Add Custom Quick Sign Phrase</span>
              </h3>
              <button onClick={() => setShowAddSignModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomSign} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Sign Phrase Label</label>
                <input
                  type="text"
                  required
                  value={newSignLabel}
                  onChange={(e) => setNewSignLabel(e.target.value)}
                  placeholder="e.g. In Elevator / At Reception"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Emoji Icon</label>
                <input
                  type="text"
                  value={newSignIcon}
                  onChange={(e) => setNewSignIcon(e.target.value)}
                  placeholder="e.g. 🛗 or 🏢"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSignModal(false)}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 font-bold text-xs rounded-xl border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg"
                >
                  Add Sign Button
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
