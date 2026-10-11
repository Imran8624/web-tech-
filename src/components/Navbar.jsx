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
    user,
    isAuthenticated,
    logoutUser,
    authRoleTab,
    setAuthRoleTab,
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
          onClick={() => {
            if (isAuthenticated && user) {
              const roleView = user.role === 'admin' ? 'admin' 
                : user.role === 'rider' ? 'rider' 
                : user.role === 'merchant' ? 'merchant' 
                : 'customer';
              setCurrentView(roleView);
            } else {
              setCurrentView('landing');
            }
          }}
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-lg p-1"
          title={isAuthenticated && user ? `Active Portal: ${user.role.toUpperCase()}` : "SignShift Delivery Home"}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-cyan-300 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-xl text-cyan-300">
              🤟
            </div>
          </div>
          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white font-sans">{t('app_title', 'SignShift')}</span>
              <span className="text-xs bg-cyan-500/20 text-cyan-400 font-bold px-1.5 py-0.5 rounded border border-cyan-500/30 uppercase tracking-wider">
                {isAuthenticated && user ? `${user.role} Portal` : 'Delivery'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              {isAuthenticated && user ? `Signed in as ${user.name}` : t('app_tagline', 'Barrier-Free Delivery Platform')}
            </p>
          </div>
        </button>

        {/* Center Role Navigation Switcher: ONLY SHOWS ACTIVE PORTAL WHEN LOGGED IN */}
        <nav aria-label="Main Navigation" className="flex items-center">
          {isAuthenticated && user ? (
            /* WHEN LOGGED IN: DISPLAY ONLY THAT PORTAL */
            <div className="flex items-center gap-2">
              {user.role === 'customer' && (
                <div className="px-4 py-2 rounded-2xl bg-emerald-950/90 border-2 border-emerald-500/70 shadow-lg shadow-emerald-500/15 flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <Package className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs sm:text-sm font-extrabold text-emerald-200">
                    {t('nav_customer', 'Customer Portal')}
                  </span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono uppercase font-black">
                    Only Portal Active
                  </span>
                </div>
              )}

              {user.role === 'rider' && (
                <div className="px-4 py-2 rounded-2xl bg-cyan-950/90 border-2 border-cyan-500/70 shadow-lg shadow-cyan-500/15 flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs sm:text-sm font-extrabold text-cyan-200">
                    {t('nav_rider', 'Rider Portal')}
                  </span>
                  <span className="text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-mono uppercase font-black">
                    Only Portal Active
                  </span>
                </div>
              )}

              {user.role === 'merchant' && (
                <div className="px-4 py-2 rounded-2xl bg-amber-950/90 border-2 border-amber-500/70 shadow-lg shadow-amber-500/15 flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <Store className="w-4 h-4 text-amber-400" />
                  <span className="text-xs sm:text-sm font-extrabold text-amber-200">
                    {t('nav_merchant', 'Merchant Portal')}
                  </span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono uppercase font-black">
                    Only Portal Active
                  </span>
                </div>
              )}

              {user.role === 'admin' && (
                <div className="px-4 py-2 rounded-2xl bg-purple-950/90 border-2 border-purple-500/70 shadow-lg shadow-purple-500/15 flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span className="text-xs sm:text-sm font-extrabold text-purple-200">
                    {t('nav_admin', 'Admin Hub')}
                  </span>
                  <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-mono uppercase font-black">
                    Only Portal Active
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* WHEN NOT LOGGED IN: Portal Selector Tabs */
            <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1 shadow-inner gap-1">
              <button
                onClick={() => setCurrentView('landing')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                  currentView === 'landing' 
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md font-bold' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>{t('nav_landing', 'Home')}</span>
              </button>

              <button
                onClick={() => {
                  setAuthRoleTab('customer');
                  setCurrentView('login');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                  currentView === 'login' && authRoleTab === 'customer'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Package className="w-4 h-4 text-emerald-400" />
                <span>Customer</span>
              </button>

              <button
                onClick={() => {
                  setAuthRoleTab('rider');
                  setCurrentView('login');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                  currentView === 'login' && authRoleTab === 'rider'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>Rider</span>
              </button>

              <button
                onClick={() => {
                  setAuthRoleTab('merchant');
                  setCurrentView('login');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                  currentView === 'login' && authRoleTab === 'merchant'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Store className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Merchant</span>
              </button>

              <button
                onClick={() => {
                  setAuthRoleTab('admin');
                  setCurrentView('login');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                  currentView === 'login' && authRoleTab === 'admin'
                    ? 'bg-purple-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Lock className="w-4 h-4 text-purple-400" />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </nav>

        {/* Right Accessibility & Language & AI Voice Agent & User Quick Controls */}
        <div className="flex items-center gap-2">
          {/* User Profile Pill & Sign Out (Visible when Logged In) */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1 shadow-sm">
              <img 
                src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"} 
                alt={user.name} 
                className="w-7 h-7 rounded-lg object-cover border border-cyan-400"
              />
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-white leading-tight max-w-[110px] truncate">{user.name}</div>
                <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold leading-none">{user.role}</div>
              </div>
              <button
                onClick={logoutUser}
                className="ml-1 px-2.5 py-1 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/60 hover:border-red-500 rounded-lg transition flex items-center gap-1.5 text-xs font-bold"
                title="Sign Out & Switch Portal"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline text-[11px] font-extrabold text-red-200">Sign Out</span>
              </button>
            </div>
          )}

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
