import { Article, CalibrationCard, SectionSlug } from "@/lib/types";

// Timestamps are generated relative to "now" at module load so the sample
// dataset always has a realistic recency spread, however far in the future
// this demo is run.
function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}

// One representative article per interest section — used as the onboarding
// calibration cards, and as the per-section fallback whenever a live
// "latest article" fetch fails for that section (see
// lib/data/nbtFeed.ts's getCalibrationCards).
export const CALIBRATION_ARTICLES: CalibrationCard[] = [
  {
    section: "business",
    headline_hi: "सेंसेक्स ने बनाया नया रिकॉर्ड, निवेशकों में उत्साह",
  },
  {
    section: "entertainment",
    headline_hi: "शाहरुख खान की नई फिल्म ने पहले दिन तोड़े सारे रिकॉर्ड",
  },
  {
    section: "cricket",
    headline_hi: "भारत ने ऑस्ट्रेलिया को 6 विकेट से हराया, सीरीज़ पर कब्ज़ा",
  },
  {
    section: "lifestyle",
    headline_hi: "रोज़ की भागदौड़ में खुद के लिए कैसे निकालें समय, जानें एक्सपर्ट टिप्स",
  },
  {
    section: "india",
    headline_hi: "संसद के मानसून सत्र में आज होगी अहम बहस",
  },
  {
    section: "world",
    headline_hi: "संयुक्त राष्ट्र में आज होगी अहम बैठक, कई देशों के प्रमुख होंगे शामिल",
  },
];

// Main feed pool. `city: null` = national news, otherwise a city slug that
// matches lib/data/cities.ts.
export const FEED_ARTICLES: Article[] = [
  { id: "a1", section: "business", city: "lucknow", published_at: hoursAgo(1), headline_hi: "यूपी में नई औद्योगिक नीति को मंजूरी, लाखों नौकरियों की उम्मीद" },
  { id: "a2", section: "cricket", city: null, published_at: hoursAgo(2), headline_hi: "IPL नीलामी: इस बार सबसे महंगा बिका यह गेंदबाज़" },
  { id: "a3", section: "entertainment", city: null, published_at: hoursAgo(3), headline_hi: "दीपिका पादुकोण की नई फिल्म का ट्रेलर रिलीज़" },
  { id: "a4", section: "lifestyle", city: "varanasi", published_at: hoursAgo(4), headline_hi: "काशी में बढ़ रहा है योग और आयुर्वेद का चलन" },
  { id: "a5", section: "india", city: "patna", published_at: hoursAgo(5), headline_hi: "बिहार में नई सड़क योजना का ऐलान" },
  { id: "a6", section: "business", city: null, published_at: hoursAgo(6), headline_hi: "रुपये में मजबूती, डॉलर के मुकाबले सुधरा भाव" },
  { id: "a7", section: "cricket", city: "indore", published_at: hoursAgo(7), headline_hi: "इंदौर में होगा अगला अंतरराष्ट्रीय मैच" },
  { id: "a8", section: "entertainment", city: null, published_at: hoursAgo(8), headline_hi: "सलमान खान की फिल्म की रिलीज़ डेट आगे बढ़ी" },
  { id: "a9", section: "lifestyle", city: null, published_at: hoursAgo(9), headline_hi: "सर्दियों में त्वचा की देखभाल के लिए अपनाएं ये आसान तरीके" },
  { id: "a10", section: "india", city: "jaipur", published_at: hoursAgo(10), headline_hi: "राजस्थान में मंत्रिमंडल विस्तार की चर्चा तेज़" },
  { id: "a11", section: "world", city: null, published_at: hoursAgo(11), headline_hi: "अमेरिका में नई व्यापार नीति का ऐलान, भारत पर पड़ेगा असर" },
  { id: "a12", section: "cricket", city: null, published_at: hoursAgo(12), headline_hi: "विराट कोहली ने जड़ा एक और शतक, फैंस झूमे" },
  { id: "a13", section: "entertainment", city: "jaipur", published_at: hoursAgo(13), headline_hi: "जयपुर में हुई बॉलीवुड सितारों की शादी, देखें तस्वीरें" },
  { id: "a14", section: "business", city: "patna", published_at: hoursAgo(14), headline_hi: "बिहार में नई स्टार्टअप नीति से मिलेगा युवाओं को फायदा" },
  { id: "a15", section: "india", city: null, published_at: hoursAgo(15), headline_hi: "संसद के मानसून सत्र में आज होगी अहम बहस" },
  { id: "a16", section: "world", city: null, published_at: hoursAgo(16), headline_hi: "यूरोप में बढ़ती ठंड से बिजली की मांग रिकॉर्ड स्तर पर" },
  { id: "a17", section: "cricket", city: "kanpur", published_at: hoursAgo(17), headline_hi: "कानपुर के ग्रीन पार्क में होगा घरेलू मुकाबला" },
  { id: "a18", section: "entertainment", city: null, published_at: hoursAgo(18), headline_hi: "अक्षय कुमार की फिल्म ने कमाए 100 करोड़" },
  { id: "a19", section: "lifestyle", city: "indore", published_at: hoursAgo(19), headline_hi: "इंदौर के लोगों में बढ़ रहा है फिटनेस के प्रति रुझान" },
  { id: "a20", section: "india", city: "lucknow", published_at: hoursAgo(20), headline_hi: "यूपी विधानसभा में आज पेश होगा बजट" },
  { id: "a21", section: "business", city: null, published_at: hoursAgo(21), headline_hi: "केंद्र सरकार ने दी नई निवेश नीति को मंजूरी" },
  { id: "a22", section: "cricket", city: null, published_at: hoursAgo(22), headline_hi: "महिला क्रिकेट टीम ने रचा इतिहास, जीता खिताब" },
  { id: "a23", section: "entertainment", city: "lucknow", published_at: hoursAgo(23), headline_hi: "लखनऊ में फिल्म फेस्टिवल का भव्य आगाज़" },
  { id: "a24", section: "world", city: null, published_at: hoursAgo(24), headline_hi: "चीन में नई आर्थिक नीति से वैश्विक बाजार में हलचल" },
  { id: "a25", section: "india", city: "ranchi", published_at: hoursAgo(26), headline_hi: "झारखंड में नई योजना से जुड़ेंगे लाखों किसान" },
  { id: "a26", section: "business", city: "jaipur", published_at: hoursAgo(28), headline_hi: "राजस्थान में नई औद्योगिक इकाइयों को मिलेगी छूट" },
  { id: "a27", section: "cricket", city: "patna", published_at: hoursAgo(30), headline_hi: "पटना में क्रिकेट अकादमी का उद्घाटन" },
  { id: "a28", section: "entertainment", city: null, published_at: hoursAgo(32), headline_hi: "कैटरीना कैफ ने शेयर की फिल्म की पहली झलक" },
  { id: "a29", section: "lifestyle", city: "gorakhpur", published_at: hoursAgo(34), headline_hi: "गोरखपुर में खुला नया वेलनेस सेंटर, लोगों में उत्साह" },
  { id: "a30", section: "world", city: null, published_at: hoursAgo(36), headline_hi: "पाकिस्तान में राजनीतिक हलचल तेज़, नई सरकार बनने के आसार" },
];

export function sectionArticleCount(section: SectionSlug): number {
  return FEED_ARTICLES.filter((a) => a.section === section).length;
}
