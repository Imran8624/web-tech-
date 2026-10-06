import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Smartphone, 
  Package, 
  Store, 
  Bot, 
  Sliders, 
  Sun, 
  Moon, 
  Zap,
  Volume2,
  VolumeX,
  PhoneCall,
  Home,
  Lock,
  ShieldCheck,
  LogOut,
  User,
  Bell,
  Palette,
  Globe,
  ArrowRightLeft
} from 'lucide-react';

export const Navbar = ({ onOpenAccessibility, onOpenVoiceAgent, onOpenNotifications }) => {
  const { 
    currentView, 
    setCurrentView, 
    theme, 
    notificationsList = [],
    language = 'en',
    setLanguage,
    t = (k) => k,
    SUPPORTED_LANGUAGES = [],
    openTransferModal
  } = useApp();
  const unreadCount = notificationsList.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <button 
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-lg p-1"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-cyan-300 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-xl text-cyan-300">
              🤟
            </div>
          </div>
          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white font-sans">{t('app_title', 'SignShift')}</span>
              <span className="text-xs bg-cyan-500/20 text-cyan-400 font-bold px-1.5 py-0.5 rounded border border-cyan-500/30 uppercase tracking-wider">Delivery</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">{t('app_tagline', 'Barrier-Free Delivery Platform')}</p>
          </div>
        </button>

        {/* Center Role Navigation Switcher */}
        <nav aria-label="Main Navigation" className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1 shadow-inner">
          <button
            onClick={() => setCurrentView('landing')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              currentView === 'landing' 
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md font-bold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden md:inline">{t('nav_landing', 'Landing')}</span>
          </button>

          <button
            onClick={() => setCurrentView('rider')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              currentView === 'rider' 
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md font-bold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>{t('nav_rider', 'Rider App')}</span>
          </button>

          <button
            onClick={() => setCurrentView('customer')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              currentView === 'customer' 
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md font-bold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Package className="w-4 h-4 text-emerald-400" />
            <span>{t('nav_customer', 'Customer View')}</span>
          </button>

          <button
            onClick={() => setCurrentView('merchant')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              currentView === 'merchant' 
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md font-bold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Store className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">{t('nav_merchant', 'Merchant')}</span>
          </button>

          <button
            onClick={() => setCurrentView('sign-lab')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              currentView === 'sign-lab' 
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md font-bold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span className="hidden xl:inline">{t('nav_sign_lab', 'Sign Studio')}</span>
          </button>

          <button
            onClick={() => setCurrentView('admin')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              currentView === 'admin' 
                ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-slate-950 shadow-md font-bold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span className="hidden xl:inline">{t('nav_admin', 'Admin Hub')}</span>
          </button>

          <button
            onClick={() => setCurrentView('login')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              currentView === 'login' 
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md font-bold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>{t('nav_login', 'Login')}</span>
          </button>
        </nav>

        {/* Right Accessibility & Language & AI Voice Agent Quick Controls */}
        <div className="flex items-center gap-2">
          {/* Global Multi-Language Selector Dropdown */}
          <div className="relative flex items-center bg-slate-900 border border-slate-700/80 hover:border-cyan-400 rounded-xl px-2.5 py-1.5 transition shadow-sm">
            <Globe className="w-4 h-4 text-cyan-400 mr-1.5 flex-shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-xs font-extrabold text-cyan-300 focus:outline-none cursor-pointer pr-1"
              title="Change language across all sectors"
              aria-label="Select Application Language"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-100 font-semibold">
                  {lang.flag} {lang.nativeName || lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* AI Voice Call Agent Trigger Button */}
          <button
            onClick={onOpenVoiceAgent}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 text-xs font-extrabold shadow-lg hover:brightness-110 transition flex items-center gap-1.5"
            title="Launch AI Voice Dispatch Agent (Call customer & schedule appointment)"
          >
            <PhoneCall className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">{t('nav_voice_agent', 'AI Voice Agent')}</span>
          </button>

          {/* Theme & Sector Color Studio Trigger */}
          <button
            onClick={onOpenAccessibility}
            className={`px-2.5 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              theme === 'neon'
                ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-lg shadow-cyan-400/30'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-cyan-500'
            }`}
            title="Open Accessibility Themes & Sector Color Studio"
          >
            <Palette className="w-4 h-4 text-cyan-400" />
            <span className="hidden xl:inline capitalize text-[11px] font-extrabold text-cyan-300">
              {theme.replace('-', ' ')}
            </span>
          </button>

          {/* Real-Time Notifications Bell Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 hover:border-cyan-500 rounded-xl transition flex items-center justify-center focus:ring-2 focus:ring-cyan-400"
            title="Open Real-Time Notification Center (Rider, Merchant, Customer)"
          >
            <Bell className="w-4 h-4 text-cyan-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white font-extrabold text-[9px] flex items-center justify-center font-mono shadow-md animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Accessibility Settings Trigger */}
          <button
            onClick={onOpenAccessibility}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 hover:border-cyan-500 rounded-xl transition flex items-center gap-1 focus:ring-2 focus:ring-cyan-400"
            title="Open Accessibility Controls"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
