export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English 🇺🇸', flag: '🇺🇸', sampleMsg: 'Please leave the food at the front door and ring bell.' },
  { code: 'kn', name: 'Kannada 🇮🇳 (ಕನ್ನಡ)', flag: '🇮🇳', sampleMsg: 'ದಯವಿಟ್ಟು ಆಹಾರವನ್ನು ಬಾಗಿಲಿನಲ್ಲಿ ಬಿಟ್ಟು ಗಂಟೆ ಬಾರಿಸಿ.' },
  { code: 'es', name: 'Spanish 🇪🇸', sampleMsg: 'Por favor deje la comida en la puerta y llame al timbre.' },
  { code: 'fr', name: 'French 🇫🇷', sampleMsg: 'Veuillez laisser la nourriture à la porte et sonner.' },
  { code: 'de', name: 'German 🇩🇪', sampleMsg: 'Bitte das Essen vor der Tür ablegen und klingeln.' },
  { code: 'ja', name: 'Japanese 🇯🇵', sampleMsg: 'ドアの前に食べ物を置いてベルを鳴らしてください。' },
  { code: 'zh', name: 'Chinese 🇨🇳', sampleMsg: '请将食物放在门口并按门铃。' },
  { code: 'hi', name: 'Hindi 🇮🇳', sampleMsg: 'कृपया खाना दरवाजे पर छोड़ दें और घंटी बजाएं।' },
  { code: 'ar', name: 'Arabic 🇸🇦', sampleMsg: 'يرجى ترك الطعام عند الباب والاتصال بالجرس.' }
];

export const RIDER_QUICK_SIGNS = [
  { 
    key: 'HELLO', 
    label: 'Hello!', 
    icon: '👋', 
    category: 'Greeting',
    translations: {
      en: "Hello! I am Alex, your delivery partner.",
      kn: "ನಮಸ್ಕಾರ! ನಾನು ಅಲೆಕ್ಸ್, ನಿಮ್ಮ ಡೆಲಿವರಿ ಪಾರ್ಟ್ನರ್.",
      es: "¡Hola! Soy Alex, su repartidor.",
      fr: "Bonjour ! Je suis Alex, votre livreur.",
      de: "Hallo! Ich bin Alex, Ihr Lieferpartner.",
      ja: "こんにちは！配達のAlexです。",
      zh: "你好！我是 Alex，您的外卖送餐员。",
      hi: "नमस्ते! मैं एलेक्स हूँ, आपका डिलीवरी पार्टनर।",
      ar: "مرحبا! أنا أليكس، شريك التوصيل الخاص بك."
    }
  },
  { 
    key: 'LEAVE AT DOOR', 
    label: 'Got it! Leaving at door', 
    icon: '🚪', 
    category: 'Action',
    translations: {
      en: "Understood! I will leave your parcel safely at your door.",
      kn: "ಅರ್ಥವಾಯಿತು! ನಿಮ್ಮ ಆರ್ಡರ್ ಅನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಬಾಗಿಲಿನಲ್ಲಿಡುತ್ತೇನೆ.",
      es: "¡Entendido! Dejaré su paquete seguro en la puerta.",
      fr: "Compris ! Je laisserai votre colis en toute sécurité à la porte.",
      de: "Verstanden! Ich lege Ihre Lieferung sicher an der Tür ab.",
      ja: "了解しました！ドアの前に安全におきます。",
      zh: "明白！我会将您的包裹安全放在门口。",
      hi: "समझ गया! मैं आपका पार्सल दरवाजे पर रख दूँगा।",
      ar: "مفهوم! سأترك طردك بأمان عند الباب."
    }
  },
  { 
    key: 'FOOD PICKED UP', 
    label: 'Food Picked Up!', 
    icon: '🛍️', 
    category: 'Status',
    translations: {
      en: "Food picked up fresh from restaurant! Heading your way now.",
      kn: "ರೆಸ್ಟೋರೆಂಟ್‌ನಿಂದ ಆಹಾರವನ್ನು ಪಡೆದುಕೊಂಡಿದ್ದೇನೆ! ಈಗ ನಿಮ್ಮ ಮನೆಗೆ ಹೊರಟಿದ್ದೇನೆ.",
      es: "¡Comida recogida en el restaurante! En camino a su dirección.",
      fr: "Commande récupérée au restaurant ! En route vers chez vous.",
      de: "Essen im Restaurant abgeholt! Auf dem Weg zu Ihnen.",
      ja: "料理を受け取りました！今向かっています。",
      zh: "餐饮已从餐厅取出！现在前往您的地址。",
      hi: "रेस्तरां से खाना ले लिया है! अब आपकी तरफ आ रहा हूँ।",
      ar: "تم استلام الطعام من المطعم! في الطريق إليك الآن."
    }
  },
  { 
    key: 'I AM OUTSIDE', 
    label: "I'm Outside Now!", 
    icon: '📍', 
    category: 'Arrival',
    translations: {
      en: "I have arrived outside your building! I am waiting near the entrance.",
      kn: "ನಾನು ನಿಮ್ಮ ಕಟ್ಟಡದ ಹೊರಗೆ ತಲುಪಿದ್ದೇನೆ! ಗೇಟ್ ಹತ್ತಿರ ಕಾಯುತ್ತಿದ್ದೇನೆ.",
      es: "¡He llegado afuera de su edificio! Estoy esperando cerca de la entrada.",
      fr: "Je suis arrivé devant votre immeuble ! J'attends près de l'entrée.",
      de: "Ich bin vor Ihrem Gebäude angekommen! Ich warte am Eingang.",
      ja: "建物の外に到着しました！入口近くで待っています。",
      zh: "我已到达您的楼下！正在入口附近等候。",
      hi: "मैं आपकी इमारत के बाहर पहुँच गया हूँ! मैं मुख्य द्वार के पास इंतज़ार कर रहा हूँ।",
      ar: "لقد وصلت خارج المبنى الخاص بك! أنا أنتظر بالقرب من المدخل."
    }
  },
  { 
    key: 'TRAFFIC DELAY', 
    label: 'Traffic Delay (3m)', 
    icon: '🚦', 
    category: 'Alert',
    translations: {
      en: "Encountered slight traffic congestion. Estimated 3 minute delay.",
      kn: "ದಾರಿಯಲ್ಲಿ ಟ್ರಾಫಿಕ್ ಇದೆ. ಸುಮಾರು 3 ನಿಮಿಷಗಳ ವಿಳಂಬ.",
      es: "Tráfico pesado en el camino. Retraso estimado de 3 minutos.",
      fr: "Embouteillage sur le trajet. Retard estimé de 3 minutes.",
      de: "Etwas verkehrsbedingt verzögert. Ca. 3 Minuten spätere Ankunft.",
      ja: "渋滞のため約3分遅れます。",
      zh: "途中遇到轻微拥堵，预计延迟约3分钟。",
      hi: "रास्ते में हल्का ट्रैफिक है। लगभग 3 मिनट की देरी।",
      ar: "زحام مروري بسيط. تأخير متوقع لمدة 3 دقائق."
    }
  },
  { 
    key: 'THANK YOU', 
    label: 'Thank You & Enjoy!', 
    icon: '🙏', 
    category: 'Closing',
    translations: {
      en: "Thank you for your order! Have a wonderful meal and day!",
      kn: "ನಿಮ್ಮ ಆರ್ಡರ್‌ಗೆ ಧನ್ಯವಾದಗಳು! ಶುಭ ದಿನ!",
      es: "¡Gracias por su pedido! ¡Que disfrute de su comida y tenga buen día!",
      fr: "Merci pour votre commande ! Bon appétit et excellente journée !",
      de: "Vielen Dank für Ihre Bestellung! Guten Appetit und einen schönen Tag!",
      ja: "ご注文ありがとうございます！美味しいお食事を！",
      zh: "感谢您的订购！祝您用餐愉快！",
      hi: "ऑर्डर करने के लिए धन्यवाद! आपका दिन शुभ हो!",
      ar: "شكرا لطلبك! أتمنى لك وجبة رائعة ويوم سعيد!"
    }
  }
];
