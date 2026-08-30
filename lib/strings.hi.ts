// Central Hindi copy. All user-facing text lives here so it can be edited
// without touching component code.

export const strings = {
  appName: "नवभारत टाइम्स",

  onboarding: {
    step1: {
      title: "आपका शहर कौन सा है?",
      subtitle: "इससे हम आपके शहर की खबरें आपकी फ़ीड में सबसे ऊपर दिखाएँगे।",
      searchPlaceholder: "शहर खोजें...",
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
  },

  widgets: {
    live: {
      badge: "लाइव",
    },
    festival: {
      daysRemaining: (name: string, days: number) =>
        days === 0 ? `आज ${name} है!` : `${name} में ${days} दिन बाकी`,
    },
    horoscope: {
      title: "आज का राशिफल",
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

  sections: {
    "sarkari-naukri": "सरकारी नौकरी",
    cricket: "क्रिकेट",
    bollywood: "बॉलीवुड",
    "dharm-tyohar": "धर्म/त्योहार",
    rajniti: "राजनीति",
  } as Record<string, string>,

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

/** Hindi relative-time label, e.g. "30 मिनट पहले", "2 घंटे पहले", "3 दिन पहले". */
export function timeAgoHi(publishedAt: string, now: Date = new Date()): string {
  const minutes = Math.max(1, Math.round((now.getTime() - new Date(publishedAt).getTime()) / 60000));
  if (minutes < 60) return `${minutes} मिनट पहले`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return hours === 1 ? "1 घंटा पहले" : `${hours} घंटे पहले`;
  const days = Math.round(hours / 24);
  return days === 1 ? "1 दिन पहले" : `${days} दिन पहले`;
}
