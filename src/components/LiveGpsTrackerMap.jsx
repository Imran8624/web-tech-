import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Navigation, 
  MapPin, 
  Compass, 
  Crosshair, 
  Radio, 
  RotateCcw, 
  Play, 
  Pause, 
  FastForward, 
  Gauge, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  Locate,
  Layers,
  Sparkles,
  Maximize2
} from 'lucide-react';

export const LiveGpsTrackerMap = ({ isRiderView = true, compact = false }) => {
  const { 
    order, 
    riderGps, 
    toggleRealDeviceGps, 
    toggleGpsSimulation, 
    setGpsSimSpeed, 
    resetGpsTrack, 
    setRiderGpsPosition,
    triggerVisualAlert
  } = useApp();

  const [followRider, setFollowRider] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showBreadcrumbs, setShowBreadcrumbs] = useState(true);
  const [mapFeedback, setMapFeedback] = useState('');
  const mapContainerRef = useRef(null);

  // Map Bounds for San Francisco / Metro delivery grid
  // Standard bounding box covering the restaurants and customer addresses
  const MAP_BOUNDS = {
    minLat: 37.7550,
    maxLat: 37.7950,
    minLng: -122.4550,
    maxLng: -122.3900
  };

  // Convert GPS Coordinates (lat, lng) to SVG / Canvas percentage coordinates (0% to 100%)
  const gpsToPercent = (lat, lng) => {
    const latSpan = MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat;
    const lngSpan = MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng;

    // Invert lat because higher lat is North (top of map)
    const yPercent = ((MAP_BOUNDS.maxLat - lat) / latSpan) * 100;
    const xPercent = ((lng - MAP_BOUNDS.minLng) / lngSpan) * 100;

    return {
      x: Math.max(5, Math.min(95, xPercent)),
      y: Math.max(5, Math.min(95, yPercent))
    };
  };

  // Safe fallback coordinates
  const merchantCoords = order.merchantCoords || { lat: 37.78917, lng: -122.40145 };
  const customerCoords = order.customerCoords || { lat: 37.77490, lng: -122.41940 };
  const currentRiderPos = riderGps || { lat: 37.78200, lng: -122.41050, heading: 45, speedKmh: 24.2, accuracy: 4 };

  const merchantPercent = gpsToPercent(merchantCoords.lat, merchantCoords.lng);
  const customerPercent = gpsToPercent(customerCoords.lat, customerCoords.lng);
  const riderPercent = gpsToPercent(currentRiderPos.lat, currentRiderPos.lng);

  // Generate SVG path connecting track waypoints
  const waypoints = riderGps?.routeWaypoints || [
    merchantCoords,
    { lat: 37.78650, lng: -122.40520 },
    { lat: 37.78390, lng: -122.40950 },
    { lat: 37.78010, lng: -122.41480 },
    { lat: 37.77680, lng: -122.41720 },
    customerCoords
  ];

  const svgPathPoints = waypoints.map(pt => {
    const p = gpsToPercent(pt.lat, pt.lng);
    return `${p.x},${p.y}`;
  }).join(' L ');

  const fullSvgPathD = `M ${svgPathPoints}`;

  // Handle click on map to move rider or set custom GPS waypoint
  const handleMapClick = (e) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xPercent = (clickX / rect.width);
    const yPercent = (clickY / rect.height);

    const latSpan = MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat;
    const lngSpan = MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng;

    const clickedLat = MAP_BOUNDS.maxLat - (yPercent * latSpan);
    const clickedLng = MAP_BOUNDS.minLng + (xPercent * lngSpan);

    if (setRiderGpsPosition) {
      setRiderGpsPosition(clickedLat, clickedLng);
      triggerVisualAlert('cyan');
      setMapFeedback(`GPS Target Repositioned: ${clickedLat.toFixed(5)}°N, ${Math.abs(clickedLng).toFixed(5)}°W`);
      setTimeout(() => setMapFeedback(''), 3500);
    }
  };

  return (
    <div className={`relative glass-panel rounded-3xl overflow-hidden border-2 border-cyan-500/40 bg-slate-950 shadow-2xl flex flex-col ${compact ? 'min-h-[280px]' : 'min-h-[380px]'}`}>
      
      {/* MAP TOP COCKPIT HUD BAR */}
      <div className="p-3.5 bg-slate-900/90 backdrop-blur border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 z-20">
        
        {/* Left: Status & Turn-by-Turn Instruction */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${riderGps?.isLiveDevice ? 'bg-emerald-400' : 'bg-cyan-400'} animate-ping`} />
            <span className="text-xs font-black text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>{riderGps?.isLiveDevice ? 'Hardware GPS Active' : 'Live Route Track'}</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-cyan-400 font-bold">ETA:</span>
            <span className="text-white font-mono font-extrabold">{riderGps?.eta || order.deliveryEta || '6 mins'}</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-mono font-bold">{riderGps?.distanceRemaining || '1.4 km'} Remaining</span>
          </div>
        </div>

        {/* Right: GPS Telemetry & Mode Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Live Device Hardware GPS Toggle */}
          <button
            onClick={() => {
              toggleRealDeviceGps();
              triggerVisualAlert('cyan');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 border shadow ${
              riderGps?.isLiveDevice
                ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-extrabold shadow-emerald-500/30'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white hover:border-cyan-500'
            }`}
            title="Toggle Real GPS Geolocation using device sensor"
          >
            <Radio className={`w-3.5 h-3.5 ${riderGps?.isLiveDevice ? 'animate-pulse text-slate-950' : 'text-emerald-400'}`} />
            <span>{riderGps?.isLiveDevice ? '📡 Real GPS ON' : '📡 Use Real GPS'}</span>
          </button>

          {/* Auto Simulation Follow Track Toggle */}
          <button
            onClick={() => {
              toggleGpsSimulation();
              triggerVisualAlert('gold');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 border shadow ${
              riderGps?.isSimulating
                ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-extrabold shadow-cyan-500/30'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white hover:border-cyan-500'
            }`}
            title="Play / Pause simulated track following animation"
          >
            {riderGps?.isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{riderGps?.isSimulating ? 'Pause Track' : 'Follow Track'}</span>
          </button>

          {/* Sim Speed Toggle (1x, 2x, 4x) */}
          <button
            onClick={() => {
              const next = riderGps?.simSpeed === 1 ? 2 : riderGps?.simSpeed === 2 ? 4 : 1;
              setGpsSimSpeed(next);
            }}
            className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800 rounded-xl text-xs font-mono font-bold"
            title="Simulation Speed Multiplier"
          >
            {riderGps?.simSpeed || 1}x
          </button>

          {/* Reset Track Button */}
          <button
            onClick={() => {
              resetGpsTrack();
              triggerVisualAlert('cyan');
            }}
            className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 rounded-xl transition"
            title="Reset track to origin"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* FEEDBACK BANNER */}
      {mapFeedback && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 bg-cyan-950/90 border border-cyan-400 text-cyan-200 text-xs font-bold rounded-full shadow-2xl flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>{mapFeedback}</span>
        </div>
      )}

      {/* GPS ERROR WARNING IF ANY */}
      {riderGps?.errorMsg && (
        <div className="absolute top-16 left-4 right-4 z-30 p-2.5 bg-amber-950/90 border border-amber-500/80 text-amber-200 text-xs font-bold rounded-xl flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{riderGps.errorMsg} (Using simulated GPS route track)</span>
          </div>
          <button
            onClick={() => toggleRealDeviceGps()}
            className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] rounded font-black uppercase"
          >
            Retry
          </button>
        </div>
      )}

      {/* INTERACTIVE MAP CANVAS CONTAINER */}
      <div 
        ref={mapContainerRef}
        onClick={handleMapClick}
        className="relative flex-1 w-full bg-slate-950 cursor-crosshair overflow-hidden select-none"
        style={{ minHeight: compact ? '220px' : '300px' }}
      >
        {/* Background Cyber-Grid Pattern */}
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Vector City Urban Grid Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          <defs>
            <pattern id="urbanGrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#334155" strokeWidth="0.75" />
              <circle cx="40" cy="40" r="1.5" fill="#475569" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#urbanGrid)" />
          
          {/* Fictional River / Waterway contour */}
          <path 
            d="M 0,260 Q 200,240 400,280 T 800,290" 
            fill="none" 
            stroke="#082f49" 
            strokeWidth="24" 
            className="opacity-50"
          />
          {/* Main Boulevards */}
          <path d="M 0,140 L 900,160" fill="none" stroke="#1e293b" strokeWidth="6" />
          <path d="M 280,0 L 320,600" fill="none" stroke="#1e293b" strokeWidth="6" />
        </svg>

        {/* SVG LIVE ROUTE TRACK PATH */}
        <svg 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none" 
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        >
          {/* Base Track Line (Outer Glow) */}
          <path 
            d={fullSvgPathD} 
            fill="none" 
            stroke="#06b6d4" 
            strokeWidth="3.5" 
            strokeOpacity="0.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active Navigation Track Line (Dashed Pulse) */}
          <path 
            d={fullSvgPathD} 
            fill="none" 
            stroke="#22d3ee" 
            strokeWidth="1.8" 
            strokeDasharray="2,2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
          />

          {/* Completed Track Segment (from merchant to current rider position) */}
          <path 
            d={`M ${merchantPercent.x},${merchantPercent.y} L ${riderPercent.x},${riderPercent.y}`}
            fill="none" 
            stroke="#10b981" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>

        {/* BREADCRUMB TRAIL GPS POINTS */}
        {showBreadcrumbs && riderGps?.breadcrumbs?.map((crumb, idx) => {
          const crumbPos = gpsToPercent(crumb.lat, crumb.lng);
          return (
            <div
              key={idx}
              className="absolute w-2 h-2 rounded-full bg-cyan-400/80 -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-sm shadow-cyan-400"
              style={{ left: `${crumbPos.x}%`, top: `${crumbPos.y}%` }}
              title={`GPS Ping: ${crumb.time}`}
            />
          );
        })}

        {/* 🏬 MERCHANT ORIGIN PIN */}
        <div 
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-transform hover:scale-110"
          style={{ left: `${merchantPercent.x}%`, top: `${merchantPercent.y}%` }}
        >
          <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg shadow-amber-500/50 border-2 border-white">
            🏬
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-950/90 text-amber-300 px-2 py-0.5 rounded-full border border-amber-600/80 mt-1 shadow-md whitespace-nowrap">
            {order.merchantName || 'Restaurant'}
          </span>
        </div>

        {/* 📍 CUSTOMER DESTINATION PIN */}
        <div 
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-transform hover:scale-110"
          style={{ left: `${customerPercent.x}%`, top: `${customerPercent.y}%` }}
        >
          {/* Destination Pulsing Radar Beacon */}
          <div className="absolute w-12 h-12 rounded-full bg-emerald-400/20 animate-ping pointer-events-none" />
          
          <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg shadow-emerald-500/50 border-2 border-white relative z-10">
            📍
          </div>
          <div className="flex flex-col items-center mt-1">
            <span className="text-[10px] font-mono font-extrabold bg-slate-950/90 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-600/80 shadow-md whitespace-nowrap">
              {order.customerName || 'Drop-off'}
            </span>
            {order.gateCode && (
              <span className="text-[9px] font-mono font-black text-amber-400 bg-black/80 px-1.5 py-0.2 rounded mt-0.5 border border-amber-500/40">
                Gate: {order.gateCode}
              </span>
            )}
          </div>
        </div>

        {/* 🏍️ RIDER LIVE GPS POSITION VEHICLE MARKER */}
        <div 
          className="absolute z-30 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-300"
          style={{ left: `${riderPercent.x}%`, top: `${riderPercent.y}%` }}
        >
          {/* GPS Accuracy Radius Aura */}
          <div 
            className="absolute rounded-full border border-cyan-400/60 bg-cyan-500/10 pointer-events-none animate-pulse"
            style={{ 
              width: `${Math.max(36, Math.min(80, (currentRiderPos.accuracy || 4) * 6))}px`, 
              height: `${Math.max(36, Math.min(80, (currentRiderPos.accuracy || 4) * 6))}px` 
            }}
          />

          {/* Heading Orientation Arrow */}
          <div 
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 text-slate-950 font-black text-base flex items-center justify-center shadow-2xl shadow-cyan-500/80 border-2 border-white relative cursor-pointer"
            style={{ transform: `rotate(${currentRiderPos.heading || 0}deg)` }}
          >
            <span className="transform -rotate-45 block">🏍️</span>
            {/* Direction pointer needle */}
            <div className="absolute -top-1 w-2 h-2 bg-white rotate-45 rounded-xs" />
          </div>

          {/* Vehicle Label & Speed Badge */}
          <div className="mt-1 flex items-center gap-1">
            <span className="text-[10px] font-mono font-black bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-700 shadow-lg whitespace-nowrap">
              Alex (Rider 🤟)
            </span>
            <span className="text-[10px] font-mono font-black bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-800 shadow-lg">
              {currentRiderPos.speedKmh?.toFixed(1) || '24.2'} km/h
            </span>
          </div>
        </div>

        {/* TURN-BY-TURN HUD FLOATING WIDGET (Top Left) */}
        <div className="absolute top-3 left-3 z-20 p-2.5 bg-slate-900/90 backdrop-blur rounded-2xl border border-slate-700 shadow-xl max-w-xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300">
            <Navigation className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>Next Maneuver:</span>
          </div>
          <p className="text-xs font-bold text-white leading-tight">
            {riderGps?.turnInstruction || 'In 180m, turn right onto Mission St towards customer gate'}
          </p>
          <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-800">
            <span>Accuracy: <strong className="text-emerald-400">±{currentRiderPos.accuracy || 4}m</strong></span>
            <span>Compass: <strong className="text-cyan-400">{currentRiderPos.heading || 45}° NE</strong></span>
          </div>
        </div>

        {/* LIVE GPS COORDINATES READOUT OVERLAY (Bottom Left) */}
        <div className="absolute bottom-3 left-3 z-20 p-2 bg-slate-900/90 backdrop-blur rounded-xl border border-slate-800 text-[10px] font-mono text-slate-300 space-y-0.5 shadow-lg">
          <div className="text-cyan-400 font-bold flex items-center gap-1">
            <Locate className="w-3 h-3" />
            <span>GPS Fix: {currentRiderPos.lat?.toFixed(5)}°N, {Math.abs(currentRiderPos.lng || 122.41)?.toFixed(5)}°W</span>
          </div>
          <div className="text-slate-400 flex items-center justify-between gap-3">
            <span>Altitude: {currentRiderPos.altitude || 18.5}m</span>
            <span>Progress: {riderGps?.progressPercent || 45}% along route</span>
          </div>
        </div>

        {/* MAP CONTROLS OVERLAY (Bottom Right) */}
        <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1.5">
          <button
            onClick={() => setFollowRider(!followRider)}
            className={`p-2 rounded-xl border text-xs font-bold transition flex items-center justify-center shadow-lg ${
              followRider 
                ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-black' 
                : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title="Auto-follow rider position"
          >
            <Crosshair className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowBreadcrumbs(!showBreadcrumbs)}
            className={`p-2 rounded-xl border text-xs font-bold transition flex items-center justify-center shadow-lg ${
              showBreadcrumbs 
                ? 'bg-slate-900 text-cyan-300 border-cyan-500' 
                : 'bg-slate-900/90 text-slate-500 border-slate-700'
            }`}
            title="Toggle GPS breadcrumb points"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* MAP BOTTOM TELEMETRY FOOTER */}
      <div className="p-3 bg-slate-900/90 backdrop-blur border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-2 z-20">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold">● GPS Tracking Connected</span>
          <span>•</span>
          <span>Galileo / GLONASS / GPS Multi-Band</span>
        </div>
        <div className="text-slate-400 text-[11px]">
          Tip: <strong className="text-cyan-300">Click anywhere on the map</strong> to navigate rider or test route waypoint tracking!
        </div>
      </div>

    </div>
  );
};
