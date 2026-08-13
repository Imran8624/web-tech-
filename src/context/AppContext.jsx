import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
    label: "Home (Apt 4B)",
    notes: "Leave parcel outside front door and ring bell"
  },
  {
    id: "ADDR-2",
    address: "100 Innovation Way, 3rd Floor Tech Hub",
    gateCode: "9081",
    label: "Office / Work Building",
    notes: "Leave with 3rd floor receptionist"
  },
  {
    id: "ADDR-3",
    address: "550 Oakwood Park Dr, West Gate Entrance",
    gateCode: "1234",
    label: "Parents' Residence",
    notes: "Call intercom unit 12"
  }
];

export const initialOrderState = {
  id: "ORD-9482",
  customerName: "Sarah Jenkins",
  customerPhone: "+1 (555) 234-5678",
  customerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  customerAddress: DEFAULT_ADDRESSES[0].address,
  gateCode: DEFAULT_ADDRESSES[0].gateCode,
  merchantName: DEFAULT_RESTAURANTS[0].name,
  merchantAddress: DEFAULT_RESTAURANTS[0].address,
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
  useEffect(() => { saveStorage('signshift_avatar_mode', avatarMode); }, [avatarMode]);

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
          return { success: false, message: "Invalid password. Please check your credentials." };
        }
        setUser(match);
        setIsAuthenticated(true);
        const nextView = match.role === 'admin' ? 'admin' : match.role === 'rider' ? 'rider' : match.role === 'customer' ? 'customer' : 'merchant';
        setCurrentView(nextView);
        triggerVisualAlert('cyan');
        return { success: true, user: match };
      } else if (targetPassword) {
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
    return { success: true, user: roleMatch };
  }, [usersList, triggerVisualAlert]);

  // Register function creating real user in Database
  const registerUser = useCallback((userData) => {
    const { name, email, password, phone, role, customAddress, gateCode, isDeafMute, avatar } = userData;

    // Check duplicate email
    const existing = usersList.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    if (existing) {
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
    setCurrentView(role === 'admin' ? 'admin' : role === 'rider' ? 'rider' : role === 'customer' ? 'customer' : 'merchant');
    return { success: true, user: newUser };
  }, [usersList, triggerVisualAlert]);

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
    return { success: true };
  }, [triggerVisualAlert]);

  // Delete user from Database
  const deleteUser = useCallback((userId) => {
    setUsersList(prev => prev.filter(u => u.id !== userId));
    triggerVisualAlert('cyan');
  }, [triggerVisualAlert]);

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
    return newUser;
  }, [triggerVisualAlert]);

  // Logout User
  const logoutUser = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('login');
  }, []);

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
  }, [triggerVisualAlert]);

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
  }, [triggerVisualAlert]);

  // Delete address
  const deleteAddress = useCallback((addrId) => {
    setSavedAddresses(prev => prev.filter(a => a.id !== addrId));
  }, []);

  // Update order items & total amount
  const updateOrderItems = useCallback((itemsArray, totalStr) => {
    setOrder(prev => ({
      ...prev,
      orderItems: itemsArray,
      totalAmount: totalStr || `$${(itemsArray.length * 12.5).toFixed(2)}`
    }));
    triggerVisualAlert('gold');
  }, [triggerVisualAlert]);

  // Select Restaurant
  const selectRestaurant = useCallback((restObj) => {
    setOrder(prev => ({
      ...prev,
      merchantName: restObj.name,
      merchantAddress: restObj.address,
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
    }));
    triggerVisualAlert('gold');
  }, [triggerVisualAlert]);

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
      distance: newRest.distance || '2.0 miles'
    };
    setRestaurantsList(prev => [...prev, restObj]);
    triggerVisualAlert('gold');
  }, [triggerVisualAlert]);

  // Select Address helper
  const selectAddress = useCallback((addrObj) => {
    setOrder(prev => ({
      ...prev,
      customerAddress: addrObj.address,
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
    }));
    triggerVisualAlert('cyan');
  }, [triggerVisualAlert]);

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

    setTimeout(() => {
      setIsTranslating(false);
    }, 1200);
  }, [triggerVisualAlert]);

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

    if (soundAlerts) {
      speakText(`Message from rider: ${riderText}`);
    }
  }, [triggerVisualAlert, soundAlerts, speakText]);

  // Update order status
  const updateOrderStatus = useCallback((newStatus) => {
    triggerVisualAlert(newStatus === 'delivered' ? 'cyan' : 'gold');
    setOrder(prev => ({
      ...prev,
      status: newStatus
    }));

    let statusMsg = "";
    if (newStatus === 'pickup') statusMsg = "Rider arrived at restaurant for order pickup.";
    if (newStatus === 'en_route') statusMsg = "Order picked up! Rider is en route to your address.";
    if (newStatus === 'arrived') statusMsg = "Rider has arrived outside your building!";
    if (newStatus === 'delivered') statusMsg = "Order successfully delivered! Enjoy your meal.";

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
  }, [triggerVisualAlert, soundAlerts, speakText]);

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
