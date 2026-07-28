import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Eye, 
  Type, 
  Zap, 
  Activity, 
  Volume2, 
  RotateCcw, 
  Check, 
  Sliders,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const AccessibilityToolbar = ({ isOpen, onClose }) => {
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    reducedMotion,
    setReducedMotion,
    soundAlerts,
    setSoundAlerts,
    hapticAlerts,
    setHapticAlerts,
    flashAlerts,
    setFlashAlerts,
    triggerVisualAlert,
    speakText
  } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-cyan-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/30">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Accessibility & Rider Preferences
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </h2>
              <p className="text-xs text-slate-400">WCAG 2.1 AA Compliant Display & Haptic Controls</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          
          {/* Contrast Mode Selector */}
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" /> Display Contrast & Color Palette
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                  theme === 'dark'
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-md ring-2 ring-cyan-500/30'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">Standard Dark</span>
                  {theme === 'dark' && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-xs text-slate-400">High contrast navy & emerald tones</p>
              </button>

              <button
                onClick={() => setTheme('neon')}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                  theme === 'neon'
                    ? 'border-cyan-400 bg-black text-cyan-300 shadow-xl shadow-cyan-500/20 ring-2 ring-cyan-400'
                    : 'border-slate-800 bg-slate-950 hover:border-cyan-500 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-cyan-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-300" /> High-Contrast Neon
                  </span>
                  {theme === 'neon' && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-xs text-cyan-400/80">Maximum outdoor sun visibility</p>
              </button>
            </div>
          </div>

          {/* Typography & Font Scaling */}
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Type className="w-4 h-4 text-emerald-400" /> Font Size Scaling
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'normal', label: '100% Normal', desc: 'Standard UI' },
                { id: 'large', label: '115% Large', desc: 'Easier Reading' },
                { id: 'xlarge', label: '130% Extra Large', desc: 'Maximum Legibility' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFontSize(f.id)}
                  className={`p-3 rounded-2xl border text-center transition ${
                    fontSize === f.id
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300 font-bold'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="block text-sm font-semibold">{f.label}</span>
                  <span className="text-[10px] text-slate-400 block mt-1">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sensory Alerts & Vibrations */}
          <div className="border-t border-slate-800 pt-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-xs">Visual & Sensory Notification Triggers</h3>

            {/* Flash Alerts Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <div>
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" /> Screen Flash Alerts
                </span>
                <p className="text-xs text-slate-400 mt-0.5">Flashes screen brightly for incoming customer updates</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerVisualAlert('cyan')}
                  className="px-2.5 py-1 bg-cyan-950 text-cyan-400 hover:bg-cyan-900 text-xs rounded-lg border border-cyan-800 font-semibold"
                >
                  Test Flash
                </button>
                <input
                  type="checkbox"
                  checked={flashAlerts}
                  onChange={(e) => setFlashAlerts(e.target.checked)}
                  className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Haptic Vibrations Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <div>
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" /> Haptic Phone Vibration
                </span>
                <p className="text-xs text-slate-400 mt-0.5">Patterned vibration feedback on order alerts</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerVisualAlert('gold')}
                  className="px-2.5 py-1 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 text-xs rounded-lg border border-emerald-800 font-semibold"
                >
                  Test Haptic
                </button>
                <input
                  type="checkbox"
                  checked={hapticAlerts}
                  onChange={(e) => setHapticAlerts(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Sound & Speech Synthesis Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <div>
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-purple-400" /> Audio Readout for Hearing Users
                </span>
                <p className="text-xs text-slate-400 mt-0.5">Converts rider quick signs into spoken audio for customers</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => speakText("SignShift Speech System test. Your rider has arrived.")}
                  className="px-2.5 py-1 bg-purple-950 text-purple-400 hover:bg-purple-900 text-xs rounded-lg border border-purple-800 font-semibold"
                >
                  Test Voice
                </button>
                <input
                  type="checkbox"
                  checked={soundAlerts}
                  onChange={(e) => setSoundAlerts(e.target.checked)}
                  className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <div>
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Reduced Motion Mode
                </span>
                <p className="text-xs text-slate-400 mt-0.5">Replaces 3D WebGL animations with static visual sign cards</p>
              </div>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              setTheme('dark');
              setFontSize('normal');
              setReducedMotion(false);
              setSoundAlerts(true);
              setHapticAlerts(true);
              setFlashAlerts(true);
            }}
            className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Recommended Defaults
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold rounded-xl shadow-lg hover:brightness-110 transition"
          >
            Save & Apply
          </button>
        </div>

      </div>
    </div>
  );
};
