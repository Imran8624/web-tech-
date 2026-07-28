import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SignAvatar3D, SIGN_DICTIONARY } from '../components/SignAvatar3D';
import { 
  Sparkles, 
  Smartphone, 
  PackageCheck, 
  Zap, 
  ShieldCheck, 
  HeartHandshake, 
  ArrowRight, 
  Play, 
  Mic, 
  Volume2, 
  Activity, 
  CheckCircle2, 
  TrendingUp,
  Award,
  Users,
  Building2,
  ChevronRight,
  MessageSquare,
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LandingPage = () => {
  const { setCurrentView, triggerVisualAlert, speakText } = useApp();
  const [activeDemoSign, setActiveDemoSign] = useState("HELLO");
  const [typedPhrase, setTypedPhrase] = useState("Hi Alex! Gate code is 4022. Please leave at door.");
  const [onboardRole, setOnboardRole] = useState(null); // 'rider' | 'merchant' | null
  const [weeklyHours, setWeeklyHours] = useState(30);

  // Auto calculate estimated earnings
  const estimatedEarnings = Math.round(weeklyHours * 28.5);

  const handleRunDemo = (signKey) => {
    setActiveDemoSign(signKey);
    triggerVisualAlert('cyan');
    const signObj = SIGN_DICTIONARY[signKey];
    if (signObj) {
      speakText(`Translating customer phrase to sign language: ${signObj.label}`);
    }
  };

  const handleOnboardSuccess = (e) => {
    e.preventDefault();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    alert(`Welcome to SignShift Delivery! Your ${onboardRole === 'rider' ? 'Rider Onboarding' : 'Merchant Partnership'} application has been received. Our inclusive support team will reach out via SMS/Video Call.`);
    setOnboardRole(null);
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative pt-8 pb-12 overflow-hidden">
        
        {/* Background Decorative Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-cyan-500/20 via-emerald-500/15 to-purple-500/20 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Next-Gen Accessibility Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Inclusive Deliveries, <br />
                <span className="bg-gradient-to-r from-cyan-400 via-emerald-300 to-cyan-200 bg-clip-text text-transparent">
                  Barrier-Free Communication.
                </span>
              </h1>

              <p className="text-lg text-slate-300 max-w-2xl font-medium leading-relaxed">
                Empowering Deaf, Hard of Hearing, and Mute delivery partners with real-time 
                <strong className="text-cyan-300"> 3D AI Sign Avatars</strong>, instant visual action cards, 
                and screen-flash sensory alerts for flawless customer and restaurant handoffs.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => setCurrentView('rider')}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-400 via-cyan-500 to-emerald-400 text-slate-950 font-extrabold rounded-2xl shadow-xl shadow-cyan-500/25 hover:scale-105 active:scale-95 transition flex items-center gap-3 group text-base"
                >
                  <Smartphone className="w-5 h-5 text-slate-950" />
                  <span>Launch Rider App Demo</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>

                <button
                  onClick={() => setOnboardRole('rider')}
                  className="px-6 py-4 bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 hover:border-cyan-400 text-white font-bold rounded-2xl transition flex items-center gap-2 text-base"
                >
                  <HeartHandshake className="w-5 h-5 text-cyan-400" />
                  <span>Join as Rider</span>
                </button>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> WCAG 2.1 AA Certified</span>
                <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-cyan-400" /> Real-time Speech-to-Sign</span>
                <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-amber-400" /> 100% Equal Earnings</span>
              </div>

            </div>

            {/* Right Column: Embedded Interactive 3D Sign Avatar Video / Demo */}
            <div className="lg:col-span-5 relative">
              
              <div className="relative glass-panel rounded-3xl p-4 sm:p-6 border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/50">
                
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                    <h3 className="font-bold text-sm text-white">Live AI Sign Agent Preview</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                    ASL 3D Avatars
                  </span>
                </div>

                {/* 3D Sign Canvas */}
                <SignAvatar3D activeSignKey={activeDemoSign} height="340px" />

                {/* Interactive Phrase Selector Controls */}
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                  <p className="text-xs font-bold text-slate-400 flex items-center justify-between">
                    <span>Try Customer Phrase Translation:</span>
                    <span className="text-cyan-400 font-mono">Click to test sign animation</span>
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.keys(SIGN_DICTIONARY).slice(0, 6).map((key) => (
                      <button
                        key={key}
                        onClick={() => handleRunDemo(key)}
                        className={`p-2 rounded-xl text-xs font-bold text-left transition flex items-center justify-between ${
                          activeDemoSign === key
                            ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                            : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                        }`}
                      >
                        <span className="truncate">{SIGN_DICTIONARY[key].label}</span>
                        <span>{SIGN_DICTIONARY[key].icon}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for <span className="text-cyan-400">Total Accessibility</span> & Speed
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Every feature is engineered to eliminate communication friction between delivery riders, customers, and restaurant staff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Feature 1: AI Sign Agent */}
          <div className="glass-panel rounded-3xl p-8 border border-slate-800 hover:border-cyan-500/50 transition group">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-2xl mb-6 group-hover:scale-110 transition">
              🤟
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI 3D Sign Agent</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Customer text and voice messages automatically render into smooth 3D sign language animations (ASL/ISL) with synchronized high-visibility action cards.
            </p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Speech-to-Sign conversion</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Speed controls (0.5x to 1.5x)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Static visual card fallback mode</li>
            </ul>
          </div>

          {/* Feature 2: Visual Alert & Sensory Mode */}
          <div className="glass-panel rounded-3xl p-8 border border-slate-800 hover:border-emerald-500/50 transition group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl mb-6 group-hover:scale-110 transition">
              ⚡
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Visual & Sensory Alerts</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Never miss an order update or gate code. Screen flashes brightly with custom color cues alongside distinct haptic vibration pulses.
            </p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> High-contrast neon flash screen</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Custom browser vibration patterns</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sunlight-visible high-contrast mode</li>
            </ul>
          </div>

          {/* Feature 3: Equal Earnings & Partner Portal */}
          <div className="glass-panel rounded-3xl p-8 border border-slate-800 hover:border-purple-500/50 transition group">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 text-2xl mb-6 group-hover:scale-110 transition">
              💼
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Equal Earnings Portal</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Empower Deaf and Mute partners to earn on equal footing across major delivery platforms with specialized rider tools and merchant support.
            </p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Seamless 1-tap customer chat</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Merchant handoff visual badges</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Dedicated Deaf community support</li>
            </ul>
          </div>

        </div>
      </section>

      {/* EARNINGS & IMPACT CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-full">
                <TrendingUp className="w-4 h-4" /> Inclusive Earnings Calculator
              </div>
              <h3 className="text-3xl font-extrabold text-white">
                Earn Flexibly with <br />
                <span className="text-cyan-400">SignShift Accessibility Tools</span>
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Join thousands of Deaf and Hard of Hearing riders delivering with confidence, high customer ratings, and top tips using our 1-tap visual communication system.
              </p>

              <div className="pt-4 space-y-3">
                <div className="flex justify-between text-sm font-bold text-slate-300">
                  <span>Weekly Delivery Hours:</span>
                  <span className="text-cyan-400 font-mono text-base">{weeklyHours} hrs/week</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="60" 
                  value={weeklyHours} 
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 bg-slate-950/80 rounded-3xl border border-slate-800 text-center">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Estimated Earnings Potential</span>
              <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 my-3">
                ${estimatedEarnings}
                <span className="text-lg text-slate-400 font-normal"> / week</span>
              </div>
              <p className="text-xs text-slate-400 max-w-xs mb-6">
                Based on average $28.50/hr including tips, order surges, and SignShift rating bonuses.
              </p>
              <button
                onClick={() => setOnboardRole('rider')}
                className="w-full max-w-xs py-3.5 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-extrabold rounded-2xl shadow-lg hover:scale-105 transition"
              >
                Apply as Rider Now
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ONBOARDING MODAL / FORM */}
      {onboardRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border-2 border-cyan-500 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {onboardRole === 'rider' ? '🏍️ Join as Delivery Rider' : '🏬 Partner as Restaurant / Business'}
              </h3>
              <button 
                onClick={() => setOnboardRole(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOnboardSuccess} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name / Business Name</label>
                <input required type="text" placeholder="e.g. Alex Rivera" className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Phone (For SMS/WhatsApp)</label>
                <input required type="tel" placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Preferred Communication Mode</label>
                <select className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none">
                  <option value="text">SMS Text Messages</option>
                  <option value="whatsapp">WhatsApp / Telegram</option>
                  <option value="sign-video">Sign Language Video Call (Deaf Support Agent)</option>
                </select>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-extrabold rounded-xl shadow-lg hover:brightness-110 transition">
                  Submit Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-300 font-bold">
            <span>🤟 SignShift Delivery</span>
            <span>•</span>
            <span className="text-cyan-400">Barrier-Free Logistics</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('rider')} className="hover:text-cyan-400">Rider App</button>
            <button onClick={() => setCurrentView('customer')} className="hover:text-cyan-400">Customer View</button>
            <button onClick={() => setCurrentView('merchant')} className="hover:text-cyan-400">Merchant Hub</button>
            <button onClick={() => setCurrentView('sign-lab')} className="hover:text-cyan-400">3D Sign Studio</button>
          </div>
        </div>
      </footer>

    </div>
  );
};
