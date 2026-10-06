// Dedicated Multilingual Translation Engine for Direct Customer-Rider Communication
// Supports real-time dynamic language switching across 9 global languages

import { RIDER_QUICK_SIGNS } from './languages.js';

export const LANG_LOCALES = {
  en: 'en-US',
  kn: 'kn-IN',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  ja: 'ja-JP',
  zh: 'zh-CN',
  hi: 'hi-IN',
  ar: 'ar-SA'
};

// UI Strings for the Direct Communication Interface
export const DIRECT_COMM_UI = {
  en: {
    title: "Direct Customer-Rider Communication",
    subtitle: "Real-time AI sign bridge & multilingual delivery chat",
    translating_notice: "Translating message to visual 3D sign language for rider Alex...",
    sender_you: "👤 You",
    sender_rider: "🤟 Rider Alex",
    sender_system: "⚙️ System Notice",
    sign_to_voice: "Sign ➔ Voice Audio",
    listen_aloud: "Listen Aloud",
    quick_prompts_title: "1-Tap Customer Prompts",
    input_placeholder: "Type your message in English...",
    send_btn: "Send",
    voice_listening: "Listening to your voice...",
    voice_title: "Speech-to-Text Voice Input",
    lang_badge: "Language",
    translated_badge: "Translated",
    prompts: [
      { key: 'leave_door', label: "🚪 Leave at door", text: "Please leave food at door and ring bell" },
      { key: 'gate_open', label: "🔢 Gate is open", text: "Front gate is open, come on in!" },
      { key: 'right_there', label: "⏱️ Right there (1m)", text: "Be right there in 1 minute!" },
      { key: 'thank_you', label: "🙏 Thank you Alex", text: "Thank you so much Alex! Great job!" }
    ]
  },
  kn: {
    title: "ಗ್ರಾಹಕ ಮತ್ತು ರೈಡರ್ ನಡುವಿನ ನೇರ ಸಂವಹನ",
    subtitle: "ನೈಜ ಸಮಯದ ಎಐ ಸನ್ನೆ ಸೇತು ಮತ್ತು ಬಹುಭಾಷಾ ಡೆಲಿವರಿ ಚಾಟ್",
    translating_notice: "ರೈಡರ್ ಅಲೆಕ್ಸ್‌ಗಾಗಿ ಸಂದೇಶವನ್ನು 3D ಸನ್ನೆ ಭಾಷೆಗೆ ಅನುವಾದಿಸಲಾಗುತ್ತಿದೆ...",
    sender_you: "👤 ನೀವು",
    sender_rider: "🤟 ರೈಡರ್ ಅಲೆಕ್ಸ್",
    sender_system: "⚙️ ಸಿಸ್ಟಮ್ ಸೂಚನೆ",
    sign_to_voice: "ಸನ್ನೆ ➔ ಧ್ವನಿ ಆಡಿಯೋ",
    listen_aloud: "ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಿ",
    quick_prompts_title: "1-ಟ್ಯಾಪ್ ಗ್ರಾಹಕ ಸೂಚನೆಗಳು",
    input_placeholder: "ಕನ್ನಡದಲ್ಲಿ ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...",
    send_btn: "ಕಳುಹಿಸಿ",
    voice_listening: "ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ಆಲಿಸಲಾಗುತ್ತಿದೆ...",
    voice_title: "ಧ್ವನಿಯಿಂದ ಪಠ್ಯ ಇನ್‌ಪುಟ್",
    lang_badge: "ಭಾಷೆ",
    translated_badge: "ಅನುವಾದಿಸಲಾಗಿದೆ",
    prompts: [
      { key: 'leave_door', label: "🚪 ಬಾಗಿಲಿನಲ್ಲಿ ಬಿಡಿ", text: "ದಯವಿಟ್ಟು ಆಹಾರವನ್ನು ಬಾಗಿಲಿನಲ್ಲಿ ಬಿಟ್ಟು ಗಂಟೆ ಬಾರಿಸಿ" },
      { key: 'gate_open', label: "🔢 ಗೇಟ್ ತೆರೆದಿದೆ", text: "ಮುಖ್ಯ ಗೇಟ್ ತೆರೆದಿದೆ, ಒಳಗೆ ಬನ್ನಿ!" },
      { key: 'right_there', label: "⏱️ 1 ನಿಮಿಷದಲ್ಲಿ ಬರುತ್ತೇನೆ", text: "ಒಂದು ನಿಮಿಷದಲ್ಲಿ ಬರುತ್ತೇನೆ!" },
      { key: 'thank_you', label: "🙏 ಧನ್ಯವಾದಗಳು ಅಲೆಕ್ಸ್", text: "ತುಂಬಾ ಧನ್ಯವಾದಗಳು ಅಲೆಕ್ಸ್! ಉತ್ತಮ ಕೆಲಸ!" }
    ]
  },
  es: {
    title: "Comunicación Directa Cliente-Repartidor",
    subtitle: "Puente de señas con IA en tiempo real y chat multilingüe",
    translating_notice: "Traduciendo mensaje a lengua de señas 3D visual para el repartidor Alex...",
    sender_you: "👤 Tú",
    sender_rider: "🤟 Repartidor Alex",
    sender_system: "⚙️ Aviso del Sistema",
    sign_to_voice: "Señas ➔ Audio de Voz",
    listen_aloud: "Escuchar en voz alta",
    quick_prompts_title: "Indicaciones rápidas en 1 toque",
    input_placeholder: "Escriba su mensaje en español...",
    send_btn: "Enviar",
    voice_listening: "Escuchando su voz...",
    voice_title: "Entrada de voz a texto",
    lang_badge: "Idioma",
    translated_badge: "Traducido",
    prompts: [
      { key: 'leave_door', label: "🚪 Dejar en la puerta", text: "Por favor deje la comida en la puerta y toque el timbre" },
      { key: 'gate_open', label: "🔢 Portón abierto", text: "¡El portón principal está abierto, puede entrar!" },
      { key: 'right_there', label: "⏱️ Ya bajo (1 min)", text: "¡Estaré allí en 1 minuto!" },
      { key: 'thank_you', label: "🙏 Gracias Alex", text: "¡Muchas gracias Alex! ¡Excelente trabajo!" }
    ]
  },
  fr: {
    title: "Communication Directe Client-Livreur",
    subtitle: "Passerelle IA en langue des signes et chat de livraison multilingue",
    translating_notice: "Traduction du message en langue des signes 3D pour le livreur Alex...",
    sender_you: "👤 Vous",
    sender_rider: "🤟 Livreur Alex",
    sender_system: "⚙️ Avis du Système",
    sign_to_voice: "Signes ➔ Audio Vocal",
    listen_aloud: "Écouter à voix haute",
    quick_prompts_title: "Instructions rapides en 1 clic",
    input_placeholder: "Écrivez votre message en français...",
    send_btn: "Envoyer",
    voice_listening: "Écoute de votre voix...",
    voice_title: "Saisie vocale",
    lang_badge: "Langue",
    translated_badge: "Traduit",
    prompts: [
      { key: 'leave_door', label: "🚪 Laisser à la porte", text: "Veuillez laisser la nourriture à la porte et sonner" },
      { key: 'gate_open', label: "🔢 Portail ouvert", text: "Le portail est ouvert, vous pouvez entrer !" },
      { key: 'right_there', label: "⏱️ J'arrive (1 min)", text: "Je suis là dans 1 minute !" },
      { key: 'thank_you', label: "🙏 Merci Alex", text: "Merci beaucoup Alex ! Excellent travail !" }
    ]
  },
  de: {
    title: "Direkte Kommunikation Kunde-Lieferant",
    subtitle: "Echtzeit-KI-Gebärdenbrücke und mehrsprachiger Liefer-Chat",
    translating_notice: "Übersetze Nachricht in visuelle 3D-Gebärdensprache für Alex...",
    sender_you: "👤 Sie",
    sender_rider: "🤟 Lieferant Alex",
    sender_system: "⚙️ Systemhinweis",
    sign_to_voice: "Gebärde ➔ Sprachausgabe",
    listen_aloud: "Laut vorlesen",
    quick_prompts_title: "1-Klick Kunden-Hinweise",
    input_placeholder: "Nachricht auf Deutsch eingeben...",
    send_btn: "Senden",
    voice_listening: "Höre Ihrer Stimme zu...",
    voice_title: "Spracheingabe",
    lang_badge: "Sprache",
    translated_badge: "Übersetzt",
    prompts: [
      { key: 'leave_door', label: "🚪 An der Tür ablegen", text: "Bitte das Essen vor der Tür ablegen und klingeln" },
      { key: 'gate_open', label: "🔢 Tor ist offen", text: "Das Tor ist offen, kommen Sie gerne herein!" },
      { key: 'right_there', label: "⏱️ Gleich da (1 Min)", text: "Ich bin in 1 Minute da!" },
      { key: 'thank_you', label: "🙏 Danke Alex", text: "Vielen Dank Alex! Tolle Arbeit!" }
    ]
  },
  ja: {
    title: "お客様と配達員の直接コミュニケーション",
    subtitle: "リアルタイムAI手話ブリッジ＆多言語配達チャット",
    translating_notice: "配達員Alexのためにメッセージを3D手話に翻訳中...",
    sender_you: "👤 あなた",
    sender_rider: "🤟 配達員 Alex",
    sender_system: "⚙️ システム通知",
    sign_to_voice: "手話 ➔ 音声読み上げ",
    listen_aloud: "音声で聞く",
    quick_prompts_title: "1タップ配達指示",
    input_placeholder: "日本語でメッセージを入力...",
    send_btn: "送信",
    voice_listening: "音声を認識中...",
    voice_title: "音声入力",
    lang_badge: "言語",
    translated_badge: "翻訳済み",
    prompts: [
      { key: 'leave_door', label: "🚪 ドアの前に置く", text: "ドアの前に食事を置いてインターホンを鳴らしてください" },
      { key: 'gate_open', label: "🔢 ゲート開放中", text: "表のゲートは開いています。どうぞお入りください！" },
      { key: 'right_there', label: "⏱️ 1分で行きます", text: "1分ですぐに向かいます！" },
      { key: 'thank_you', label: "🙏 ありがとうAlex", text: "Alexさん、ありがとうございます！素晴らしい配達です！" }
    ]
  },
  zh: {
    title: "客户与配送员实时直接沟通",
    subtitle: "实时 AI 手语桥接与多语言配送对话",
    translating_notice: "正在将消息翻译为专送员 Alex 的 3D 手语动作...",
    sender_you: "👤 您",
    sender_rider: "🤟 专送员 Alex",
    sender_system: "⚙️ 系统通知",
    sign_to_voice: "手语 ➔ 语音播报",
    listen_aloud: "语音收听",
    quick_prompts_title: "1 键快速常用提示",
    input_placeholder: "输入您的中文消息...",
    send_btn: "发送",
    voice_listening: "正在倾听您的声音...",
    voice_title: "语音转文字输入",
    lang_badge: "语言",
    translated_badge: "已翻译",
    prompts: [
      { key: 'leave_door', label: "🚪 放在门口", text: "请将食物放在门口并按门铃" },
      { key: 'gate_open', label: "🔢 大门已开", text: "前院大门敞开着，请直接进来！" },
      { key: 'right_there', label: "⏱️ 马上到（1分钟）", text: "我马上就到，只需1分钟！" },
      { key: 'thank_you', label: "🙏 谢谢 Alex", text: "非常感谢 Alex！配送很棒！" }
    ]
  },
  hi: {
    title: "ग्राहक और राइडर के बीच सीधा संवाद",
    subtitle: "रियल-टाइम एआई सांकेतिक भाषा ब्रिज और बहुभाषी चैट",
    translating_notice: "राइडर एलेक्स के लिए संदेश को विज़ुअल 3D सांकेतिक भाषा में अनुवाद किया जा रहा है...",
    sender_you: "👤 आप",
    sender_rider: "🤟 राइडर एलेक्स",
    sender_system: "⚙️ सिस्टम सूचना",
    sign_to_voice: "सांकेतिक ➔ वॉइस ऑडियो",
    listen_aloud: "बोलकर सुनें",
    quick_prompts_title: "1-टैप त्वरित ग्राहक संकेत",
    input_placeholder: "हिन्दी में अपना संदेश लिखें...",
    send_btn: "भेजें",
    voice_listening: "आपकी आवाज़ सुनी जा रही है...",
    voice_title: "वॉइस-टू-टेक्स्ट इनपुट",
    lang_badge: "भाषा",
    translated_badge: "अनुवादित",
    prompts: [
      { key: 'leave_door', label: "🚪 दरवाजे पर छोड़ें", text: "कृपया खाना दरवाजे पर छोड़ दें और घंटी बजाएं" },
      { key: 'gate_open', label: "🔢 गेट खुला है", text: "मुख्य गेट खुला है, सीधे अंदर आ जाएं!" },
      { key: 'right_there', label: "⏱️ 1 मिनट में आता हूँ", text: "मैं 1 मिनट में वहीं पहुँचता हूँ!" },
      { key: 'thank_you', label: "🙏 धन्यवाद एलेक्स", text: "बहुत-बहुत धन्यवाद एलेक्स! बेहतरीन सेवा!" }
    ]
  },
  ar: {
    title: "التواصل المباشر بين العميل ومندوب التوصيل",
    subtitle: "جسر لغة الإشارة الذكي في الوقت الفعلي والدردشة متعددة اللغات",
    translating_notice: "جاري ترجمة الرسالة إلى لغة الإشارة ثلاثية الأبعاد للمندوب أليكس...",
    sender_you: "👤 أنت",
    sender_rider: "🤟 المندوب أليكس",
    sender_system: "⚙️ إشعار النظام",
    sign_to_voice: "إشارة ➔ صوت مسموع",
    listen_aloud: "الاستماع بصوت عالٍ",
    quick_prompts_title: "توجيهات بنقرة واحدة",
    input_placeholder: "اكتب رسالتك باللغة العربية...",
    send_btn: "إرسال",
    voice_listening: "جاري الاستماع لصوتك...",
    voice_title: "إدخال الصوت إلى نص",
    lang_badge: "اللغة",
    translated_badge: "مترجم",
    prompts: [
      { key: 'leave_door', label: "🚪 اترك عند الباب", text: "يرجى ترك الطعام عند الباب ودق الجرس" },
      { key: 'gate_open', label: "🔢 البوابة مفتوحة", text: "البوابة الأمامية مفتوحة، تفضل بالدخول!" },
      { key: 'right_there', label: "⏱️ قادم خلال دقيقة", text: "سأكون هناك خلال دقيقة واحدة!" },
      { key: 'thank_you', label: "🙏 شكراً أليكس", text: "شكراً جزيلاً أليكس! عمل رائع ومميز!" }
    ]
  }
};

// Initial default chat messages with complete 9-language translations
export const DEFAULT_CHAT_MESSAGES = [
  {
    id: 1,
    sender: "system",
    translations: {
      en: "Real-Time Sign & Visual Assist is ACTIVE for this delivery. Rider Alex uses SignShift visual bridge.",
      kn: "ನೈಜ-ಸಮಯದ ಸನ್ನೆ ಮತ್ತು ದೃಶ್ಯ ಸಹಾಯಕ ಈ ಡೆಲಿವರಿಗೆ ಸಕ್ರಿಯವಾಗಿದೆ. ರೈಡರ್ ಅಲೆಕ್ಸ್ ಸೈನ್‌ಶಿಫ್ಟ್ ದೃಶ್ಯ ಸೇತುವನ್ನು ಬಳಸುತ್ತಾರೆ.",
      es: "Asistencia visual y de señas en tiempo real ACTIVA para esta entrega. El repartidor Alex usa el puente visual de SignShift.",
      fr: "L'assistance visuelle et de langue des signes en temps réel est ACTIVE. Le livreur Alex utilise la passerelle visuelle SignShift.",
      de: "Echtzeit-Gebärden- und Seh-Assistent ist AKTIV für diese Lieferung. Alex nutzt die SignShift-Gebärdenbrücke.",
      ja: "リアルタイム手話＆視覚アシストが有効です。配達員AlexはSignShiftビジュアルブリッジを使用しています。",
      zh: "实时手语及视觉辅助已激活。配送员 Alex 正在使用 SignShift 视觉桥接系统。",
      hi: "इस डिलीवरी के लिए रियल-टाइम सांकेतिक और विज़ुअल सहायता सक्रिय है। राइडर एलेक्स साइनशिफ्ट विज़ुअल ब्रिज का उपयोग करते हैं।",
      ar: "مساعد لغة الإشارة المرئية نشط في الوقت الفعلي لهذا التوصيل. يستخدم المندوب أليكس جسر SignShift المرئي."
    },
    text: "Real-Time Sign & Visual Assist is ACTIVE for this delivery. Rider Alex uses SignShift visual bridge.",
    timestamp: "12:14 PM"
  },
  {
    id: 2,
    sender: "customer",
    translations: {
      en: "Hi Alex! Please leave the food at the front door and ring the bell. Gate code is 4022.",
      kn: "ನಮಸ್ಕಾರ ಅಲೆಕ್ಸ್! ದಯವಿಟ್ಟು ಆಹಾರವನ್ನು ಮುಖ್ಯ ಬಾಗಿಲಿನಲ್ಲಿ ಬಿಟ್ಟು ಗಂಟೆ ಬಾರಿಸಿ. ಗೇಟ್ ಕೋಡ್ 4022.",
      es: "¡Hola Alex! Por favor deja la comida en la puerta principal y toca el timbre. El código del portón es 4022.",
      fr: "Bonjour Alex ! Veuillez laisser la nourriture devant la porte et sonner. Le code du portail est 4022.",
      de: "Hallo Alex! Bitte das Essen an der Haustür ablegen und klingeln. Der Torkode ist 4022.",
      ja: "Alexさんこんにちは！食事を玄関の前に置いてインターホンを鳴らしてください。ゲートコードは4022です。",
      zh: "你好 Alex！请把餐点放在前门并按门铃。大门密码是 4022。",
      hi: "नमस्ते एलेक्स! कृपया खाना सामने के दरवाजे पर छोड़ दें और घंटी बजाएं। गेट कोड 4022 है।",
      ar: "مرحباً أليكس! يرجى ترك الطعام عند الباب الأمامي ودق الجرس. رمز البوابة هو 4022."
    },
    text: "Hi Alex! Please leave the food at the front door and ring the bell. Gate code is 4022.",
    signKeywords: ["leave", "door", "gate", "code"],
    timestamp: "12:15 PM"
  },
  {
    id: 3,
    sender: "rider",
    signPhrase: "HELLO",
    translations: {
      en: "Hello! I am Alex, your delivery partner. I communicate using Visual Sign and text prompts.",
      kn: "ನಮಸ್ಕಾರ! ನಾನು ಅಲೆಕ್ಸ್, ನಿಮ್ಮ ಡೆಲಿವರಿ ಪಾರ್ಟ್ನರ್. ನಾನು ದೃಶ್ಯ ಸನ್ನೆ ಮತ್ತು ಪಠ್ಯ ಸೂಚನೆಗಳನ್ನು ಬಳಸುತ್ತೇನೆ.",
      es: "¡Hola! Soy Alex, su repartidor. Me comunico mediante señas visuales y texto.",
      fr: "Bonjour ! Je suis Alex, votre livreur. Je communique par langue des signes visuelle et texte.",
      de: "Hallo! Ich bin Alex, Ihr Lieferpartner. Ich kommuniziere über visuelle Gebärden und Text.",
      ja: "こんにちは！配達のAlexです。視覚的手話とテキストでコミュニケーションをとります。",
      zh: "你好！我是 Alex，您的外卖送餐员。我使用视觉手语和文字进行沟通。",
      hi: "नमस्ते! मैं एलेक्स हूँ, आपका डिलीवरी पार्टनर। मैं विज़ुअल साइन और टेक्स्ट के माध्यम से संवाद करता हूँ।",
      ar: "مرحباً! أنا أليكس، شريك التوصيل الخاص بك. أتواصل عبر لغة الإشارة المرئية والنصوص."
    },
    text: "Hello! I am Alex, your delivery partner. I communicate using Visual Sign and text prompts.",
    timestamp: "12:16 PM"
  }
];

// Helper to get all 9-language translations for a quick prompt by key
export const getPromptTranslations = (promptKey) => {
  const result = {};
  Object.keys(DIRECT_COMM_UI).forEach((langCode) => {
    const found = DIRECT_COMM_UI[langCode].prompts.find((p) => p.key === promptKey);
    if (found) {
      result[langCode] = found.text;
    }
  });
  return result;
};

// Core resolver: translates any chat message into the user's active language
export const translateChatMessage = (msg, currentLang = 'en') => {
  if (!msg) return "";
  const targetLang = currentLang || 'en';

  // 1. Direct match in msg.translations
  if (msg.translations && msg.translations[targetLang]) {
    return msg.translations[targetLang];
  }

  // 2. Look up by signPhrase / signKey from RIDER_QUICK_SIGNS
  if (msg.signPhrase) {
    const quickSign = RIDER_QUICK_SIGNS.find(
      (s) => s.key === msg.signPhrase || s.label === msg.signPhrase
    );
    if (quickSign?.translations && quickSign.translations[targetLang]) {
      return quickSign.translations[targetLang];
    }
  }

  // 3. Match against known customer prompts
  for (const lang of Object.keys(DIRECT_COMM_UI)) {
    const matchedPrompt = DIRECT_COMM_UI[lang].prompts.find(
      (p) => p.text.trim().toLowerCase() === (msg.text || "").trim().toLowerCase()
    );
    if (matchedPrompt) {
      const targetPrompt = DIRECT_COMM_UI[targetLang]?.prompts.find((p) => p.key === matchedPrompt.key);
      if (targetPrompt) return targetPrompt.text;
    }
  }

  // 4. Match against default messages (system notice or rider greeting)
  for (const defMsg of DEFAULT_CHAT_MESSAGES) {
    if (defMsg.translations && Object.values(defMsg.translations).some(t => t.trim().toLowerCase() === (msg.text || "").trim().toLowerCase())) {
      if (defMsg.translations[targetLang]) {
        return defMsg.translations[targetLang];
      }
    }
  }

  // 5. Fallback to English translation if available
  if (msg.translations && msg.translations.en) {
    return msg.translations.en;
  }

  // 6. Return original text
  return msg.text || "";
};
