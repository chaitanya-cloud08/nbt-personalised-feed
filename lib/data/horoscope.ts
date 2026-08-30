// Static daily horoscope lookup — no AI generation. A small pool of Hindi
// texts is rotated deterministically by (rashi index + day of year), so the
// same rashi+date always yields the same text and it changes day to day.
const HOROSCOPE_TEXTS: string[] = [
  "आज आपका दिन ऊर्जा से भरपूर रहेगा, नए कामों में सफलता मिलेगी।",
  "पारिवारिक जीवन में खुशियां बनी रहेंगी, धन लाभ के योग हैं।",
  "आज सेहत का विशेष ध्यान रखें, यात्रा से बचें तो बेहतर होगा।",
  "करियर में आज कोई अच्छा अवसर मिल सकता है, सतर्क रहें।",
  "मन शांत रहेगा, पुराने रुके काम आज पूरे हो सकते हैं।",
  "आज किसी करीबी से मुलाकात खुशी का कारण बनेगी।",
  "आर्थिक मामलों में सोच-समझकर फैसला लें, जल्दबाज़ी से बचें।",
];

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getHoroscopeText(rashiIndex: number, date: Date = new Date()): string {
  const idx = (rashiIndex + dayOfYear(date)) % HOROSCOPE_TEXTS.length;
  return HOROSCOPE_TEXTS[idx];
}
