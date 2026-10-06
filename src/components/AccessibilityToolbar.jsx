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
  BookOpen
} from 'lucide-react';

export const AccessibilityToolbar = ({ isOpen, onClose }) => {
  const {
    theme,
    setTheme,
    sectorColors = {},
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
    speakText
  } = useApp();

  const [activeTab, setActiveTab] = useState('display'); // Default to display/font or themes

  if (!isOpen) return null;

  // Curated quick-pick swatches for sectors
  const QUICK_SWATCHES = [
    '#06B6D4', // Cyan
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#A855F7', // Purple
    '#3B82F6', // Blue
    '#EC4899', // Pink
    '#F43F5E', // Rose
    '#84CC16', // Lime
    '#F97316', // Orange
    '#E2E8F0', // Platinum
    '#00FFFF', // Neon Aqua
    '#00FF66'  // Neon Green
  ];

  // Sector Definitions for Sector Color Studio
  const SECTORS_LIST = [
    {
      key: 'rider',
      label: 'Rider / Courier Sector',
      description: 'Courier dispatch cards, route tracking, speedometer & order badges',
      icon: Bike,
      defaultColor: '#06B6D4'
    },
    {
      key: 'customer',
      label: 'Customer Portal Sector',
      description: 'Delivery tracking milestones, restaurant cart, item notes & door cues',
      icon: Package,
      defaultColor: '#10B981'
    },
    {
      key: 'merchant',
      label: 'Merchant / Kitchen Sector',
      description: 'Kitchen prep tickets, incoming orders, menu items & restaurant cards',
      icon: Store,
      defaultColor: '#F59E0B'
    },
    {
      key: 'avatar',
      label: '3D Human Sign Avatar Sector',
      description: "Alex's jacket piping, chest crest, hologram stage ring & rim studio light",
      icon: Bot,
      defaultColor: '#06B6D4'
    },
    {
      key: 'accent',
      label: 'Global Accent & UI Glow',
      description: 'Primary action buttons, active navigation indicators & glowing borders',
      icon: Sparkles,
      defaultColor: '#06B6D4'
    },
    {
      key: 'card',
      label: 'Card Surfaces & Panels',
      description: 'Glassmorphic card panels, dialog headers & elevated surface tint',
      icon: Layers,
      defaultColor: '#1E293B'
    },
    {
      key: 'bg',
      label: 'Canvas Background Sector',
      description: 'Main application background depth & viewport canvas tone',
      icon: Moon,
      defaultColor: '#0F172A'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-cyan-500/60 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-slate-100">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/30 shadow-md">
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
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
          >
            <Type className="w-4 h-4" />
            <span>Complete Font Size ({fontScale}%)</span>
          </button>

          <button
            onClick={() => setActiveTab('themes')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'themes'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
          >
            <Eye className="w-4 h-4" />
            <span>Vision Themes (7)</span>
          </button>

          <button
            onClick={() => setActiveTab('sectors')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'sectors'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
          >
            <Palette className="w-4 h-4" />
            <span>Sector Colors ({SECTORS_LIST.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'alerts'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
          >
            <Zap className="w-4 h-4" />
            <span>Sensory Alerts</span>
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
                    <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800/80 rounded-lg text-xs font-mono font-extrabold shadow-sm">
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
                            ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300 font-bold shadow-lg ring-2 ring-emerald-500/30'
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
                            ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 font-bold'
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

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-inner">
                  <h3 className="font-extrabold text-white">
                    Order #SF-8924: Rider Has Arrived
                  </h3>
                  <p className="text-slate-300">
                    Alex is waiting outside unit 4B with your warm thermal food parcel. Gate code 4022 confirmed.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="px-2.5 py-1 bg-cyan-950/80 text-cyan-300 border border-cyan-800 rounded-lg font-bold text-xs">
                      ASL Gesture: HELLO
                    </span>
                    <button className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold rounded-lg text-xs">
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
                          ? 'border-cyan-400 bg-cyan-950/40 text-cyan-100 ring-2 ring-cyan-500/40 shadow-xl'
                          : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-950 text-slate-300'
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
                      <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-800/80">
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
                      className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-cyan-500/50 text-left transition flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-cyan-300">{preset.name}</p>
                        <div className="flex items-center gap-1 mt-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.colors.rider }} />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.colors.customer }} />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.colors.merchant }} />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.colors.avatar }} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Sector Preview Bar */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider block mb-2">
                  Live Sector Harmony Preview
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5"
                    style={{
                      backgroundColor: `${sectorColors.rider || '#06B6D4'}20`,
                      borderColor: `${sectorColors.rider || '#06B6D4'}60`,
                      color: sectorColors.rider || '#06B6D4'
                    }}
                  >
                    <Bike className="w-3.5 h-3.5" /> Rider Sector
                  </span>

                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5"
                    style={{
                      backgroundColor: `${sectorColors.customer || '#10B981'}20`,
                      borderColor: `${sectorColors.customer || '#10B981'}60`,
                      color: sectorColors.customer || '#10B981'
                    }}
                  >
                    <Package className="w-3.5 h-3.5" /> Customer Sector
                  </span>

                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5"
                    style={{
                      backgroundColor: `${sectorColors.merchant || '#F59E0B'}20`,
                      borderColor: `${sectorColors.merchant || '#F59E0B'}60`,
                      color: sectorColors.merchant || '#F59E0B'
                    }}
                  >
                    <Store className="w-3.5 h-3.5" /> Merchant Sector
                  </span>

                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5"
                    style={{
                      backgroundColor: `${sectorColors.avatar || '#06B6D4'}20`,
                      borderColor: `${sectorColors.avatar || '#06B6D4'}60`,
                      color: sectorColors.avatar || '#06B6D4'
                    }}
                  >
                    <Bot className="w-3.5 h-3.5" /> 3D Avatar Suit
                  </span>
                </div>
              </div>

              {/* Individual Sector Color Selectors */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Customize the Color of Every Sector
                </h4>

                {SECTORS_LIST.map((sector) => {
                  const Icon = sector.icon;
                  const currentColor = sectorColors[sector.key] || sector.defaultColor;

                  return (
                    <div
                      key={sector.key}
                      className="p-3.5 bg-slate-950/90 rounded-2xl border border-slate-800 hover:border-slate-700 transition"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
                            style={{
                              backgroundColor: `${currentColor}25`,
                              color: currentColor,
                              border: `1px solid ${currentColor}60`
                            }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-sm text-white block">{sector.label}</span>
                            <span className="text-[11px] text-slate-400 block">{sector.description}</span>
                          </div>
                        </div>

                        {/* Native Color Picker & Hex Display */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
                            {currentColor}
                          </span>
                          <label className="relative cursor-pointer w-7 h-7 rounded-lg overflow-hidden border border-slate-700 shadow flex items-center justify-center">
                            <input
                              type="color"
                              value={currentColor}
                              onChange={(e) => updateSectorColor(sector.key, e.target.value)}
                              className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer opacity-0"
                            />
                            <span className="w-full h-full block" style={{ backgroundColor: currentColor }} />
                          </label>
                        </div>
                      </div>

                      {/* Quick Swatch Bar */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
                        {QUICK_SWATCHES.map((swatch) => (
                          <button
                            key={swatch}
                            onClick={() => updateSectorColor(sector.key, swatch)}
                            className={`w-5 h-5 rounded-md flex-shrink-0 transition-transform ${currentColor.toLowerCase() === swatch.toLowerCase()
                                ? 'scale-125 ring-2 ring-white shadow-lg'
                                : 'opacity-80 hover:opacity-100 hover:scale-110'
                              }`}
                            style={{ backgroundColor: swatch }}
                            title={`Set to ${swatch}`}
                          />
                        ))}
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
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold rounded-xl shadow-lg hover:brightness-110 transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" /> Save & Apply
          </button>
        </div>

      </div>
    </div>
  );
};
