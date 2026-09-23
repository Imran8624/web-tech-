import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const AppContext = createContext(null);

export const DEFAULT_USERS = [
  {
    id: "USR-101",
    name: "Alex Rivera",
    email: "alex.rivera@signshift.io",
    password: "rider123",
    phone: "+1 (555) 019-2831",
    role: "rider",
    isDeafMute: true,
    vehicle: "Electric Delivery Bike",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: "4.98 ⭐",
    deliveriesCount: "1,420+",
    createdAt: "2026-01-15"
  },
  {
    id: "USR-102",
    name: "Sarah Jenkins",
    email: "user@example.com",
    password: "user123",
    phone: "+1 (555) 234-5678",
    role: "customer",
    isDeafMute: false,
    address: "742 Evergreen Terrace, Apt 4B",
    gateCode: "4022",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-02-10"
  },
  {
    id: "USR-103",
    name: "Aroma Bistro Manager",
    email: "merchant@signshift.io",
    password: "merchant123",
    phone: "+1 (555) 888-9999",
    role: "merchant",
    isDeafMute: false,
    restaurantName: "Aroma Bistro & Grill",
    address: "108 Market Street",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-03-01"
  },
  {
    id: "USR-104",
    name: "SignShift Administrator",
    email: "admin@signshift.io",
    password: "admin123",
    phone: "+1 (555) 999-0000",
    role: "admin",
    isDeafMute: false,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-01-01"
  }
];

export const DEFAULT_RESTAURANTS = [
  {
    id: "REST-1",
    name: "Aroma Bistro & Grill",
    address: "108 Market Street",
    cuisine: "Modern Fusion",
    coords: { lat: 37.78917, lng: -122.40145 },
    items: [
      { name: "Crispy Salmon Bowl", qty: 1, notes: "No onions", price: "$18.50" },
      { name: "Iced Matcha Latte", qty: 2, notes: "Oat milk", price: "$6.00" },
      { name: "Truffle Fries", qty: 1, notes: "Extra dip", price: "$10.00" }
    ],
    totalAmount: "$34.50",
    pickupEta: "5 mins",
    deliveryEta: "18 mins",
    distance: "2.4 miles"
  },
  {
    id: "REST-2",
    name: "Tokyo Sushi & Ramen Express",
    address: "450 Sakura Avenue, Suite 10",
    cuisine: "Japanese",
    coords: { lat: 37.78520, lng: -122.42900 },
    items: [
      { name: "Tonkotsu Black Garlic Ramen", qty: 2, notes: "Extra chashu", price: "$17.50" },
      { name: "Spicy Tuna Roll (8pcs)", qty: 1, notes: "Wasabi on side", price: "$14.00" },
      { name: "Green Tea Mochi", qty: 1, notes: "", price: "$5.20" }
    ],
    totalAmount: "$48.20",
    pickupEta: "8 mins",
    deliveryEta: "22 mins",
    distance: "3.8 miles"
  },
  {
    id: "REST-3",
    name: "Taco Fiesta & Cantina",
    address: "882 Mission Blvd",
    cuisine: "Mexican",
    coords: { lat: 37.76010, lng: -122.41900 },
    items: [
      { name: "Birria Quesatacos Trio", qty: 2, notes: "Extra consommé", price: "$12.00" },
      { name: "Fresh Guacamole & Chips", qty: 1, notes: "Mild salsa", price: "$8.50" },
      { name: "Horchata Drink", qty: 2, notes: "", price: "$4.65" }
    ],
    totalAmount: "$29.80",
    pickupEta: "4 mins",
    deliveryEta: "14 mins",
    distance: "1.9 miles"
  },
  {
    id: "REST-4",
    name: "Green Leaf Organic Salads",
    address: "210 Eco Way",
    cuisine: "Organic Healthy",
    coords: { lat: 37.77120, lng: -122.43500 },
    items: [
      { name: "Mediterranean Quinoa Bowl", qty: 1, notes: "Dressing on side", price: "$14.50" },
      { name: "Cold-Pressed Citrus Juice", qty: 1, notes: "", price: "$7.00" }
    ],
    totalAmount: "$21.50",
    pickupEta: "3 mins",
    deliveryEta: "12 mins",
    distance: "1.2 miles"
  }
];

export const DEFAULT_ADDRESSES = [
  {
    id: "ADDR-1",
    address: "742 Evergreen Terrace, Apt 4B",
    gateCode: "4022",
    coords: { lat: 37.77490, lng: -122.41940 },
    label: "Home (Apt 4B)",
    notes: "Leave parcel outside front door and ring bell"
  },
  {
    id: "ADDR-2",
    address: "100 Innovation Way, 3rd Floor Tech Hub",
    gateCode: "9081",
    coords: { lat: 37.78310, lng: -122.39200 },
    label: "Office / Work Building",
    notes: "Leave with 3rd floor receptionist"
  },
  {
    id: "ADDR-3",
    address: "550 Oakwood Park Dr, West Gate Entrance",
    gateCode: "1234",
    coords: { lat: 37.76800, lng: -122.44800 },
    label: "Parents' Residence",
    notes: "Call intercom unit 12"
  }
];

// Helper to generate route waypoints
export const generateRouteWaypoints = (start, end) => {
  const points = [];
  const steps = 8;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const jitterLat = i > 0 && i < steps ? (Math.sin(i * 1.5) * 0.0018) : 0;
    const jitterLng = i > 0 && i < steps ? (Math.cos(i * 1.5) * 0.0022) : 0;
    points.push({
      lat: start.lat + (end.lat - start.lat) * t + jitterLat,
      lng: start.lng + (end.lng - start.lng) * t + jitterLng
    });
  }
  return points;
};

export const INITIAL_RIDER_GPS = {
  lat: 37.78450,
  lng: -122.40950,
  accuracy: 4, // in meters
  heading: 48, // in degrees
  speedKmh: 24.5,
  altitude: 16.2,
  isLiveDevice: false,
  isTrackingActive: true,
  isSimulating: true,
  simSpeed: 1,
  progressPercent: 42,
  turnInstruction: "In 180m, turn right onto Mission St towards customer gate",
  distanceRemaining: "1.4 km",
  eta: "5 mins",
  breadcrumbs: [
    { lat: 37.78917, lng: -122.40145, time: "12:10 PM" },
    { lat: 37.78740, lng: -122.40480, time: "12:12 PM" },
    { lat: 37.78580, lng: -122.40720, time: "12:14 PM" },
    { lat: 37.78450, lng: -122.40950, time: "12:16 PM" }
  ],
  routeWaypoints: [
    { lat: 37.78917, lng: -122.40145 },
    { lat: 37.78650, lng: -122.40520 },
    { lat: 37.78390, lng: -122.40950 },
    { lat: 37.78010, lng: -122.41480 },
    { lat: 37.77680, lng: -122.41720 },
    { lat: 37.77490, lng: -122.41940 }
  ],
  errorMsg: "",
  lastUpdated: "Just Now"
};

export const initialOrderState = {
  id: "ORD-9482",
  customerName: "Sarah Jenkins",
  customerPhone: "+1 (555) 234-5678",
  customerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  customerAddress: DEFAULT_ADDRESSES[0].address,
  customerCoords: DEFAULT_ADDRESSES[0].coords,
  gateCode: DEFAULT_ADDRESSES[0].gateCode,
  merchantName: DEFAULT_RESTAURANTS[0].name,
  merchantAddress: DEFAULT_RESTAURANTS[0].address,
  merchantCoords: DEFAULT_RESTAURANTS[0].coords,
  orderItems: DEFAULT_RESTAURANTS[0].items,
  totalAmount: DEFAULT_RESTAURANTS[0].totalAmount,
  status: "pickup", // 'pickup' | 'en_route' | 'arrived' | 'delivered'
  pickupEta: DEFAULT_RESTAURANTS[0].pickupEta,
  deliveryEta: DEFAULT_RESTAURANTS[0].deliveryEta,
  distance: DEFAULT_RESTAURANTS[0].distance,
  riderInfo: {
    name: "Alex Rivera",
    rating: "4.98 ⭐",
    deliveriesCount: "1,420+",
    isDeafMute: true,
    badges: ["Deaf / Non-Verbal Partner", "Top Delivery Pro", "SignShift Certified"]
  },
  chatMessages: [
    {
      id: 1,
      sender: "system",
      text: "Real-Time Sign & Visual Assist is ACTIVE for this delivery. Rider Alex uses SignShift visual bridge.",
      timestamp: "12:14 PM"
    },
    {
      id: 2,
      sender: "customer",
      text: "Hi Alex! Please leave the food at the front door and ring the bell. Gate code is 4022.",
      signKeywords: ["leave", "door", "gate", "code"],
      timestamp: "12:15 PM"
    }
  ]
};

export const DEFAULT_ACTIVITY_LOGS = [
  {
    id: "ACT-1001",
    timestamp: "12:15:30 PM",
    category: "COMMUNICATION",
    action: "Customer Message Dispatched",
    details: "Sarah Jenkins: 'Hi Alex! Please leave the food at the front door...'",
    actor: "Sarah Jenkins (Customer)",
    status: "SUCCESS"
  },
  {
    id: "ACT-1002",
    timestamp: "12:14:10 PM",
    category: "ALERT",
    action: "Accessibility Visual Alert Triggered",
    details: "High-contrast cyan flash & dual haptic pulse sent to rider device",
    actor: "System Bridge",
    status: "INFO"
  },
  {
    id: "ACT-1003",
    timestamp: "12:12:00 PM",
    category: "ORDER",
    action: "Order Milestone Updated",
    details: "Order #ORD-9482 status set to 'PICKUP' at Aroma Bistro & Grill",
    actor: "Alex Rivera (Rider)",
    status: "SUCCESS"
  },
  {
    id: "ACT-1004",
    timestamp: "12:10:45 PM",
    category: "AUTH",
    action: "Rider Sign Passcode Verified",
    details: "Alex Rivera signed in via 3-gesture biometric sign passcode",
    actor: "Alex Rivera (Rider)",
    status: "SUCCESS"
  },
  {
    id: "ACT-1005",
    timestamp: "12:00:00 PM",
    category: "DATABASE",
    action: "Database Initialized",
    details: "Loaded 4 user credentials, 4 restaurants, 3 delivery addresses",
    actor: "Admin Security Daemon",
    status: "INFO"
  }
];

export const DEFAULT_NOTIFICATIONS = [
  {
    id: "NOTIF-101",
    targetRole: "merchant",
    title: "🔔 New Order Appeared in Kitchen!",
    message: "Order #ORD-9482 from Sarah Jenkins ($34.50) received. Ticket generated.",
    type: "order_appear",
    timestamp: "12:10 PM",
    isRead: false,
    icon: "Store"
  },
  {
    id: "NOTIF-102",
    targetRole: "rider",
    title: "📍 New Pickup Assigned",
    message: "Collect order #ORD-9482 at Aroma Bistro & Grill (108 Market St).",
    type: "rider_pickup",
    timestamp: "12:12 PM",
    isRead: false,
    icon: "Navigation"
  },
  {
    id: "NOTIF-103",
    targetRole: "rider",
    title: "🍳 Order is Ready for Pickup!",
    message: "Aroma Bistro & Grill marked order #ORD-9482 as READY on counter.",
    type: "order_ready",
    timestamp: "12:14 PM",
    isRead: false,
    icon: "CheckCircle2"
  },
  {
    id: "NOTIF-104",
    targetRole: "customer",
    title: "🚴 Rider En Route to You!",
    message: "Alex Rivera picked up your meal and is on the way to 742 Evergreen Terrace.",
    type: "rider_pickup",
    timestamp: "12:16 PM",
    isRead: false,
    icon: "Package"
  },
  {
    id: "NOTIF-105",
    targetRole: "customer",
    title: "🚪 Rider Arrived at Drop-off!",
    message: "Alex Rivera is outside your building. Gate code: 4022.",
    type: "rider_drop",
    timestamp: "12:28 PM",
    isRead: false,
    icon: "MapPin"
  }
];

// Web Audio API Synthesizer for instant notification chimes
const playNotificationChime = (type = 'bell') => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'order_appear') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880.00, now + 0.12); // A5
      osc.frequency.setValueAtTime(1174.66, now + 0.24); // D6
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'order_ready') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(783.99, now + 0.14); // G5
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'rider_drop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.setValueAtTime(523.25, now + 0.2); // C5
      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.start(now);
      osc.stop(now + 0.7);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.setValueAtTime(880.00, now + 0.15);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch (e) {
    // Autoplay restrictions handled gracefully
  }
};

// Helper for LocalStorage
const loadStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`LocalStorage error for ${key}:`, e);
    return fallback;
  }
};

const saveStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`LocalStorage save error for ${key}:`, e);
  }
};

export const AppProvider = ({ children }) => {
  // Navigation & Theme
  const [currentView, setCurrentView] = useState('login');
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState('normal');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [hapticAlerts, setHapticAlerts] = useState(true);
  const [flashAlerts, setFlashAlerts] = useState(true);
  const [screenFlash, setScreenFlash] = useState(null);

  // Persistent Databases
  const [usersList, setUsersList] = useState(() => loadStorage('signshift_users', DEFAULT_USERS));
  const [user, setUser] = useState(() => loadStorage('signshift_active_user', null));
  const [isAuthenticated, setIsAuthenticated] = useState(() => loadStorage('signshift_is_auth', false));
  const [savedAddresses, setSavedAddresses] = useState(() => loadStorage('signshift_addresses', DEFAULT_ADDRESSES));
  const [restaurantsList, setRestaurantsList] = useState(() => loadStorage('signshift_restaurants', DEFAULT_RESTAURANTS));
  const [order, setOrder] = useState(() => loadStorage('signshift_order', initialOrderState));
  const [activityLogs, setActivityLogs] = useState(() => loadStorage('signshift_activity_logs', DEFAULT_ACTIVITY_LOGS));
  const [notificationsList, setNotificationsList] = useState(() => loadStorage('signshift_notifications', DEFAULT_NOTIFICATIONS));
  const [latestToast, setLatestToast] = useState(null);
  const [riderGps, setRiderGps] = useState(() => loadStorage('signshift_rider_gps', INITIAL_RIDER_GPS));
  const geoWatchIdRef = useRef(null);

  const [isTranslating, setIsTranslating] = useState(false);
  const [signSpeed, setSignSpeed] = useState(1);
  const [avatarMode, setAvatarMode] = useState(() => loadStorage('signshift_avatar_mode', 'human'));

  // Save to LocalStorage on updates
  useEffect(() => { saveStorage('signshift_users', usersList); }, [usersList]);
  useEffect(() => { saveStorage('signshift_active_user', user); }, [user]);
  useEffect(() => { saveStorage('signshift_is_auth', isAuthenticated); }, [isAuthenticated]);
  useEffect(() => { saveStorage('signshift_addresses', savedAddresses); }, [savedAddresses]);
  useEffect(() => { saveStorage('signshift_restaurants', restaurantsList); }, [restaurantsList]);
  useEffect(() => { saveStorage('signshift_order', order); }, [order]);
  useEffect(() => { saveStorage('signshift_rider_gps', riderGps); }, [riderGps]);
  useEffect(() => { saveStorage('signshift_avatar_mode', avatarMode); }, [avatarMode]);
  useEffect(() => { saveStorage('signshift_activity_logs', activityLogs); }, [activityLogs]);
  useEffect(() => { saveStorage('signshift_notifications', notificationsList); }, [notificationsList]);

  // Log Activity Helper
  const logActivity = useCallback((action, category = 'SYSTEM', details = '', actor = 'System', status = 'INFO') => {
    const newLog = {
      id: `ACT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      category,
      action,
      details,
      actor,
      status
    };
    setActivityLogs(prev => [newLog, ...(prev || []).slice(0, 99)]);
  }, []);

  const clearActivityLogs = useCallback(() => {
    setActivityLogs([]);
    saveStorage('signshift_activity_logs', []);
  }, []);

  // Visual & Haptic Alert Helper
  const triggerVisualAlert = useCallback((type = 'cyan') => {
    if (flashAlerts) {
      setScreenFlash(type);
      setTimeout(() => setScreenFlash(null), 1200);
    }
    if (hapticAlerts && typeof window !== 'undefined' && 'navigator' in window && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(type === 'cyan' ? [150, 100, 150] : [300, 150, 300, 150, 400]);
      } catch (e) {
        console.log('Vibration not supported');
      }
    }
  }, [flashAlerts, hapticAlerts]);

  // Speech Synthesis Helper
  const speakText = useCallback((text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // --- AUTHENTICATION & USER MANAGEMENT --- //

  // Login function validating email and password
  const loginUser = useCallback((targetRole, targetName, targetEmail, targetPassword) => {
    // If credentials provided, validate against database
    if (targetEmail) {
      const match = usersList.find(u => u.email.toLowerCase() === targetEmail.toLowerCase());
      if (match) {
        if (targetPassword && match.password && match.password !== targetPassword) {
          logActivity("Failed Login Attempt", "AUTH", `Incorrect password for ${targetEmail}`, targetEmail, "WARNING");
          return { success: false, message: "Invalid password. Please check your credentials." };
        }
        setUser(match);
        setIsAuthenticated(true);
        const nextView = match.role === 'admin' ? 'admin' : match.role === 'rider' ? 'rider' : match.role === 'customer' ? 'customer' : 'merchant';
        setCurrentView(nextView);
        triggerVisualAlert('cyan');
        logActivity("User Login Successful", "AUTH", `Signed in as ${match.name} (${match.role.toUpperCase()})`, match.name, "SUCCESS");
        return { success: true, user: match };
      } else if (targetPassword) {
        logActivity("Failed Login Attempt", "AUTH", `Account not found: ${targetEmail}`, targetEmail, "WARNING");
        return { success: false, message: "Account not found with this email address." };
      }
    }

    // Fallback Quick Demo Login by Role
    const roleMatch = usersList.find(u => u.role === targetRole) || {
      id: `USR-${Date.now()}`,
      name: targetName || (targetRole === 'rider' ? 'Alex Rivera' : targetRole === 'customer' ? 'Sarah Jenkins' : targetRole === 'merchant' ? 'Aroma Bistro Manager' : 'SignShift Administrator'),
      email: targetEmail || `${targetRole}@signshift.io`,
      password: `${targetRole}123`,
      role: targetRole,
      isDeafMute: targetRole === 'rider'
    };

    setUser(roleMatch);
    setIsAuthenticated(true);
    setCurrentView(targetRole === 'admin' ? 'admin' : targetRole === 'rider' ? 'rider' : targetRole === 'customer' ? 'customer' : 'merchant');
    triggerVisualAlert('cyan');
    logActivity("Demo Quick Login", "AUTH", `Signed in as demo ${roleMatch.role.toUpperCase()}: ${roleMatch.name}`, roleMatch.name, "SUCCESS");
    return { success: true, user: roleMatch };
  }, [usersList, triggerVisualAlert, logActivity]);

  // Register function creating real user in Database
  const registerUser = useCallback((userData) => {
    const { name, email, password, phone, role, customAddress, gateCode, isDeafMute, avatar } = userData;

    // Check duplicate email
    const existing = usersList.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    if (existing) {
      logActivity("Registration Rejected", "AUTH", `Email already registered: ${email}`, name || "Guest", "WARNING");
      return { success: false, message: "An account with this email address already exists." };
    }

    const newUser = {
      id: `USR-${Date.now()}`,
      name: name || 'New User',
      email: email,
      password: password || 'password123',
      phone: phone || '+1 (555) 000-1111',
      role: role || 'customer',
      isDeafMute: isDeafMute !== undefined ? isDeafMute : role === 'rider',
      address: customAddress || '101 Main St',
      gateCode: gateCode || '1234',
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Add to persistent users list
    setUsersList(prev => [...prev, newUser]);
    setUser(newUser);
    setIsAuthenticated(true);

    // If custom address provided, add to address book and order
    if (customAddress) {
      const newAddrObj = {
        id: `ADDR-${Date.now()}`,
        address: customAddress,
        gateCode: gateCode || "1234",
        label: `Default (${name})`,
        notes: "Primary user registered address"
      };

      setSavedAddresses(prev => [newAddrObj, ...prev]);

      setOrder(prev => ({
        ...prev,
        customerName: name,
        customerPhone: phone || prev.customerPhone,
        customerAddress: customAddress,
        gateCode: gateCode || "1234",
        chatMessages: [
          ...prev.chatMessages,
          {
            id: Date.now(),
            sender: 'system',
            text: `New user account created: ${name} (${role.toUpperCase()}) with address: ${customAddress} (Gate Code: ${gateCode || "1234"}).`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      }));
    }

    triggerVisualAlert('cyan');
    logActivity("New Account Registered", "AUTH", `Created user ${newUser.name} [${newUser.role.toUpperCase()}], Email: ${newUser.email}`, newUser.name, "SUCCESS");
    setCurrentView(role === 'admin' ? 'admin' : role === 'rider' ? 'rider' : role === 'customer' ? 'customer' : 'merchant');
    return { success: true, user: newUser };
  }, [usersList, triggerVisualAlert, logActivity]);

  // Update existing user credentials/profile in Database
  const updateUserProfile = useCallback((userId, updatedFields) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, ...updatedFields } : u));

    setUser(prev => {
      if (prev && prev.id === userId) {
        return { ...prev, ...updatedFields };
      }
      return prev;
    });

    triggerVisualAlert('cyan');
    logActivity("Credential Profile Updated", "DATABASE", `Modified credentials for User ID: ${userId}`, "Admin", "INFO");
    return { success: true };
  }, [triggerVisualAlert, logActivity]);

  // Delete user from Database
  const deleteUser = useCallback((userId) => {
    setUsersList(prev => prev.filter(u => u.id !== userId));
    triggerVisualAlert('cyan');
    logActivity("Credential Record Deleted", "DATABASE", `Permanently removed user ID: ${userId}`, "Admin", "WARNING");
  }, [triggerVisualAlert, logActivity]);

  // Admin add new user
  const addUserByAdmin = useCallback((userData) => {
    const newUser = {
      id: `USR-${Date.now()}`,
      name: userData.name || 'New Admin User',
      email: userData.email,
      password: userData.password || 'user123',
      phone: userData.phone || '+1 (555) 123-4567',
      role: userData.role || 'customer',
      isDeafMute: !!userData.isDeafMute,
      address: userData.address || '100 Admin Way',
      gateCode: userData.gateCode || '0000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsersList(prev => [...prev, newUser]);
    triggerVisualAlert('cyan');
    logActivity("Admin Created Credential", "DATABASE", `Created account for ${newUser.name} (${newUser.email}, ${newUser.role.toUpperCase()})`, "Admin", "SUCCESS");
    return newUser;
  }, [triggerVisualAlert, logActivity]);

  // Logout User
  const logoutUser = useCallback(() => {
    const userName = user?.name || "User";
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('login');
    logActivity("User Logged Out", "AUTH", `Session terminated for ${userName}`, userName, "INFO");
  }, [user, logActivity]);

  // Reset entire database to defaults
  const resetDatabase = useCallback(() => {
    setUsersList(DEFAULT_USERS);
    setUser(DEFAULT_USERS[0]);
    setIsAuthenticated(true);
    setSavedAddresses(DEFAULT_ADDRESSES);
    setRestaurantsList(DEFAULT_RESTAURANTS);
    setOrder(initialOrderState);
    localStorage.clear();
    triggerVisualAlert('cyan');
    logActivity("Database Factory Reset", "DATABASE", "Restored default user credentials, restaurants, and addresses", "Admin", "WARNING");
  }, [triggerVisualAlert, logActivity]);

  // --- CUSTOMER & RIDER DATA CUSTOMIZERS --- //

  // Add new delivery address to DB
  const addCustomAddress = useCallback((newAddrStr, gateCodeStr, labelStr) => {
    const newAddrObj = {
      id: `ADDR-${Date.now()}`,
      address: newAddrStr,
      gateCode: gateCodeStr || "1234",
      label: labelStr || "Custom Address",
      notes: "User added custom delivery address"
    };

    setSavedAddresses(prev => [newAddrObj, ...prev]);

    setOrder(prev => ({
      ...prev,
      customerAddress: newAddrStr,
      gateCode: gateCodeStr || "1234",
      chatMessages: [
        ...prev.chatMessages,
        {
          id: Date.now(),
          sender: 'system',
          text: `Delivery address updated: ${newAddrStr} (Gate Code: ${gateCodeStr || "1234"}).`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    }));
    triggerVisualAlert('cyan');
    logActivity("Delivery Address Added", "DATABASE", `Added ${newAddrStr} (Gate Code: ${gateCodeStr})`, "Customer", "SUCCESS");
  }, [triggerVisualAlert, logActivity]);

  // Delete address
  const deleteAddress = useCallback((addrId) => {
    setSavedAddresses(prev => prev.filter(a => a.id !== addrId));
    logActivity("Delivery Address Removed", "DATABASE", `Deleted address ID: ${addrId}`, "Customer", "INFO");
  }, [logActivity]);

  // Update order items & total amount
  const updateOrderItems = useCallback((itemsArray, totalStr) => {
    setOrder(prev => ({
      ...prev,
      orderItems: itemsArray,
      totalAmount: totalStr || `$${(itemsArray.length * 12.5).toFixed(2)}`
    }));
    triggerVisualAlert('gold');
    logActivity("Order Items Updated", "ORDER", `Updated order cart with ${itemsArray.length} items (${totalStr})`, "Customer", "INFO");
  }, [triggerVisualAlert, logActivity]);

  // Select Restaurant
  const selectRestaurant = useCallback((restObj) => {
    const coords = restObj.coords || DEFAULT_RESTAURANTS[0].coords;
    setOrder(prev => {
      const updated = {
        ...prev,
        merchantName: restObj.name,
        merchantAddress: restObj.address,
        merchantCoords: coords,
        orderItems: restObj.items,
        totalAmount: restObj.totalAmount,
        pickupEta: restObj.pickupEta,
        deliveryEta: restObj.deliveryEta,
        distance: restObj.distance,
        chatMessages: [
          ...prev.chatMessages,
          {
            id: Date.now(),
            sender: 'system',
            text: `Restaurant selected: ${restObj.name} (${restObj.address}).`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      };
      // Regenerate route waypoints for GPS tracking
      const newWaypoints = generateRouteWaypoints(coords, prev.customerCoords || DEFAULT_ADDRESSES[0].coords);
      setRiderGps(gps => ({
        ...gps,
        lat: coords.lat,
        lng: coords.lng,
        progressPercent: 0,
        routeWaypoints: newWaypoints,
        breadcrumbs: [{ lat: coords.lat, lng: coords.lng, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
      }));
      return updated;
    });
    triggerVisualAlert('gold');
    logActivity("Restaurant Selected", "ORDER", `Selected merchant: ${restObj.name}`, "Customer", "INFO");
  }, [triggerVisualAlert, logActivity]);

  // Add/Edit Restaurant in Database
  const addRestaurant = useCallback((newRest) => {
    const restObj = {
      id: `REST-${Date.now()}`,
      name: newRest.name,
      address: newRest.address,
      cuisine: newRest.cuisine || 'General',
      items: newRest.items || [],
      totalAmount: newRest.totalAmount || '$25.00',
      pickupEta: newRest.pickupEta || '10 mins',
      deliveryEta: newRest.deliveryEta || '25 mins',
      distance: newRest.distance || '2.0 miles',
      coords: newRest.coords || { lat: 37.78000, lng: -122.41000 }
    };
    setRestaurantsList(prev => [...prev, restObj]);
    triggerVisualAlert('gold');
    logActivity("New Restaurant Added", "DATABASE", `Added partner restaurant: ${newRest.name}`, "Admin", "SUCCESS");
  }, [triggerVisualAlert, logActivity]);

  // Select Address helper
  const selectAddress = useCallback((addrObj) => {
    const coords = addrObj.coords || DEFAULT_ADDRESSES[0].coords;
    setOrder(prev => {
      const updated = {
        ...prev,
        customerAddress: addrObj.address,
        customerCoords: coords,
        gateCode: addrObj.gateCode,
        chatMessages: [
          ...prev.chatMessages,
          {
            id: Date.now(),
            sender: 'system',
            text: `Delivery destination set to ${addrObj.label}: ${addrObj.address} (Gate Code: ${addrObj.gateCode}).`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      };
      // Regenerate route waypoints for GPS tracking
      const newWaypoints = generateRouteWaypoints(prev.merchantCoords || DEFAULT_RESTAURANTS[0].coords, coords);
      setRiderGps(gps => ({
        ...gps,
        routeWaypoints: newWaypoints
      }));
      return updated;
    });
    triggerVisualAlert('cyan');
    logActivity("Delivery Destination Changed", "ORDER", `Updated to: ${addrObj.address}`, "Customer", "INFO");
  }, [triggerVisualAlert, logActivity]);

  // --- REAL-TIME GPS TRACKING & ROUTE TELEMETRY ENGINE --- //

  // Toggle Real Hardware Device GPS Geolocation
  const toggleRealDeviceGps = useCallback(() => {
    if (riderGps.isLiveDevice) {
      if (geoWatchIdRef.current !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.clearWatch(geoWatchIdRef.current);
        geoWatchIdRef.current = null;
      }
      setRiderGps(prev => ({
        ...prev,
        isLiveDevice: false,
        errorMsg: ""
      }));
      logActivity("Hardware GPS Deactivated", "GPS", "Rider switched back to simulated route tracking", "Alex Rivera (Rider)", "INFO");
    } else {
      if (typeof window === 'undefined' || !navigator.geolocation) {
        setRiderGps(prev => ({
          ...prev,
          errorMsg: "Browser Geolocation API is not supported on this device"
        }));
        return;
      }

      setRiderGps(prev => ({ ...prev, errorMsg: "" }));

      try {
        const watchId = navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude, longitude, accuracy, heading, speed } = pos.coords;
            const speedKmh = speed !== null ? Math.round(speed * 3.6 * 10) / 10 : 23.5;
            const headingDeg = heading !== null ? Math.round(heading) : 45;

            setRiderGps(prev => ({
              ...prev,
              lat: latitude,
              lng: longitude,
              accuracy: Math.round(accuracy) || 4,
              heading: headingDeg,
              speedKmh: speedKmh,
              isLiveDevice: true,
              isSimulating: false,
              breadcrumbs: [
                ...(prev.breadcrumbs || []).slice(-30),
                { lat: latitude, lng: longitude, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
              ],
              lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              errorMsg: ""
            }));

            logActivity("Real GPS Coordinate Stream", "GPS", `Live Fix: ${latitude.toFixed(5)}°N, ${longitude.toFixed(5)}°W (±${Math.round(accuracy)}m)`, "Alex Rivera (Rider)", "SUCCESS");
          },
          (err) => {
            setRiderGps(prev => ({
              ...prev,
              isLiveDevice: false,
              errorMsg: err.code === 1 ? "Permission denied. Allow location access in browser settings." : (err.message || "Unable to acquire real GPS fix.")
            }));
            logActivity("GPS Sensor Warning", "GPS", `Geolocation error: ${err.message}`, "Alex Rivera (Rider)", "WARNING");
          },
          {
            enableHighAccuracy: true,
            maximumAge: 1000,
            timeout: 10000
          }
        );
        geoWatchIdRef.current = watchId;
      } catch (err) {
        setRiderGps(prev => ({
          ...prev,
          isLiveDevice: false,
          errorMsg: "Failed to initialize location service."
        }));
      }
    }
  }, [riderGps.isLiveDevice, logActivity]);

  // Clean up geolocation watcher on unmount
  useEffect(() => {
    return () => {
      if (geoWatchIdRef.current !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.clearWatch(geoWatchIdRef.current);
      }
    };
  }, []);

  // Toggle Track Simulation (Play / Pause)
  const toggleGpsSimulation = useCallback(() => {
    setRiderGps(prev => ({
      ...prev,
      isSimulating: !prev.isSimulating,
      isLiveDevice: false
    }));
  }, []);

  // Set Simulation Speed (1x, 2x, 4x)
  const setGpsSimSpeed = useCallback((speed) => {
    setRiderGps(prev => ({ ...prev, simSpeed: speed }));
  }, []);

  // Reset Track to Origin
  const resetGpsTrack = useCallback(() => {
    const origin = order.merchantCoords || DEFAULT_RESTAURANTS[0].coords;
    setRiderGps(prev => ({
      ...prev,
      lat: origin.lat,
      lng: origin.lng,
      progressPercent: 0,
      distanceRemaining: order.distance || "2.4 miles",
      eta: order.deliveryEta || "18 mins",
      speedKmh: 0,
      heading: 45,
      isSimulating: true,
      breadcrumbs: [{ lat: origin.lat, lng: origin.lng, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
    }));
    logActivity("GPS Track Reset", "GPS", "Rider position reset to restaurant pickup origin", "System", "INFO");
  }, [order, logActivity]);

  // Set Rider GPS Position (e.g. clicking on map)
  const setRiderGpsPosition = useCallback((lat, lng) => {
    setRiderGps(prev => ({
      ...prev,
      lat,
      lng,
      breadcrumbs: [
        ...(prev.breadcrumbs || []).slice(-30),
        { lat, lng, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ],
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  }, []);

  // Route Track Simulation Animation Loop
  useEffect(() => {
    if (!riderGps?.isSimulating || riderGps?.isLiveDevice) return;

    const intervalTime = Math.max(800, 2000 / (riderGps.simSpeed || 1));
    const timer = setInterval(() => {
      setRiderGps(prev => {
        const waypoints = prev.routeWaypoints || [
          order.merchantCoords || { lat: 37.78917, lng: -122.40145 },
          { lat: 37.78650, lng: -122.40520 },
          { lat: 37.78390, lng: -122.40950 },
          { lat: 37.78010, lng: -122.41480 },
          { lat: 37.77680, lng: -122.41720 },
          order.customerCoords || { lat: 37.77490, lng: -122.41940 }
        ];

        let nextProgress = prev.progressPercent + (4 * (prev.simSpeed || 1));
        if (nextProgress > 100) nextProgress = 0; // loop track

        // Interpolate along waypoints based on progress
        const totalSegments = waypoints.length - 1;
        const progressFraction = nextProgress / 100;
        const rawIndex = progressFraction * totalSegments;
        const segmentIdx = Math.min(totalSegments - 1, Math.floor(rawIndex));
        const segmentT = rawIndex - segmentIdx;

        const p1 = waypoints[segmentIdx];
        const p2 = waypoints[segmentIdx + 1] || p1;

        const currentLat = p1.lat + (p2.lat - p1.lat) * segmentT;
        const currentLng = p1.lng + (p2.lng - p1.lng) * segmentT;

        // Calculate heading angle
        const dy = p2.lat - p1.lat;
        const dx = p2.lng - p1.lng;
        let angleDeg = Math.round((Math.atan2(dx, dy) * 180) / Math.PI);
        if (angleDeg < 0) angleDeg += 360;

        // Dynamic distance remaining and ETA
        const distKm = Math.max(0.1, ((100 - nextProgress) / 100) * 2.4).toFixed(1);
        const etaMins = Math.max(1, Math.round(((100 - nextProgress) / 100) * 18));

        return {
          ...prev,
          lat: currentLat,
          lng: currentLng,
          heading: angleDeg,
          speedKmh: nextProgress === 0 ? 0 : 22 + (Math.sin(nextProgress) * 4),
          progressPercent: Math.round(nextProgress),
          distanceRemaining: `${distKm} km`,
          eta: `${etaMins} mins`,
          breadcrumbs: [
            ...(prev.breadcrumbs || []).slice(-30),
            { lat: currentLat, lng: currentLng, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          ],
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [riderGps?.isSimulating, riderGps?.isLiveDevice, riderGps?.simSpeed, order]);

  // Send message from customer
  const sendCustomerMessage = useCallback((text) => {
    if (!text.trim()) return;

    setIsTranslating(true);
    triggerVisualAlert('cyan');

    const newMessage = {
      id: Date.now(),
      sender: 'customer',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setOrder(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, newMessage]
    }));

    logActivity("Customer Message Sent", "COMMUNICATION", `"${text.trim().substring(0, 45)}${text.length > 45 ? '...' : ''}"`, "Sarah Jenkins (Customer)", "INFO");

    setTimeout(() => {
      setIsTranslating(false);
    }, 1200);
  }, [triggerVisualAlert, logActivity]);

  // Send tap-to-sign response from rider
  const sendRiderResponse = useCallback((riderText, signPhrase) => {
    triggerVisualAlert('gold');

    const newMessage = {
      id: Date.now(),
      sender: 'rider',
      text: riderText,
      signPhrase: signPhrase,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setOrder(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, newMessage]
    }));

    logActivity("Rider Visual Sign Response", "COMMUNICATION", `Rider sent: "${riderText}" [Gesture: ${signPhrase}]`, "Alex Rivera (Rider)", "SUCCESS");

    if (soundAlerts) {
      speakText(`Message from rider: ${riderText}`);
    }
  }, [triggerVisualAlert, soundAlerts, speakText, logActivity]);

  // Push Notification Helper
  const pushNotification = useCallback(({
    targetRole = 'all', // 'rider' | 'customer' | 'merchant' | 'admin' | 'all'
    title,
    message,
    type = 'general', // 'order_appear' | 'order_ready' | 'rider_pickup' | 'rider_drop' | 'delivered' | 'alert'
    icon = 'Bell',
    playAudio = true,
    flash = true
  }) => {
    const newNotif = {
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      targetRole,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      icon
    };

    setNotificationsList(prev => [newNotif, ...(prev || []).slice(0, 49)]);
    setLatestToast(newNotif);

    // Audio chime
    if (soundAlerts && playAudio) {
      playNotificationChime(type);
    }

    // Flash alert
    if (flash) {
      triggerVisualAlert(type === 'order_ready' || type === 'delivered' ? 'cyan' : 'gold');
    }

    // Log to activity audit trail
    logActivity(`Notification [${targetRole.toUpperCase()}]: ${title}`, 'ALERT', message, `${targetRole.toUpperCase()} Dispatch`, 'SUCCESS');
  }, [soundAlerts, triggerVisualAlert, logActivity]);

  const dismissToast = useCallback(() => {
    setLatestToast(null);
  }, []);

  const markNotificationRead = useCallback((id) => {
    setNotificationsList(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotificationsList(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotificationsList([]);
    saveStorage('signshift_notifications', []);
  }, []);

  // Dedicated helper when a new order appears in the kitchen
  const notifyOrderAppeared = useCallback((customOrder) => {
    const activeOrd = customOrder || order;
    pushNotification({
      targetRole: 'merchant',
      title: '🔔 New Order Appeared in Kitchen!',
      message: `Order #${activeOrd.id} from ${activeOrd.customerName} for ${activeOrd.totalAmount} appeared. Kitchen ticket active!`,
      type: 'order_appear',
      icon: 'Store'
    });

    pushNotification({
      targetRole: 'customer',
      title: '🧾 Order Placed & Confirmed!',
      message: `Your order #${activeOrd.id} has appeared at ${activeOrd.merchantName} and is being cooked.`,
      type: 'order_appear',
      icon: 'ShoppingBag'
    });

    pushNotification({
      targetRole: 'rider',
      title: '🛵 New Delivery Scheduled for Pickup',
      message: `Order #${activeOrd.id} at ${activeOrd.merchantName} assigned to your route.`,
      type: 'rider_pickup',
      icon: 'Navigation'
    });
  }, [order, pushNotification]);

  // Dedicated helper when the merchant marks the order as READY
  const notifyOrderReady = useCallback(() => {
    pushNotification({
      targetRole: 'rider',
      title: '🍳 Order is READY for Pickup!',
      message: `${order.merchantName} marked order #${order.id} as READY on pickup counter. Tap to confirm pickup!`,
      type: 'order_ready',
      icon: 'CheckCircle2'
    });

    pushNotification({
      targetRole: 'customer',
      title: '👨‍🍳 Meal Finished Cooking!',
      message: `${order.merchantName} has completed preparing your food. Handing over to rider Alex Rivera.`,
      type: 'order_ready',
      icon: 'Store'
    });

    logActivity('Kitchen Marked Order Ready', 'ORDER', `Order #${order.id} packed and ready for pickup`, 'Merchant Kitchen', 'SUCCESS');
  }, [order, pushNotification, logActivity]);

  // Update order status with automatic multi-role notifications
  const updateOrderStatus = useCallback((newStatus) => {
    triggerVisualAlert(newStatus === 'delivered' ? 'cyan' : 'gold');
    setOrder(prev => ({
      ...prev,
      status: newStatus
    }));

    let statusMsg = "";
    if (newStatus === 'pickup') {
      statusMsg = "Rider arrived at restaurant for order pickup.";
      pushNotification({
        targetRole: 'rider',
        title: '📍 Arrived for Order Pickup',
        message: `You have arrived at ${order.merchantName}. Collect package for order #${order.id}.`,
        type: 'rider_pickup',
        icon: 'Navigation'
      });
      pushNotification({
        targetRole: 'merchant',
        title: '🏍️ Rider Arrived for Pickup!',
        message: `Rider Alex Rivera is at the counter to pick up order #${order.id}.`,
        type: 'rider_pickup',
        icon: 'Store'
      });
    }

    if (newStatus === 'en_route') {
      statusMsg = "Order picked up! Rider is en route to customer address.";
      pushNotification({
        targetRole: 'customer',
        title: '🚴 Order Picked Up & En Route!',
        message: `Alex Rivera collected your food from ${order.merchantName} and is en route to ${order.customerAddress}.`,
        type: 'rider_pickup',
        icon: 'Package'
      });
      pushNotification({
        targetRole: 'rider',
        title: '🗺️ En Route to Customer Drop-off',
        message: `Delivering to ${order.customerAddress}. Customer gate code: ${order.gateCode}.`,
        type: 'rider_drop',
        icon: 'Navigation'
      });
      pushNotification({
        targetRole: 'merchant',
        title: '📦 Order Handed to Rider',
        message: `Alex Rivera collected order #${order.id} and departed from the store.`,
        type: 'rider_pickup',
        icon: 'CheckCircle2'
      });
    }

    if (newStatus === 'arrived') {
      statusMsg = "Rider has arrived outside your building!";
      pushNotification({
        targetRole: 'customer',
        title: '🚪 Rider Arrived for Drop-off!',
        message: `Alex Rivera is outside your building! Gate code: ${order.gateCode}. Leave at doorstep requested.`,
        type: 'rider_drop',
        icon: 'MapPin'
      });
      pushNotification({
        targetRole: 'rider',
        title: '🚪 Reached Customer Drop-off',
        message: `Arrived at ${order.customerAddress}. Gate code: ${order.gateCode}. Leave at doorstep.`,
        type: 'rider_drop',
        icon: 'MapPin'
      });
    }

    if (newStatus === 'delivered') {
      statusMsg = "Order successfully delivered! Enjoy your meal.";
      pushNotification({
        targetRole: 'customer',
        title: '🎉 Order Delivered Successfully!',
        message: `Your food from ${order.merchantName} was delivered. Enjoy your meal!`,
        type: 'delivered',
        icon: 'Package'
      });
      pushNotification({
        targetRole: 'merchant',
        title: '✅ Order Delivery Completed',
        message: `Order #${order.id} was successfully delivered to ${order.customerName}.`,
        type: 'delivered',
        icon: 'CheckCircle2'
      });
      pushNotification({
        targetRole: 'rider',
        title: '⭐ Delivery Successful!',
        message: `Order #${order.id} completed. +$14.50 earned and 5-star rating recorded!`,
        type: 'delivered',
        icon: 'Award'
      });
    }

    logActivity("Order Milestone Transition", "ORDER", `Status updated to ${newStatus.toUpperCase()}: ${statusMsg}`, "Delivery Workflow", "SUCCESS");

    if (statusMsg) {
      setOrder(prev => ({
        ...prev,
        chatMessages: [
          ...prev.chatMessages,
          {
            id: Date.now(),
            sender: 'system',
            text: statusMsg,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      }));

      if (soundAlerts) {
        speakText(statusMsg);
      }
    }
  }, [order, triggerVisualAlert, soundAlerts, speakText, logActivity, pushNotification]);

  return (
    <AppContext.Provider value={{
      currentView,
      setCurrentView,
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
      screenFlash,
      triggerVisualAlert,

      // Users & Auth Database
      usersList,
      user,
      isAuthenticated,
      loginUser,
      registerUser,
      updateUserProfile,
      deleteUser,
      addUserByAdmin,
      logoutUser,
      resetDatabase,

      // Activity Logs
      activityLogs,
      logActivity,
      clearActivityLogs,

      // Notifications Engine
      notificationsList,
      latestToast,
      pushNotification,
      notifyOrderAppeared,
      notifyOrderReady,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotifications,
      dismissToast,

      // Addresses Database
      savedAddresses,
      addCustomAddress,
      deleteAddress,

      // Restaurants Database
      restaurantsList,
      addRestaurant,
      selectRestaurant,
      selectAddress,

      // Order State
      order,
      setOrder,
      updateOrderItems,
      updateOrderStatus,

      // Real GPS Telemetry & Route Track Engine
      riderGps,
      setRiderGps,
      toggleRealDeviceGps,
      toggleGpsSimulation,
      setGpsSimSpeed,
      resetGpsTrack,
      setRiderGpsPosition,

      // Messaging & Speech
      isTranslating,
      sendCustomerMessage,
      sendRiderResponse,
      signSpeed,
      setSignSpeed,
      avatarMode,
      setAvatarMode,
      speakText
    }}>
      <div className={`min-h-screen ${theme === 'neon' ? 'high-contrast-neon' : ''} ${fontSize === 'large' ? 'font-size-large' : fontSize === 'xlarge' ? 'font-size-xlarge' : ''} ${reducedMotion ? 'reduced-motion' : ''}`}>
        {screenFlash && (
          <div
            className={`fixed inset-0 z-50 pointer-events-none ${screenFlash === 'cyan' ? 'animate-screen-flash-cyan bg-brand-cyan/40' : 'animate-screen-flash-gold bg-brand-yellow/40'
              }`}
          />
        )}
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
