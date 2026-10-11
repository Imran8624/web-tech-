import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LiveGpsTrackerMap } from '../components/LiveGpsTrackerMap';
import { SignAvatar3D, SIGN_DICTIONARY } from '../components/SignAvatar3D';
import { SUPPORTED_LANGUAGES } from '../constants/languages';
import { DIRECT_COMM_UI, translateChatMessage, getPromptTranslations, LANG_LOCALES } from '../constants/communicationTranslations';
import { 
  Package, 
  MapPin, 
  Clock, 
  Send, 
  Mic, 
  Volume2, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  CheckCircle2,
  Navigation,
  MessageSquare,
  Award,
  Heart,
  PhoneCall,
  Bot,
  Store,
  Edit3,
  User,
  Plus,
  Minus,
  Trash2,
  Lock,
  Key,
  X,
  ArrowRightLeft,
  Copy,
  Check,
  RotateCcw,
  Receipt,
  Download,
  Search,
  Bell,
  ChevronDown,
  ChevronUp,
  Star,
  Zap,
  Coffee,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  Filter,
  Info,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Sliders,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';

// -------------------------------------------------------------
// SENSORY HARMONIC CHIME (Web Audio API - Zero External Asset)
// -------------------------------------------------------------
const playHarmonicChime = (type = 'success') => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'reorder') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === 'otp') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.setValueAtTime(880.00, now + 0.08); // A5
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880.00, now + 0.12); // A5
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch (e) {
    // Graceful fallback for autoplay policies
  }
};

const triggerHaptic = (pattern = [50]) => {
  if (typeof window !== 'undefined' && 'navigator' in window && window.navigator.vibrate) {
    try {
      window.navigator.vibrate(pattern);
    } catch (e) {
      // Unsupported environments handled safely
    }
  }
};

// -------------------------------------------------------------
// PRE-DEFINED SAVED ADDRESS BOOK WITH LINKED GATE OTPS
// -------------------------------------------------------------
const DEFAULT_SAVED_ADDRESSES = [
  {
    id: "ADDR-1",
    label: "Home",
    subLabel: "Primary Residence",
    address: "Flat 402, Green Glen Towers, Outer Ring Road",
    gateCode: "4022",
    notes: "Leave package with 4th floor security or ring video intercom"
  },
  {
    id: "ADDR-2",
    label: "Work",
    subLabel: "Corporate Tech Park",
    address: "Tower B, 7th Floor, Prestige Tech Park, Marathahalli",
    gateCode: "9081",
    notes: "Leave with Tower B reception desk"
  },
  {
    id: "ADDR-3",
    label: "Parents",
    subLabel: "Family Residence",
    address: "Villa 14, Palm Meadows, Varthur Main Rd, Whitefield",
    gateCode: "1234",
    notes: "Call security gate intercom unit 14"
  }
];

// -------------------------------------------------------------
// QUICK-COMMERCE "ORDER AGAIN IN 1-TAP" SKU REORDER RAIL
// -------------------------------------------------------------
const REORDER_SKU_ITEMS = [
  {
    id: "SKU-1",
    name: "Artisan Sourdough Loaf",
    merchant: "The French Bakery",
    priceStr: "₹65",
    priceNum: 65,
    orderCount: 14,
    category: "grocery",
    img: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=260&auto=format&fit=crop&q=80",
    rating: "4.9 ★",
    etaMins: "12m"
  },
  {
    id: "SKU-2",
    name: "A2 Organic Farm Milk (1L)",
    merchant: "Fresh Farms Dairy",
    priceStr: "₹58",
    priceNum: 58,
    orderCount: 18,
    category: "grocery",
    img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=260&auto=format&fit=crop&q=80",
    rating: "4.9 ★",
    etaMins: "10m"
  },
  {
    id: "SKU-3",
    name: "Cold Brew Single Origin",
    merchant: "Blue Tokai Coffee",
    priceStr: "₹180",
    priceNum: 180,
    orderCount: 9,
    category: "beverage",
    img: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=260&auto=format&fit=crop&q=80",
    rating: "4.9 ★",
    etaMins: "15m"
  },
  {
    id: "SKU-4",
    name: "Greek Berry Yogurt Cup",
    merchant: "Epigamia Gourmet",
    priceStr: "₹45",
    priceNum: 45,
    orderCount: 6,
    category: "grocery",
    img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=260&auto=format&fit=crop&q=80",
    rating: "4.8 ★",
    etaMins: "10m"
  },
  {
    id: "SKU-5",
    name: "Truffle Parmesan Fries",
    merchant: "Aroma Bistro & Grill",
    priceStr: "₹195",
    priceNum: 195,
    orderCount: 7,
    category: "food",
    img: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=260&auto=format&fit=crop&q=80",
    rating: "4.8 ★",
    etaMins: "18m"
  },
  {
    id: "SKU-6",
    name: "Smoked Salmon Rice Bowl",
    merchant: "Tokyo Sushi Express",
    priceStr: "₹420",
    priceNum: 420,
    orderCount: 4,
    category: "food",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=260&auto=format&fit=crop&q=80",
    rating: "4.9 ★",
    etaMins: "20m"
  }
];

// -------------------------------------------------------------
// FAVORITE MERCHANTS & "YOUR USUAL" (SWIGGY STYLE)
// -------------------------------------------------------------
const FAVORITE_MERCHANTS_DATA = [
  {
    id: "MERCH-1",
    name: "L'Atelier Culinaire",
    rating: "4.9 ★",
    etaStr: "18 mins",
    distanceStr: "1.2 km away",
    cuisine: "French Contemporary, Fine Pastries",
    isOpen: true,
    logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=160&auto=format&fit=crop&q=80",
    usualMeal: "Truffle Risotto & Yuzu Tart",
    usualPriceStr: "₹1,140",
    usualCount: 5,
    items: [
      { name: "Truffle Risotto", qty: 1, price: "₹680", priceNum: 680, desc: "Arborio rice with black summer truffle shavings and aged parmesan" },
      { name: "Yuzu Blanche Tart", qty: 1, price: "₹280", priceNum: 280, desc: "Crisp shortcrust pastry with citrus curd and torched meringue" },
      { name: "Botanical Fizz Drink", qty: 1, price: "₹180", priceNum: 180, desc: "Infused elderflower, sparkling spring water, and crushed fresh mint" },
      { name: "Artisanal Duck Confit", qty: 1, price: "₹750", priceNum: 750, desc: "Crispy skin duck leg with rosemary roasted baby potatoes" },
      { name: "Sourdough Brioche Basket", qty: 1, price: "₹190", priceNum: 190, desc: "Warm fermented rolls served with cultured French sea salt butter" }
    ]
  },
  {
    id: "MERCH-2",
    name: "Aroma Bistro & Grill",
    rating: "4.8 ★",
    etaStr: "14 mins",
    distanceStr: "1.8 km away",
    cuisine: "Modern Fusion, Artisan Grain Bowls",
    isOpen: true,
    logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=160&auto=format&fit=crop&q=80",
    usualMeal: "Crispy Salmon Bowl & Truffle Fries",
    usualPriceStr: "₹645",
    usualCount: 8,
    items: [
      { name: "Crispy Salmon Bowl", qty: 1, price: "₹450", priceNum: 450, desc: "Pan-seared Atlantic salmon with edamame, avocado, and ponzu ginger glaze" },
      { name: "Truffle Fries", qty: 1, price: "₹195", priceNum: 195, desc: "Crispy shoestring fries tossed in white truffle oil and Grana Padano" },
      { name: "Iced Matcha Latte", qty: 1, price: "₹160", priceNum: 160, desc: "Ceremonial grade Uji matcha with steamed oat milk and agave" },
      { name: "Wood-Fired Margherita Pizza", qty: 1, price: "₹380", priceNum: 380, desc: "San Marzano sauce, fresh mozzarella fior di latte, and basil leaves" },
      { name: "Avocado Goddess Salad", qty: 1, price: "₹290", priceNum: 290, desc: "Hydroponic crisp greens, avocado quarters, toasted sunflower seeds" }
    ]
  },
  {
    id: "MERCH-3",
    name: "Tokyo Sushi & Ramen Express",
    rating: "4.9 ★",
    etaStr: "22 mins",
    distanceStr: "2.4 km away",
    cuisine: "Japanese, Tonkotsu Ramen & Maki",
    isOpen: true,
    logo: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=160&auto=format&fit=crop&q=80",
    usualMeal: "Tonkotsu Black Garlic Ramen & Mochi",
    usualPriceStr: "₹520",
    usualCount: 4,
    items: [
      { name: "Tonkotsu Black Garlic Ramen", qty: 1, price: "₹380", priceNum: 380, desc: "18-hour broth, slow-braised chashu pork, ajitsuke tamago, and nori" },
      { name: "Green Tea Mochi", qty: 1, price: "₹140", priceNum: 140, desc: "Soft glutinous rice confectionery with delicate matcha ice cream filling" },
      { name: "Spicy Tuna Maki Roll (8pcs)", qty: 1, price: "₹320", priceNum: 320, desc: "Yellowfin sashimi tuna, sriracha aioli, cucumber, and toasted sesame" },
      { name: "Salmon Sashimi Platter", qty: 1, price: "₹460", priceNum: 460, desc: "6 thick cuts of grade-A sashimi salmon with freshly grated wasabi" },
      { name: "Pan-Fried Gyoza (5pcs)", qty: 1, price: "₹210", priceNum: 210, desc: "Crispy bottom pork and scallion dumplings with dark dipping vinegar" }
    ]
  },
  {
    id: "MERCH-4",
    name: "Taco Fiesta & Cantina",
    rating: "4.7 ★",
    etaStr: "12 mins",
    distanceStr: "1.0 km away",
    cuisine: "Authentic Mexican Street Food",
    isOpen: true,
    logo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=160&auto=format&fit=crop&q=80",
    usualMeal: "Birria Quesatacos Trio & Guacamole",
    usualPriceStr: "₹510",
    usualCount: 3,
    items: [
      { name: "Birria Quesatacos Trio", qty: 1, price: "₹320", priceNum: 320, desc: "Crispy grilled corn tortillas with melted cheese, slow-braised beef, and consommé dip" },
      { name: "Fresh Guacamole & Chips", qty: 1, price: "₹190", priceNum: 190, desc: "Hass avocado mashed with lime, cilantro, jalapeño, and warm corn tortilla chips" },
      { name: "Cinnamon Horchata Drink", qty: 1, price: "₹120", priceNum: 120, desc: "Traditional sweetened rice milk with cinnamon and vanilla beans" },
      { name: "Carne Asada Burrito Bowl", qty: 1, price: "₹340", priceNum: 340, desc: "Fire-grilled steak over cilantro lime rice, black beans, pico de gallo" },
      { name: "Churros con Dulce de Leche", qty: 1, price: "₹160", priceNum: 160, desc: "Golden fried pastry dusted with cinnamon sugar and warm caramel dip" }
    ]
  }
];

// -------------------------------------------------------------
// GRANULAR HISTORICAL ORDER ARCHIVE WITH INVOICE DATA
// -------------------------------------------------------------
const PAST_ORDER_ARCHIVE = [
  {
    id: "ORD-9480",
    merchant: "L'Atelier Culinaire",
    neighborhood: "Indiranagar 100ft Rd",
    statusBadge: "Delivered Today",
    items: [
      { name: "Truffle Risotto", qty: 1, price: "₹680" },
      { name: "Yuzu Blanche Tart", qty: 1, price: "₹280" },
      { name: "Botanical Fizz Drink", qty: 1, price: "₹180" }
    ],
    summaryLine: "Truffle Risotto, Yuzu Blanche Tart, Botanical Fizz",
    subtotal: "₹1,140",
    tax: "₹57",
    deliveryFee: "₹40",
    total: "₹1,237",
    paymentMethod: "UPI (Google Pay Instant)",
    gateCodeUsed: "4022",
    courierName: "Julian S.",
    courierVehicle: "TVS iQube (KA-04-ER-9821)",
    courierBadge: "Deaf / Non-Verbal Verified Courier",
    userRating: 5,
    timestamp: "Today, 1:45 PM",
    category: "food"
  },
  {
    id: "ORD-9476",
    merchant: "Aroma Bistro & Grill",
    neighborhood: "Market Street Promenade",
    statusBadge: "Delivered Yesterday",
    items: [
      { name: "Crispy Salmon Bowl", qty: 1, price: "₹450" },
      { name: "Iced Matcha Latte", qty: 2, price: "₹320" },
      { name: "Truffle Fries", qty: 1, price: "₹195" }
    ],
    summaryLine: "Crispy Salmon Bowl, Iced Matcha Latte (2x), Truffle Fries",
    subtotal: "₹965",
    tax: "₹48",
    deliveryFee: "₹0 (SignShift Pro Free)",
    total: "₹1,013",
    paymentMethod: "Visa Platinum ****4192",
    gateCodeUsed: "4022",
    courierName: "Alex Rivera",
    courierVehicle: "Electric Cargo Bike",
    courierBadge: "Deaf / Non-Verbal Verified Courier",
    userRating: 5,
    timestamp: "Yesterday, 8:20 PM",
    category: "food"
  },
  {
    id: "ORD-9462",
    merchant: "Blue Tokai & French Bakery",
    neighborhood: "Koramangala 4th Block",
    statusBadge: "Delivered 3 days ago",
    items: [
      { name: "Artisan Sourdough Loaf", qty: 2, price: "₹130" },
      { name: "Cold Brew Single Origin Bottle", qty: 1, price: "₹180" }
    ],
    summaryLine: "Artisan Sourdough Loaf (2x), Cold Brew Bottle",
    subtotal: "₹310",
    tax: "₹15",
    deliveryFee: "₹35",
    total: "₹360",
    paymentMethod: "UPI (Paytm)",
    gateCodeUsed: "4022",
    courierName: "Alex Rivera",
    courierVehicle: "Electric Cargo Bike",
    courierBadge: "Deaf / Non-Verbal Verified Courier",
    userRating: 5,
    timestamp: "Oct 8, 10:15 AM",
    category: "grocery"
  }
];

export const CustomerTracker = ({ onOpenVoiceAgent }) => {
  const { 
    user,
    updateUserProfile,
    order, 
    setOrder,
    restaurantsList,
    selectRestaurant, 
    openTransferModal, 
    savedAddresses: appSavedAddresses,
    selectAddress, 
    addCustomAddress, 
    deleteAddress,
    updateOrderItems, 
    sendCustomerMessage, 
    isTranslating, 
    speakText,
    language = 'en',
    setLanguage,
    t = (k) => k,
    SUPPORTED_LANGUAGES = [],
    triggerVisualAlert,
    awardRiderCoins,
    customerWallet,
    awardCustomerCoins,
    pushNotification
  } = useApp();

  const commUI = DIRECT_COMM_UI[language] || DIRECT_COMM_UI.en;
  const custLanguage = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Address book resolution
  const savedAddresses = (appSavedAddresses && appSavedAddresses.length > 0) 
    ? appSavedAddresses 
    : DEFAULT_SAVED_ADDRESSES;

  // Active Directives & Avatar State
  const [activeMirrorSign, setActiveMirrorSign] = useState("LEAVE AT DOOR");
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [isLiveHudCollapsed, setIsLiveHudCollapsed] = useState(false);
  const [selectedTip, setSelectedTip] = useState(null);
  const [tipSuccessFeedback, setTipSuccessFeedback] = useState("");
  const [reorderNotificationToast, setReorderNotificationToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favFilter, setFavFilter] = useState("ALL"); // ALL | OPEN | FAST
  const [historyFilter, setHistoryFilter] = useState("ALL"); // ALL | FOOD | GROCERY
  const [invoiceModalOrder, setInvoiceModalOrder] = useState(null);

  // -------------------------------------------------------------
  // INTERACTIVE CART & CHECKOUT STATE
  // -------------------------------------------------------------
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('signshift_customer_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [showCartModal, setShowCartModal] = useState(false);
  const [activeMenuMerchant, setActiveMenuMerchant] = useState(null);
  const [deliverWithDeafCourier, setDeliverWithDeafCourier] = useState(true);
  const [deliveryDirective, setDeliveryDirective] = useState("LEAVE AT DOOR");
  const [redeemCoins, setRedeemCoins] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi"); // 'upi' | 'card' | 'cod'
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Sync cart to local storage for persistence across reloads
  useEffect(() => {
    try {
      localStorage.setItem('signshift_customer_cart', JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  // Address Switcher Modal & Custom Address Form
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newStreetAddress, setNewStreetAddress] = useState("");
  const [newGateCode, setNewGateCode] = useState("");
  const [newAddrLabel, setNewAddrLabel] = useState("");

  // Customer Profile Editor
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [editName, setEditName] = useState(user?.name || 'Sarah Jenkins');
  const [editEmail, setEditEmail] = useState(user?.email || 'sarah.j@signshift.io');
  const [editPassword, setEditPassword] = useState(user?.password || '••••••••');
  const [editPhone, setEditPhone] = useState(user?.phone || '+1 (555) 234-5678');

  // Chat input state
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------

  // Clipboard Copy with Haptic & Sound Feedback
  const handleCopyOtpCode = () => {
    const code = order.gateCode || "4022";
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(code);
    }
    triggerHaptic([50]);
    playHarmonicChime('otp');
    setCopiedOtp(true);
    if (triggerVisualAlert) triggerVisualAlert('cyan');
    setTimeout(() => setCopiedOtp(false), 2400);
  };

  // Quick Directives Taps (Translates to 3D Avatar + Sends to Courier)
  const handleSelectDirective = (signDictKey, textInstruction) => {
    setActiveMirrorSign(signDictKey);
    triggerHaptic([50]);
    playHarmonicChime('success');
    sendCustomerMessage(textInstruction);
    if (speakText) speakText(textInstruction, language);
    if (triggerVisualAlert) triggerVisualAlert('cyan');
  };

  // Address Switcher Handler (Syncs address and Gate OTP in real-time)
  const handleSelectAddressDestination = (addrObj) => {
    selectAddress(addrObj);
    triggerHaptic([50]);
    playHarmonicChime('success');
    setShowAddressModal(false);
    confetti({ particleCount: 40, spread: 60 });
  };

  // Save New Custom Address to Storage
  const handleSaveCustomAddress = (e) => {
    e.preventDefault();
    if (!newStreetAddress.trim()) return;
    addCustomAddress(newStreetAddress.trim(), newGateCode.trim() || "4022", newAddrLabel.trim() || "My Location");
    setNewStreetAddress("");
    setNewGateCode("");
    setNewAddrLabel("");
    triggerHaptic([50]);
    playHarmonicChime('success');
    confetti({ particleCount: 50, spread: 70 });
  };

  // Gratuity & SignCoins Reward Handler
  const handleSendCourierTip = (amountUSD) => {
    setSelectedTip(amountUSD);
    triggerHaptic([100, 50, 100]);
    playHarmonicChime('success');

    if (awardRiderCoins) {
      awardRiderCoins(Math.round(amountUSD * 10), `Customer Tip $${amountUSD}`);
    }
    if (awardCustomerCoins) {
      awardCustomerCoins(50, `Accessible Gratuity Bonus ($${amountUSD})`);
    }

    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    setTipSuccessFeedback(`🎉 $${amountUSD} tip credited to ${order.riderInfo?.name || 'Julian S.'}! +50🪙 SignCoins added to your balance.`);
    setTimeout(() => setTipSuccessFeedback(""), 5000);
  };

  // -------------------------------------------------------------
  // CART HELPERS & BILL SUMMARY CALCULATIONS
  // -------------------------------------------------------------
  const parsePrice = (priceVal) => {
    if (typeof priceVal === 'number') return priceVal;
    if (!priceVal) return 0;
    const clean = String(priceVal).replace(/[^0-9.]/g, '');
    return parseFloat(clean) || 0;
  };

  const cartSubtotal = cartItems.reduce((acc, it) => acc + (it.priceNum * it.qty), 0);
  const cartTax = Math.round(cartSubtotal * 0.05);
  const cartDeliveryFee = (cartSubtotal > 200 || cartItems.length === 0) ? 0 : 35;
  const coinDiscount = (redeemCoins && (customerWallet?.signCoins || 450) >= 100) ? 50 : 0;
  const cartGrandTotal = Math.max(0, cartSubtotal + cartTax + cartDeliveryFee - coinDiscount);
  const cartTotalItemCount = cartItems.reduce((acc, it) => acc + it.qty, 0);

  // Add Item to Cart
  const handleAddToCart = (item, merchantName = null, notify = true) => {
    const pNum = item.priceNum || parsePrice(item.price || item.priceStr);
    const pStr = item.priceStr || item.price || `₹${pNum}`;
    const mName = merchantName || item.merchant || "SignShift Kitchen";
    const itemId = item.id || `${mName}-${item.name}`.replace(/\s+/g, '-');

    setCartItems(prev => {
      const idx = prev.findIndex(ci => ci.id === itemId || (ci.name === item.name && ci.merchant === mName));
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + 1 };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: itemId,
            name: item.name,
            merchant: mName,
            priceNum: pNum,
            priceStr: pStr,
            qty: 1,
            img: item.img || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=160&auto=format&fit=crop&q=80",
            category: item.category || "food"
          }
        ];
      }
    });

    triggerHaptic([50]);
    playHarmonicChime('reorder');
    if (triggerVisualAlert) triggerVisualAlert('cyan');

    if (notify) {
      setReorderNotificationToast(`🛒 Added "${item.name}" (${pStr}) to Cart! Click to view cart.`);
      setTimeout(() => setReorderNotificationToast(null), 3600);
    }
  };

  // Adjust Cart Quantity
  const handleUpdateCartQty = (itemId, delta) => {
    triggerHaptic([30]);
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  // Remove Single Item from Cart
  const handleRemoveFromCart = (itemId) => {
    triggerHaptic([50]);
    setCartItems(prev => prev.filter(i => i.id !== itemId));
  };

  // Empty Entire Cart
  const handleClearCart = () => {
    triggerHaptic([80]);
    setCartItems([]);
  };

  // 1-Tap SKU Reorder (Adds item to cart & opens Cart Checkout Modal)
  const handleReorderSKU = (sku) => {
    handleAddToCart(sku, sku.merchant, false);
    setShowCartModal(true);
    confetti({ particleCount: 50, spread: 60 });
    setReorderNotificationToast(`⚡ 1-Tap Reorder: "${sku.name}" added to cart! Proceed to checkout.`);
    setTimeout(() => setReorderNotificationToast(null), 3800);
  };

  // 1-Tap Repeat Usual Meal from Merchant (Adds all usual meal items to cart & opens Cart Modal)
  const handleRepeatUsualMeal = (merchant) => {
    triggerHaptic([100, 50, 100]);
    playHarmonicChime('reorder');
    confetti({ particleCount: 80, spread: 75 });
    if (triggerVisualAlert) triggerVisualAlert('cyan');

    const newItems = (merchant.items || []).map((it, idx) => {
      const pNum = it.priceNum || parsePrice(it.price);
      return {
        id: `${merchant.id}-usual-${idx}-${it.name}`.replace(/\s+/g, '-'),
        name: it.name,
        merchant: merchant.name,
        priceNum: pNum,
        priceStr: it.price || `₹${pNum}`,
        qty: it.qty || 1,
        img: merchant.logo,
        category: "food"
      };
    });

    setCartItems(prev => {
      const existing = [...prev];
      newItems.forEach(newItem => {
        const found = existing.findIndex(e => e.name === newItem.name && e.merchant === newItem.merchant);
        if (found >= 0) {
          existing[found] = { ...existing[found], qty: existing[found].qty + newItem.qty };
        } else {
          existing.push(newItem);
        }
      });
      return existing;
    });

    setShowCartModal(true);
    setReorderNotificationToast(`⚡ The Usual: "${merchant.usualMeal}" placed in cart from ${merchant.name}!`);
    setTimeout(() => setReorderNotificationToast(null), 4200);
  };

  // Repeat Entire Historical Order (Adds all past items to cart & opens Cart Modal)
  const handleRepeatEntireHistoricalOrder = (historicalOrder) => {
    triggerHaptic([100, 50, 100]);
    playHarmonicChime('reorder');
    confetti({ particleCount: 90, spread: 85 });
    if (triggerVisualAlert) triggerVisualAlert('cyan');

    const newItems = (historicalOrder.items || []).map((it, idx) => {
      const pNum = parsePrice(it.price);
      return {
        id: `${historicalOrder.id}-${idx}-${it.name}`.replace(/\s+/g, '-'),
        name: it.name,
        merchant: historicalOrder.merchant,
        priceNum: pNum,
        priceStr: it.price || `₹${pNum}`,
        qty: it.qty || 1,
        img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=160&auto=format&fit=crop&q=80",
        category: historicalOrder.category || "food"
      };
    });

    setCartItems(prev => {
      const existing = [...prev];
      newItems.forEach(newItem => {
        const found = existing.findIndex(e => e.name === newItem.name && e.merchant === newItem.merchant);
        if (found >= 0) {
          existing[found] = { ...existing[found], qty: existing[found].qty + newItem.qty };
        } else {
          existing.push(newItem);
        }
      });
      return existing;
    });

    setShowCartModal(true);
    setReorderNotificationToast(`🔁 Reordered ${historicalOrder.items.length} items from ${historicalOrder.merchant} into cart!`);
    setTimeout(() => setReorderNotificationToast(null), 4200);
  };

  // Place Cart Order & Dispatch Real-Time Milestone Engine
  const handlePlaceCartOrder = () => {
    if (cartItems.length === 0) return;
    setIsPlacingOrder(true);
    triggerHaptic([100, 50, 150]);
    playHarmonicChime('success');

    setTimeout(() => {
      const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const primaryMerchant = cartItems[0]?.merchant || "SignShift Gourmet";

      // Update active order state in AppContext
      if (setOrder) {
        setOrder(prev => ({
          ...prev,
          id: newOrderId,
          merchantName: primaryMerchant,
          merchantAddress: "108 Market Street Promenade",
          orderItems: cartItems.map(it => ({
            name: it.name,
            qty: it.qty,
            price: it.priceStr || `₹${it.priceNum}`,
            notes: it.notes || ""
          })),
          totalAmount: `₹${cartGrandTotal}`,
          status: "pickup",
          pickupEta: "4 mins",
          deliveryEta: "12 mins",
          distance: "1.2 km",
          gateCode: order.gateCode || "4022",
          customerAddress: order.customerAddress || "Flat 402, Green Glen Towers",
          riderInfo: {
            name: "Julian S.",
            rating: "4.98 ⭐",
            deliveriesCount: "1,424+",
            isDeafMute: true,
            badges: ["Deaf / Non-Verbal Partner", "Top Delivery Pro", "SignShift Certified"]
          },
          chatMessages: [
            {
              id: Date.now(),
              sender: 'system',
              text: `Order #${newOrderId} placed successfully! Kitchen has received your items. Delivery directive: "${deliveryDirective}".`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        }));
      }

      // Rewards & Coins logic
      if (deliverWithDeafCourier && awardCustomerCoins) {
        awardCustomerCoins(50, `Inclusive Delivery Booking (#${newOrderId})`);
      }
      if (redeemCoins && coinDiscount > 0 && awardCustomerCoins) {
        awardCustomerCoins(-100, `SignCoins Redeemed for Discount (Order #${newOrderId})`);
      }

      if (pushNotification) {
        pushNotification(
          "Order Dispatched ⚡", 
          `Order #${newOrderId} from ${primaryMerchant} (₹${cartGrandTotal}) is now in kitchen prep!`, 
          'order'
        );
      }

      // Celebratory feedback
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 }
      });

      // Clear cart & close modal
      setCartItems([]);
      setShowCartModal(false);
      setIsPlacingOrder(false);
      setIsLiveHudCollapsed(false);

      // Scroll smoothly to top Live HUD
      const hudEl = document.getElementById('live-hud');
      if (hudEl) {
        hudEl.scrollIntoView({ behavior: 'smooth' });
      }

      setReorderNotificationToast(`🎉 Order #${newOrderId} Dispatched! Tracking live on HUD with Gate OTP ${order.gateCode || '4022'}.`);
      setTimeout(() => setReorderNotificationToast(null), 5000);
    }, 600);
  };

  // Send Direct Message
  const handleSendTextMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendCustomerMessage(inputText);
    setInputText("");
    triggerHaptic([50]);
  };

  // Voice Dictation
  const handleStartVoiceDictation = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = LANG_LOCALES[language] || 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.start();
    } else {
      setIsListening(true);
      setTimeout(() => {
        setInputText(custLanguage.sampleMsg);
        setIsListening(false);
      }, 1400);
    }
  };

  // Profile Save
  const handleSaveProfileCredentials = (e) => {
    e.preventDefault();
    if (!user) return;
    updateUserProfile(user.id, {
      name: editName,
      email: editEmail,
      password: editPassword,
      phone: editPhone
    });
    confetti({ particleCount: 60, spread: 70 });
    setShowProfileEditor(false);
  };

  // Filtering
  const filteredMerchants = FAVORITE_MERCHANTS_DATA.filter(m => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.cuisine.toLowerCase().includes(q) || m.usualMeal.toLowerCase().includes(q);
    }
    if (favFilter === "OPEN") return m.isOpen;
    if (favFilter === "FAST") return parseInt(m.etaStr) <= 15;
    return true;
  });

  const filteredPastHistory = PAST_ORDER_ARCHIVE.filter(h => {
    if (historyFilter === "FOOD") return h.category === "food";
    if (historyFilter === "GROCERY") return h.category === "grocery";
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8 pb-32 text-slate-100 font-sans selection:bg-[#00F2FE] selection:text-slate-950">
      
      {/* -------------------------------------------------------------
          TOP BAR: OBSIDIAN GLASS DOCK (ADDRESS, SEARCH, COINS, PROFILE)
      ------------------------------------------------------------- */}
      <header className="rounded-3xl p-3.5 sm:p-4 border border-white/[0.08] bg-[#080B10]/90 backdrop-blur-2xl shadow-2xl flex flex-wrap items-center justify-between gap-3">
        
        {/* Address Switcher Trigger */}
        <button
          onClick={() => setShowAddressModal(true)}
          className="min-h-[44px] flex items-center gap-3 bg-slate-900/80 hover:bg-slate-800/90 px-3.5 py-2 rounded-2xl border border-white/[0.08] hover:border-cyan-400/80 transition-all text-left group shadow-inner"
          title="Switch delivery destination and linked Gate OTP"
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="max-w-[170px] sm:max-w-[240px] truncate">
            <span className="block text-[10px] font-black uppercase tracking-wider text-cyan-400 leading-none">
              Deliver To ({savedAddresses.find(a => a.address === order.customerAddress)?.label || 'Home'})
            </span>
            <span className="block text-xs font-extrabold text-white truncate mt-0.5">
              {order.customerAddress || "Flat 402, Green Glen Towers"}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition" />
        </button>

        {/* Global Search Bar */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search favorites, dishes, groceries (e.g. Sourdough, Risotto)..."
            className="w-full min-h-[44px] pl-10 pr-4 py-2 bg-slate-900/80 border border-white/[0.08] focus:border-cyan-400 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none transition shadow-inner"
          />
        </div>

        {/* Champagne Gold SignCoins Chip, Cart Pill & Profile Badge */}
        <div className="flex items-center gap-2">
          <div className="min-h-[44px] px-3.5 py-1.5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center gap-2 shadow-sm">
            <span className="text-xs font-mono font-black text-[#E5C07B] tracking-wide">
              {(customerWallet?.signCoins || 450).toLocaleString()} 🪙
            </span>
          </div>

          {/* Cart Trigger Button */}
          <button
            onClick={() => setShowCartModal(true)}
            className="min-h-[44px] px-3.5 py-1.5 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 flex items-center gap-2 shadow-sm text-cyan-300 transition group"
            title="View Active Cart & Checkout"
          >
            <ShoppingCart className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
            <span className="text-xs font-mono font-black">
              Cart ({cartTotalItemCount})
            </span>
            {cartItems.length > 0 && (
              <span className="text-[10px] font-mono text-emerald-300 font-extrabold bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
                ₹{cartGrandTotal}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setEditName(user?.name || 'Sarah Jenkins');
              setEditEmail(user?.email || 'sarah.j@signshift.io');
              setEditPassword(user?.password || '••••••••');
              setEditPhone(user?.phone || '+1 (555) 234-5678');
              setShowProfileEditor(true);
            }}
            className="min-h-[44px] flex items-center gap-2 p-1 bg-slate-900/80 hover:bg-slate-800 rounded-2xl border border-white/[0.08] hover:border-[#D4AF37]/80 transition shadow-sm"
            title="Customer Credentials & Verification Settings"
          >
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"} 
              alt={user?.name || "Sarah"} 
              className="w-9 h-9 rounded-xl object-cover border border-[#D4AF37]/60"
            />
          </button>
        </div>

      </header>

      {/* Floating 1-Tap Reorder Feedback Banner */}
      {reorderNotificationToast && (
        <div className="p-3.5 bg-gradient-to-r from-cyan-950/95 via-slate-900/95 to-emerald-950/95 border-2 border-cyan-400 text-cyan-200 rounded-2xl text-xs font-extrabold flex items-center justify-between gap-3 animate-fadeIn shadow-2xl">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse flex-shrink-0" />
            <span>{reorderNotificationToast}</span>
          </div>
          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-mono uppercase font-black">
            Fulfillment Queued
          </span>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODULE A & B: LIVE DELIVERY TRACKING HUD & 3D SIGN AVATAR MIRROR
      ------------------------------------------------------------- */}
      <section id="live-hud" className="rounded-3xl border border-white/[0.12] bg-[#080B10]/95 backdrop-blur-2xl shadow-2xl overflow-hidden relative">
        
        {/* HUD Top Bar Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-4 bg-slate-950/70">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-2xl shadow-inner">
              🛵
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
                  Arriving in <span className="text-cyan-300 font-mono font-black">{order.deliveryEta || '8 mins'}</span> • 1.2 km away
                </h2>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                From: <strong className="text-white font-serif">{order.merchantName || "L'Atelier Culinaire"}</strong> • Ticket #{order.id || "ORD-9482"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiveHudCollapsed(!isLiveHudCollapsed)}
              className="min-h-[44px] px-3.5 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/[0.08] rounded-2xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>{isLiveHudCollapsed ? "Expand Telemetry HUD" : "Collapse HUD"}</span>
              {isLiveHudCollapsed ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronUp className="w-4 h-4 text-cyan-400" />}
            </button>
          </div>
        </div>

        {/* Persistent Tracking Canvas */}
        {!isLiveHudCollapsed && (
          <div className="p-5 sm:p-6 space-y-6 animate-fadeIn">
            
            {/* Dynamic 4-Stage Stepper */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-900/40 border border-white/[0.06]">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1 text-cyan-300 font-mono uppercase tracking-wider">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" /> Live Transit Telemetry
                </span>
                <span className="text-emerald-400 font-mono uppercase bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/80">
                  Status: {order.status.toUpperCase()}
                </span>
              </div>

              {/* Progress Glow Bar */}
              <div className="relative pt-2 pb-1">
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/[0.08]">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-[#00F2FE] rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                    style={{
                      width: order.status === 'pickup' ? '25%' 
                        : order.status === 'en_route' ? '65%' 
                        : order.status === 'arrived' ? '90%' 
                        : '100%'
                    }}
                  />
                </div>

                {/* 4 Discrete Milestones */}
                <div className="grid grid-cols-4 text-center pt-2.5 text-[11px] font-mono tracking-wider font-extrabold">
                  <span className={order.status === 'pickup' ? 'text-cyan-300 font-black' : 'text-slate-500'}>
                    01 Kitchen Prep
                  </span>
                  <span className={order.status === 'en_route' ? 'text-cyan-300 font-black' : 'text-slate-500'}>
                    02 Courier Picked
                  </span>
                  <span className={order.status === 'arrived' ? 'text-cyan-300 font-black' : 'text-slate-500'}>
                    03 En Route
                  </span>
                  <span className={order.status === 'delivered' ? 'text-emerald-400 font-black' : 'text-slate-600'}>
                    04 At Doorstep
                  </span>
                </div>
              </div>
            </div>

            {/* Assigned Courier Card with Verified Accessibility Badge */}
            <div className="p-4 sm:p-5 bg-slate-900/60 rounded-2xl border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img 
                    src={order.riderInfo?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                    alt={order.riderInfo?.name || "Julian S."} 
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400 shadow-md"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 border-2 border-slate-950 flex items-center justify-center text-[10px]">
                    🤟
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-white">
                      {order.riderInfo?.name || "Julian S."}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-[#D4AF37]/15 text-[#E5C07B] border border-[#D4AF37]/30">
                      4.98 ★
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    TVS iQube (KA-04-ER-9821) • {order.riderInfo?.deliveriesCount || "1,420+"} Deliveries
                  </p>
                  
                  {/* Verified Accessibility Chip */}
                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/80 border border-cyan-500/40 rounded-xl text-xs text-cyan-200 font-extrabold shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Deaf / Non-Verbal Verified Courier</span>
                    <span className="hidden sm:inline text-slate-400 font-normal text-[10px]">• Calls Rerouted to Sign Mirror</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
                <button
                  onClick={onOpenVoiceAgent}
                  className="min-h-[44px] px-4 py-2 bg-gradient-to-r from-cyan-400 via-cyan-500 to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-slate-950" />
                  <span>Call AI Voice Agent 🤖</span>
                </button>
                <button
                  onClick={() => openTransferModal('rider')}
                  className="min-h-[44px] px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow"
                  title="Switch to another nearby available courier"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
                  <span>Switch Courier</span>
                </button>
              </div>
            </div>

            {/* OTP Vault Container & Segmented Address Switcher */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Delivery Gate Verification OTP Vault */}
              <div className="md:col-span-5 p-4 sm:p-5 rounded-2xl bg-cyan-950/30 border-2 border-cyan-400/50 flex flex-col justify-between space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300 font-black flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" /> Gate Verification OTP Vault
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Syncs to Courier</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-white bg-slate-950/90 px-4 py-1.5 rounded-2xl border border-cyan-400/40 shadow-inner">
                    {order.gateCode || "4022"}
                  </span>

                  <button
                    onClick={handleCopyOtpCode}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-mono font-black transition flex items-center gap-1.5 shadow ${
                      copiedOtp 
                        ? 'bg-emerald-400 text-slate-950' 
                        : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 active:scale-95'
                    }`}
                  >
                    {copiedOtp ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedOtp ? "Copied! ✓" : "Tap to Copy"}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 leading-tight">
                  Auto-shared with {order.riderInfo?.name || 'courier'} to unlock community gate or intercom barrier.
                </p>
              </div>

              {/* Segmented Destination Switcher */}
              <div className="md:col-span-7 p-4 sm:p-5 bg-slate-900/60 rounded-2xl border border-white/[0.08] flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-black flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Destination & OTP Switcher:
                  </span>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="min-h-[44px] text-xs text-cyan-400 hover:text-white font-extrabold flex items-center gap-1"
                  >
                    + Manage Book
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {savedAddresses.slice(0, 3).map((addr) => {
                    const isSelected = order.customerAddress === addr.address;
                    return (
                      <button
                        key={addr.id || addr.label}
                        onClick={() => handleSelectAddressDestination(addr)}
                        className={`min-h-[44px] p-2.5 rounded-xl text-left transition border ${
                          isSelected
                            ? 'bg-cyan-950/90 border-cyan-400 text-white shadow-md ring-1 ring-cyan-400'
                            : 'bg-slate-950/80 border-white/[0.06] text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black truncate">{addr.label}</span>
                          <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400' : 'bg-slate-700'}`} />
                        </div>
                        <span className="text-[11px] font-mono text-[#E5C07B] font-extrabold block mt-0.5">
                          OTP: {addr.gateCode || '4022'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <p className="text-[11px] text-slate-400 truncate font-mono">
                  Active Drop: <strong className="text-white font-sans">{order.customerAddress}</strong>
                </p>
              </div>

            </div>

            {/* 🤟 3D WebGL Sign Avatar Mirror & Quick Directives */}
            <div className="p-5 bg-slate-950/95 rounded-2xl border-2 border-cyan-500/40 space-y-3.5 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🤟</span>
                  <div>
                    <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                      <span>3D Sign Language Avatar Mirror</span>
                      <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-700 px-2 py-0.5 rounded font-mono">
                        Procedural Kinematics
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Visualizing directive for courier: <strong className="text-cyan-300 font-mono uppercase">"{activeMirrorSign}"</strong>
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
                  ⚡ Client-Side WebGL 60 FPS
                </span>
              </div>

              {/* Three.js 3D Avatar Viewport */}
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-slate-900/60 flex items-center justify-center shadow-inner">
                <SignAvatar3D activeSignKey={activeMirrorSign} height="260px" />
              </div>

              {/* 1-Tap Directive Quick Chips */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-black block">
                  Tap Preset Directive to Send & Mirror in 3D:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "LEAVE AT DOOR", label: "🚪 Leave at door", text: "Please leave the parcel outside my doorstep." },
                    { key: "GATE CODE", label: "🔑 Gate code 4022", text: "Gate access code is 4022. You can enter through west entrance." },
                    { key: "TRAFFIC DELAY", label: "⏳ Wait 2 mins", text: "Taking the elevator down, please wait 2 minutes." },
                    { key: "THANK YOU", label: "🙏 Thank you!", text: "Thank you for the barrier-free delivery!" },
                    { key: "HELLO", label: "🔔 Ring Bell / Knock", text: "Please ring the doorbell when you drop the food." }
                  ].map((chip) => (
                    <button
                      key={chip.key}
                      onClick={() => handleSelectDirective(chip.key, chip.text)}
                      className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-extrabold transition border flex items-center gap-1.5 ${
                        activeMirrorSign === chip.key
                          ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-lg font-black scale-105'
                          : 'bg-slate-900/90 text-slate-300 border-white/[0.08] hover:border-cyan-400 active:scale-95'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Gratuity & SignCoins Loyalty Engine */}
            <div className="p-4 sm:p-5 bg-slate-900/60 rounded-2xl border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="font-serif text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D4AF37]" /> Courier Tipping Ledger & SignCoins:
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  100% of gratuity goes directly to {order.riderInfo?.name || 'Julian S.'}. You earn <strong className="text-[#E5C07B] font-mono">+50🪙 SignCoins</strong> for supporting inclusive couriers!
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[2, 4, 6].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => handleSendCourierTip(amt)}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-mono font-black transition border ${
                      selectedTip === amt
                        ? 'bg-[#D4AF37] text-slate-950 border-[#D4AF37] shadow-lg'
                        : 'bg-slate-950/80 text-[#E5C07B] border-[#D4AF37]/40 hover:bg-slate-800'
                    }`}
                  >
                    ${amt} (+50🪙)
                  </button>
                ))}
                <button
                  onClick={() => handleSendCourierTip(10)}
                  className="min-h-[44px] px-3.5 py-2 bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-white/[0.08] rounded-xl text-xs font-bold"
                >
                  Custom
                </button>
              </div>
            </div>

            {tipSuccessFeedback && (
              <div className="p-3 bg-emerald-950/90 border border-emerald-500/70 rounded-xl text-xs font-extrabold text-emerald-200 text-center animate-fadeIn shadow-lg">
                {tipSuccessFeedback}
              </div>
            )}

            {/* Telemetry GPS Map */}
            <div className="pt-1">
              <LiveGpsTrackerMap isRiderView={false} />
            </div>

          </div>
        )}
      </section>

      {/* -------------------------------------------------------------
          MODULE D: "ORDER AGAIN IN 1-TAP" HORIZONTAL RAIL (ZEPTO / BLINKIT)
      ------------------------------------------------------------- */}
      <section id="sku-reorder-rail" className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-400/30">🔁</span>
              <span>Order Again in 1-Tap</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Habitual SKU replenishment delivered in 10–15 mins with non-verbal delivery handover.
            </p>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800 font-extrabold">
            ⚡ 10-Min Fast Track
          </span>
        </div>

        {/* Horizontal Scroll Rail */}
        <div className="flex gap-3.5 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-slate-800">
          {REORDER_SKU_ITEMS.map((sku) => (
            <div 
              key={sku.id}
              className="flex-shrink-0 w-48 sm:w-52 bg-slate-900/60 hover:bg-slate-850 rounded-2xl border border-white/[0.08] hover:border-cyan-400/80 p-3.5 flex flex-col justify-between transition-all duration-200 shadow-xl group"
            >
              <div>
                <div className="relative w-full h-32 rounded-xl overflow-hidden mb-2.5 bg-slate-950">
                  <img 
                    src={sku.img} 
                    alt={sku.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                  />
                  <span className="absolute top-1.5 left-1.5 bg-slate-950/90 backdrop-blur-md text-[10px] font-mono font-black text-[#E5C07B] px-2 py-0.5 rounded border border-[#D4AF37]/30">
                    {sku.rating}
                  </span>
                  <span className="absolute bottom-1.5 right-1.5 bg-slate-950/90 backdrop-blur-md text-[9px] font-mono font-bold text-slate-300 px-2 py-0.5 rounded">
                    Ordered {sku.orderCount}x
                  </span>
                </div>

                <h3 className="font-serif text-xs font-bold text-white line-clamp-1 leading-snug">{sku.name}</h3>
                <p className="text-[10px] text-slate-400 line-clamp-1">{sku.merchant}</p>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/[0.08]">
                <span className="text-sm font-black text-cyan-300 font-mono">{sku.priceStr}</span>
                {cartItems.find(ci => ci.id === sku.id || ci.name === sku.name) ? (
                  <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-xl border border-emerald-500/40">
                    <button
                      onClick={() => handleUpdateCartQty(sku.id, -1)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-mono font-black text-emerald-300 px-1 min-w-[16px] text-center">
                      {cartItems.find(ci => ci.id === sku.id || ci.name === sku.name)?.qty}
                    </span>
                    <button
                      onClick={() => handleUpdateCartQty(sku.id, 1)}
                      className="w-7 h-7 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center text-xs font-black transition"
                      title="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleReorderSKU(sku)}
                    className="min-h-[44px] px-3.5 py-1.5 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:brightness-110 active:scale-95 text-slate-950 text-xs font-mono font-black rounded-xl shadow-lg transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-950" />
                    <span>+ REORDER</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------
          MODULE E: FAVORITE MERCHANTS & "YOUR USUAL" (SWIGGY STYLE)
      ------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">❤️</span>
              <span>Favorite Merchants & Your Usual</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Bookmarked outlets with pre-computed meal presets ready for instant dispatch.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-white/[0.08] text-xs font-bold">
            <button
              onClick={() => setFavFilter("ALL")}
              className={`min-h-[44px] px-3 py-1 rounded-xl transition ${favFilter === "ALL" ? "bg-cyan-500 text-slate-950 font-black shadow" : "text-slate-400 hover:text-white"}`}
            >
              All Favorites
            </button>
            <button
              onClick={() => setFavFilter("OPEN")}
              className={`min-h-[44px] px-3 py-1 rounded-xl transition flex items-center gap-1 ${favFilter === "OPEN" ? "bg-emerald-500 text-slate-950 font-black shadow" : "text-slate-400 hover:text-white"}`}
            >
              <span>Open Now 🟢</span>
            </button>
            <button
              onClick={() => setFavFilter("FAST")}
              className={`min-h-[44px] px-3 py-1 rounded-xl transition ${favFilter === "FAST" ? "bg-[#D4AF37] text-slate-950 font-black shadow" : "text-slate-400 hover:text-white"}`}
            >
              Under 15 mins
            </button>
          </div>
        </div>

        {/* Curated Outlet Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredMerchants.map((merch) => (
            <div 
              key={merch.id}
              className="p-5 rounded-3xl border border-white/[0.08] bg-slate-900/60 hover:border-cyan-500/50 transition-all duration-200 space-y-4 flex flex-col justify-between shadow-2xl group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <img 
                      src={merch.logo} 
                      alt={merch.name} 
                      className="w-14 h-14 rounded-2xl object-cover border border-white/[0.12] shadow"
                    />
                    <div>
                      <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                        <span>{merch.name}</span>
                        <span className="text-[10px] font-mono bg-[#D4AF37]/15 text-[#E5C07B] font-black px-1.5 py-0.5 rounded border border-[#D4AF37]/30">
                          {merch.rating}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{merch.cuisine} • {merch.distanceStr}</p>
                      <span className="text-[11px] text-emerald-400 font-mono font-bold block mt-1">
                        Open Now 🟢 • {merch.etaStr}
                      </span>
                    </div>
                  </div>

                  <span className="text-red-400 hover:scale-125 transition cursor-pointer text-lg">
                    ❤️
                  </span>
                </div>

                {/* Pre-Computed "Your Usual" Box */}
                <div className="mt-4 p-3 rounded-2xl bg-slate-950/90 border border-white/[0.08] flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">
                    The Usual: <strong className="text-cyan-300 font-serif">{merch.usualMeal}</strong>
                  </span>
                  <span className="text-xs font-mono font-black text-[#E5C07B]">
                    {merch.usualPriceStr}
                  </span>
                </div>
              </div>

              {/* Actions: Browse Menu vs Repeat Usual */}
              <div className="flex items-center gap-2.5 pt-2 border-t border-white/[0.08]">
                <button
                  onClick={() => {
                    setActiveMenuMerchant(merch);
                    confetti({ particleCount: 30, spread: 50 });
                  }}
                  className="min-h-[44px] flex-1 py-2 bg-slate-950 hover:bg-slate-850 text-slate-300 border border-white/[0.08] hover:border-cyan-400/50 rounded-xl text-xs font-bold transition text-center flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Browse Menu</span>
                </button>
                <button
                  onClick={() => handleRepeatUsualMeal(merch)}
                  className="min-h-[44px] flex-1 py-2 bg-gradient-to-r from-[#D4AF37] via-amber-500 to-emerald-400 hover:brightness-110 active:scale-95 text-slate-950 font-black rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-4 h-4 text-slate-950" />
                  <span>⚡ Repeat Usual ({merch.usualPriceStr})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------
          MODULE F: GRANULAR ORDER HISTORY & TAX INVOICE ARCHIVE
      ------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">📦</span>
              <span>Past Order History & Invoices</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified records with exact Gate OTPs, courier badges, and tax receipts.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-white/[0.08] text-xs font-bold">
            <button
              onClick={() => setHistoryFilter("ALL")}
              className={`min-h-[44px] px-3 py-1 rounded-xl transition ${historyFilter === "ALL" ? "bg-purple-500 text-slate-950 font-black shadow" : "text-slate-400 hover:text-white"}`}
            >
              All Records
            </button>
            <button
              onClick={() => setHistoryFilter("FOOD")}
              className={`min-h-[44px] px-3 py-1 rounded-xl transition ${historyFilter === "FOOD" ? "bg-purple-500 text-slate-950 font-black shadow" : "text-slate-400 hover:text-white"}`}
            >
              Dining
            </button>
            <button
              onClick={() => setHistoryFilter("GROCERY")}
              className={`min-h-[44px] px-3 py-1 rounded-xl transition ${historyFilter === "GROCERY" ? "bg-purple-500 text-slate-950 font-black shadow" : "text-slate-400 hover:text-white"}`}
            >
              Grocery
            </button>
          </div>
        </div>

        {/* History Item Cards */}
        <div className="space-y-3.5">
          {filteredPastHistory.map((pastOrder) => (
            <div 
              key={pastOrder.id}
              className="p-5 rounded-3xl border border-white/[0.08] bg-slate-900/60 space-y-3.5 shadow-xl hover:border-slate-700 transition"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-white/[0.08] pb-3">
                <div>
                  <h3 className="font-serif text-base font-bold text-white">
                    {pastOrder.merchant} — {pastOrder.neighborhood}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">{pastOrder.id} • {pastOrder.timestamp}</span>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                  {pastOrder.statusBadge}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">Items Itemized:</span>
                  <p className="text-slate-200 font-medium leading-relaxed">{pastOrder.summaryLine}</p>
                  <p className="text-slate-400 text-xs mt-1">Paid via: <span className="text-white font-mono">{pastOrder.paymentMethod}</span></p>
                </div>

                <div className="sm:text-right space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Total Billed:</span>
                  <span className="text-lg font-black text-cyan-300 font-mono block">{pastOrder.total}</span>
                  <span className="text-xs text-[#E5C07B] font-mono block font-black">Gate OTP Used: {pastOrder.gateCodeUsed}</span>
                  <span className="text-xs text-slate-400 block font-medium">Courier: {pastOrder.courierName} ({pastOrder.courierBadge})</span>
                </div>
              </div>

              {/* Actions: Download Invoice & Repeat Order */}
              <div className="pt-2 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => setInvoiceModalOrder(pastOrder)}
                  className="min-h-[44px] px-4 py-2 bg-slate-950 hover:bg-slate-850 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2"
                >
                  <Receipt className="w-4 h-4 text-cyan-400" />
                  <span>📄 Download Tax Invoice</span>
                </button>

                <button
                  onClick={() => handleRepeatEntireHistoricalOrder(pastOrder)}
                  className="min-h-[44px] px-4 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:brightness-110 active:scale-95 text-slate-950 font-mono font-black rounded-xl text-xs transition flex items-center gap-1.5 shadow-lg"
                >
                  <RotateCcw className="w-4 h-4 text-slate-950" />
                  <span>🔁 Repeat Entire Order ({pastOrder.items.length} Items)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------
          DUAL COMMUNICATION CHAT BRIDGE (FALLBACK TEXT & VOICE)
      ------------------------------------------------------------- */}
      <section className="rounded-3xl p-5 sm:p-6 border border-white/[0.08] bg-[#080B10]/90 backdrop-blur-2xl space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/15 text-cyan-400 rounded-2xl border border-cyan-500/30">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white leading-tight">
                Direct Visual Chat with Courier
              </h3>
              <p className="text-xs text-slate-400">
                Text messages converted directly into visual gestures on courier device.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-2xl border border-cyan-500/40">
            <Globe className="w-4 h-4 text-cyan-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                  {l.flag} {l.nativeName || l.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chat Thread */}
        <div className="bg-slate-950/90 rounded-2xl p-4 border border-white/[0.06] space-y-3 min-h-[160px] max-h-[260px] overflow-y-auto">
          {order.chatMessages.map((msg) => {
            const messageText = translateChatMessage(msg, language);
            const isMe = msg.sender === 'customer';
            return (
              <div 
                key={msg.id}
                className={`p-3.5 rounded-2xl text-xs space-y-1.5 ${
                  isMe 
                    ? 'bg-cyan-950/70 border border-cyan-800 text-cyan-100 ml-8' 
                    : msg.sender === 'rider'
                    ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-100 mr-8'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 text-center italic'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-mono font-bold opacity-75">
                  <span>{isMe ? "You (Customer)" : msg.sender === 'rider' ? `Courier ${order.riderInfo?.name || 'Julian S.'}` : "Dispatch System"}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="text-sm font-medium leading-relaxed">{messageText}</p>
                {msg.sender === 'rider' && (
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => speakText(messageText, language)}
                      className="min-h-[32px] text-[10px] text-emerald-300 hover:text-white font-mono font-bold flex items-center gap-1 bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-700"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Listen Aloud
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendTextMessage} className="flex gap-2">
          <button
            type="button"
            onClick={handleStartVoiceDictation}
            className={`min-h-[44px] px-3.5 rounded-2xl border transition flex items-center justify-center ${
              isListening
                ? 'bg-red-500 text-white border-red-400 animate-bounce'
                : 'bg-slate-950 hover:bg-slate-850 text-cyan-400 border-white/[0.08]'
            }`}
            title="Speech-to-Text Voice Dictation"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? "Listening to your voice..." : "Type custom delivery instruction..."}
            className="flex-1 min-h-[44px] px-4 py-2.5 bg-slate-950 border border-white/[0.08] rounded-2xl text-xs sm:text-sm text-white focus:border-cyan-400 focus:outline-none placeholder:text-slate-500"
          />

          <button
            type="submit"
            className="min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition flex items-center gap-1.5"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </section>

      {/* -------------------------------------------------------------
          MODAL: TAX INVOICE & RECEIPT DOWNLOAD
      ------------------------------------------------------------- */}
      {invoiceModalOrder && (
        <div className="fixed inset-0 z-50 bg-[#080B10]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-cyan-400/80 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-fadeIn text-slate-100">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-5 h-5 text-cyan-400" />
                <h3 className="font-serif text-base font-bold text-white">Official Tax Invoice Receipt</h3>
              </div>
              <button 
                onClick={() => setInvoiceModalOrder(null)} 
                className="min-h-[44px] text-slate-400 hover:text-white p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-white/[0.08] space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-white/[0.08] pb-2">
                <div>
                  <span className="font-serif font-black text-white text-base block">🤟 SignShift Delivery</span>
                  <span className="text-slate-400 text-[10px]">GSTIN: 29AAACS1234F1Z8</span>
                </div>
                <div className="text-right">
                  <span className="text-cyan-300 font-bold block">{invoiceModalOrder.id}</span>
                  <span className="text-slate-400 text-[10px]">{invoiceModalOrder.timestamp}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">MERCHANT / KITCHEN:</span>
                <span className="font-bold text-white font-serif">{invoiceModalOrder.merchant} ({invoiceModalOrder.neighborhood})</span>
                <span className="text-slate-400 block text-[10px] mt-1">DESTINATION: {order.customerAddress} (Gate OTP: {invoiceModalOrder.gateCodeUsed})</span>
                <span className="text-emerald-400 block text-[10px]">COURIER: {invoiceModalOrder.courierName} ({invoiceModalOrder.courierBadge})</span>
              </div>

              {/* Items List */}
              <div className="border-t border-b border-white/[0.08] py-2.5 space-y-1.5">
                {invoiceModalOrder.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-slate-300">
                    <span>{it.qty}x {it.name}</span>
                    <span>{it.price}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-slate-400 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{invoiceModalOrder.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST / Platform Taxes (5%):</span>
                  <span>{invoiceModalOrder.tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Partner Handling Fee:</span>
                  <span>{invoiceModalOrder.deliveryFee}</span>
                </div>
                <div className="flex justify-between text-white font-black text-sm pt-1.5 border-t border-white/[0.08]">
                  <span>TOTAL PAID:</span>
                  <span className="text-cyan-300">{invoiceModalOrder.total}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[10px] text-center">
                ✓ Non-Verbal Verification Handover Logged via Gate OTP {invoiceModalOrder.gateCodeUsed}
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => {
                  handleRepeatEntireHistoricalOrder(invoiceModalOrder);
                  setInvoiceModalOrder(null);
                }}
                className="min-h-[44px] flex-1 py-2.5 bg-gradient-to-r from-cyan-400 via-cyan-500 to-emerald-400 text-slate-950 font-mono font-black rounded-xl text-xs shadow-lg flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 transition"
              >
                <RotateCcw className="w-4 h-4 text-slate-950" />
                <span>Repeat & Go to Cart ({invoiceModalOrder.total})</span>
              </button>
              <button
                onClick={() => window.print()}
                className="min-h-[44px] px-4 py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-300 font-mono font-bold rounded-xl text-xs border border-white/[0.08] flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                <span>Print</span>
              </button>
              <button
                onClick={() => setInvoiceModalOrder(null)}
                className="min-h-[44px] px-4 py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-400 rounded-xl text-xs font-bold border border-white/[0.08]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL: ADDRESS BOOK & GATE OTP MANAGER
      ------------------------------------------------------------- */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-[#080B10]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-emerald-500/70 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Saved Address Book & Gate OTPs</span>
              </h3>
              <button onClick={() => setShowAddressModal(false)} className="min-h-[44px] text-slate-400 hover:text-white p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {savedAddresses.map((addr) => (
                <div key={addr.id || addr.address} className="p-3.5 bg-slate-950 rounded-2xl border border-white/[0.08] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-black text-white block text-sm">{addr.label}</span>
                    <span className="text-slate-400 block text-xs mt-0.5">{addr.address}</span>
                    <span className="text-[#E5C07B] font-mono text-xs font-black block mt-1">Gate OTP: {addr.gateCode || '4022'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSelectAddressDestination(addr)}
                      className="min-h-[36px] px-3.5 py-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-black rounded-xl text-xs shadow"
                    >
                      Deliver
                    </button>
                    {savedAddresses.length > 1 && (
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="p-2 text-slate-500 hover:text-red-400"
                        title="Delete Address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Form */}
            <form onSubmit={handleSaveCustomAddress} className="p-3.5 bg-slate-950 rounded-2xl border border-white/[0.08] space-y-2.5 text-xs">
              <span className="font-mono uppercase tracking-wider text-cyan-300 font-black block">➕ Add New Destination & Gate OTP</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Street Address..."
                  value={newStreetAddress}
                  onChange={(e) => setNewStreetAddress(e.target.value)}
                  className="sm:col-span-2 min-h-[44px] px-3.5 py-2 bg-slate-900 border border-white/[0.08] rounded-xl text-white focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Label (e.g. Gym)"
                  value={newAddrLabel}
                  onChange={(e) => setNewAddrLabel(e.target.value)}
                  className="min-h-[44px] px-3.5 py-2 bg-slate-900 border border-white/[0.08] rounded-xl text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Gate / Intercom OTP (e.g. 5092)"
                  value={newGateCode}
                  onChange={(e) => setNewGateCode(e.target.value)}
                  className="flex-1 min-h-[44px] px-3.5 py-2 bg-slate-900 border border-white/[0.08] rounded-xl text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="min-h-[44px] px-4 py-2 bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-mono font-black rounded-xl text-xs shadow-lg"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL: PROFILE CREDENTIALS & SECURITY
      ------------------------------------------------------------- */}
      {showProfileEditor && (
        <div className="fixed inset-0 z-50 bg-[#080B10]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-[#D4AF37]/80 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
              <h3 className="font-serif text-base font-bold text-white">✏️ Customer Security Credentials</h3>
              <button onClick={() => setShowProfileEditor(false)} className="min-h-[44px] text-slate-400 hover:text-white p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfileCredentials} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Full Patron Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 bg-slate-950 border border-white/[0.08] rounded-xl text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Email Account</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 bg-slate-950 border border-white/[0.08] rounded-xl text-white font-mono focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Password</label>
                <input
                  type="text"
                  required
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 bg-slate-950 border border-white/[0.08] rounded-xl text-white font-mono focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Mobile Contact</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 bg-slate-950 border border-white/[0.08] rounded-xl text-white font-mono focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowProfileEditor(false)}
                  className="min-h-[44px] flex-1 py-2 bg-slate-950 text-slate-400 rounded-xl font-bold border border-white/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] flex-1 py-2 bg-gradient-to-r from-[#D4AF37] to-amber-400 text-slate-950 font-black rounded-xl shadow-lg"
                >
                  Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL: BROWSE RESTAURANT MENU WITH ONE-TAP ADD TO CART
      ------------------------------------------------------------- */}
      {activeMenuMerchant && (
        <div className="fixed inset-0 z-50 bg-[#080B10]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-slate-900 border-2 border-cyan-400/80 rounded-3xl p-5 sm:p-6 max-w-2xl w-full max-h-[88vh] overflow-y-auto space-y-5 shadow-2xl animate-fadeIn">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3.5">
                <img 
                  src={activeMenuMerchant.logo} 
                  alt={activeMenuMerchant.name} 
                  className="w-14 h-14 rounded-2xl object-cover border border-white/[0.12] shadow"
                />
                <div>
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                    <span>{activeMenuMerchant.name}</span>
                    <span className="text-[10px] font-mono bg-[#D4AF37]/15 text-[#E5C07B] font-black px-1.5 py-0.5 rounded border border-[#D4AF37]/30">
                      {activeMenuMerchant.rating}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{activeMenuMerchant.cuisine} • {activeMenuMerchant.distanceStr}</p>
                  <span className="text-[11px] text-emerald-400 font-mono font-bold block mt-1">
                    🟢 Open Now • Delivers in {activeMenuMerchant.etaStr}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setActiveMenuMerchant(null)} 
                className="min-h-[44px] text-slate-400 hover:text-white p-2 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items List */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-black block">
                🍽️ Signature Menu & Outlets Specials
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeMenuMerchant.items.map((dish, idx) => {
                  const inCartItem = cartItems.find(ci => ci.name === dish.name && ci.merchant === activeMenuMerchant.name);
                  return (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-white/[0.08] flex flex-col justify-between space-y-3 hover:border-slate-700 transition"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif text-sm font-bold text-white leading-tight">{dish.name}</h4>
                          <span className="text-xs font-mono font-black text-cyan-300">{dish.price}</span>
                        </div>
                        {dish.desc && (
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {dish.desc}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">Freshly Prepared</span>
                        
                        {inCartItem ? (
                          <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-xl border border-emerald-500/50">
                            <button
                              onClick={() => handleUpdateCartQty(inCartItem.id, -1)}
                              className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center text-xs font-bold"
                            >
                              -
                            </button>
                            <span className="text-xs font-mono font-black text-emerald-300 px-1 min-w-[16px] text-center">
                              {inCartItem.qty}
                            </span>
                            <button
                              onClick={() => handleUpdateCartQty(inCartItem.id, 1)}
                              className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-black"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(dish, activeMenuMerchant.name)}
                            className="min-h-[36px] px-3 py-1 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:brightness-110 active:scale-95 text-slate-950 text-xs font-mono font-black rounded-xl shadow transition flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5 text-slate-950" />
                            <span>Add to Cart</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Bar: Quick View Cart */}
            {cartItems.length > 0 && (
              <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-3.5 rounded-2xl">
                <div>
                  <span className="text-xs font-black text-white">{cartTotalItemCount} Items in Cart</span>
                  <span className="text-sm font-mono font-black text-cyan-300 block">Total: ₹{cartGrandTotal}</span>
                </div>
                <button
                  onClick={() => {
                    setActiveMenuMerchant(null);
                    setShowCartModal(true);
                  }}
                  className="min-h-[44px] px-5 py-2 bg-gradient-to-r from-cyan-400 via-cyan-500 to-emerald-400 text-slate-950 font-mono font-black rounded-xl text-xs shadow-lg flex items-center gap-2"
                >
                  <span>Proceed to Cart & Checkout</span>
                  <ChevronRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL: FULL ACTIVE CART & CHECKOUT DRAWER
      ------------------------------------------------------------- */}
      {showCartModal && (
        <div className="fixed inset-0 z-50 bg-[#080B10]/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#0B0F17] border-2 border-cyan-400 rounded-3xl p-5 sm:p-7 max-w-xl w-full max-h-[92vh] overflow-y-auto space-y-5 shadow-[0_0_60px_rgba(6,182,212,0.3)] animate-fadeIn text-slate-100">
            
            {/* Cart Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg">
                  <ShoppingCart className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                    <span>Active Cart & Instant Checkout</span>
                    <span className="text-xs font-mono font-black bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/30">
                      {cartTotalItemCount} {cartTotalItemCount === 1 ? 'Item' : 'Items'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {cartItems.length > 0 ? `Ordering from ${cartItems[0]?.merchant || 'SignShift Kitchen'}` : 'Universal Accessible Checkout'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {cartItems.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="min-h-[44px] text-xs text-slate-400 hover:text-red-400 px-2 py-1 rounded-xl transition flex items-center gap-1"
                    title="Empty Entire Cart"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Empty</span>
                  </button>
                )}
                <button
                  onClick={() => setShowCartModal(false)}
                  className="min-h-[44px] text-slate-400 hover:text-white p-2 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Empty Cart View */}
            {cartItems.length === 0 ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-900 border border-white/[0.08] flex items-center justify-center text-3xl">
                  🛒
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-base font-bold text-white">Your Cart is Currently Empty</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Click <strong>+ REORDER</strong> on any item from the quick-commerce rail, or select <strong>Repeat Usual</strong> from favorite outlets to start a new order.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCartModal(false);
                    const railEl = document.getElementById('sku-reorder-rail');
                    if (railEl) railEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="min-h-[44px] px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-mono font-black rounded-xl text-xs shadow-lg hover:brightness-110 transition"
                >
                  Explore Reorder Menu ⚡
                </button>
              </div>
            ) : (
              /* Populated Cart Content */
              <div className="space-y-5">
                
                {/* Delivery Destination & Linked Gate OTP */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-400/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-300">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold block uppercase">Deliver Destination & Gate OTP</span>
                      <span className="font-bold text-white block mt-0.5">{order.customerAddress || "Flat 402, Green Glen Towers"}</span>
                      <span className="text-[#E5C07B] font-mono font-black text-xs block mt-0.5">
                        Gate Verification OTP: {order.gateCode || "4022"} (Pre-cleared)
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="min-h-[36px] px-3 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-white/[0.08] rounded-xl text-xs font-bold transition"
                  >
                    Change
                  </button>
                </div>

                {/* Itemized Cart List */}
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div 
                      key={item.id}
                      className="p-3 bg-slate-950 rounded-2xl border border-white/[0.08] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.img && (
                          <img 
                            src={item.img} 
                            alt={item.name} 
                            className="w-12 h-12 rounded-xl object-cover border border-white/[0.08] flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-white truncate text-xs">{item.name}</h4>
                          <span className="text-[10px] text-slate-400 block truncate">{item.merchant}</span>
                          <span className="text-xs font-mono font-black text-cyan-300 block mt-0.5">{item.priceStr}</span>
                        </div>
                      </div>

                      {/* Stepper +/- */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/[0.08]">
                          <button
                            onClick={() => handleUpdateCartQty(item.id, -1)}
                            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs transition"
                            title="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-black text-white px-1.5 min-w-[18px] text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => handleUpdateCartQty(item.id, 1)}
                            className="w-7 h-7 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center font-black text-xs transition"
                            title="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="p-2 text-slate-500 hover:text-red-400 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inclusive Deaf / Non-Verbal Partner Option */}
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={deliverWithDeafCourier}
                        onChange={(e) => setDeliverWithDeafCourier(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-400 focus:ring-0 bg-slate-900 border-white/[0.2] cursor-pointer"
                      />
                      <span className="font-extrabold text-emerald-200 text-xs">
                        🤟 Deliver with Deaf / Non-Verbal Courier Partner
                      </span>
                    </label>
                    <span className="text-[10px] font-mono font-black bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                      +50🪙 Reward
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-300/80 leading-relaxed pl-6">
                    Courier receives visual telemetry alerts, translation directives & gate verification automatically. You earn 50 SignCoins upon doorstep handover!
                  </p>

                  {/* Delivery Directive Chips */}
                  <div className="pl-6 pt-1 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Contactless Directive:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {["LEAVE AT DOOR", "RING INTERCOM", "MEET AT GATE", "DO NOT KNOCK"].map((dir) => (
                        <button
                          key={dir}
                          type="button"
                          onClick={() => setDeliveryDirective(dir)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition ${deliveryDirective === dir ? "bg-emerald-500 text-slate-950 font-black shadow" : "bg-slate-900 text-slate-300 hover:text-white border border-white/[0.08]"}`}
                        >
                          {dir}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SignCoins Loyalty Discount Redemption */}
                <div className="p-3 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={redeemCoins}
                      onChange={(e) => setRedeemCoins(e.target.checked)}
                      disabled={(customerWallet?.signCoins || 450) < 100}
                      className="w-4 h-4 rounded text-[#D4AF37] focus:ring-0 bg-slate-900 border-white/[0.2] cursor-pointer"
                    />
                    <div>
                      <span className="font-extrabold text-[#E5C07B] block">Redeem 100🪙 SignCoins for ₹50 Off</span>
                      <span className="text-[10px] text-slate-400 block">
                        Your balance: {(customerWallet?.signCoins || 450).toLocaleString()}🪙 available
                      </span>
                    </div>
                  </label>
                  <span className="text-xs font-mono font-black text-emerald-400">
                    {redeemCoins ? "-₹50" : "Save ₹50"}
                  </span>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-black block">
                    Payment Channel
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("upi")}
                      className={`min-h-[44px] p-2 rounded-xl text-xs font-mono font-bold transition border flex flex-col items-center justify-center gap-0.5 ${paymentMethod === "upi" ? "bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow" : "bg-slate-950 text-slate-300 border-white/[0.08] hover:border-slate-700"}`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Instant UPI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`min-h-[44px] p-2 rounded-xl text-xs font-mono font-bold transition border flex flex-col items-center justify-center gap-0.5 ${paymentMethod === "card" ? "bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow" : "bg-slate-950 text-slate-300 border-white/[0.08] hover:border-slate-700"}`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Card / Debit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`min-h-[44px] p-2 rounded-xl text-xs font-mono font-bold transition border flex flex-col items-center justify-center gap-0.5 ${paymentMethod === "cod" ? "bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow" : "bg-slate-950 text-slate-300 border-white/[0.08] hover:border-slate-700"}`}
                    >
                      <span>💵</span>
                      <span>Cash/Doorstep</span>
                    </button>
                  </div>
                </div>

                {/* Bill Breakdown Receipt */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/[0.08] space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Items Subtotal:</span>
                    <span>₹{cartSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Taxes & GST (5%):</span>
                    <span>₹{cartTax}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Delivery Partner Fee:</span>
                    <span className={cartDeliveryFee === 0 ? "text-emerald-400 font-bold" : ""}>
                      {cartDeliveryFee === 0 ? "FREE (Pro Partner)" : `₹${cartDeliveryFee}`}
                    </span>
                  </div>
                  {coinDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>SignCoins Discount (100🪙):</span>
                      <span>-₹{coinDiscount}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-white/[0.08] flex justify-between text-sm font-black text-white">
                    <span>Grand Total:</span>
                    <span className="text-cyan-300 font-mono text-base">₹{cartGrandTotal}</span>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  onClick={handlePlaceCartOrder}
                  disabled={isPlacingOrder || cartItems.length === 0}
                  className="w-full min-h-[50px] py-3.5 bg-gradient-to-r from-cyan-400 via-cyan-500 to-emerald-400 hover:brightness-110 active:scale-95 text-slate-950 font-mono font-black rounded-2xl text-sm shadow-[0_0_30px_rgba(6,182,212,0.5)] transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isPlacingOrder ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Dispatching Order to Kitchen...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 text-slate-950" />
                      <span>Place Order & Dispatch ⚡ (₹{cartGrandTotal})</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          FLOATING STICKY CART PILL (WHEN ITEMS IN CART & MODAL CLOSED)
      ------------------------------------------------------------- */}
      {cartItems.length > 0 && !showCartModal && (
        <aside 
          aria-label="Active Cart Summary"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-xl p-3.5 bg-[#080B10]/95 backdrop-blur-2xl border-2 border-cyan-400 rounded-3xl shadow-[0_10px_35px_rgba(6,182,212,0.35)] flex items-center justify-between gap-3 animate-fadeIn"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg">
              <ShoppingCart className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white">{cartTotalItemCount} Items Added</span>
                <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-400/30 font-bold truncate max-w-[130px]">
                  {cartItems[0]?.merchant}
                </span>
              </div>
              <span className="text-sm font-black text-cyan-300 font-mono">
                Total: ₹{cartGrandTotal}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowCartModal(true)}
            className="min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-cyan-400 via-cyan-500 to-emerald-400 hover:brightness-110 active:scale-95 text-slate-950 font-mono font-black rounded-2xl text-xs shadow-xl transition flex items-center gap-2"
          >
            <span>View Cart & Checkout</span>
            <ChevronRight className="w-4 h-4 text-slate-950" />
          </button>
        </aside>
      )}

    </div>
  );
};
