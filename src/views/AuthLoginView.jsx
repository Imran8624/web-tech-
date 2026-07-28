import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lock, 
  Mail, 
  Smartphone, 
  Package, 
  Store, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Key, 
  Zap, 
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  UserPlus,
  LogIn,
  User,
  LogOut,
  MapPin,
  Edit3
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AuthLoginView = () => {
  const { 
    user, 
    isAuthenticated, 
    loginUser, 
    registerUser, 
    logoutUser,
    usersList, 
    setCurrentView 
  } = useApp();

  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'register'
  const [selectedRole, setSelectedRole] = useState('customer'); // 'rider' | 'customer' | 'merchant' | 'admin'
  
  // Registration Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [customAddr, setCustomAddr] = useState('');
  const [gateCode, setGateCode] = useState('');
  const [isDeafMute, setIsDeafMute] = useState(true);

  // UI state
  const [showPass, setShowPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [signPasscodeStep, setSignPasscodeStep] = useState(0);

  // Default prefilled sample login credentials per role
  const getSampleCredentials = (role) => {
    switch (role) {
      case 'rider': return { email: 'alex.rivera@signshift.io', pass: 'rider123', label: 'Alex Rivera (Deaf Rider)' };
      case 'customer': return { email: 'user@example.com', pass: 'user123', label: 'Sarah Jenkins (Customer)' };
      case 'merchant': return { email: 'merchant@signshift.io', pass: 'merchant123', label: 'Aroma Bistro Manager' };
      case 'admin': return { email: 'admin@signshift.io', pass: 'admin123', label: 'SignShift Admin' };
      default: return { email: 'user@example.com', pass: 'user123', label: 'Demo User' };
    }
  };

  const sampleCreds = getSampleCredentials(selectedRole);

  const handleFillSampleCredentials = () => {
    setEmail(sampleCreds.email);
    setPassword(sampleCreds.pass);
    setErrorMessage('');
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (authMode === 'register') {
      if (password.length < 4) {
        setErrorMessage('Password must be at least 4 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        return;
      }

      const res = registerUser({
        name: name || 'New Account User',
        email: email,
        password: password,
        phone: phone || '+1 (555) 123-4567',
        role: selectedRole,
        customAddress: customAddr || (selectedRole === 'customer' ? '123 Main Street, Apt 10' : undefined),
        gateCode: gateCode || '1234',
        isDeafMute: selectedRole === 'rider' ? isDeafMute : false
      });

      if (res.success) {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        setSuccessMessage(`Account created successfully! Welcome to SignShift, ${res.user.name}.`);
      } else {
        setErrorMessage(res.message || 'Registration failed. Email may already be in use.');
      }
    } else {
      // Sign In mode
      const res = loginUser(selectedRole, null, email, password);
      if (res.success) {
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
        setSuccessMessage(`Signed in as ${res.user.name} (${res.user.role.toUpperCase()})`);
      } else {
        setErrorMessage(res.message || 'Invalid email or password. Click below to autofill demo credentials.');
      }
    }
  };

  const handleQuickDemoLogin = (role) => {
    setErrorMessage('');
    setSuccessMessage('');
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    const creds = getSampleCredentials(role);
    loginUser(role, creds.label, creds.email, creds.pass);
  };

  const handleSignPasscodeTap = (gestureName) => {
    if (signPasscodeStep < 2) {
      setSignPasscodeStep(prev => prev + 1);
    } else {
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
      loginUser('rider', 'Alex Rivera (Sign Passcode)', 'alex.rivera@signshift.io', 'rider123');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-6 pb-24">
      
      {/* BRAND LOGO CARD */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-cyan-300 p-1 mx-auto shadow-xl shadow-cyan-500/20 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center font-bold text-3xl text-cyan-300">
            🤟
          </div>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">SignShift Delivery</h2>
        <p className="text-xs text-slate-400 font-medium">Inclusive Credentials & Multi-Role Database Portal</p>
      </div>

      {/* IF LOGGED IN: SHOW ACTIVE SESSION CARD */}
      {isAuthenticated && user && (
        <div className="glass-panel rounded-3xl p-5 border-2 border-emerald-500/50 bg-slate-900/95 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                alt={user.name} 
                className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-400"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-white text-base">{user.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">{user.email}</p>
              </div>
            </div>

            <button
              onClick={logoutUser}
              className="p-2 bg-slate-950 hover:bg-red-950 text-red-400 hover:text-red-300 border border-slate-800 hover:border-red-700 rounded-xl transition flex items-center gap-1 text-xs font-bold"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Current View Portal:</span>
            <button
              onClick={() => setCurrentView(user.role === 'admin' ? 'admin' : user.role === 'rider' ? 'rider' : user.role === 'customer' ? 'customer' : 'merchant')}
              className="px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-extrabold rounded-lg hover:brightness-110 transition flex items-center gap-1"
            >
              <span>Go to {user.role.toUpperCase()} Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* MAIN LOGIN / REGISTER CARD */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-cyan-500/50 bg-slate-900/95 space-y-6 shadow-2xl">
        
        {/* Auth Mode Toggle (Sign In vs Create Account) */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => { setAuthMode('signin'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${authMode === 'signin' ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => { setAuthMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${authMode === 'register' ? 'bg-emerald-400 text-slate-950 font-extrabold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-center">
          {[
            { id: 'customer', label: 'Customer', icon: '👤' },
            { id: 'rider', label: 'Rider', icon: '🏍️' },
            { id: 'merchant', label: 'Merchant', icon: '🏬' },
            { id: 'admin', label: 'Admin', icon: '🛡️' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setSelectedRole(tab.id); setErrorMessage(''); }}
              className={`py-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center gap-0.5 ${
                selectedRole === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md font-extrabold scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[10px] uppercase font-mono">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Header */}
        <div className="text-left border-b border-slate-800 pb-3 flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-base text-white tracking-wider flex items-center gap-2">
              <span>{authMode === 'register' ? `✨ Register ${selectedRole.toUpperCase()}` : `🔑 ${selectedRole.toUpperCase()} Portal Login`}</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {authMode === 'register' ? 'Create a permanent account stored in local database' : 'Enter registered email & password to sign in'}
            </p>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950 px-2 py-1 rounded border border-cyan-800 uppercase font-bold">
            {selectedRole}
          </span>
        </div>

        {/* Error / Success Feedback Alerts */}
        {errorMessage && (
          <div className="p-3 bg-red-950/90 border-2 border-red-500/60 rounded-2xl flex items-start gap-2.5 text-red-200 text-xs font-bold animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <span>{errorMessage}</span>
              {authMode === 'signin' && (
                <button
                  type="button"
                  onClick={handleFillSampleCredentials}
                  className="block text-[11px] text-cyan-300 hover:underline font-bold mt-1"
                >
                  ⚡ Auto-fill demo credentials ({sampleCreds.email} / {sampleCreds.pass})
                </button>
              )}
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-950/90 border-2 border-emerald-500/60 rounded-2xl flex items-center gap-2.5 text-emerald-200 text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Standard Login / Registration Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          
          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Jenkins or Alex Rivera"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-300">Email Address</label>
              {authMode === 'signin' && (
                <button
                  type="button"
                  onClick={handleFillSampleCredentials}
                  className="text-[10px] text-cyan-400 hover:text-white font-bold"
                >
                  Fill Demo: {sampleCreds.email}
                </button>
              )}
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={sampleCreds.email}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {authMode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Phone (For SMS Alerts)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* CUSTOM DELIVERY ADDRESS / VEHICLE DETAILS FOR REGISTRATION */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-cyan-500/40 space-y-3">
                <span className="text-xs font-bold text-cyan-300 block flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  {selectedRole === 'customer' ? '✍️ Initial Delivery Address & Gate Code' : selectedRole === 'rider' ? '✍️ Rider Vehicle & Accessibility Settings' : '✍️ Business Location'}
                </span>
                
                {selectedRole === 'customer' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Street Address</label>
                      <input
                        type="text"
                        required
                        value={customAddr}
                        onChange={(e) => setCustomAddr(e.target.value)}
                        placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                        className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Gate Code / Intercom Code</label>
                      <input
                        type="text"
                        value={gateCode}
                        onChange={(e) => setGateCode(e.target.value)}
                        placeholder="e.g. 4022"
                        className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                      />
                    </div>
                  </>
                )}

                {selectedRole === 'rider' && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={isDeafMute}
                        onChange={(e) => setIsDeafMute(e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-400"
                      />
                      <span className="text-xs font-bold text-slate-200">
                        🤟 I am a Deaf / Non-Verbal Rider (Enable Real-Time Sign Assist)
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-300">Password</label>
              {authMode === 'signin' && (
                <span className="text-[10px] text-slate-500 font-mono">Default: {sampleCreds.pass}</span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-cyan-400 via-cyan-500 to-emerald-400 text-slate-950 font-extrabold rounded-xl shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2 text-sm"
          >
            <span>{authMode === 'register' ? `Create ${selectedRole.toUpperCase()} Account` : `Sign In as ${selectedRole.toUpperCase()}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* DEAF ACCESSIBILITY SIGN GESTURE PASSCODE LOGIN */}
        {selectedRole === 'rider' && (
          <div className="p-4 bg-slate-950 rounded-2xl border border-cyan-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Deaf Sign Gesture Quick Login:
              </span>
              <span className="text-[10px] font-mono text-slate-400">Step {signPasscodeStep + 1}/3</span>
            </div>

            <p className="text-[11px] text-slate-400">Tap 3 sign gestures to verify rider identity instantly without typing:</p>

            <div className="grid grid-cols-3 gap-2">
              {[
                { name: '👋 Hello', icon: '👋' },
                { name: '🚪 Door', icon: '🚪' },
                { name: '🙏 Thanks', icon: '🙏' }
              ].map((g, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSignPasscodeTap(g.name)}
                  className="p-2.5 bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-400 rounded-xl text-center transition"
                >
                  <span className="text-xl block">{g.icon}</span>
                  <span className="text-[10px] font-bold text-slate-300 block mt-0.5">{g.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* DEMO 1-TAP QUICK LOGINS GRID FOR ALL ROLES */}
        <div className="border-t border-slate-800 pt-4 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Or 1-Tap Quick Demo Credentials Login:</span>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('customer')}
              className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-400 rounded-xl text-xs text-left transition flex items-center gap-2"
            >
              <span className="text-lg">👤</span>
              <div>
                <span className="block font-bold text-white">Customer Sarah</span>
                <span className="text-[10px] text-slate-400 block font-mono">user@example.com</span>
              </div>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('rider')}
              className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-400 rounded-xl text-xs text-left transition flex items-center gap-2"
            >
              <span className="text-lg">🏍️</span>
              <div>
                <span className="block font-bold text-white">Rider Alex</span>
                <span className="text-[10px] text-slate-400 block font-mono">alex.rivera@...</span>
              </div>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('merchant')}
              className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400 rounded-xl text-xs text-left transition flex items-center gap-2"
            >
              <span className="text-lg">🏬</span>
              <div>
                <span className="block font-bold text-white">Aroma Bistro</span>
                <span className="text-[10px] text-slate-400 block font-mono">merchant@...</span>
              </div>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-400 rounded-xl text-xs text-left transition flex items-center gap-2"
            >
              <span className="text-lg">🛡️</span>
              <div>
                <span className="block font-bold text-white">Admin Hub</span>
                <span className="text-[10px] text-slate-400 block font-mono">admin@signshift.io</span>
              </div>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
