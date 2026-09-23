import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SignAvatar3D, SIGN_DICTIONARY } from '../components/SignAvatar3D';
import { LiveGpsTrackerMap } from '../components/LiveGpsTrackerMap';
import { SUPPORTED_LANGUAGES, RIDER_QUICK_SIGNS } from '../constants/languages';
import { 
  CheckCircle2, 
  Navigation, 
  MapPin, 
  Phone, 
  PhoneCall, 
  MessageSquare, 
  Zap, 
  Activity, 
  ChevronDown, 
  Send, 
  Volume2, 
  Globe, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  AlertTriangle, 
  Clock, 
  ThumbsUp, 
  User, 
  ShoppingBag, 
  Mic, 
  Maximize2, 
  Edit3, 
  Plus, 
  X,
  Coins,
  DollarSign,
  Wallet,
  TrendingUp,
  Calendar,
  CreditCard,
  ChevronRight,
  CheckCircle,
  Percent,
  ArrowUpRight,
  RefreshCw,
  Gift,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Available currencies for rider payments conversion
const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', rate: 1.0, label: 'USD ($) US Dollar' },
  INR: { code: 'INR', symbol: '₹', rate: 86.5, label: 'INR (₹) Indian Rupee' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, label: 'EUR (€) Euro' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, label: 'GBP (£) British Pound' },
  JPY: { code: 'JPY', symbol: '¥', rate: 154.0, label: 'JPY (¥) Japanese Yen' },
};

// Granular Daily Telemetry Data (Day 1 through Day 7)
const DAYS_MOCK_DATA = [
  { dayIndex: 1, key: 'day1', label: "Day 1 (Today)", shortLabel: "Day 1", subLabel: "Today", orders: 11, hours: 6.2, totalUSD: 192.50, baseUSD: 93.50, tipsUSD: 41.80, incentivesUSD: 57.20, avgUSD: 17.50, pace: "$31.05/hr" },
  { dayIndex: 2, key: 'day2', label: "Day 2 (Yesterday)", shortLabel: "Day 2", subLabel: "Yesterday", orders: 12, hours: 6.8, totalUSD: 204.00, baseUSD: 102.00, tipsUSD: 45.60, incentivesUSD: 56.40, avgUSD: 17.00, pace: "$30.00/hr" },
  { dayIndex: 3, key: 'day3', label: "Day 3 (2 Days Ago)", shortLabel: "Day 3", subLabel: "2 Days Ago", orders: 12, hours: 6.5, totalUSD: 205.50, baseUSD: 102.00, tipsUSD: 45.60, incentivesUSD: 57.90, avgUSD: 17.12, pace: "$31.61/hr" },
  { dayIndex: 4, key: 'day4', label: "Day 4 (3 Days Ago)", shortLabel: "Day 4", subLabel: "3 Days Ago", orders: 9, hours: 5.2, totalUSD: 162.00, baseUSD: 76.50, tipsUSD: 34.20, incentivesUSD: 51.30, avgUSD: 18.00, pace: "$31.15/hr" },
  { dayIndex: 5, key: 'day5', label: "Day 5 (4 Days Ago)", shortLabel: "Day 5", subLabel: "4 Days Ago", orders: 8, hours: 4.8, totalUSD: 145.00, baseUSD: 68.00, tipsUSD: 30.40, incentivesUSD: 46.60, avgUSD: 18.12, pace: "$30.20/hr" },
  { dayIndex: 6, key: 'day6', label: "Day 6 (5 Days Ago)", shortLabel: "Day 6", subLabel: "5 Days Ago", orders: 8, hours: 4.7, totalUSD: 146.00, baseUSD: 68.00, tipsUSD: 30.40, incentivesUSD: 47.60, avgUSD: 18.25, pace: "$31.06/hr" },
  { dayIndex: 7, key: 'day7', label: "Day 7 (6 Days Ago)", shortLabel: "Day 7", subLabel: "6 Days Ago", orders: 8, hours: 4.8, totalUSD: 185.00, baseUSD: 68.00, tipsUSD: 30.40, incentivesUSD: 86.60, avgUSD: 23.12, pace: "$38.54/hr" },
];

// Initial Rider Wallet Data with LocalStorage Persistence
const INITIAL_WALLET = {
  walletBalanceUSD: 482.50,
  signCoins: 2850,
  lifetimeOrders: 1424,
  todayOrders: 11,
  weekOrders: 68,
  monthOrders: 274,
  yearOrders: 3280,
  hoursWorkedToday: 6.2,
  hourlyRateUSD: 26.50,
  // Per Order Cost Breakdown (USD)
  basePayPerOrderUSD: 8.50,
  distancePayUSD: 3.20,
  avgTipUSD: 3.80,
  accessibilityBonusUSD: 2.00,
  redemptions: [
    { id: 'RED-901', date: 'Yesterday', coins: 500, cashUSD: 5.00, status: 'Credited to Wallet' },
    { id: 'RED-902', date: '3 days ago', coins: 1000, cashUSD: 10.00, status: 'Credited to Wallet' }
  ],
  deliveredOrdersList: [
    { id: 'ORD-9480', customer: 'Sarah Jenkins', restaurant: 'Aroma Bistro', time: '11:45 AM', baseUSD: 8.50, distUSD: 3.20, tipUSD: 4.50, bonusUSD: 2.00, totalUSD: 18.20 },
    { id: 'ORD-9478', customer: 'David Kim', restaurant: 'Tokyo Sushi', time: '10:30 AM', baseUSD: 8.50, distUSD: 4.10, tipUSD: 5.00, bonusUSD: 2.00, totalUSD: 19.60 },
    { id: 'ORD-9475', customer: 'Emily Watson', restaurant: 'Green Leaf Salads', time: '09:15 AM', baseUSD: 8.50, distUSD: 2.00, tipUSD: 3.00, bonusUSD: 2.00, totalUSD: 15.50 },
    { id: 'ORD-9471', customer: 'Michael Chang', restaurant: 'Taco Fiesta', time: '08:20 AM', baseUSD: 8.50, distUSD: 3.50, tipUSD: 3.00, bonusUSD: 2.00, totalUSD: 17.00 },
  ]
};

export const RiderDashboard = ({ onOpenVoiceAgent }) => {
  const { 
    user, 
    updateUserProfile, 
    order, 
    updateOrderStatus, 
    sendRiderResponse, 
    sendCustomerMessage, 
    triggerVisualAlert, 
    isTranslating,
    logActivity
  } = useApp();

  // Active Main Tab: 'delivery' | 'earnings'
  const [activeRiderTab, setActiveRiderTab] = useState('delivery');

  // Currency Selection
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Timeframe Selection for Total Payments: 'hours' | 'days' | 'weeks' | 'months' | 'years'
  const [paymentTimeframe, setPaymentTimeframe] = useState('days');

  // Wallet and Coins State
  const [wallet, setWallet] = useState(() => {
    try {
      const saved = localStorage.getItem('signshift_rider_wallet');
      return saved ? JSON.parse(saved) : INITIAL_WALLET;
    } catch (e) {
      return INITIAL_WALLET;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('signshift_rider_wallet', JSON.stringify(wallet));
    } catch (e) {
      console.error(e);
    }
  }, [wallet]);

  // SignCoins Redemption State
  const [coinsToRedeem, setCoinsToRedeem] = useState(500);
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState('');

  // Dynamic Incentives Toggles
  const [incentiveSurge, setIncentiveSurge] = useState(true); // +$3.50
  const [incentiveDeafBridge, setIncentiveDeafBridge] = useState(true); // +$2.00
  const [incentiveWeather, setIncentiveWeather] = useState(false); // +$4.00

  // 3D Avatar & Sign Communication States
  const [activeSignKey, setActiveSignKey] = useState("HELLO");
  const [selectedLanguage, setSelectedLanguage] = useState(SUPPORTED_LANGUAGES[0]);
  const [customSimText, setCustomSimText] = useState("");

  // Custom Rider Quick Signs state
  const [riderSignsList, setRiderSignsList] = useState(RIDER_QUICK_SIGNS);
  const [showAddSignModal, setShowAddSignModal] = useState(false);
  const [newSignLabel, setNewSignLabel] = useState("");
  const [newSignIcon, setNewSignIcon] = useState("👋");

  // Profile Editor Modal State
  const [showRiderProfileEditor, setShowRiderProfileEditor] = useState(false);
  const [editName, setEditName] = useState(user?.name || 'Alex Rivera');
  const [editEmail, setEditEmail] = useState(user?.email || 'alex.rivera@signshift.io');
  const [editVehicle, setEditVehicle] = useState(user?.vehicle || 'Electric Delivery Bike');
  const [editIsDeaf, setEditIsDeaf] = useState(user?.isDeafMute !== undefined ? user.isDeafMute : true);

  // Granular Sub-interval Selectors
  const [selectedDaysCount, setSelectedDaysCount] = useState(1); // 1 | 2 | 3 | 7
  const [daysSubCheckMode, setDaysSubCheckMode] = useState('both'); // 'day1' | 'day2' | 'both'
  const [selectedHoursCount, setSelectedHoursCount] = useState(6.2); // 1 | 2 | 4 | 6.2 | 8
  const [selectedWeeksCount, setSelectedWeeksCount] = useState(1); // 1 | 2 | 4
  const [selectedMonthsCount, setSelectedMonthsCount] = useState(1); // 1 | 3 | 6 | 12
  const [selectedYearsCount, setSelectedYearsCount] = useState(1); // 1 | 2

  // Currency Converter Helper
  const formatMoney = (usdAmount) => {
    const curr = CURRENCIES[selectedCurrency] || CURRENCIES.USD;
    const converted = usdAmount * curr.rate;
    if (selectedCurrency === 'JPY') {
      return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${curr.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculate Average Earning of One Order
  const costOfOneOrderUSD = 
    wallet.basePayPerOrderUSD + 
    wallet.distancePayUSD + 
    wallet.avgTipUSD + 
    (incentiveDeafBridge ? wallet.accessibilityBonusUSD : 0) +
    (incentiveSurge ? 3.50 : 0) +
    (incentiveWeather ? 4.00 : 0);

  // Timeframe Earnings Calculations (in USD)
  const getTimeframeStats = () => {
    switch (paymentTimeframe) {
      case 'hours': {
        const hrs = selectedHoursCount;
        const estOrders = Math.round(hrs * 1.8 * 10) / 10;
        const total = hrs * wallet.hourlyRateUSD;
        return {
          title: `${hrs} Hour${hrs > 1 ? 's' : ''} Payout`,
          subtitle: `Calculated for ${hrs} working hours @ $26.50/hr average`,
          ordersCount: `${estOrders} Orders Delivered`,
          ordersNum: Math.max(1, Math.round(hrs * 1.8)),
          totalUSD: total,
          baseUSD: hrs * 18.00,
          tipsUSD: hrs * 5.50,
          incentivesUSD: hrs * 3.00,
          periodLabel: `${hrs} hr${hrs > 1 ? 's' : ''}`,
          isDayCompare: false
        };
      }
      case 'days': {
        const isSingleDayCheck = daysSubCheckMode.startsWith('day');
        if (isSingleDayCheck) {
          const targetDay = DAYS_MOCK_DATA.find(d => d.key === daysSubCheckMode) || DAYS_MOCK_DATA[0];
          return {
            title: `${targetDay.label} Single Day Check`,
            subtitle: `Checking ${targetDay.subLabel} specifically: ${targetDay.orders} orders completed (${targetDay.pace} active pace)`,
            ordersCount: `${targetDay.orders} Delivered Orders (${targetDay.shortLabel})`,
            ordersNum: targetDay.orders,
            totalUSD: targetDay.totalUSD,
            baseUSD: targetDay.baseUSD,
            tipsUSD: targetDay.tipsUSD,
            incentivesUSD: targetDay.incentivesUSD,
            periodLabel: `${targetDay.shortLabel}`,
            isDayCompare: selectedDaysCount > 1,
            activeDayKey: targetDay.key
          };
        } else {
          // Cumulative calculation for 1 to selectedDaysCount (up to 7 days)
          const activeDays = DAYS_MOCK_DATA.slice(0, selectedDaysCount);
          const totalOrders = activeDays.reduce((sum, d) => sum + d.orders, 0);
          const totalUSD = activeDays.reduce((sum, d) => sum + d.totalUSD, 0);
          const totalBase = activeDays.reduce((sum, d) => sum + d.baseUSD, 0);
          const totalTips = activeDays.reduce((sum, d) => sum + d.tipsUSD, 0);
          const totalIncentives = activeDays.reduce((sum, d) => sum + d.incentivesUSD, 0);
          const totalHours = activeDays.reduce((sum, d) => sum + d.hours, 0);

          return {
            title: `${selectedDaysCount} Day${selectedDaysCount > 1 ? 's' : ''} Cumulative Payout`,
            subtitle: `${totalOrders} total orders delivered across ${selectedDaysCount} day${selectedDaysCount > 1 ? 's' : ''} (${totalHours.toFixed(1)} hrs active shift)`,
            ordersCount: `${totalOrders} Delivered across ${selectedDaysCount} Days`,
            ordersNum: totalOrders,
            totalUSD: totalUSD,
            baseUSD: totalBase,
            tipsUSD: totalTips,
            incentivesUSD: totalIncentives,
            periodLabel: `${selectedDaysCount} Day${selectedDaysCount > 1 ? 's' : ''}`,
            isDayCompare: selectedDaysCount > 1,
            activeDayKey: 'all'
          };
        }
      }
      case 'weeks': {
        const wks = selectedWeeksCount;
        const ords = wks * 68;
        const total = (ords * 17.50) + (wks * 50.00);
        return {
          title: `${wks} Week${wks > 1 ? 's' : ''} Payout`,
          subtitle: `${ords} total orders completed across ${wks} week${wks > 1 ? 's' : ''}`,
          ordersCount: `${ords} Delivered`,
          ordersNum: ords,
          totalUSD: total,
          baseUSD: ords * 8.50,
          tipsUSD: ords * 3.80,
          incentivesUSD: (ords * 5.20) + (wks * 50.00),
          periodLabel: `${wks} Week${wks > 1 ? 's' : ''}`,
          isDayCompare: false
        };
      }
      case 'months': {
        const mos = selectedMonthsCount;
        const ords = mos * 274;
        const total = (ords * 17.50) + (mos * 200.00);
        return {
          title: `${mos} Month${mos > 1 ? 's' : ''} Payout`,
          subtitle: `${ords} total orders completed over ${mos} month${mos > 1 ? 's' : ''}`,
          ordersCount: `${ords} Delivered`,
          ordersNum: ords,
          totalUSD: total,
          baseUSD: ords * 8.50,
          tipsUSD: ords * 3.80,
          incentivesUSD: (ords * 5.20) + (mos * 200.00),
          periodLabel: `${mos} Month${mos > 1 ? 's' : ''}`,
          isDayCompare: false
        };
      }
      case 'years': {
        const yrs = selectedYearsCount;
        const ords = yrs * 3280;
        const total = (ords * 17.50) + (yrs * 1800.00);
        return {
          title: `${yrs} Year${yrs > 1 ? 's' : ''} Payout`,
          subtitle: `${ords.toLocaleString()} total orders completed over ${yrs} year${yrs > 1 ? 's' : ''}`,
          ordersCount: `${ords.toLocaleString()} Delivered`,
          ordersNum: ords,
          totalUSD: total,
          baseUSD: ords * 8.50,
          tipsUSD: ords * 3.80,
          incentivesUSD: (ords * 5.20) + (yrs * 1800.00),
          periodLabel: `${yrs} Year${yrs > 1 ? 's' : ''}`,
          isDayCompare: false
        };
      }
      default:
        return {
          title: "1 Day (Today's) Payout",
          subtitle: "11 orders completed today",
          ordersCount: "11 Delivered",
          totalUSD: 192.50,
          baseUSD: 93.50,
          tipsUSD: 41.80,
          incentivesUSD: 57.20,
          periodLabel: "1 Day",
          isDayCompare: false
        };
    }
  };

  const timeframeData = getTimeframeStats();

  // Handle Coin Redemption into Real Cash
  const handleRedeemCoins = () => {
    if (coinsToRedeem < 100) return;
    if (coinsToRedeem > wallet.signCoins) {
      alert("Insufficient SignCoins balance.");
      return;
    }

    // 100 SignCoins = $1.00 USD
    const cashValueUSD = coinsToRedeem / 100;
    const formattedCredited = formatMoney(cashValueUSD);

    setWallet(prev => ({
      ...prev,
      signCoins: prev.signCoins - coinsToRedeem,
      walletBalanceUSD: prev.walletBalanceUSD + cashValueUSD,
      redemptions: [
        {
          id: `RED-${Date.now()}`,
          date: 'Just Now',
          coins: coinsToRedeem,
          cashUSD: cashValueUSD,
          status: 'Credited to Wallet'
        },
        ...prev.redemptions
      ]
    }));

    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    triggerVisualAlert('gold');
    setRedeemSuccessMsg(`Successfully redeemed ${coinsToRedeem.toLocaleString()} SignCoins! ${formattedCredited} credited to your cash balance.`);
    setTimeout(() => setRedeemSuccessMsg(''), 5000);

    if (logActivity) {
      logActivity(
        "SignCoins Redeemed to Cash", 
        "AUTH", 
        `Rider Alex Rivera converted ${coinsToRedeem} coins to $${cashValueUSD.toFixed(2)} USD`, 
        "Alex Rivera (Rider)", 
        "SUCCESS"
      );
    }
  };

  const handleSimulateCustomerInput = (e) => {
    e.preventDefault();
    if (!customSimText.trim()) return;
    sendCustomerMessage(customSimText);
    setCustomSimText("");
    setActiveSignKey("LEAVE AT DOOR");
  };

  const handleSimulateLanguageMsg = (lang) => {
    setSelectedLanguage(lang);
    sendCustomerMessage(`[${lang.name}] ${lang.sampleMsg}`);
    setActiveSignKey(lang.code === 'ja' ? 'THANK YOU' : 'LEAVE AT DOOR');
  };

  const handleRiderQuickTap = (signItem) => {
    setActiveSignKey(signItem.key || "HELLO");
    const translatedMsg = signItem.translations ? (signItem.translations[selectedLanguage.code] || signItem.translations['en']) : signItem.label;
    sendRiderResponse(translatedMsg, signItem.key || signItem.label);
  };

  const handleAddCustomSign = (e) => {
    e.preventDefault();
    if (!newSignLabel.trim()) return;
    const newSignObj = {
      key: newSignLabel.toUpperCase(),
      label: newSignLabel,
      icon: newSignIcon || "🤟",
      category: "CUSTOM",
      translations: {
        en: newSignLabel,
        es: newSignLabel,
        fr: newSignLabel,
        de: newSignLabel,
        hi: newSignLabel,
        kn: newSignLabel
      }
    };
    setRiderSignsList(prev => [...prev, newSignObj]);
    confetti({ particleCount: 50, spread: 60 });
    setShowAddSignModal(false);
    setNewSignLabel("");
  };

  const handleSaveRiderProfile = (e) => {
    e.preventDefault();
    if (!user) return;
    updateUserProfile(user.id, {
      name: editName,
      email: editEmail,
      vehicle: editVehicle,
      isDeafMute: editIsDeaf
    });
    confetti({ particleCount: 60, spread: 70 });
    setShowRiderProfileEditor(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pickup': return { bg: 'bg-emerald-500', text: 'text-emerald-400', label: '1. RESTAURANT PICKUP' };
      case 'en_route': return { bg: 'bg-cyan-500', text: 'text-cyan-400', label: '2. EN ROUTE TO CUSTOMER' };
      case 'arrived': return { bg: 'bg-amber-500', text: 'text-amber-400', label: '3. ARRIVED OUTSIDE' };
      case 'delivered': return { bg: 'bg-purple-500', text: 'text-purple-400', label: '4. ORDER DELIVERED 🎉' };
      default: return { bg: 'bg-cyan-500', text: 'text-cyan-400', label: 'IN PROGRESS' };
    }
  };

  const currentStatusObj = getStatusColor(order.status);

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 space-y-4 pb-24">
      
      {/* TOP RIDER HEADER BAR WITH CREDENTIALS EDITOR */}
      <div className="glass-panel rounded-3xl p-5 border-2 border-cyan-500/40 flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 shadow-xl">
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 font-extrabold text-xl shadow-lg">
            🤟
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-lg text-white">{user?.name || "Alex Rivera"}</h2>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/40 uppercase">
                {user?.isDeafMute ? 'Deaf Rider Partner' : 'Rider'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
              <span>Vehicle: <strong className="text-slate-200">{user?.vehicle || 'Electric Bike'}</strong></span> • 
              <span className="text-cyan-400 font-semibold">Active Order #{order.id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setEditName(user?.name || 'Alex Rivera');
              setEditEmail(user?.email || 'alex.rivera@signshift.io');
              setEditVehicle(user?.vehicle || 'Electric Bike');
              setEditIsDeaf(user?.isDeafMute !== undefined ? user.isDeafMute : true);
              setShowRiderProfileEditor(true);
            }}
            className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>

          <button
            onClick={onOpenVoiceAgent}
            className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-extrabold rounded-xl shadow-lg hover:scale-105 transition flex items-center gap-1.5 text-xs"
          >
            <PhoneCall className="w-4 h-4 text-slate-950" />
            <span>AI Voice Call 📞</span>
          </button>
        </div>

      </div>

      {/* RIDER VIEW NAVIGATION TABS (Delivery vs Earnings & Wallet) */}
      <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold gap-1 shadow-inner">
        <button
          onClick={() => setActiveRiderTab('delivery')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
            activeRiderTab === 'delivery'
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-extrabold shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>Active Delivery & 3D Sign Assist</span>
        </button>

        <button
          onClick={() => setActiveRiderTab('earnings')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
            activeRiderTab === 'earnings'
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-extrabold shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Wallet className="w-4 h-4 text-amber-400" />
          <span>Earnings, Orders & SignCoins Wallet</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: RIDER EARNINGS, MULTI-CURRENCY, COINS & INCENTIVES MODULE
         ========================================================================= */}
      {activeRiderTab === 'earnings' && (
        <div className="space-y-5 animate-fadeIn">
          
          {/* CURRENCY CHANGER BAR */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Payout Currency:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {Object.keys(CURRENCIES).map((currCode) => {
                const curr = CURRENCIES[currCode];
                return (
                  <button
                    key={currCode}
                    onClick={() => setSelectedCurrency(currCode)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1 ${
                      selectedCurrency === currCode
                        ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md scale-105'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>{curr.symbol}</span>
                    <span>{curr.code}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIDER STATS HERO: WALLET BALANCE, DELIVERED ORDERS & PER-ORDER COST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* CARD 1: LIVE WALLET BALANCE */}
            <div className="glass-panel rounded-2xl p-4 border border-slate-800 bg-slate-900/90 space-y-1">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Withdrawable Cash</span>
                <Wallet className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {formatMoney(wallet.walletBalanceUSD)}
              </div>
              <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready for Instant Payout
              </p>
            </div>

            {/* CARD 2: TOTAL DELIVERED ORDERS */}
            <div className="glass-panel rounded-2xl p-4 border border-slate-800 bg-slate-900/90 space-y-1">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Delivered Orders</span>
                <CheckCircle className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {wallet.lifetimeOrders.toLocaleString()}+
              </div>
              <p className="text-[10px] text-cyan-300 font-semibold">
                Today: <strong className="text-white">{wallet.todayOrders}</strong> | Week: <strong className="text-white">{wallet.weekOrders}</strong>
              </p>
            </div>

            {/* CARD 3: COST / EARNING OF ONE ORDER */}
            <div className="glass-panel rounded-2xl p-4 border-2 border-cyan-500/40 bg-slate-900/90 space-y-1">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">Avg Earning Per Order</span>
                <DollarSign className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-cyan-300 font-mono">
                {formatMoney(costOfOneOrderUSD)}
              </div>
              <p className="text-[10px] text-slate-300">
                Base {formatMoney(wallet.basePayPerOrderUSD)} + Tip {formatMoney(wallet.avgTipUSD)} + Sign {formatMoney(wallet.accessibilityBonusUSD)}
              </p>
            </div>

            {/* CARD 4: SIGNCOINS REWARDS BALANCE */}
            <div className="glass-panel rounded-2xl p-4 border border-amber-500/40 bg-slate-900/90 space-y-1">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">SignCoins Rewards</span>
                <Coins className="w-4 h-4 text-amber-400 animate-bounce" />
              </div>
              <div className="text-2xl font-black text-amber-300 font-mono flex items-center gap-1">
                <span>{wallet.signCoins.toLocaleString()}</span>
                <span className="text-sm">🪙</span>
              </div>
              <p className="text-[10px] text-amber-400/90 font-semibold">
                Worth <strong className="text-white">{formatMoney(wallet.signCoins / 100)}</strong> in Cash
              </p>
            </div>

          </div>

          {/* TOTAL PAYMENTS BREAKDOWN (HOURS, DAYS, WEEKS, MONTHS, YEARS) */}
          <div className="glass-panel rounded-3xl p-5 border-2 border-slate-800 bg-slate-900/95 space-y-4 shadow-xl">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>Rider Payments & Timeframe Analytics</span>
                </h3>
                <p className="text-xs text-slate-400">View aggregate payout telemetry calculated across different working intervals</p>
              </div>

              {/* Timeframe Filter Buttons */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold gap-1">
                {[
                  { id: 'hours', label: '⏱️ Hours' },
                  { id: 'days', label: '📅 Days' },
                  { id: 'weeks', label: '🗓️ Weeks' },
                  { id: 'months', label: '📊 Months' },
                  { id: 'years', label: '📈 Years' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setPaymentTimeframe(t.id)}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      paymentTimeframe === t.id
                        ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-extrabold shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SUB-INTERVAL SELECTOR ROW */}
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase font-mono">
                  {paymentTimeframe === 'days' ? 'Select Days Span:' :
                   paymentTimeframe === 'hours' ? 'Select Hours Span:' :
                   paymentTimeframe === 'weeks' ? 'Select Weeks Span:' :
                   paymentTimeframe === 'months' ? 'Select Months Span:' : 'Select Years Span:'}
                </span>
              </div>

              {/* Sub-selectors for DAYS (1 Day, 2 Day, 3 Days, 4 Days, 5 Days, 6 Days, 7 Days) */}
              {paymentTimeframe === 'days' && (
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { count: 1, label: '1 Day' },
                    { count: 2, label: '2 Day' },
                    { count: 3, label: '3 Days' },
                    { count: 4, label: '4 Days' },
                    { count: 5, label: '5 Days' },
                    { count: 6, label: '6 Days' },
                    { count: 7, label: '7 Days' },
                  ].map(d => (
                    <button
                      key={d.count}
                      onClick={() => {
                        setSelectedDaysCount(d.count);
                        setDaysSubCheckMode('all');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1 ${
                        selectedDaysCount === d.count && daysSubCheckMode === 'all'
                          ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md scale-105'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <span>📅</span>
                      <span>{d.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Sub-selectors for HOURS */}
              {paymentTimeframe === 'hours' && (
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { count: 1, label: '1 Hour' },
                    { count: 2, label: '2 Hours' },
                    { count: 4, label: '4 Hours' },
                    { count: 6.2, label: '6.2 Hrs (Today Shift)' },
                    { count: 8, label: '8 Hours (Full Shift)' },
                  ].map(h => (
                    <button
                      key={h.count}
                      onClick={() => setSelectedHoursCount(h.count)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition ${
                        selectedHoursCount === h.count
                          ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md scale-105'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Sub-selectors for WEEKS */}
              {paymentTimeframe === 'weeks' && (
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { count: 1, label: '1 Week (Current)' },
                    { count: 2, label: '2 Weeks' },
                    { count: 4, label: '4 Weeks' },
                  ].map(w => (
                    <button
                      key={w.count}
                      onClick={() => setSelectedWeeksCount(w.count)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition ${
                        selectedWeeksCount === w.count
                          ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md scale-105'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Sub-selectors for MONTHS */}
              {paymentTimeframe === 'months' && (
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { count: 1, label: '1 Month' },
                    { count: 3, label: '3 Months (Quarter)' },
                    { count: 6, label: '6 Months (Half-Year)' },
                    { count: 12, label: '12 Months' },
                  ].map(m => (
                    <button
                      key={m.count}
                      onClick={() => setSelectedMonthsCount(m.count)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition ${
                        selectedMonthsCount === m.count
                          ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md scale-105'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Sub-selectors for YEARS */}
              {paymentTimeframe === 'years' && (
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { count: 1, label: '1 Year (2026)' },
                    { count: 2, label: '2 Years (Cumulative)' },
                  ].map(y => (
                    <button
                      key={y.count}
                      onClick={() => setSelectedYearsCount(y.count)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition ${
                        selectedYearsCount === y.count
                          ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md scale-105'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {y.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* DAYS DEDICATED CHECK MODE SELECTOR (Day 1 through Day 7) */}
            {paymentTimeframe === 'days' && (
              <div className="p-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-cyan-500/40 flex flex-wrap items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold text-cyan-300 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    Inspect Individual Day:
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {DAYS_MOCK_DATA.slice(0, Math.max(selectedDaysCount, 2)).map(d => (
                    <button
                      key={d.key}
                      onClick={() => setDaysSubCheckMode(d.key)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 ${
                        daysSubCheckMode === d.key
                          ? 'bg-cyan-500 text-slate-950 font-black shadow-lg scale-105 ring-2 ring-cyan-300'
                          : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                      }`}
                    >
                      <span>📅 {d.shortLabel}</span>
                      <span className="text-[10px] px-1 py-0.2 bg-black/30 rounded font-black">{d.orders} ord • {formatMoney(d.totalUSD)}</span>
                    </button>
                  ))}

                  <button
                    onClick={() => setDaysSubCheckMode('all')}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 ${
                      daysSubCheckMode === 'all'
                        ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-black shadow-lg scale-105 ring-2 ring-emerald-300'
                        : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>⚡ Check All ({selectedDaysCount} Days Combined)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Timeframe Total Hero Banner */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-mono">{timeframeData.title}</span>
                <span className="text-3xl font-black text-emerald-400 font-mono block mt-1">
                  {formatMoney(timeframeData.totalUSD)}
                </span>
                <span className="text-xs text-slate-400 mt-0.5 block">{timeframeData.subtitle}</span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 font-mono border-t md:border-t-0 md:border-l border-slate-800 md:pl-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Base Trip Earnings:</span>
                  <span className="font-bold text-white">{formatMoney(timeframeData.baseUSD)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer Tips:</span>
                  <span className="font-bold text-emerald-300">{formatMoney(timeframeData.tipsUSD)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Incentives & Sign Bonus:</span>
                  <span className="font-bold text-cyan-300">{formatMoney(timeframeData.incentivesUSD)}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">Fulfillment Efficiency:</span>
                <div className="text-white font-bold">{timeframeData.ordersCount}</div>
                <div className="text-slate-400 text-[11px]">
                  Average Payout: <strong className="text-emerald-400">{formatMoney(timeframeData.totalUSD / (timeframeData.ordersNum || 1))}</strong> per order
                </div>
              </div>
            </div>

            {/* DYNAMIC ITEMIZED DAILY BREAKDOWN CARDS (Days 1 through 7) */}
            {paymentTimeframe === 'days' && (
              <div className="p-4 bg-slate-950 rounded-2xl border-2 border-cyan-500/40 space-y-3 animate-fadeIn">
                <div className="flex flex-wrap justify-between items-center border-b border-slate-900 pb-2 gap-2">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 uppercase font-mono">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" /> 
                    <span>Daily Breakdown (Showing {selectedDaysCount} of 7 Days):</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono font-bold">
                    Click any day card to inspect individual telemetry
                  </span>
                </div>

                <div className={`grid gap-3 text-xs ${
                  selectedDaysCount <= 2 ? 'grid-cols-1 sm:grid-cols-2' :
                  selectedDaysCount <= 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
                  'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }`}>
                  {DAYS_MOCK_DATA.slice(0, Math.max(selectedDaysCount, 2)).map(d => {
                    const isActive = daysSubCheckMode === d.key;
                    return (
                      <div 
                        key={d.key}
                        onClick={() => setDaysSubCheckMode(d.key)}
                        className={`p-3.5 rounded-xl border transition cursor-pointer space-y-1.5 ${
                          isActive
                            ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-500/50 shadow-lg scale-[1.02]'
                            : 'bg-slate-900/60 border-slate-800 hover:border-cyan-700 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-white text-xs flex items-center gap-1">
                            <span>📅 {d.label}</span>
                            {isActive && (
                              <span className="text-[9px] px-1.5 py-0.2 bg-cyan-500 text-slate-950 rounded font-black uppercase">Active</span>
                            )}
                          </span>
                          <span className="px-1.5 py-0.5 bg-cyan-950 text-cyan-300 text-[10px] rounded font-mono font-bold border border-cyan-800">
                            {d.orders} ord
                          </span>
                        </div>
                        <div className="text-xl font-black text-cyan-300 font-mono">
                          {formatMoney(d.totalUSD)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono space-y-0.5 pt-1 border-t border-slate-800/80">
                          <div>Active Shift: <strong className="text-slate-200">{d.hours} hrs</strong> ({d.pace})</div>
                          <div>Avg / Order: <strong className="text-emerald-400">{formatMoney(d.avgUSD)}</strong></div>
                          <div className="text-[9px] text-slate-400">Base {formatMoney(d.baseUSD)} • Tips {formatMoney(d.tipsUSD)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Combined Daily Pace Footer */}
                <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-wrap justify-between items-center text-xs text-slate-300 font-mono gap-2">
                  <span>
                    Combined Pace ({selectedDaysCount} Days): <strong className="text-white">
                      {formatMoney(
                        DAYS_MOCK_DATA.slice(0, selectedDaysCount).reduce((s, d) => s + d.totalUSD, 0) / selectedDaysCount
                      )} / day
                    </strong>
                  </span>
                  <span className="text-cyan-400 font-bold">
                    {DAYS_MOCK_DATA.slice(0, selectedDaysCount).reduce((s, d) => s + d.orders, 0)} Total Orders Completed
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* SIGNCOINS REDEMPTION TO CASH MODULE */}
          <div className="glass-panel rounded-3xl p-5 border-2 border-amber-500/40 bg-slate-900/95 space-y-4 shadow-xl">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 text-xl font-bold">
                  🪙
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">SignCoins Rewards & Cash Redemption Hub</h3>
                  <p className="text-xs text-slate-400">
                    Earn coins through accessibility ratings, and convert directly into cash ({formatMoney(1.00)} per 100 🪙)
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-bold">Your Coin Balance</span>
                <span className="text-lg font-black text-amber-300 font-mono">{wallet.signCoins.toLocaleString()} 🪙</span>
              </div>
            </div>

            {/* Success message feedback */}
            {redeemSuccessMsg && (
              <div className="p-3 bg-emerald-950/90 border border-emerald-500/60 rounded-xl text-xs text-emerald-200 font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{redeemSuccessMsg}</span>
              </div>
            )}

            {/* Interactive Redemption Calculator */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              <div className="md:col-span-7 p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-300 flex justify-between">
                  <span>Select Coins to Redeem:</span>
                  <span className="text-amber-400 font-mono font-extrabold">{coinsToRedeem.toLocaleString()} Coins</span>
                </label>

                {/* Slider */}
                <input
                  type="range"
                  min="100"
                  max={Math.max(100, Math.floor(wallet.signCoins / 100) * 100)}
                  step="100"
                  value={coinsToRedeem}
                  onChange={(e) => setCoinsToRedeem(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />

                {/* Preset Buttons */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[100, 500, 1000, 2000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setCoinsToRedeem(Math.min(wallet.signCoins, amt))}
                      disabled={wallet.signCoins < amt}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition ${
                        coinsToRedeem === amt 
                          ? 'bg-amber-500 text-slate-950 border-amber-400' 
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {amt.toLocaleString()} 🪙
                    </button>
                  ))}
                  <button
                    onClick={() => setCoinsToRedeem(Math.floor(wallet.signCoins / 100) * 100)}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800"
                  >
                    Max ({Math.floor(wallet.signCoins / 100) * 100})
                  </button>
                </div>
              </div>

              {/* Conversion Preview & Redeem Button */}
              <div className="md:col-span-5 p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">You Will Receive In Cash</span>
                <div className="text-3xl font-black text-emerald-400 font-mono">
                  +{formatMoney(coinsToRedeem / 100)}
                </div>
                <p className="text-[10px] text-slate-400">100 Coins = $1.00 USD in {selectedCurrency}</p>

                <button
                  onClick={handleRedeemCoins}
                  disabled={wallet.signCoins < 100 || coinsToRedeem > wallet.signCoins}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-emerald-400 hover:brightness-110 text-slate-950 font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider"
                >
                  <Gift className="w-4 h-4" />
                  <span>Redeem {coinsToRedeem} Coins Now</span>
                </button>
              </div>

            </div>

            {/* How Rider Earns Coins */}
            <div className="pt-2 border-t border-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-400">
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="font-bold text-amber-300 block">🛵 +50 🪙 per Delivery</span>
                <span className="text-[10px]">Automatically awarded on order drop-off</span>
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="font-bold text-amber-300 block">⭐ +30 🪙 for 5-Star Rating</span>
                <span className="text-[10px]">When customer rates visual communication</span>
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="font-bold text-amber-300 block">🤟 +20 🪙 for Sign Assist</span>
                <span className="text-[10px]">Using 3D sign avatar in chat</span>
              </div>
            </div>

          </div>

          {/* DYNAMIC INCENTIVES & SURGE CALCULATOR */}
          <div className="glass-panel rounded-3xl p-5 border-2 border-slate-800 bg-slate-900/95 space-y-4 shadow-xl">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Dynamic Incentives & Streak Bonus Calculator</span>
                </h3>
                <p className="text-xs text-slate-400">Toggle active bonuses to calculate your potential take-home on upcoming orders</p>
              </div>

              <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-800">
                Target: 11 / 15 Orders
              </span>
            </div>

            {/* Milestone Progress Bar */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" /> Daily Milestone Streak Bonus:
                </span>
                <span className="text-emerald-400 font-extrabold font-mono">+$25.00 ({formatMoney(25.00)}) Bonus</span>
              </div>

              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 rounded-full" style={{ width: '73%' }}></div>
              </div>

              <p className="text-[11px] text-slate-400 flex justify-between">
                <span>Completed 11 deliveries today</span>
                <span className="text-cyan-300 font-bold">Only 4 more orders to unlock bonus!</span>
              </p>
            </div>

            {/* Interactive Incentives Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <label className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                incentiveSurge ? 'bg-cyan-950/40 border-cyan-400' : 'bg-slate-950 border-slate-800'
              }`}>
                <div>
                  <span className="font-bold text-white text-xs block">⚡ Peak Hour Surge</span>
                  <span className="text-[10px] text-cyan-300 font-mono">+{formatMoney(3.50)} / order</span>
                </div>
                <input
                  type="checkbox"
                  checked={incentiveSurge}
                  onChange={(e) => setIncentiveSurge(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500"
                />
              </label>

              <label className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                incentiveDeafBridge ? 'bg-purple-950/40 border-purple-400' : 'bg-slate-950 border-slate-800'
              }`}>
                <div>
                  <span className="font-bold text-white text-xs block">🤟 Sign Language Bridge</span>
                  <span className="text-[10px] text-purple-300 font-mono">+{formatMoney(2.00)} / order</span>
                </div>
                <input
                  type="checkbox"
                  checked={incentiveDeafBridge}
                  onChange={(e) => setIncentiveDeafBridge(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-500"
                />
              </label>

              <label className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                incentiveWeather ? 'bg-amber-950/40 border-amber-400' : 'bg-slate-950 border-slate-800'
              }`}>
                <div>
                  <span className="font-bold text-white text-xs block">🌧️ Weather Rush Pay</span>
                  <span className="text-[10px] text-amber-300 font-mono">+{formatMoney(4.00)} / order</span>
                </div>
                <input
                  type="checkbox"
                  checked={incentiveWeather}
                  onChange={(e) => setIncentiveWeather(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500"
                />
              </label>

            </div>

            {/* Calculated Next Delivery Earning Preview */}
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-emerald-500/50 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-300">
                Calculated Potential Earning for Your Next Delivery:
              </span>
              <span className="text-xl font-black text-emerald-300 font-mono">
                {formatMoney(costOfOneOrderUSD)}
              </span>
            </div>

          </div>

          {/* ITEM-BY-ITEM DELIVERED ORDERS LOG */}
          <div className="glass-panel rounded-3xl p-5 border border-slate-800 bg-slate-900/90 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase font-mono">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> Recent Completed Order Itemization:
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Showing last 4 orders</span>
            </div>

            <div className="space-y-2">
              {wallet.deliveredOrdersList.map((ord) => (
                <div key={ord.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white font-mono">{ord.id}</span>
                      <span className="text-[10px] text-slate-400">{ord.restaurant} → {ord.customer}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Base: {formatMoney(ord.baseUSD)} | Distance: {formatMoney(ord.distUSD)} | Tip: <span className="text-emerald-400 font-bold">{formatMoney(ord.tipUSD)}</span> | Sign Bonus: {formatMoney(ord.bonusUSD)}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-400 font-mono block">
                      +{formatMoney(ord.totalUSD)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{ord.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 2: ACTIVE DELIVERY, 3D AVATAR & SIGN ASSIST MODULE
         ========================================================================= */}
      {activeRiderTab === 'delivery' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* ACCESSIBLE STATUS PROGRESS INDICATOR */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-full ${currentStatusObj.bg} animate-ping`} />
                <span className={`${currentStatusObj.text} font-mono text-sm tracking-wider uppercase`}>{currentStatusObj.label}</span>
              </span>
              <span className="text-slate-400">ETA: <strong className="text-white">{order.status === 'pickup' ? order.pickupEta : order.deliveryEta}</strong></span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {[
                { id: 'pickup', label: '1. Pickup', icon: '🛍️' },
                { id: 'en_route', label: '2. En Route', icon: '🏍️' },
                { id: 'arrived', label: '3. Arrived', icon: '📍' },
                { id: 'delivered', label: '4. Delivered', icon: '✅' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => updateOrderStatus(st.id)}
                  className={`p-3 rounded-xl font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 border-2 ${
                    order.status === st.id
                      ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 border-white shadow-lg scale-[1.02]'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                >
                  <span>{st.icon}</span>
                  <span>{st.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* MAP & ADDRESS BOX */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            <div className="md:col-span-5 glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-cyan-400" /> Delivery Address</span>
                  <span className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                    {order.distance}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-white">{order.customerAddress}</h3>
                <p className="text-xs text-slate-300 mt-1">Customer: <strong>{order.customerName}</strong> ({order.customerPhone})</p>

                <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border-2 border-amber-500/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔢</span>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-400 block">Gate / Intercom Code</span>
                      <span className="text-xl font-mono font-extrabold text-amber-300">{order.gateCode}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRiderQuickTap(RIDER_QUICK_SIGNS[1])}
                    className="px-3 py-1.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg hover:brightness-110"
                  >
                    Sign Back 🚪
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Merchant: <strong className="text-white">{order.merchantName}</strong></span>
                <span className="text-cyan-400 font-semibold">{order.totalAmount}</span>
              </div>
            </div>

            {/* REAL GPS LIVE TRACKER & ROUTE NAVIGATOR */}
            <div className="md:col-span-7">
              <LiveGpsTrackerMap isRiderView={true} />
            </div>

          </div>

          {/* REAL-TIME 3D SIGN LANGUAGE AVATAR & CONVERSATION HUB */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* 3D SIGN AVATAR CARD */}
            <div className="md:col-span-6 glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col justify-between space-y-3 bg-slate-900/70">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                  <span className="font-bold text-xs text-white uppercase tracking-wider">SignShift 3D Sign Engine</span>
                </div>
                <span className="text-[10px] text-cyan-300 font-mono bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  ASL / ISL Bridge
                </span>
              </div>

              <div className="w-full flex-1 min-h-[300px] flex items-center justify-center">
                <SignAvatar3D activePhraseKey={activeSignKey} />
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Current Gesture: <strong className="text-cyan-300 font-mono">{activeSignKey}</strong></span>
                <span className="text-emerald-400 text-[11px] font-bold">100% Sync</span>
              </div>
            </div>

            {/* QUICK TAP-TO-SIGN ACTION PHRASES & CHAT */}
            <div className="md:col-span-6 glass-panel rounded-2xl p-4 border border-slate-800 space-y-4 flex flex-col justify-between bg-slate-900/70">
              
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase">
                    <Sparkles className="w-4 h-4 text-cyan-400" /> Rider Quick Tap-To-Sign
                  </h4>
                  <button
                    onClick={() => setShowAddSignModal(true)}
                    className="text-[10px] text-cyan-400 hover:text-white font-bold flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-800"
                  >
                    <Plus className="w-3 h-3" /> Add Sign
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {riderSignsList.slice(0, 6).map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRiderQuickTap(item)}
                      className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-400 rounded-xl text-left text-xs font-bold transition flex items-center gap-2 group"
                    >
                      <span className="text-lg group-hover:scale-110 transition">{item.icon}</span>
                      <span className="text-slate-200 group-hover:text-cyan-300 truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Log Preview */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Live Delivery Communication:</span>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {order.chatMessages.map((msg, idx) => (
                    <div 
                      key={idx}
                      className={`p-2 rounded-xl text-xs ${
                        msg.sender === 'rider'
                          ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-100 ml-4'
                          : msg.sender === 'customer'
                          ? 'bg-slate-950 border border-slate-800 text-slate-200 mr-4'
                          : 'bg-purple-950/60 border border-purple-800 text-purple-200'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mb-0.5">
                        <span className="capitalize font-bold">{msg.sender}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p>{msg.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulate Customer Message for testing */}
              <form onSubmit={handleSimulateCustomerInput} className="pt-2 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={customSimText}
                  onChange={(e) => setCustomSimText(e.target.value)}
                  placeholder="Simulate customer instruction (e.g. Leave at door)..."
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Send
                </button>
              </form>

            </div>

          </div>

        </div>
      )}

      {/* RIDER PROFILE EDITOR MODAL */}
      {showRiderProfileEditor && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-cyan-500/60 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <span>👤 Edit Rider Profile</span>
              </h3>
              <button onClick={() => setShowRiderProfileEditor(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRiderProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Rider Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Delivery Vehicle</label>
                <input
                  type="text"
                  value={editVehicle}
                  onChange={(e) => setEditVehicle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="deafCheck"
                  checked={editIsDeaf}
                  onChange={(e) => setEditIsDeaf(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-cyan-500"
                />
                <label htmlFor="deafCheck" className="text-xs text-slate-300 font-bold">
                  🤟 Deaf / Non-Verbal Accessibility Partner Mode
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowRiderProfileEditor(false)}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 font-bold text-xs rounded-xl border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CUSTOM SIGN MODAL */}
      {showAddSignModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-cyan-500/60 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <span>➕ Add Custom Quick Sign Phrase</span>
              </h3>
              <button onClick={() => setShowAddSignModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomSign} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Sign Phrase Label</label>
                <input
                  type="text"
                  required
                  value={newSignLabel}
                  onChange={(e) => setNewSignLabel(e.target.value)}
                  placeholder="e.g. In Elevator / At Reception"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Emoji Icon</label>
                <input
                  type="text"
                  value={newSignIcon}
                  onChange={(e) => setNewSignIcon(e.target.value)}
                  placeholder="e.g. 🛗 or 🏢"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSignModal(false)}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 font-bold text-xs rounded-xl border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg"
                >
                  Add Sign Button
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
