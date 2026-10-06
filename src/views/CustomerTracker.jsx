import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LiveGpsTrackerMap } from '../components/LiveGpsTrackerMap';
import { SUPPORTED_LANGUAGES } from '../constants/languages';
import { DIRECT_COMM_UI, translateChatMessage, getPromptTranslations, LANG_LOCALES } from '../constants/communicationTranslations';
import { 
  Package, 
  MapPin, 
  Clock, 
  Send, 
  Mic, 
  Volume2, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  CheckCircle2,
  Navigation,
  MessageSquare,
  Award,
  Heart,
  PhoneCall,
  Bot,
  Store,
  Edit3,
  User,
  Plus,
  Trash2,
  Lock,
  Key,
  X,
  ArrowRightLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CustomerTracker = ({ onOpenVoiceAgent }) => {
  const { 
    user,
    updateUserProfile,
    order, 
    restaurantsList,
    selectRestaurant, 
    openTransferModal, 
    savedAddresses,
    selectAddress, 
    addCustomAddress, 
    deleteAddress,
    updateOrderItems, 
    sendCustomerMessage, 
    isTranslating, 
    speakText,
    language = 'en',
    setLanguage,
    t = (k) => k,
    SUPPORTED_LANGUAGES = [],
    triggerVisualAlert
  } = useApp();

  const commUI = DIRECT_COMM_UI[language] || DIRECT_COMM_UI.en;
  const [inputText, setInputText] = useState("");
  const custLanguage = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const [isListening, setIsListening] = useState(false);
  const [langToast, setLangToast] = useState(null);

  // Custom Address Form State
  const [showAddressManager, setShowAddressManager] = useState(false);
  const [newStreetAddress, setNewStreetAddress] = useState("");
  const [newGateCode, setNewGateCode] = useState("");
  const [newAddrLabel, setNewAddrLabel] = useState("");

  // Edit Profile Credentials Modal State
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPassword, setEditPassword] = useState(user?.password || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendCustomerMessage(inputText);
    setInputText("");
  };

  const handleSaveCustomAddress = (e) => {
    e.preventDefault();
    if (!newStreetAddress.trim()) return;
    addCustomAddress(newStreetAddress.trim(), newGateCode.trim(), newAddrLabel.trim() || 'Custom Location');
    setNewStreetAddress("");
    setNewGateCode("");
    setNewAddrLabel("");
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!user) return;
    updateUserProfile(user.id, {
      name: editName,
      email: editEmail,
      password: editPassword,
      phone: editPhone
    });
    confetti({ particleCount: 60, spread: 70 });
    setShowProfileEditor(false);
  };

  const handleLanguageChange = (newLangCode) => {
    setLanguage(newLangCode);
    if (triggerVisualAlert) triggerVisualAlert('cyan');
    const selectedLangObj = SUPPORTED_LANGUAGES.find(l => l.code === newLangCode);
    const toastMsg = `🌐 ${selectedLangObj?.flag || ''} Communication translated to ${selectedLangObj?.nativeName || newLangCode}`;
    setLangToast(toastMsg);
    setTimeout(() => setLangToast(null), 3000);
    confetti({ particleCount: 30, spread: 50 });
  };

  const handleVoiceRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = LANG_LOCALES[language] || 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.start();
    } else {
      setIsListening(true);
      setTimeout(() => {
        setInputText(custLanguage.sampleMsg);
        setIsListening(false);
      }, 1500);
    }
  };

  const handleQuickCustomerPrompt = (promptKey, defaultText) => {
    const promptTranslations = getPromptTranslations(promptKey);
    const activeText = promptTranslations[language] || defaultText;
    sendCustomerMessage(activeText, promptTranslations);
    if (speakText) {
      speakText(activeText, language);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-20">
      
      {/* CUSTOMER USER CREDENTIALS HEADER CARD */}
      <div className="glass-panel rounded-3xl p-5 border-2 border-emerald-500/50 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img 
            src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"} 
            alt={user?.name || "Customer"} 
            className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">{user?.name || "Sarah Jenkins"}</h2>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 uppercase">
                Customer Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {user?.email || "user@example.com"} • Phone: {user?.phone || "+1 (555) 234-5678"}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditName(user?.name || '');
            setEditEmail(user?.email || '');
            setEditPassword(user?.password || '');
            setEditPhone(user?.phone || '');
            setShowProfileEditor(true);
          }}
          className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit My Credentials</span>
        </button>
      </div>

      {/* RESTAURANT & DELIVERY ADDRESS CUSTOMIZER BAR */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 bg-slate-900/90 grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Restaurant Selector */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-amber-400" /> Select Merchant / Restaurant:
          </label>
          <select
            value={order.merchantName}
            onChange={(e) => {
              const found = restaurantsList.find(r => r.name === e.target.value);
              if (found) selectRestaurant(found);
            }}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
          >
            {restaurantsList.map((r, idx) => (
              <option key={idx} value={r.name} className="bg-slate-900 text-white">
                🏬 {r.name} ({r.pickupEta || '5 mins'})
              </option>
            ))}
          </select>
        </div>

        {/* Address Selector */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Delivery Destination Address:
            </label>
            <button
              onClick={() => setShowAddressManager(!showAddressManager)}
              className="text-[11px] text-cyan-400 hover:text-white font-bold flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> {showAddressManager ? 'Close Address Manager' : '✍️ Manage Saved Addresses'}
            </button>
          </div>

          <select
            value={order.customerAddress}
            onChange={(e) => {
              const found = savedAddresses.find(a => a.address === e.target.value);
              if (found) selectAddress(found);
            }}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-cyan-300 focus:outline-none cursor-pointer"
          >
            {savedAddresses.map((a, idx) => (
              <option key={a.id || idx} value={a.address} className="bg-slate-900 text-white">
                📍 {a.label || 'Home'} - {a.address} (Gate: {a.gateCode || 'None'})
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* CUSTOM ADDRESS MANAGER COLLAPSIBLE PANEL */}
      {showAddressManager && (
        <div className="glass-panel rounded-2xl p-5 border-2 border-cyan-500/50 bg-slate-900/95 space-y-4 animate-fadeIn shadow-xl">
          <h3 className="font-extrabold text-sm text-white flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <MapPin className="w-4 h-4 text-cyan-400" /> Saved Delivery Address Database
            </span>
            <span className="text-[10px] text-slate-400">{savedAddresses.length} Addresses Stored</span>
          </h3>

          {/* Address List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {savedAddresses.map((addr) => (
              <div key={addr.id || addr.address} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="block font-bold text-white text-xs">{addr.label || 'Saved Location'}</span>
                  <span className="text-[11px] text-slate-300 block">{addr.address}</span>
                  <span className="text-[10px] text-amber-400 font-mono block mt-0.5">Gate Code: {addr.gateCode || '1234'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => selectAddress(addr)}
                    className="px-2.5 py-1 bg-cyan-500 text-slate-950 text-[10px] font-bold rounded hover:bg-cyan-400"
                  >
                    Select
                  </button>
                  {savedAddresses.length > 1 && (
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="p-1 text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add New Address Form */}
          <form onSubmit={handleSaveCustomAddress} className="p-4 bg-slate-950 rounded-xl border border-cyan-500/40 space-y-3">
            <span className="text-xs font-bold text-cyan-300 block">➕ Add New Delivery Address to Database</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                required
                placeholder="Street Address (e.g. 88 Park St, Apt 3)..."
                value={newStreetAddress}
                onChange={(e) => setNewStreetAddress(e.target.value)}
                className="sm:col-span-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Label (e.g. Gym / Beach)"
                value={newAddrLabel}
                onChange={(e) => setNewAddrLabel(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Gate Code (e.g. 5092)..."
                value={newGateCode}
                onChange={(e) => setNewGateCode(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-extrabold text-xs rounded-lg shadow hover:brightness-110"
              >
                Save to My Address Database
              </button>
            </div>
          </form>
        </div>
      )}

      {/* RIDER ASSIST BADGE */}
      <div className="glass-panel rounded-3xl p-6 border-2 border-cyan-500/60 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={order.riderInfo?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                alt={order.riderInfo?.name || "Rider"} 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-cyan-500 border-2 border-slate-900 flex items-center justify-center text-xs">
                🤟
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">{order.riderInfo?.name || 'Alex Rivera'}</h2>
                <span className="bg-cyan-500/20 text-cyan-300 text-xs font-bold px-2 py-0.5 rounded border border-cyan-500/40">
                  {order.riderInfo?.rating || '4.98 ⭐'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {order.riderInfo?.vehicle ? `${order.riderInfo.vehicle} • ` : ''}
                {order.riderInfo?.deliveriesCount || '1,420+'} Successful Deliveries
              </p>

              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-cyan-950 border border-cyan-500/50 rounded-xl text-xs text-cyan-200 font-bold">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>
                  {order.riderInfo?.isDeafMute ? 'Deaf / Non-Verbal Partner. Real-Time Sign Assist Active!' : 'Verified Courier Pro'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end space-y-2">
            <button
              onClick={onOpenVoiceAgent}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-400 via-cyan-500 to-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg hover:scale-105 transition flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-slate-950" />
              <span>Talk to AI Voice Agent 🤖📞</span>
            </button>
            <span className="text-xs text-slate-400 font-mono">ETA: <strong className="text-emerald-400 text-sm">{order.deliveryEta}</strong></span>
            <button
              onClick={() => openTransferModal('rider')}
              className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
              title="Request reassigning order to closer nearby courier"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Switch Courier 🔄</span>
            </button>
          </div>
        </div>
      </div>

      {/* REAL GPS LIVE TRACKER MAP */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            Live Real GPS Navigation & Route Track
          </span>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800">
            📡 Live Telemetry Feed
          </span>
        </div>
        <LiveGpsTrackerMap isRiderView={false} />
      </div>

      {/* TRACKING PROGRESS */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex justify-between items-center text-xs font-bold text-slate-300">
          <span className="flex items-center gap-2 text-sm text-white">
            <Navigation className="w-4 h-4 text-cyan-400" />
            Live Delivery Tracking
          </span>
          <span className="text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800 font-mono">
            Status: {order.status.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
          {[
            { label: t('order_status_pickup', 'Preparing'), active: true },
            { label: t('order_status_en_route', 'On The Way'), active: order.status === 'en_route' || order.status === 'arrived' || order.status === 'delivered' },
            { label: t('order_status_arrived', 'Arrived'), active: order.status === 'arrived' || order.status === 'delivered' },
            { label: t('order_status_delivered', 'Delivered'), active: order.status === 'delivered' }
          ].map((step, idx) => (
            <div key={idx} className="space-y-1">
              <div className={`h-2 rounded-full transition-all ${step.active ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-md' : 'bg-slate-800'}`} />
              <span className={step.active ? 'text-cyan-300' : 'text-slate-500'}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* DIRECT CHAT WITH RIDER */}
      <div className="glass-panel rounded-3xl p-6 border-2 border-slate-800 bg-slate-900/95 space-y-4 shadow-xl relative overflow-hidden">
        {/* Language Change Toast Notification */}
        {langToast && (
          <div className="p-2.5 bg-gradient-to-r from-cyan-900/90 to-emerald-900/90 border border-cyan-400 text-cyan-100 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2 animate-fadeIn shadow-lg">
            <span>{langToast}</span>
          </div>
        )}

        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20 shadow-inner">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base leading-tight">
                {commUI.title}
              </h3>
              <p className="text-[11px] text-slate-400">
                {commUI.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-2xl border border-cyan-500/40 shadow-inner">
            <Globe className="w-4 h-4 text-cyan-400" />
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
              title="Select direct communication language"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                  {l.flag} {l.nativeName || l.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isTranslating && (
          <div className="p-3 bg-cyan-950/80 border border-cyan-500/60 rounded-2xl flex items-center gap-3 animate-pulse text-cyan-200 text-xs font-bold">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>{commUI.translating_notice}</span>
          </div>
        )}

        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3 min-h-[200px] max-h-[300px] overflow-y-auto">
          {order.chatMessages.map((msg) => {
            const messageText = translateChatMessage(msg, language);
            const senderLabel = msg.sender === 'customer' 
              ? commUI.sender_you 
              : msg.sender === 'rider' 
              ? commUI.sender_rider 
              : commUI.sender_system;

            return (
              <div 
                key={msg.id}
                className={`p-3.5 rounded-2xl text-xs space-y-1.5 transition-all duration-300 ${
                  msg.sender === 'customer'
                    ? 'bg-cyan-950/70 border border-cyan-800 text-cyan-100 ml-6'
                    : msg.sender === 'rider'
                    ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-100 mr-6'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 text-center italic'
                }`}
              >
                <div className="flex justify-between items-center font-bold text-[10px] opacity-75">
                  <span className="flex items-center gap-1.5">{senderLabel}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400">
                      {custLanguage.flag} {custLanguage.nativeName}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
                
                <p className="text-sm font-medium leading-relaxed">{messageText}</p>

                {msg.sender === 'rider' && (
                  <div className="pt-1.5 flex items-center justify-between border-t border-emerald-900/60">
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <span>🤟</span> {commUI.sign_to_voice}
                    </span>
                    <button
                      type="button"
                      onClick={() => speakText(messageText, language)}
                      className="text-[11px] text-emerald-300 hover:text-white font-bold flex items-center gap-1 bg-emerald-900/70 hover:bg-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-700 transition shadow-sm"
                      title={commUI.listen_aloud}
                    >
                      <Volume2 className="w-3.5 h-3.5" /> {commUI.listen_aloud}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Customer Voice & Sign Prompts */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {commUI.quick_prompts_title}:
            </span>
            <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded-lg border border-cyan-800">
              {custLanguage.flag} {custLanguage.nativeName}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {commUI.prompts.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => handleQuickCustomerPrompt(p.key, p.text)}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500 rounded-xl text-xs text-left transition font-semibold text-slate-300 truncate group shadow-sm"
                title={p.text}
              >
                <span className="group-hover:text-cyan-300 transition">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Customer Input Box */}
        <form onSubmit={handleSend} className="flex gap-2">
          <button
            type="button"
            onClick={handleVoiceRecording}
            className={`p-3 rounded-2xl border transition flex items-center justify-center ${
              isListening
                ? 'bg-red-500 text-white border-red-400 animate-bounce'
                : 'bg-slate-950 hover:bg-slate-800 text-cyan-400 border-slate-800'
            }`}
            title={commUI.voice_title}
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? commUI.voice_listening : commUI.input_placeholder}
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white focus:border-cyan-400 focus:outline-none placeholder:text-slate-500"
          />

          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg hover:brightness-110 transition flex items-center gap-2"
          >
            <span>{commUI.send_btn}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* EDIT USER CREDENTIALS MODAL */}
      {showProfileEditor && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <span>✏️ Edit My Profile Credentials</span>
              </h3>
              <button onClick={() => setShowProfileEditor(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
                <input
                  type="text"
                  required
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-400 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowProfileEditor(false)}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 font-bold text-xs rounded-xl border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg"
                >
                  Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
