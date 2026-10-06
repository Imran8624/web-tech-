import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SignAvatar3D, SIGN_DICTIONARY } from '../components/SignAvatar3D';
import { SUPPORTED_LANGUAGES } from '../constants/languages';
import { 
  Bot, 
  Sparkles, 
  Globe, 
  FastForward, 
  Volume2, 
  BookOpen, 
  Play, 
  Check, 
  RotateCcw,
  Zap,
  User,
  UserCheck
} from 'lucide-react';

export const SignAvatarLab = () => {
  const { 
    signSpeed, 
    setSignSpeed, 
    speakText, 
    triggerVisualAlert, 
    avatarMode, 
    setAvatarMode,
    language = 'en',
    setLanguage,
    t = (k) => k,
    SUPPORTED_LANGUAGES = []
  } = useApp();
  const [activeSignKey, setActiveSignKey] = useState("HELLO");
  const selectedLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const [customText, setCustomText] = useState(selectedLang.sampleMsg || "Please leave food at door, gate code 4022.");
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslateCustom = (e) => {
    e.preventDefault();
    if (!customText.trim()) return;

    setIsTranslating(true);
    triggerVisualAlert('cyan');

    // Keyword matcher for sign key mapping across supported languages
    const lower = customText.toLowerCase();
    let matchedKey = "HELLO";
    if (lower.includes("leave") || lower.includes("door") || lower.includes("deje") || lower.includes("porte") || lower.includes("ドア") || lower.includes("ಬಾಗಿಲಿನಲ್ಲಿ") || lower.includes("दरवाजे") || lower.includes("门口") || lower.includes("الباب")) {
      matchedKey = "LEAVE AT DOOR";
    } else if (lower.includes("code") || lower.includes("gate") || lower.includes("keypad") || lower.includes("código") || lower.includes("ಗೇಟ್") || lower.includes("गेट") || lower.includes("门禁") || lower.includes("البوابة")) {
      matchedKey = "GATE CODE";
    } else if (lower.includes("food") || lower.includes("picked") || lower.includes("bag") || lower.includes("comida") || lower.includes("ಆಹಾರ") || lower.includes("खाना") || lower.includes("食物") || lower.includes("الطعام")) {
      matchedKey = "FOOD PICKED UP";
    } else if (lower.includes("outside") || lower.includes("arrived") || lower.includes("afuera") || lower.includes("arrivé") || lower.includes("ಹೊರಗೆ") || lower.includes("बाहर") || lower.includes("到达") || lower.includes("وصلت")) {
      matchedKey = "I AM OUTSIDE";
    } else if (lower.includes("traffic") || lower.includes("delay") || lower.includes("retardo") || lower.includes("渋滞") || lower.includes("ಟ್ರಾಫಿಕ್") || lower.includes("ट्रैफिक") || lower.includes("堵") || lower.includes("زحام")) {
      matchedKey = "TRAFFIC DELAY";
    } else if (lower.includes("thank") || lower.includes("gracias") || lower.includes("merci") || lower.includes("感謝") || lower.includes("ಧನ್ಯವಾದ") || lower.includes("धन्यवाद") || lower.includes("谢谢") || lower.includes("شكرا")) {
      matchedKey = "THANK YOU";
    }

    setActiveSignKey(matchedKey);

    setTimeout(() => {
      setIsTranslating(false);
      speakText(`Translated phrase into sign animation ${matchedKey}`);
    }, 800);
  };

  const currentMode = avatarMode || 'human';

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8 pb-24">
      
      {/* HEADER BAR */}
      <div className="glass-panel rounded-3xl p-6 border-2 border-purple-500/40 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-2xl">
            🤟
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              3D Human Sign Avatar Studio
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </h2>
            <p className="text-xs text-slate-400">Universal Speech & Text ➔ Real-Time 3D Human ASL Interpreter</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow-lg">
            <UserCheck className="w-4 h-4 text-cyan-400" /> 3D Human Mode Active
          </div>

          <button
            onClick={() => setSignSpeed(signSpeed === 1 ? 1.5 : signSpeed === 1.5 ? 0.5 : 1)}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 shadow-lg"
          >
            <FastForward className="w-4 h-4" /> Speed: {signSpeed}x
          </button>
        </div>
      </div>

      {/* 3D AVATAR & TRANSLATION ENGINE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 3D Avatar Stage */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-3xl p-4 border-2 border-cyan-500/50 bg-slate-950 shadow-2xl">
            <SignAvatar3D activeSignKey={activeSignKey} height="380px" />
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Active Sign: <strong className="text-white">{SIGN_DICTIONARY[activeSignKey]?.label}</strong></span>
            </div>
            <button
              onClick={() => speakText(SIGN_DICTIONARY[activeSignKey]?.description)}
              className="text-cyan-400 hover:text-white font-bold flex items-center gap-1 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-800"
            >
              <Volume2 className="w-3.5 h-3.5" /> Read Description
            </button>
          </div>
        </div>

        {/* Right Input & Language Studio */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Custom Translation Form */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4 bg-slate-900">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" /> Multi-Language Input Translator
              </h3>
            </div>

            {/* Language Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">{t('language_select', 'Select Input Language')}</label>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  const found = SUPPORTED_LANGUAGES.find(l => l.code === e.target.value);
                  if (found) {
                    setCustomText(found.sampleMsg);
                  }
                }}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-cyan-300 focus:outline-none"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                    {l.flag} {l.nativeName || l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Text Input */}
            <form onSubmit={handleTranslateCustom} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Message Text</label>
                <textarea
                  rows={3}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Type anything in chosen language..."
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isTranslating}
                className="w-full py-3 bg-gradient-to-r from-purple-500 via-cyan-500 to-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isTranslating ? 'Processing AI Translation...' : 'Translate to 3D Sign Avatar'}</span>
              </button>
            </form>

          </div>

          {/* Complete Sign Dictionary Browser */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-3 bg-slate-900">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Sign Dictionary Library</span>
              <span className="text-cyan-400">{Object.keys(SIGN_DICTIONARY).length} Phrases</span>
            </h4>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {Object.keys(SIGN_DICTIONARY).map((key) => {
                const item = SIGN_DICTIONARY[key];
                return (
                  <button
                    key={key}
                    onClick={() => setActiveSignKey(key)}
                    className={`w-full p-2.5 rounded-xl text-xs text-left transition flex items-center justify-between border ${
                      activeSignKey === key
                        ? 'bg-cyan-500 text-slate-950 font-extrabold border-white'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[10px] opacity-75 font-mono">{key}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
