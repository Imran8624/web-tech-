import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  Bot, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Globe, 
  Activity, 
  Search, 
  Filter, 
  PhoneCall,
  Sparkles, 
  Award, 
  RefreshCw, 
  Plus, 
  Edit, 
  Trash2, 
  Lock, 
  Unlock,
  Mail, 
  UserCheck, 
  Eye, 
  EyeOff, 
  Database, 
  Store, 
  MapPin, 
  X,
  Key,
  FileText,
  Download,
  Copy,
  Check,
  Clock,
  Radio,
  Server,
  Cpu,
  Package,
  Layers,
  FileCode
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminDashboard = () => {
  const { 
    usersList, 
    updateUserProfile, 
    deleteUser, 
    addUserByAdmin, 
    resetDatabase, 
    savedAddresses, 
    restaurantsList, 
    addRestaurant, 
    order,
    triggerVisualAlert, 
    speakText,
    user,
    isAuthenticated,
    loginUser,
    logoutUser,
    activityLogs = [],
    logActivity,
    clearActivityLogs
  } = useApp();

  // Admin Access Gate State
  const isAlreadyAdmin = isAuthenticated && user?.role === 'admin';
  const [sessionUnlocked, setSessionUnlocked] = useState(isAlreadyAdmin);
  const [adminEmailInput, setAdminEmailInput] = useState('admin@signshift.io');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPinInput, setAdminPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);

  // Active Tab: 'users' | 'database' | 'activity' | 'restaurants'
  const [activeTab, setActiveTab] = useState('database');

  // Database Explorer sub-tab: 'all' | 'orders' | 'users' | 'addresses' | 'restaurants' | 'raw_json'
  const [dbSubTab, setDbSubTab] = useState('all');
  const [copiedJson, setCopiedJson] = useState(false);

  // Activity Stream Filter
  const [activityFilter, setActivityFilter] = useState('ALL');
  const [activitySearch, setActivitySearch] = useState('');

  // Users Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showPasswordMap, setShowPasswordMap] = useState({});

  // Add User Modal State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('customer');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserAddress, setNewUserAddress] = useState('');
  const [newUserIsDeaf, setNewUserIsDeaf] = useState(false);

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState(null);

  // Add Restaurant Modal State
  const [isAddRestOpen, setIsAddRestOpen] = useState(false);
  const [restName, setRestName] = useState('');
  const [restAddress, setRestAddress] = useState('');
  const [restCuisine, setRestCuisine] = useState('');

  // Handle Admin Credential Verification
  const handleVerifyAdminCredentials = (e) => {
    if (e) e.preventDefault();
    setAuthError('');

    // Check email/password or master PIN (9482)
    const isValidCreds = (
      (adminEmailInput.trim().toLowerCase() === 'admin@signshift.io' && adminPasswordInput === 'admin123') ||
      (adminPinInput.trim() === '9482' || adminPinInput.trim() === '1234')
    );

    if (isValidCreds) {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      loginUser('admin', 'SignShift Administrator', 'admin@signshift.io', 'admin123');
      setSessionUnlocked(true);
      if (logActivity) {
        logActivity('Admin Console Unlocked', 'AUTH', 'Administrator verified credentials for Database & Audit access', 'Admin Console', 'SUCCESS');
      }
    } else {
      setAuthError('Invalid Admin credentials or security PIN. Click below to auto-fill default admin credentials.');
      if (logActivity) {
        logActivity('Unauthorized Admin Access Attempt', 'AUTH', `Failed unlock attempt for: ${adminEmailInput}`, 'Security Gateway', 'WARNING');
      }
    }
  };

  const handleAutofillAdmin = () => {
    setAdminEmailInput('admin@signshift.io');
    setAdminPasswordInput('admin123');
    setAdminPinInput('9482');
    setAuthError('');
  };

  const handleInstantDemoUnlock = () => {
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    loginUser('admin', 'SignShift Administrator', 'admin@signshift.io', 'admin123');
    setSessionUnlocked(true);
    if (logActivity) {
      logActivity('Admin Console 1-Tap Unlocked', 'AUTH', 'Instant demo clearance granted for Project Evaluation', 'Admin Console', 'SUCCESS');
    }
  };

  const handleLockConsole = () => {
    setSessionUnlocked(false);
    setAdminPasswordInput('');
    setAdminPinInput('');
    if (logActivity) {
      logActivity('Admin Console Locked', 'AUTH', 'Admin locked dashboard session', 'SignShift Admin', 'INFO');
    }
  };

  const togglePasswordVisibility = (userId) => {
    setShowPasswordMap(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserEmail.trim()) return;

    addUserByAdmin({
      name: newUserName || 'New System User',
      email: newUserEmail.trim(),
      password: newUserPassword || 'user123',
      role: newUserRole,
      phone: newUserPhone || '+1 (555) 000-0000',
      address: newUserAddress || '100 City Center',
      isDeafMute: newUserIsDeaf
    });

    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    setIsAddUserOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
  };

  const handleUpdateUserSubmit = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUserProfile(editingUser.id, editingUser);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    setEditingUser(null);
  };

  const handleCreateRestaurant = (e) => {
    e.preventDefault();
    if (!restName.trim()) return;
    addRestaurant({
      name: restName.trim(),
      address: restAddress.trim() || '123 Market St',
      cuisine: restCuisine || 'Fusion',
      items: [{ name: "Signature Dish", qty: 1, notes: "Chef Special", price: "$15.00" }],
      totalAmount: "$15.00"
    });
    confetti({ particleCount: 60, spread: 60 });
    setIsAddRestOpen(false);
    setRestName('');
    setRestAddress('');
  };

  const handleBroadcastAlert = () => {
    triggerVisualAlert('cyan');
    speakText("Admin notification dispatched: Emergency Visual Alert sent to all active riders.");
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
  };

  const handleSimulateActivity = () => {
    const simulationEvents = [
      { action: "AI Voice Call Completed", cat: "COMMUNICATION", desc: "Automated voice agent scheduled customer drop-off window", actor: "AI Dispatch Bot", stat: "SUCCESS" },
      { action: "High-Priority Visual Signal", cat: "ALERT", desc: "Rider Alex Rivera received doorstep strobe alert", actor: "SignShift Bridge", stat: "INFO" },
      { action: "Order ETA Recalculated", cat: "ORDER", desc: "Delivery ETA updated to 14 mins via live routing telemetry", actor: "Routing Daemon", stat: "INFO" },
      { action: "Sign Vocabulary Synced", cat: "DATABASE", desc: "New 3D gesture tokens loaded into avatar rendering buffer", actor: "Sign Studio", stat: "SUCCESS" }
    ];
    const picked = simulationEvents[Math.floor(Math.random() * simulationEvents.length)];
    if (logActivity) {
      logActivity(picked.action, picked.cat, picked.desc, picked.actor, picked.stat);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    }
  };

  const handleCopyRawDatabase = () => {
    const fullDb = {
      timestamp: new Date().toISOString(),
      metadata: {
        platform: "SignShift Inclusive Delivery System",
        environment: "Local In-Memory / LocalStorage DB",
        databaseVersion: "2.4.0"
      },
      users: usersList,
      activeOrder: order,
      restaurants: restaurantsList,
      savedAddresses: savedAddresses,
      auditActivityLogs: activityLogs
    };
    navigator.clipboard.writeText(JSON.stringify(fullDb, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadDatabaseBackup = () => {
    const fullDb = {
      timestamp: new Date().toISOString(),
      platform: "SignShift Inclusive Logistics",
      users: usersList,
      activeOrder: order,
      restaurants: restaurantsList,
      savedAddresses: savedAddresses,
      activityLogs: activityLogs
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullDb, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `signshift_database_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered Users
  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Filtered Activity Logs
  const filteredActivity = (activityLogs || []).filter(item => {
    const matchesCategory = activityFilter === 'ALL' || item.category === activityFilter;
    const matchesQuery = activitySearch === '' || 
      item.action.toLowerCase().includes(activitySearch.toLowerCase()) ||
      item.details.toLowerCase().includes(activitySearch.toLowerCase()) ||
      item.actor.toLowerCase().includes(activitySearch.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // =========================================================================
  // VIEW 1: ADMIN CREDENTIAL AUTHENTICATION GATE (When locked / not admin)
  // =========================================================================
  if (!sessionUnlocked && !isAlreadyAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 space-y-6 pb-24">
        {/* Security Shield Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-500 via-cyan-400 to-indigo-500 p-1 mx-auto shadow-2xl shadow-purple-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center font-bold text-3xl text-purple-400">
              🛡️
            </div>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Admin Authorization Portal</h2>
          <p className="text-xs text-slate-400 font-medium">Restricted Database Inspection & System Audit Log Clearance</p>
        </div>

        {/* Credential Login Form */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-purple-500/60 bg-slate-900/95 space-y-6 shadow-2xl">
          <div className="p-3 bg-purple-950/70 border border-purple-500/40 rounded-2xl flex items-center gap-3">
            <Key className="w-6 h-6 text-purple-400 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-extrabold text-white block">Security Clearance Required</span>
              <span className="text-slate-400 block text-[11px]">Enter Admin credentials or Master PIN to access live database tables & activity stream.</span>
            </div>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/90 border border-red-500/60 rounded-xl text-xs text-red-200 font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleVerifyAdminCredentials} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-300">Admin Email</label>
                <button
                  type="button"
                  onClick={handleAutofillAdmin}
                  className="text-[10px] text-cyan-400 hover:text-white font-bold"
                >
                  ⚡ Auto-fill Demo
                </button>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={adminEmailInput}
                  onChange={(e) => setAdminEmailInput(e.target.value)}
                  placeholder="admin@signshift.io"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-purple-400 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-300">Admin Password</label>
                <span className="text-[10px] text-slate-500 font-mono">Default: admin123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showAdminPass ? 'text' : 'password'}
                  required
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-purple-400 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-1">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[11px] font-bold text-slate-400">Master Security PIN (Optional Quick Bypass)</label>
                <span className="text-[10px] text-purple-400 font-mono">PIN: 9482</span>
              </div>
              <input
                type="text"
                value={adminPinInput}
                onChange={(e) => setAdminPinInput(e.target.value)}
                placeholder="e.g. 9482"
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-center tracking-widest text-purple-300 focus:border-purple-400 focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 text-white font-extrabold rounded-xl shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              <Unlock className="w-4 h-4" />
              <span>Verify Credentials & Enter Console</span>
            </button>
          </form>

          {/* Quick Demo Bypass Button for VIVA/Presentation */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">Academic Evaluation / Demo Mode:</span>
            <button
              onClick={handleInstantDemoUnlock}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Instant 1-Tap Unlock (SignShift Administrator)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: UNLOCKED ADMIN CONTROL CENTER (Database + Live Activity + Users)
  // =========================================================================
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 pb-24">
      
      {/* ADMIN HEADER BAR */}
      <div className="glass-panel rounded-3xl p-6 border-2 border-purple-500/50 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-2xl shadow-inner">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                SignShift Admin Control Center
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Authorized
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Admin: <span className="text-purple-300 font-bold">admin@signshift.io</span> | Clearance: Level 4 Full Database & Activity Audit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleBroadcastAlert}
            className="px-3.5 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg hover:scale-105 transition flex items-center gap-1.5"
            title="Broadcast Visual Alert to all connected devices"
          >
            <Zap className="w-4 h-4 text-slate-950" />
            <span>Broadcast Flash Alert</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to reset all user credentials and database stores to factory defaults?")) {
                resetDatabase();
              }
            }}
            className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-red-500 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            title="Reset Database to Default Credentials"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset DB</span>
          </button>

          <button
            onClick={handleLockConsole}
            className="px-3 py-2 bg-slate-950 hover:bg-red-950 text-red-300 border border-slate-700 hover:border-red-500 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            title="Lock Admin Console with password"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Console</span>
          </button>
        </div>
      </div>

      {/* SYSTEM KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Users & Credentials */}
        <div 
          onClick={() => setActiveTab('users')}
          className="glass-panel rounded-3xl p-5 border border-slate-800 hover:border-cyan-500/50 cursor-pointer space-y-2 bg-slate-900/90 transition shadow-lg"
        >
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">User Credentials</span>
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{usersList.length}</div>
          <p className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" /> 4 Roles (Admin, Rider, Customer, Merchant)
          </p>
        </div>

        {/* KPI 2: Live Activity Events */}
        <div 
          onClick={() => setActiveTab('activity')}
          className="glass-panel rounded-3xl p-5 border border-slate-800 hover:border-purple-500/50 cursor-pointer space-y-2 bg-slate-900/90 transition shadow-lg"
        >
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Audit Activity Logs</span>
            <Activity className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{activityLogs.length}</div>
          <p className="text-[11px] text-purple-400 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Real-time timestamped audit trail
          </p>
        </div>

        {/* KPI 3: Live Order In DB */}
        <div 
          onClick={() => { setActiveTab('database'); setDbSubTab('orders'); }}
          className="glass-panel rounded-3xl p-5 border border-slate-800 hover:border-emerald-500/50 cursor-pointer space-y-2 bg-slate-900/90 transition shadow-lg"
        >
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Order In DB</span>
            <Package className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono truncate">{order.id}</div>
          <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Status: {order.status?.toUpperCase()} ({order.totalAmount})
          </p>
        </div>

        {/* KPI 4: Partner Stores */}
        <div 
          onClick={() => setActiveTab('restaurants')}
          className="glass-panel rounded-3xl p-5 border border-slate-800 hover:border-amber-500/50 cursor-pointer space-y-2 bg-slate-900/90 transition shadow-lg"
        >
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Merchants</span>
            <Store className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{restaurantsList.length}</div>
          <p className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Partner Kitchens & Menus
          </p>
        </div>

      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 max-w-2xl text-xs font-bold overflow-x-auto gap-1">
        
        <button
          onClick={() => setActiveTab('database')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'database' 
              ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 text-white font-extrabold shadow-md' 
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Database className="w-4 h-4 text-cyan-300" />
          <span>Database Explorer</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'activity' 
              ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 text-white font-extrabold shadow-md' 
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-300" />
          <span>Live Activity ({activityLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'users' 
              ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 text-white font-extrabold shadow-md' 
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-purple-300" />
          <span>User Credentials ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('restaurants')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'restaurants' 
              ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 text-white font-extrabold shadow-md' 
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Store className="w-4 h-4 text-amber-300" />
          <span>Restaurants ({restaurantsList.length})</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: COMPREHENSIVE DATABASE EXPLORER
         ========================================================================= */}
      {activeTab === 'database' && (
        <div className="glass-panel rounded-3xl p-6 border-2 border-slate-800 bg-slate-900/95 space-y-6 shadow-xl">
          
          {/* Database Explorer Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <span>SignShift Core Database Collections</span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 font-mono">
                  LocalStorage Synced
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Inspect structured document tables across Orders, Users, Addresses, and Menus
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleCopyRawDatabase}
                className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-cyan-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                title="Copy entire database to clipboard as JSON"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? 'JSON Copied!' : 'Copy DB JSON'}</span>
              </button>

              <button
                onClick={handleDownloadDatabaseBackup}
                className="px-3 py-2 bg-purple-950 hover:bg-purple-900 border border-purple-700 text-purple-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                title="Download JSON Database Backup file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export DB Dump</span>
              </button>
            </div>
          </div>

          {/* Database Sub-Tab Selector */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold gap-1 overflow-x-auto">
            {[
              { id: 'all', label: 'All Collections Overview', icon: Layers },
              { id: 'orders', label: `Orders Table (${order ? 1 : 0})`, icon: Package },
              { id: 'users', label: `Users & Credentials (${usersList.length})`, icon: Users },
              { id: 'addresses', label: `Delivery Addresses (${savedAddresses.length})`, icon: MapPin },
              { id: 'restaurants', label: `Restaurants (${restaurantsList.length})`, icon: Store },
              { id: 'raw_json', label: 'Raw JSON DB Viewer', icon: FileCode }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDbSubTab(tab.id)}
                  className={`py-2 px-3 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
                    dbSubTab === tab.id
                      ? 'bg-cyan-500 text-slate-950 font-extrabold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* SUB-VIEW: OVERVIEW (ALL COLLECTIONS SUMMARY) */}
          {dbSubTab === 'all' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Collection 1: Orders */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-emerald-400" />
                    <span className="font-extrabold text-white text-sm">Collection: `orders`</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Active Order
                  </span>
                </div>
                <div className="text-xs space-y-1 font-mono text-slate-300">
                  <div><strong>ID:</strong> {order.id}</div>
                  <div><strong>Customer:</strong> {order.customerName} ({order.customerPhone})</div>
                  <div><strong>Address:</strong> {order.customerAddress} (Gate: {order.gateCode})</div>
                  <div><strong>Merchant:</strong> {order.merchantName} ({order.totalAmount})</div>
                  <div><strong>Status:</strong> <span className="text-cyan-400 font-bold">{order.status}</span></div>
                </div>
                <button
                  onClick={() => setDbSubTab('orders')}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 rounded-lg transition"
                >
                  Inspect Full Order Record →
                </button>
              </div>

              {/* Collection 2: Users & Credentials */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span className="font-extrabold text-white text-sm">Collection: `users`</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    {usersList.length} Credentials Stored
                  </span>
                </div>
                <div className="space-y-1.5">
                  {usersList.slice(0, 3).map(u => (
                    <div key={u.id} className="text-xs flex items-center justify-between text-slate-300">
                      <span className="font-bold text-white">{u.name}</span>
                      <span className="font-mono text-[10px] text-slate-400">{u.email}</span>
                      <span className="px-1.5 py-0.5 bg-slate-900 text-[10px] rounded font-mono uppercase text-cyan-300">{u.role}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setDbSubTab('users')}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 rounded-lg transition"
                >
                  Manage All User Records →
                </button>
              </div>

              {/* Collection 3: Delivery Addresses */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    <span className="font-extrabold text-white text-sm">Collection: `addresses`</span>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-mono bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                    {savedAddresses.length} Addresses Stored
                  </span>
                </div>
                <div className="space-y-1.5">
                  {savedAddresses.map(a => (
                    <div key={a.id} className="text-xs text-slate-300">
                      <span className="font-bold text-white block">{a.label}</span>
                      <span className="text-slate-400 text-[11px] block">{a.address} (Gate: {a.gateCode})</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setDbSubTab('addresses')}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 rounded-lg transition"
                >
                  Inspect Addresses Table →
                </button>
              </div>

              {/* Collection 4: Restaurants & Menus */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-amber-400" />
                    <span className="font-extrabold text-white text-sm">Collection: `restaurants`</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                    {restaurantsList.length} Partner Merchants
                  </span>
                </div>
                <div className="space-y-1.5">
                  {restaurantsList.slice(0, 3).map(r => (
                    <div key={r.id || r.name} className="text-xs flex items-center justify-between text-slate-300">
                      <span className="font-bold text-white">{r.name}</span>
                      <span className="text-amber-400 text-[10px] font-mono">{r.cuisine}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setDbSubTab('restaurants')}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 rounded-lg transition"
                >
                  View Restaurant Menus Database →
                </button>
              </div>

            </div>
          )}

          {/* SUB-VIEW: ORDERS TABLE */}
          {dbSubTab === 'orders' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-extrabold text-white text-base flex items-center gap-2">
                      <Package className="w-5 h-5 text-emerald-400" />
                      <span>Order Database Record: #{order.id}</span>
                    </h4>
                    <p className="text-xs text-slate-400">Live order state shared across Customer, Rider, and Merchant dashboards</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Status: {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-3 bg-slate-900 rounded-xl space-y-1 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Customer Payload</span>
                    <div className="text-white font-bold">{order.customerName}</div>
                    <div className="text-slate-400">{order.customerPhone}</div>
                    <div className="text-cyan-300">{order.customerAddress}</div>
                    <div className="text-amber-300">Gate / Intercom Code: {order.gateCode}</div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl space-y-1 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Merchant & Fulfillment</span>
                    <div className="text-white font-bold">{order.merchantName}</div>
                    <div className="text-slate-400">{order.merchantAddress}</div>
                    <div className="text-emerald-400 font-bold">Total Bill: {order.totalAmount}</div>
                    <div className="text-slate-400">Pickup: {order.pickupEta} | Delivery: {order.deliveryEta}</div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl space-y-1 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Assigned Rider Details</span>
                    <div className="text-white font-bold">{order.riderInfo?.name || 'Alex Rivera'}</div>
                    <div className="text-slate-400">Rating: {order.riderInfo?.rating} ({order.riderInfo?.deliveriesCount})</div>
                    <div className="text-cyan-400">🤟 {order.riderInfo?.isDeafMute ? 'Deaf / Non-Verbal Verified' : 'Standard'}</div>
                    <div className="text-slate-400">Visual Signal Bridge: ACTIVE</div>
                  </div>
                </div>

                {/* Ordered Items Table */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Cart Line Items ({order.orderItems?.length || 0}):</span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-slate-300">
                      <thead className="bg-slate-900 text-slate-400 uppercase font-mono text-[10px]">
                        <tr>
                          <th className="py-2 px-3">Item Name</th>
                          <th className="py-2 px-3">Qty</th>
                          <th className="py-2 px-3">Special Instructions</th>
                          <th className="py-2 px-3 text-right">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 font-semibold">
                        {order.orderItems?.map((it, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/60">
                            <td className="py-2.5 px-3 text-white font-bold">{it.name}</td>
                            <td className="py-2.5 px-3 font-mono">{it.qty}</td>
                            <td className="py-2.5 px-3 text-slate-400">{it.notes || 'None'}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-emerald-400">{it.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Live Message Log in Order */}
                <div className="space-y-2 pt-2 border-t border-slate-900">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Communication Audit Thread ({order.chatMessages?.length || 0} Events):</span>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {order.chatMessages?.map((msg, idx) => (
                      <div key={idx} className="p-2 bg-slate-900 rounded-lg text-xs flex justify-between items-center gap-2">
                        <div>
                          <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded uppercase font-bold mr-2 ${
                            msg.sender === 'rider' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                            msg.sender === 'customer' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            'bg-purple-950 text-purple-300 border border-purple-800'
                          }`}>
                            {msg.sender}
                          </span>
                          <span className="text-slate-200">{msg.text}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">{msg.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SUB-VIEW: USERS & CREDENTIALS TABLE */}
          {dbSubTab === 'users' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Total User Credentials: <strong className="text-white">{usersList.length}</strong></span>
                <button
                  onClick={() => setIsAddUserOpen(true)}
                  className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Credential</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">User ID & Name</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Email Credential</th>
                      <th className="py-2.5 px-3">Password</th>
                      <th className="py-2.5 px-3">Phone</th>
                      <th className="py-2.5 px-3">Accessibility</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-semibold">
                    {usersList.map((usr) => (
                      <tr key={usr.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                          <img src={usr.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"} alt={usr.name} className="w-7 h-7 rounded-lg object-cover" />
                          <div>
                            <div>{usr.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{usr.id}</div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            usr.role === 'admin' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                            usr.role === 'rider' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                            usr.role === 'merchant' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            {usr.role}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-cyan-300">{usr.email}</td>
                        <td className="py-3 px-3 font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-200">
                              {showPasswordMap[usr.id] ? usr.password || 'user123' : '••••••••'}
                            </span>
                            <button onClick={() => togglePasswordVisibility(usr.id)} className="text-slate-400 hover:text-white">
                              {showPasswordMap[usr.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-400">{usr.phone}</td>
                        <td className="py-3 px-3">
                          {usr.isDeafMute ? <span className="text-cyan-400 text-[11px] font-bold">🤟 Deaf/Mute</span> : <span className="text-slate-500 text-[11px]">Standard</span>}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => setEditingUser({ ...usr })} className="p-1 bg-slate-950 hover:bg-cyan-950 text-cyan-400 border border-slate-800 rounded">
                              <Edit className="w-3 h-3" />
                            </button>
                            <button onClick={() => { if (window.confirm(`Delete ${usr.name}?`)) deleteUser(usr.id); }} className="p-1 bg-slate-950 hover:bg-red-950 text-red-400 border border-slate-800 rounded">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-VIEW: SAVED ADDRESSES */}
          {dbSubTab === 'addresses' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {savedAddresses.map((addr) => (
                  <div key={addr.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-extrabold text-white text-sm">{addr.label}</span>
                      <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                        Gate: {addr.gateCode}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{addr.address}</p>
                    <p className="text-[11px] text-slate-400 italic">Notes: {addr.notes || 'None'}</p>
                    <span className="text-[10px] text-slate-500 font-mono block">ID: {addr.id}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-VIEW: RESTAURANTS */}
          {dbSubTab === 'restaurants' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restaurantsList.map((rest) => (
                <div key={rest.id || rest.name} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-white text-base">{rest.name}</h4>
                      <p className="text-xs text-slate-400">{rest.address}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-950 text-amber-300 rounded font-mono text-[10px] border border-amber-800">
                      {rest.cuisine}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-300">
                    Pickup: {rest.pickupEta} | Delivery: {rest.deliveryEta} | Dist: {rest.distance}
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                    Menu Items ({rest.items?.length || 0}): {rest.items?.map(i => i.name).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SUB-VIEW: RAW JSON DB VIEWER */}
          {dbSubTab === 'raw_json' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 font-mono">Live In-Memory Database JSON Schema:</span>
                <span className="text-[10px] text-cyan-400 font-mono">Updated: {new Date().toLocaleTimeString()}</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 max-h-96 overflow-y-auto font-mono text-xs text-cyan-300">
                <pre>{JSON.stringify({
                  database: "SignShift-NoSQL-MemoryStore",
                  collections: {
                    users: usersList,
                    activeOrder: order,
                    restaurants: restaurantsList,
                    savedAddresses: savedAddresses,
                    auditLogsCount: activityLogs?.length || 0
                  }
                }, null, 2)}</pre>
              </div>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          TAB 2: LIVE SYSTEM ACTIVITY & AUDIT LOG STREAM
         ========================================================================= */}
      {activeTab === 'activity' && (
        <div className="glass-panel rounded-3xl p-6 border-2 border-slate-800 bg-slate-900/95 space-y-6 shadow-xl">
          
          {/* Activity Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <span>Live System Activity & Audit Stream</span>
                </h3>
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  LIVE AUDIT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-time chronological telemetry across Authentication, Database modifications, Orders, and Visual Alerts
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleSimulateActivity}
                className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-extrabold text-xs rounded-xl shadow hover:scale-105 transition flex items-center gap-1.5"
                title="Inject a test event to verify live monitoring"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulate Event</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm("Clear all activity logs from memory?")) {
                    clearActivityLogs();
                  }
                }}
                className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-red-400 rounded-xl text-xs font-bold transition flex items-center gap-1"
                title="Clear current activity stream"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Stream</span>
              </button>
            </div>
          </div>

          {/* Search & Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {['ALL', 'AUTH', 'DATABASE', 'ORDER', 'COMMUNICATION', 'ALERT'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActivityFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activityFilter === cat
                      ? 'bg-emerald-400 text-slate-950 shadow-md font-extrabold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                placeholder="Search event, actor, detail..."
                className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none w-52"
              />
            </div>
          </div>

          {/* Activity Logs Stream List */}
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredActivity.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No activity events match the current filter. Click "Simulate Event" above to generate a new live event.
              </div>
            ) : (
              filteredActivity.map((log) => {
                const getBadgeStyle = (cat) => {
                  switch (cat) {
                    case 'AUTH': return 'bg-cyan-950 text-cyan-300 border-cyan-800';
                    case 'DATABASE': return 'bg-purple-950 text-purple-300 border-purple-800';
                    case 'ORDER': return 'bg-emerald-950 text-emerald-300 border-emerald-800';
                    case 'COMMUNICATION': return 'bg-blue-950 text-blue-300 border-blue-800';
                    case 'ALERT': return 'bg-amber-950 text-amber-300 border-amber-800';
                    default: return 'bg-slate-900 text-slate-300 border-slate-700';
                  }
                };

                return (
                  <div 
                    key={log.id} 
                    className="p-3.5 bg-slate-950 hover:bg-slate-900/80 rounded-2xl border border-slate-800/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase border ${getBadgeStyle(log.category)}`}>
                          {log.category}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white text-xs">{log.action}</span>
                          <span className="text-[10px] text-slate-400 font-mono">by {log.actor}</span>
                        </div>
                        <p className="text-xs text-slate-300">{log.details}</p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 text-[10px] font-mono flex-shrink-0">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {log.timestamp}
                      </span>
                      <span className={`font-bold ${log.status === 'SUCCESS' ? 'text-emerald-400' : log.status === 'WARNING' ? 'text-amber-400' : 'text-cyan-400'}`}>
                        {log.status || 'INFO'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 3: USER CREDENTIALS MANAGER
         ========================================================================= */}
      {activeTab === 'users' && (
        <div className="glass-panel rounded-3xl p-6 border-2 border-slate-800 bg-slate-900/95 space-y-6 shadow-xl">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" /> User Credentials Database Manager
              </h3>
              <p className="text-xs text-slate-400">View, create, edit credentials, or change roles across Customer, Rider, Merchant, and Admin</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none w-48"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="customer">Customer</option>
                <option value="rider">Rider</option>
                <option value="merchant">Merchant</option>
                <option value="admin">Admin</option>
              </select>

              <button
                onClick={() => setIsAddUserOpen(true)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-slate-950" />
                <span>Add User Credential</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">User ID & Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Password Credential</th>
                  <th className="py-3 px-4">Phone / Contact</th>
                  <th className="py-3 px-4">Accessibility / Details</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-semibold">
                {filteredUsers.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-3">
                      <img 
                        src={usr.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"} 
                        alt={usr.name} 
                        className="w-8 h-8 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <span className="block font-bold">{usr.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{usr.id}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        usr.role === 'admin' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                        usr.role === 'rider' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                        usr.role === 'merchant' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {usr.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-cyan-300">
                      {usr.email}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-slate-200">
                          {showPasswordMap[usr.id] ? usr.password || 'user123' : '••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(usr.id)}
                          className="text-slate-400 hover:text-white"
                          title="Toggle Password Visibility"
                        >
                          {showPasswordMap[usr.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      {usr.phone || '+1 (555) 000-0000'}
                    </td>

                    <td className="py-3.5 px-4">
                      {usr.isDeafMute ? (
                        <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-800 text-[10px] font-bold">
                          🤟 Deaf / Non-Verbal
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Standard Account</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingUser({ ...usr })}
                          className="p-1.5 bg-slate-950 hover:bg-cyan-950 text-cyan-400 border border-slate-800 rounded-lg transition"
                          title="Edit User Credentials"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete user credential for ${usr.name} (${usr.email})?`)) {
                              deleteUser(usr.id);
                            }
                          }}
                          className="p-1.5 bg-slate-950 hover:bg-red-950 text-red-400 border border-slate-800 rounded-lg transition"
                          title="Delete User Credential"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 4: RESTAURANTS DATABASE
         ========================================================================= */}
      {activeTab === 'restaurants' && (
        <div className="glass-panel rounded-3xl p-6 border-2 border-slate-800 bg-slate-900/95 space-y-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-400" /> Restaurants & Menu Items Database
              </h3>
              <p className="text-xs text-slate-400">Manage partner restaurants, delivery ETAs, and customizable food menus</p>
            </div>

            <button
              onClick={() => setIsAddRestOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Add Restaurant</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {restaurantsList.map((rest) => (
              <div key={rest.id || rest.name} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-white text-base">{rest.name}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" /> {rest.address}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-950 text-amber-300 rounded-full border border-amber-800 text-[10px] font-bold">
                    {rest.cuisine}
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-mono space-y-1">
                  <div>ETA Pickup: <strong className="text-white">{rest.pickupEta}</strong></div>
                  <div>ETA Delivery: <strong className="text-emerald-400">{rest.deliveryEta}</strong></div>
                </div>

                <div className="pt-2 border-t border-slate-900 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Sample Menu Items ({rest.items?.length || 0}):</span>
                  <div className="flex flex-wrap gap-1">
                    {rest.items?.map((it, idx) => (
                      <span key={idx} className="bg-slate-900 text-slate-300 text-[11px] px-2 py-0.5 rounded border border-slate-800">
                        {it.name} ({it.price || '$12.00'})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD USER CREDENTIAL */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-cyan-500/60 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <span>➕ Add New User Credential</span>
              </h3>
              <button onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="priya@signshift.io"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
                <input
                  type="text"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="rider123"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="customer">Customer</option>
                    <option value="rider">Rider</option>
                    <option value="merchant">Merchant</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    placeholder="+1 (555) 999-1111"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="deafCheck"
                  checked={newUserIsDeaf}
                  onChange={(e) => setNewUserIsDeaf(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-cyan-500"
                />
                <label htmlFor="deafCheck" className="text-xs text-slate-300 font-bold">
                  🤟 Deaf / Non-Verbal Accessibility Badge
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 font-bold text-xs rounded-xl border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg"
                >
                  Save Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT USER CREDENTIAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-purple-500/60 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <span>✏️ Edit User Credential ({editingUser.id})</span>
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUserSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-purple-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
                <input
                  type="text"
                  required
                  value={editingUser.password || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-purple-400 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="customer">Customer</option>
                    <option value="rider">Rider</option>
                    <option value="merchant">Merchant</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingUser.phone || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editDeafCheck"
                  checked={!!editingUser.isDeafMute}
                  onChange={(e) => setEditingUser({ ...editingUser, isDeafMute: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-purple-500"
                />
                <label htmlFor="editDeafCheck" className="text-xs text-slate-300 font-bold">
                  🤟 Deaf / Non-Verbal Accessibility Badge
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 font-bold text-xs rounded-xl border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-500 hover:bg-purple-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg"
                >
                  Update Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD RESTAURANT */}
      {isAddRestOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <span>🏬 Add New Restaurant</span>
              </h3>
              <button onClick={() => setIsAddRestOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRestaurant} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Restaurant Name</label>
                <input
                  type="text"
                  required
                  value={restName}
                  onChange={(e) => setRestName(e.target.value)}
                  placeholder="e.g. Spice Route Kitchen"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={restAddress}
                  onChange={(e) => setRestAddress(e.target.value)}
                  placeholder="e.g. 500 Grand Ave"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Cuisine</label>
                <input
                  type="text"
                  value={restCuisine}
                  onChange={(e) => setRestCuisine(e.target.value)}
                  placeholder="e.g. Indian Street Food"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddRestOpen(false)}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 font-bold text-xs rounded-xl border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg"
                >
                  Add Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
