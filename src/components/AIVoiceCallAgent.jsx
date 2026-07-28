import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  PhoneCall,
  PhoneOff,
  Mic,
  Volume2,
  Sparkles,
  Clock,
  Calendar,
  CheckCircle2,
  UserCheck,
  AlertCircle,
  Play,
  X,
  Bot,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AIVoiceCallAgent = ({ isOpen, onClose, initialScenario = 'order_ready' }) => {
  const { order, speakText, triggerVisualAlert } = useApp();

  const [callState, setCallState] = useState('idle'); // 'idle' | 'calling' | 'connected' | 'completed'
  const [activeScenario, setActiveScenario] = useState(initialScenario); // 'order_ready' | 'appointment' | 'arrival_5min'
  const [appointmentTime, setAppointmentTime] = useState('5 mins (Immediate)');
  const [callTranscript, setCallTranscript] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Default Call Scenarios
  const SCENARIOS = {
    arrival_5min: {
      title: "5-Minute Arrival Alert Call",
      subtitle: "Informs customer rider Alex will arrive at doorstep in 5 minutes",
      btnText: "Call Customer: 'Arriving in 5 Mins' 📞",
      badge: "Arrival Dispatch",
      speechScript: `Hello ${order.customerName}! This is the SignShift AI Voice Assistant calling on behalf of your delivery partner Alex Rivera. Alex has picked up your order from ${order.merchantName} and will arrive at your address in 5 minutes. Please be ready at the entrance or gate code ${order.gateCode}. Since Alex is Deaf, you can reply via text or 1-tap sign visual assist. Have a great day!`
    },
    order_ready: {
      title: "Order Ready & Pickup Call",
      subtitle: "Notifies customer that order is freshly prepared and en route",
      btnText: "Call Customer: 'Order Fresh & Ready' 🛍️",
      badge: "Order Status",
      speechScript: `Hi ${order.customerName}! SignShift AI Assistant here. Your delicious order of ${order.orderItems.map(i => i.name).join(', ')} is ready at ${order.merchantName}! Alex is starting the delivery now.`
    },
    appointment: {
      title: "Schedule / Confirm Delivery Appointment",
      subtitle: "Communicates with customer to arrange exact delivery window",
      btnText: "Schedule Delivery Appointment 📅",
      badge: "Appointment Agent",
      speechScript: `Hello ${order.customerName}! SignShift AI Assistant calling to confirm your delivery appointment. Alex is scheduled to deliver your order at ${appointmentTime}. Press confirm or reply with your preferred time slot.`
    }
  };

  const currentScenarioObj = SCENARIOS[activeScenario] || SCENARIOS['arrival_5min'];

  const startAICall = (scenarioKey = activeScenario) => {
    setActiveScenario(scenarioKey);
    setCallState('calling');
    triggerVisualAlert('cyan');
    setCallTranscript([{ sender: 'system', text: 'Initiating AI Voice Dispatch Call to ' + order.customerPhone + '...' }]);

    // Simulate ring delay
    setTimeout(() => {
      setCallState('connected');
      setIsSpeaking(true);

      const scriptText = SCENARIOS[scenarioKey].speechScript;
      speakText(scriptText);

      setCallTranscript(prev => [
        ...prev,
        { sender: 'ai_agent', text: '🤖 SignShift Voice Agent: "' + scriptText + '"' }
      ]);

      // Complete call simulation
      setTimeout(() => {
        setIsSpeaking(false);
        setCallState('completed');
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      }, 7000);
    }, 2000);
  };

  const handleEndCall = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setCallState('idle');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-cyan-500/70 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] text-slate-100">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/40">
              <Bot className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                AI Voice Dispatch & Appointment Agent
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              </h2>
              <p className="text-xs text-slate-400">Automated Human Voice Calls & Appointment Scheduling for Deaf Riders</p>
            </div>
          </div>
          <button
            onClick={() => { handleEndCall(); onClose(); }}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scenario Selection Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {Object.keys(SCENARIOS).map((key) => (
            <button
              key={key}
              onClick={() => { setActiveScenario(key); setCallState('idle'); }}
              className={`p-3 rounded-2xl text-xs font-bold transition text-left border ${activeScenario === key
                ? 'bg-cyan-500 text-slate-950 border-white shadow-lg font-extrabold'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
            >
              <span className="block font-mono text-[10px] opacity-75 uppercase">{SCENARIOS[key].badge}</span>
              <span className="truncate block mt-0.5">{SCENARIOS[key].title}</span>
            </button>
          ))}
        </div>

        {/* ACTIVE CALL SIMULATOR SCREEN */}
        <div className="glass-panel rounded-3xl p-6 border-2 border-slate-800 bg-slate-950 text-center space-y-6">

          {/* Phone Call Status Avatar */}
          <div className="relative inline-block">
            <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center border-4 transition-all ${callState === 'connected'
              ? 'bg-cyan-500/20 border-cyan-400 shadow-2xl shadow-cyan-400/50 scale-105'
              : callState === 'calling'
                ? 'bg-amber-500/20 border-amber-400 animate-pulse'
                : 'bg-slate-900 border-slate-700'
              }`}>
              <PhoneCall className={`w-10 h-10 ${callState === 'connected' ? 'text-cyan-300 animate-bounce' : callState === 'calling' ? 'text-amber-400' : 'text-slate-400'
                }`} />
            </div>

            {/* Audio Waveform Animation during active speech */}
            {isSpeaking && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-500 text-cyan-300 text-xs">
                <span className="w-1.5 h-3 bg-cyan-400 rounded-full animate-wave-bar" />
                <span className="w-1.5 h-5 bg-cyan-300 rounded-full animate-wave-bar" style={{ animationDelay: '0.2s' }} />
                <span className="w-1.5 h-4 bg-cyan-400 rounded-full animate-wave-bar" style={{ animationDelay: '0.4s' }} />
                <span className="text-[10px] font-bold ml-1 uppercase">AI Speaking</span>
              </div>
            )}
          </div>

          <div>
            <span className="text-xs uppercase font-mono font-bold text-slate-400 block">Outbound Voice Call Target</span>
            <h3 className="text-xl font-bold text-white mt-1">{order.customerName} ({order.customerPhone})</h3>
            <p className="text-xs text-cyan-400 font-semibold mt-0.5">{currentScenarioObj.title}</p>
          </div>

          {/* Appointment Slot Selector (if scenario is appointment) */}
          {activeScenario === 'appointment' && callState === 'idle' && (
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-left space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" /> Select Preferred Appointment Slot:
              </label>
              <select
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-cyan-300 focus:outline-none"
              >
                <option value="5 mins (Immediate)">In 5 Minutes (Immediate Arrival)</option>
                <option value="15 mins (12:30 PM)">In 15 Minutes (12:30 PM)</option>
                <option value="30 mins (12:45 PM)">In 30 Minutes (12:45 PM)</option>
                <option value="Custom Time Slot">Custom Requested Time Slot</option>
              </select>
            </div>
          )}

          {/* CALL ACTION BUTTONS */}
          <div className="flex items-center justify-center gap-4 pt-2">
            {callState === 'idle' && (
              <button
                onClick={() => startAICall(activeScenario)}
                className="w-full py-4 bg-gradient-to-r from-cyan-400 via-cyan-500 to-emerald-400 text-slate-950 font-extrabold rounded-2xl shadow-xl hover:scale-105 transition flex items-center justify-center gap-3 text-sm"
              >
                <PhoneCall className="w-5 h-5 text-slate-950" />
                <span>{currentScenarioObj.btnText}</span>
              </button>
            )}

            {(callState === 'calling' || callState === 'connected') && (
              <button
                onClick={handleEndCall}
                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-extrabold rounded-2xl shadow-xl transition flex items-center justify-center gap-2 text-sm"
              >
                <PhoneOff className="w-5 h-5" />
                <span>End AI Voice Call</span>
              </button>
            )}

            {callState === 'completed' && (
              <div className="w-full space-y-3">
                <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-2xl text-emerald-200 text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Call Successfully Completed! Customer Informed of 5-Min Arrival.</span>
                </div>
                <button
                  onClick={() => setCallState('idle')}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs"
                >
                  Make Another Voice Call / Appointment
                </button>
              </div>
            )}
          </div>

          {/* Live Call Transcript Box */}
          {callTranscript.length > 0 && (
            <div className="text-left bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2 max-h-[140px] overflow-y-auto">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Live Call Dialogue Transcript</span>
              {callTranscript.map((t, idx) => (
                <div key={idx} className="text-xs text-slate-300 font-mono leading-relaxed">
                  {t.text}
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
