import React, { useState } from 'react';
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
  ShieldCheck,
  Palette,
  Sun,
  Moon,
  Smartphone,
  Bike,
  Package,
  Store,
  Bot,
  Layers,
  CheckCircle2,
  RefreshCw,
  Minus,
  Plus,
  ZoomIn,
  ZoomOut,
  AlignLeft,
  BookOpen,
  Globe,
  Lock
} from 'lucide-react';

export const AccessibilityToolbar = ({ isOpen, onClose }) => {
  const {
    theme,
    setTheme,
    sectorColors = {},
    activeSectorKey,
    activeSectorBg,
    updateSectorColor,
    applySectorPreset,
    resetSectorColors,
    ACCESSIBILITY_THEMES = [],
    SECTOR_PALETTE_PRESETS = [],
    fontSize,
    setFontSize,
    fontScale = 100,
    changeFontScale,
    stepFontScale,
    fontFamily = 'standard',
    setFontFamily,
    enhancedLineHeight = false,
    setEnhancedLineHeight,
    highTextWeight = false,
    setHighTextWeight,
    resetTypography,
    FONT_SIZE_PRESETS = [],
    reducedMotion,
    setReducedMotion,
    soundAlerts,
    setSoundAlerts,
    hapticAlerts,
    setHapticAlerts,
    flashAlerts,
    setFlashAlerts,
    triggerVisualAlert,
    speakText,
    language = 'en',
    setLanguage,
    t = (k) => k,
    SUPPORTED_LANGUAGES = []
  } = useApp();

  const [activeTab, setActiveTab] = useState('display'); // Default to display/font or themes

  if (!isOpen) return null;

  // Utility to determine solid contrasting text color (dark or light)
  const getContrastColor = (hex) => {
    if (!hex || typeof hex !== 'string') return '#ffffff';
    let cleanHex = hex.replace('#', '').trim();
    if (cleanHex.length === 8) {
      cleanHex = cleanHex.substring(0, 6);
    }
    if (cleanHex.length !== 6 && cleanHex.length !== 3) return '#ffffff';
    const fullHex = cleanHex.length === 3
      ? cleanHex.split('').map((c) => c + c).join('')
      : cleanHex;
    const r = parseInt(fullHex.substring(0, 2), 16);
    const g = parseInt(fullHex.substring(2, 4), 16);
    const b = parseInt(fullHex.substring(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#020617' : '#ffffff';
  };

  // Curated quick-pick solid swatches for sector accents
  const QUICK_SWATCHES = [
    '#2563EB', // Solid Royal Blue
    '#0284C7', // Solid Sky Blue
    '#06B6D4', // Solid Cyan
    '#10B981', // Solid Emerald Green
    '#16A34A', // Solid Green
    '#84CC16', // Solid Lime
    '#F59E0B', // Solid Amber
    '#EA580C', // Solid Orange
    '#DC2626', // Solid Red
    '#EC4899', // Solid Pink
    '#8B5CF6', // Solid Purple
    '#64748B'  // Solid Slate
  ];

  // Curated deep background tones for sector canvases
  const QUICK_BG_SWATCHES = [
    '#081225', // Deep Ocean / Rider Blue
    '#061a14', // Deep Pine / Customer Green
    '#1c1206', // Deep Warm Amber / Merchant
    '#190a14', // Deep Burgundy / Admin
    '#120a22', // Deep Royal Violet / Avatar
    '#090e1a', // Midnight Navy / Landing
    '#0a0d18', // Deep Charcoal / Auth
    '#000000', // Pitch OLED Black
    '#0F172A', // Slate 900 Canvas
    '#1E293B', // Slate 800 Surface
    '#140E08', // Warm Circadian
    '#0A0F1D'  // Cobalt Night
  ];

  // Sector Definitions for Sector Color Studio (Accents + Backgrounds)
  const SECTORS_LIST = [
    {
      id: 'rider',
      label: 'Rider / Courier Sector',
      description: 'Courier route cards, live telemetry HUD & active order badges',
      icon: Bike,
      accentKey: 'rider',
      defaultAccent: '#0284C7',
      bgKey: 'riderBg',
      defaultBg: '#081225'
    },
    {
      id: 'customer',
      label: 'Customer Portal Sector',
      description: 'Milestones tracking, address selector, favorites & restaurant cart',
      icon: Package,
      accentKey: 'customer',
      defaultAccent: '#10B981',
      bgKey: 'customerBg',
      defaultBg: '#061a14'
    },
    {
      id: 'merchant',
      label: 'Merchant / Kitchen Sector',
      description: 'Kitchen tickets, food prep pipeline & incoming order cards',
      icon: Store,
      accentKey: 'merchant',
      defaultAccent: '#F59E0B',
      bgKey: 'merchantBg',
      defaultBg: '#1c1206'
    },
    {
      id: 'admin',
      label: 'Admin Operations Sector',
      description: 'System telemetry, fleet health overview, audit logs & dispute triage',
      icon: ShieldCheck,
      accentKey: 'admin',
      defaultAccent: '#EC4899',
      bgKey: 'adminBg',
      defaultBg: '#190a14'
    },
    {
      id: 'avatar',
      label: '3D Human Sign Avatar Sector',
      description: "Alex's sign suit piping, hologram stage glow & 3D canvas backdrop",
      icon: Bot,
      accentKey: 'avatar',
      defaultAccent: '#8B5CF6',
      bgKey: 'avatarBg',
      defaultBg: '#120a22'
    },
    {
      id: 'landing',
      label: 'Landing Page Sector',
      description: 'Public marketing hero section, feature spotlights & registration portal',
      icon: Sparkles,
      accentKey: 'accent',
      defaultAccent: '#06B6D4',
      bgKey: 'landingBg',
      defaultBg: '#090e1a'
    },
    {
      id: 'auth',
      label: 'Auth & Login Sector',
      description: 'Role-based credentials portal, secure OTP & multi-role gate cards',
      icon: Lock,
      accentKey: 'accent',
      defaultAccent: '#06B6D4',
      bgKey: 'authBg',
      defaultBg: '#0a0d18'
    },
    {
      id: 'canvas',
      label: 'Global Canvas & Card Surface',
      description: 'Universal fallback background depth & elevated surface card panels',
      icon: Moon,
      accentKey: 'card',
      defaultAccent: '#1E293B',
      bgKey: 'bg',
      defaultBg: '#0F172A'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-cyan-500 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-slate-100">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-950 text-cyan-400 rounded-2xl border border-cyan-500 shadow-md">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Accessibility, Font & Sector Studio
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </h2>
              <p className="text-xs text-slate-400">Complete Font Scaling (80% - 200%), 7 Vision Modes & Sector Colors</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-2xl mb-5 overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('display')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'display'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
          >
            <Type className="w-4 h-4" />
            <span>Complete Font Size ({fontScale}%)</span>
          </button>

          <button
            onClick={() => setActiveTab('themes')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'themes'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
          >
            <Eye className="w-4 h-4" />
            <span>Vision Themes (7)</span>
          </button>

          <button
            onClick={() => setActiveTab('sectors')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'sectors'
              ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
          >
            <Palette className="w-4 h-4" />
            <span>Sector Colors ({SECTORS_LIST.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'alerts'
              ? 'bg-purple-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
          >
            <Zap className="w-4 h-4" />
            <span>Sensory Alerts</span>
          </button>

          <button
            onClick={() => setActiveTab('language')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'language'
              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
          >
            <Globe className="w-4 h-4" />
            <span>Language / ಭಾಷೆ / Idioma ({SUPPORTED_LANGUAGES.find(l => l.code === language)?.flag || '🌐'})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">

          {/* ==================== TAB 1: COMPLETE FONT SIZE & TYPOGRAPHY ==================== */}
          {activeTab === 'display' && (
            <div className="space-y-6">

              {/* Continuous Font Scale Slider & Stepper */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold text-white">Continuous Font Scaling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-mono font-extrabold shadow-sm">
                      {fontScale}% Scale
                    </span>
                    <button
                      onClick={() => changeFontScale(100)}
                      className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition"
                      title="Reset font to 100%"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset 100%
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => stepFontScale(-10)}
                    disabled={fontScale <= 80}
                    className="p-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-200 border border-slate-700 rounded-xl transition shadow flex items-center justify-center"
                    title="Decrease font size (-10%)"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <input
                    type="range"
                    min="80"
                    max="200"
                    step="5"
                    value={fontScale}
                    onChange={(e) => changeFontScale(Number(e.target.value))}
                    className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />

                  <button
                    onClick={() => stepFontScale(10)}
                    disabled={fontScale >= 200}
                    className="p-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-200 border border-slate-700 rounded-xl transition shadow flex items-center justify-center"
                    title="Increase font size (+10%)"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 font-mono px-1">
                  <span>80% (Compact)</span>
                  <span>100% (Standard)</span>
                  <span>130% (Outdoor)</span>
                  <span>150% (High-Vis)</span>
                  <span>200% (Max WCAG)</span>
                </div>
              </div>

              {/* Complete 6 Font Size Presets */}
              <div>
                <label className="block text-sm font-bold text-slate-200 mb-2.5 flex items-center gap-2">
                  <ZoomIn className="w-4 h-4 text-emerald-400" /> Complete Font Size Presets (WCAG 1.4.4)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {FONT_SIZE_PRESETS.map((f) => {
                    const isSelected = fontSize === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => setFontSize(f.id)}
                        className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between group ${isSelected
                          ? 'border-emerald-400 bg-emerald-950 text-emerald-300 font-bold shadow-lg ring-2 ring-emerald-500'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300'
                          }`}
                      >
                        <div className="flex items-start justify-between mb-1.5">
                          <span
                            className="font-bold text-slate-100 block"
                            style={{ fontSize: `${Math.max(12, Math.round(14 * (f.scale / 100)))}px` }}
                          >
                            {f.label}
                          </span>
                          {isSelected && (
                            <div className="p-0.5 rounded-full bg-emerald-500 text-slate-950">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">{f.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reading Assistance & Font Family */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" /> Reading Ease & Dyslexia Enhancements
                </h4>

                {/* Font Family Selector */}
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Typography Font Family:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'standard', name: 'Inter / Standard', desc: 'Modern geometric UI' },
                      { id: 'lexend', name: 'Lexend High-Fluency', desc: 'Engineered for reading speed' },
                      { id: 'dyslexic', name: 'OpenDyslexic Assist', desc: 'Heavy bottom letter forms' }
                    ].map((font) => (
                      <button
                        key={font.id}
                        onClick={() => setFontFamily(font.id)}
                        className={`p-2.5 rounded-xl border text-left transition ${fontFamily === font.id
                          ? 'border-cyan-400 bg-cyan-950 text-cyan-200 font-bold'
                          : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-400'
                          }`}
                      >
                        <span className="block text-xs font-bold">{font.name}</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{font.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Formatting Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">Enhanced Line Spacing</span>
                      <span className="text-[10px] text-slate-400">1.85x line height for visual comfort</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={enhancedLineHeight}
                      onChange={(e) => setEnhancedLineHeight(e.target.checked)}
                      className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">High Text Weight</span>
                      <span className="text-[10px] text-slate-400">Bold text stroke for bright sunlight</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={highTextWeight}
                      onChange={(e) => setHighTextWeight(e.target.checked)}
                      className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Live Interactive Typography Preview Sandbox */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Live Typography Preview ({fontScale}% Scale)
                </span>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 shadow-inner">
                  <h3 className="font-extrabold text-white">
                    Order #SF-8924: Rider Has Arrived
                  </h3>
                  <p className="text-slate-300">
                    Alex is waiting outside unit 4B with your warm thermal food parcel. Gate code 4022 confirmed.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-lg font-bold text-xs">
                      ASL Gesture: HELLO
                    </span>
                    <button className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs transition">
                      Confirm Delivery
                    </button>
                  </div>
                </div>
              </div>

              {/* Reduced Motion Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
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
          )}

          {/* ==================== TAB 2: ACCESSIBILITY THEMES ==================== */}
          {activeTab === 'themes' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-200 mb-1 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-400" /> Specialized Contrast & Vision Assist Modes
                </h3>
                <p className="text-xs text-slate-400">
                  Engineered for WCAG 2.1 compliance, colorblindness support, outdoor sunlight, and OLED power saving.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ACCESSIBILITY_THEMES.map((t) => {
                  const isSelected = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between group ${isSelected
                        ? 'border-cyan-400 bg-cyan-950 text-cyan-100 ring-2 ring-cyan-500 shadow-xl'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
                        }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{t.name}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${t.id === 'neon' ? 'bg-cyan-500 text-slate-950' :
                              t.id === 'solar-light' ? 'bg-amber-400 text-slate-950' :
                                t.id === 'oled-midnight' ? 'bg-emerald-500 text-slate-950' :
                                  'bg-slate-800 text-slate-300'
                              }`}>
                              {t.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{t.desc}</p>
                        </div>
                        {isSelected && (
                          <div className="p-1 rounded-full bg-cyan-500 text-slate-950 shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Visual Palette Preview Strip */}
                      <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-800">
                        <span className="text-[10px] text-slate-500 font-mono">Palette:</span>
                        <div className="flex items-center gap-1">
                          {t.id === 'neon' && (
                            <>
                              <span className="w-3.5 h-3.5 rounded-full bg-black border border-white" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#00FFFF]" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#00FF66]" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#FFFF00]" />
                            </>
                          )}
                          {t.id === 'solar-light' && (
                            <>
                              <span className="w-3.5 h-3.5 rounded-full bg-[#F8FAFC] border border-slate-300" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#0F172A]" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#0284C7]" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#059669]" />
                            </>
                          )}
                          {t.id === 'tritanopia' && (
                            <>
                              <span className="w-3.5 h-3.5 rounded-full bg-[#0C101B]" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#7C3AED]" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#F59E0B]" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#EC4899]" />
                            </>
                          )}
                          {t.id === 'protanopia' && (
                            <>
                              <span className="w-3.5 h-3.5 rounded-full bg-[#0A0F1D]" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#2563EB]" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#FBBF24]" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#38BDF8]" />
                            </>
                          )}
                          {t.id === 'oled-midnight' && (
                            <>
                              <span className="w-3.5 h-3.5 rounded-full bg-[#000000] border border-slate-700" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#050811]" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#38BDF8]" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#4ADE80]" />
                            </>
                          )}
                          {t.id === 'amber-night' && (
                            <>
                              <span className="w-3.5 h-3.5 rounded-full bg-[#140E08]" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#B45309]" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#F59E0B]" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#FEF3C7]" />
                            </>
                          )}
                          {t.id === 'dark' && (
                            <>
                              <span className="w-3.5 h-3.5 rounded-full bg-[#0F172A]" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#1E293B]" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#06B6D4]" />
                              <span className="w-3.5 h-3.5 rounded-full bg-[#10B981]" />
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================== TAB 3: SECTOR COLOR STUDIO ==================== */}
          {activeTab === 'sectors' && (
            <div className="space-y-6">

              {/* Presets Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" /> Quick Sector Presets
                  </label>
                  <button
                    onClick={resetSectorColors}
                    className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset Sectors
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SECTOR_PALETTE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => applySectorPreset(preset.id)}
                      className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-cyan-500 text-left transition flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-cyan-300">{preset.name}</p>
                        <div className="flex items-center gap-1 mt-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.colors.rider }} title="Rider Accent" />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.colors.customer }} title="Customer Accent" />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.colors.merchant }} title="Merchant Accent" />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.colors.admin || '#EC4899' }} title="Admin Accent" />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.colors.avatar }} title="Avatar Accent" />
                          <span className="w-2.5 h-2.5 rounded border border-slate-600" style={{ backgroundColor: preset.colors.bg || '#0F172A' }} title="Background" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Sector Harmony & Backgrounds Preview Bar */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider block">
                    Live Sector Harmony & Backgrounds
                  </span>
                  {activeSectorKey && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                      Current Sector: {activeSectorKey.toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SECTORS_LIST.map((sec) => {
                    const secAccent = sectorColors[sec.accentKey] || sec.defaultAccent;
                    const secBg = sectorColors[sec.bgKey] || sec.defaultBg;
                    const Icon = sec.icon;
                    const isActive = activeSectorKey === sec.id;

                    return (
                      <div
                        key={sec.id}
                        className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                          isActive ? 'ring-2 ring-cyan-400 shadow-lg' : ''
                        }`}
                        style={{
                          backgroundColor: secBg,
                          borderColor: secAccent
                        }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shadow"
                            style={{
                              backgroundColor: secAccent,
                              color: getContrastColor(secAccent)
                            }}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </span>
                          {isActive && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-400 text-slate-950">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-white truncate block">{sec.label.split(' /')[0]}</span>
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 mt-1 pt-1 border-t border-white/10">
                          <span className="truncate">BG: {secBg}</span>
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: secAccent }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Individual Sector Color Selectors (Accent & Background for Every Sector) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Customize the Accent & Background Color of Every Sector
                </h4>

                {SECTORS_LIST.map((sector) => {
                  const Icon = sector.icon;
                  const currentAccent = sectorColors[sector.accentKey] || sector.defaultAccent;
                  const currentBg = sectorColors[sector.bgKey] || sector.defaultBg;
                  const isActive = activeSectorKey === sector.id;

                  return (
                    <div
                      key={sector.id}
                      className={`p-3.5 rounded-2xl border transition ${
                        isActive ? 'border-cyan-500/80 shadow-lg' : 'border-slate-800 hover:border-slate-700'
                      }`}
                      style={{ backgroundColor: `${currentBg}cc` }}
                    >
                      {/* Sector Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md font-bold"
                            style={{
                              backgroundColor: currentAccent,
                              color: getContrastColor(currentAccent),
                              border: `1px solid ${currentAccent}`
                            }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white block">{sector.label}</span>
                              {isActive && (
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950">
                                  Viewing Now
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 block">{sector.description}</span>
                          </div>
                        </div>

                        {/* Live Combined Mini Badge Preview */}
                        <div
                          className="px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 shadow-inner"
                          style={{
                            backgroundColor: currentBg,
                            borderColor: currentAccent,
                            color: getContrastColor(currentBg)
                          }}
                        >
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentAccent }} />
                          <span>Sector Preview</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                        {/* 1. SECTOR BACKGROUND COLOR */}
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                              <Moon className="w-3.5 h-3.5 text-cyan-400" /> Sector Background
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300">
                                {currentBg}
                              </span>
                              <label className="relative cursor-pointer w-6 h-6 rounded-md overflow-hidden border border-slate-700 shadow flex items-center justify-center">
                                <input
                                  type="color"
                                  value={currentBg}
                                  onChange={(e) => updateSectorColor(sector.bgKey, e.target.value)}
                                  className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer opacity-0"
                                />
                                <span className="w-full h-full block" style={{ backgroundColor: currentBg }} />
                              </label>
                            </div>
                          </div>

                          {/* Quick Deep BG Swatches */}
                          <div className="flex items-center gap-1 overflow-x-auto pt-0.5 scrollbar-none">
                            {QUICK_BG_SWATCHES.map((bgSwatch) => (
                              <button
                                key={bgSwatch}
                                onClick={() => updateSectorColor(sector.bgKey, bgSwatch)}
                                className={`w-5 h-5 rounded-md flex-shrink-0 transition-transform ${
                                  currentBg.toLowerCase() === bgSwatch.toLowerCase()
                                    ? 'scale-125 ring-2 ring-white shadow-md'
                                    : 'hover:scale-110 border border-white/20'
                                }`}
                                style={{ backgroundColor: bgSwatch }}
                                title={`Set BG to ${bgSwatch}`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* 2. SECTOR ACCENT COLOR */}
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Sector Accent & Badges
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300">
                                {currentAccent}
                              </span>
                              <label className="relative cursor-pointer w-6 h-6 rounded-md overflow-hidden border border-slate-700 shadow flex items-center justify-center">
                                <input
                                  type="color"
                                  value={currentAccent}
                                  onChange={(e) => updateSectorColor(sector.accentKey, e.target.value)}
                                  className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer opacity-0"
                                />
                                <span className="w-full h-full block" style={{ backgroundColor: currentAccent }} />
                              </label>
                            </div>
                          </div>

                          {/* Quick Accent Swatches */}
                          <div className="flex items-center gap-1 overflow-x-auto pt-0.5 scrollbar-none">
                            {QUICK_SWATCHES.map((swatch) => (
                              <button
                                key={swatch}
                                onClick={() => updateSectorColor(sector.accentKey, swatch)}
                                className={`w-5 h-5 rounded-md flex-shrink-0 transition-transform ${
                                  currentAccent.toLowerCase() === swatch.toLowerCase()
                                    ? 'scale-125 ring-2 ring-white shadow-md'
                                    : 'hover:scale-110 shadow-sm'
                                }`}
                                style={{ backgroundColor: swatch }}
                                title={`Set Accent to ${swatch}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ==================== TAB 4: SENSORY ALERTS ==================== */}
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-200 mb-1">Visual & Sensory Notification Triggers</h3>
                <p className="text-xs text-slate-400">Essential cues for deaf, hard-of-hearing and non-verbal couriers.</p>
              </div>

              {/* Flash Alerts Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
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
              <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div>
                  <span className="font-bold text-sm text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" /> Haptic Phone Vibration
                  </span>
                  <p className="text-xs text-slate-400 mt-0.5">Patterned vibration feedback on critical order events</p>
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
              <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div>
                  <span className="font-bold text-sm text-white flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-purple-400" /> Audio Readout for Hearing Users
                  </span>
                  <p className="text-xs text-slate-400 mt-0.5">Converts rider quick signs into spoken speech synthesis for customers</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => speakText("SignShift Speech System test. Your rider has arrived outside.")}
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
            </div>
          )}

          {/* ==================== TAB 5: MULTI-LANGUAGE LOCALIZATION ==================== */}
          {activeTab === 'language' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-200 mb-1 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400" /> Complete System Translation Across All Sectors
                </h3>
                <p className="text-xs text-slate-400">
                  Select a language to convert all sectors (Rider, Customer, Merchant, Admin, Sign Studio, and Navigation).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        triggerVisualAlert('cyan');
                      }}
                      className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between group ${isSelected
                        ? 'border-amber-400 bg-amber-950 text-amber-100 ring-2 ring-amber-500 shadow-xl'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
                        }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{lang.flag}</span>
                          <div>
                            <span className="font-bold text-sm text-white block">{lang.nativeName || lang.name}</span>
                            <span className="text-xs text-slate-400">{lang.name}</span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="p-1 rounded-full bg-amber-400 text-slate-950 shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-800">
                        <span className="text-[10px] text-slate-500 font-mono block">Sample Translation:</span>
                        <p className="text-xs text-slate-300 italic mt-0.5">{lang.sampleMsg}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              setTheme('dark');
              resetSectorColors();
              resetTypography();
              setReducedMotion(false);
              setSoundAlerts(true);
              setHapticAlerts(true);
              setFlashAlerts(true);
            }}
            className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset All Defaults
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" /> Save & Apply
          </button>
        </div>

      </div>
    </div>
  );
};
