// Nearby Riders Registry for Dynamic Order Transfers & Re-dispatch
// Tracks nearby Deaf/Hard-of-Hearing & specialist couriers with live telemetry

export const NEARBY_RIDERS = [
  {
    id: "USR-101",
    name: "Alex Rivera",
    email: "alex.rivera@signshift.io",
    phone: "+1 (555) 019-2831",
    role: "rider",
    isDeafMute: true,
    vehicle: "Electric Delivery Bike",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: "4.98 ⭐",
    deliveriesCount: "1,420+",
    distanceKm: 0.1,
    distanceStr: "0.1 km away",
    etaMinutes: 1,
    etaStr: "1 min away",
    battery: 88,
    status: "active",
    badge: "Deaf / Non-Verbal Pro"
  },
  {
    id: "USR-105",
    name: "Jordan Lee",
    email: "jordan.lee@signshift.io",
    phone: "+1 (555) 301-4422",
    role: "rider",
    isDeafMute: true,
    vehicle: "Cyber E-Scooter Pro",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: "4.95 ⭐",
    deliveriesCount: "980+",
    distanceKm: 0.4,
    distanceStr: "0.4 km away",
    etaMinutes: 2,
    etaStr: "2 mins away",
    battery: 94,
    status: "available",
    badge: "Deaf Partner Specialist"
  },
  {
    id: "USR-106",
    name: "Maya Chen",
    email: "maya.chen@signshift.io",
    phone: "+1 (555) 712-9988",
    role: "rider",
    isDeafMute: true,
    vehicle: "Cargo E-Bike Sprint",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    rating: "4.99 ⭐",
    deliveriesCount: "1,650+",
    distanceKm: 0.7,
    distanceStr: "0.7 km away",
    etaMinutes: 4,
    etaStr: "4 mins away",
    battery: 91,
    status: "available",
    badge: "Top Rated Sign Pro"
  },
  {
    id: "USR-107",
    name: "Carlos Santana",
    email: "carlos.santana@signshift.io",
    phone: "+1 (555) 449-1123",
    role: "rider",
    isDeafMute: false,
    vehicle: "Solar E-Moped 500",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rating: "4.92 ⭐",
    deliveriesCount: "820+",
    distanceKm: 1.1,
    distanceStr: "1.1 km away",
    etaMinutes: 5,
    etaStr: "5 mins away",
    battery: 78,
    status: "available",
    badge: "Fast Dispatch Courier"
  },
  {
    id: "USR-108",
    name: "Samira Patel",
    email: "samira.patel@signshift.io",
    phone: "+1 (555) 553-7721",
    role: "rider",
    isDeafMute: true,
    vehicle: "Hybrid Aero Bike",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    rating: "4.97 ⭐",
    deliveriesCount: "1,120+",
    distanceKm: 1.5,
    distanceStr: "1.5 km away",
    etaMinutes: 7,
    etaStr: "7 mins away",
    battery: 84,
    status: "available",
    badge: "Sign Certified Courier"
  }
];

export const TRANSFER_REASONS = {
  rider: [
    { id: "battery", label: "🔋 E-Bike Battery Depleted (<15%)" },
    { id: "breakdown", label: "🚲 Mechanical Issue / Puncture" },
    { id: "traffic", label: "🚦 Severe Traffic Stall Ahead" },
    { id: "emergency", label: "🚨 Accessibility / Personal Emergency" },
    { id: "handoff", label: "🤝 Optimized Proximity Handoff" }
  ],
  merchant: [
    { id: "closer", label: "⚡ Faster Pickup by Closer Courier" },
    { id: "prep_ready", label: "🍳 Food Fresh Out of Oven - Needs Immediate Pickup" },
    { id: "rider_request", label: "📞 Rider Requested Re-dispatch" },
    { id: "capacity", label: "📦 Cargo Volume Reassignment" }
  ],
  admin: [
    { id: "dispatch_opt", label: "🧭 Dispatch Daemon Proximity Optimization" },
    { id: "sla_protect", label: "⏱️ Delivery SLA Protection (<15m Remaining)" },
    { id: "safety_override", label: "🛡️ Rider Safety / Emergency Override" },
    { id: "manual", label: "👤 Customer Support Manual Reassignment" }
  ]
};
