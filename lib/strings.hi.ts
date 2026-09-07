// Central Hindi copy. All user-facing text lives here so it can be edited
// without touching component code.

export const strings = {
  appName: "नवभारत टाइम्स",

  auth: {
    loginTitle: "साइन इन करें",
    registerTitle: "खाता बनाएं",
    subtitle: "अपनी पसंद की खबरें सहेजने के लिए साइन इन करें।",
    emailPlaceholder: "ईमेल",
    passwordPlaceholder: "पासवर्ड (कम से कम 8 अक्षर)",
    loginButton: "साइन इन करें",
    registerButton: "खाता बनाएं",
    switchToRegister: "नया खाता बनाना चाहते हैं? यहाँ क्लिक करें",
    switchToLogin: "पहले से खाता है? साइन इन करें",
    genericError: "कुछ गलत हो गया, फिर कोशिश करें",
    logout: "लॉग आउट",
  },

  onboarding: {
    step1: {
      title: "आपका राज्य कौन सा है?",
      subtitle: "पहले राज्य चुनें, फिर हम आपको उसके शहर दिखाएँगे।",
      searchPlaceholder: "राज्य खोजें...",
      cityTitle: "आपका शहर कौन सा है?",
      citySubtitle: "इससे हम आपके शहर की खबरें आपकी फ़ीड में सबसे ऊपर दिखाएँगे।",
      citySearchPlaceholder: "शहर खोजें...",
      continue: "आगे बढ़ें",
    },
    step2: {
      title: "आपकी पसंद बताइए",
      subtitle: "इन खबरों को देखकर बताएं कि आपको ऐसी खबरें पसंद हैं या नहीं।",
      notInterested: "पसंद नहीं",
      interested: "पसंद है",
      done: "आपकी फ़ीड तैयार है",
      doneSubtitle: "अब आपको आपकी पसंद की खबरें सबसे पहले दिखेंगी।",
    },
    step3: {
      title: "आपकी राशि क्या है?",
      subtitle: "राशिफल विजेट पाने के लिए अपनी राशि चुनें (यह वैकल्पिक है)।",
      skip: "अभी नहीं",
      finish: "फ़ीड पर जाएं",
    },
    progress: (current: number, total: number) => `${current}/${total}`,
  },

  feed: {
    header: "आपकी फ़ीड",
    forYou: "आपके लिए चुनी गई खबरें",
    empty: "अभी कोई खबर उपलब्ध नहीं है।",
    nationalTag: "राष्ट्रीय",
    cityBadge: "आपके शहर की खबर",
    regionalBadge: "राज्य/शहर",
    resetInterests: {
      title: "क्या आपकी फ़ीड सही लग रही है?",
      subtitle: "कुछ खबरें देखकर अपनी पसंद फिर से सेट करें।",
      button: "पसंद फिर से सेट करें",
      calibrationTitle: "आपकी पसंद बताइए",
      calibrationSubtitle: "इन खबरों को देखकर बताएं कि आपको ऐसी खबरें पसंद हैं या नहीं।",
      saving: "सहेजा जा रहा है...",
    },
  },

  widgets: {
    live: {
      badge: "लाइव",
    },
    festival: {
      daysRemaining: (name: string, days: number) =>
        days === 0 ? `आज ${name} है!` : `${name} में ${days} दिन बाकी`,
    },
    festivalPage: {
      significance: "महत्व",
      tips: "कैसे मनाएं",
      inspiration: "प्रेरणा",
      backToFeed: "फ़ीड पर वापस जाएं",
      unavailable: "इस त्योहार की विस्तृत जानकारी अभी उपलब्ध नहीं है।",
    },
    horoscope: {
      title: "आज का राशिफल",
    },
    brief: {
      morningTitle: "सुबह की सुर्खियां",
      afternoonTitle: "दिन की सुर्खियां",
      eveningTitle: "शाम की सुर्खियां",
      subtitle: "आज की टॉप खबरें आवाज़ में सुनें",
      play: "सुनें",
      pause: "रोकें",
      resume: "जारी रखें",
      stop: "बंद करें",
      playing: "चल रहा है...",
      morningGreeting: "सुप्रभात",
      afternoonGreeting: "नमस्ते",
      eveningGreeting: "शुभ संध्या",
      introWithCity: (city: string) => `${city} से आज की मुख्य खबरें प्रस्तुत हैं।`,
      introWithoutCity: "आज की मुख्य खबरें प्रस्तुत हैं।",
      headlineNumber: (n: number) => `खबर ${n}।`,
      outro: "यह था आज का समाचार सार। धन्यवाद।",
    },
  },

  settings: {
    title: "सेटिंग्स",
    cityLabel: "शहर",
    rashiLabel: "राशि",
    rashiNotSet: "राशि सेट नहीं है",
    changeCity: "शहर बदलें",
    changeRashi: "राशि बदलें",
    recalibrate: "फ़ीड को फिर से सेट करें",
    recalibrateSubtitle: "कुछ और खबरें देखकर अपनी फ़ीड को बेहतर बनाएं।",
    backToFeed: "फ़ीड पर वापस जाएं",
    saved: "सहेजा गया",
  },

  common: {
    loading: "लोड हो रहा है...",
    settings: "सेटिंग्स",
    home: "होम",
  },

  nav: {
    home: "होम",
    settings: "सेटिंग्स",
  },
};

const MONTHS_HI = [
  "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
  "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर",
];

/** Hindi date label, e.g. "14 सितंबर 2026", parsed from a "YYYY-MM-DD" date. */
export function formatDateHi(dateISO: string): string {
  const [year, month, day] = dateISO.split("-").map(Number);
  return `${day} ${MONTHS_HI[month - 1]} ${year}`;
}

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export interface BriefTimeOfDay {
  title: string;
  greeting: string;
}

/** Morning/afternoon/evening copy for the audio brief widget, based on IST
 * (this app is India-only) — computed server-side so the client doesn't
 * need its own clock/timezone, which would risk a hydration mismatch
 * against the server-rendered HTML. */
export function briefTimeOfDay(now: Date = new Date()): BriefTimeOfDay {
  const istHour = new Date(now.getTime() + IST_OFFSET_MS).getUTCHours();
  const b = strings.widgets.brief;
  if (istHour < 12) return { title: b.morningTitle, greeting: b.morningGreeting };
  if (istHour < 17) return { title: b.afternoonTitle, greeting: b.afternoonGreeting };
  return { title: b.eveningTitle, greeting: b.eveningGreeting };
}

/** Hindi relative-time label, e.g. "30 मिनट पहले", "2 घंटे पहले", "3 दिन पहले". */
export function timeAgoHi(publishedAt: string, now: Date = new Date()): string {
  const minutes = Math.max(1, Math.round((now.getTime() - new Date(publishedAt).getTime()) / 60000));
  if (minutes < 60) return `${minutes} मिनट पहले`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return hours === 1 ? "1 घंटा पहले" : `${hours} घंटे पहले`;
  const days = Math.round(hours / 24);
  return days === 1 ? "1 दिन पहले" : `${days} दिन पहले`;
}
