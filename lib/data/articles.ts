import { Article, CalibrationCard, SectionSlug } from "@/lib/types";

// Timestamps are generated relative to "now" at module load so the sample
// dataset always has a realistic recency spread, however far in the future
// this demo is run.
function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}

// One representative article per major section — shown as the 5 onboarding
// calibration cards (Part 1, Step 2).
export const CALIBRATION_ARTICLES: CalibrationCard[] = [
  {
    section: "sarkari-naukri",
    headline_hi: "UPSSSC में 10,000 पदों पर भर्ती, आज से आवेदन शुरू",
  },
  {
    section: "cricket",
    headline_hi: "भारत ने ऑस्ट्रेलिया को 6 विकेट से हराया, सीरीज़ पर कब्ज़ा",
  },
  {
    section: "bollywood",
    headline_hi: "शाहरुख खान की नई फिल्म ने पहले दिन तोड़े सारे रिकॉर्ड",
  },
  {
    section: "dharm-tyohar",
    headline_hi: "जन्माष्टमी पर मथुरा-वृंदावन में उमड़ा श्रद्धालुओं का सैलाब",
  },
  {
    section: "rajniti",
    headline_hi: "विधानसभा सत्र में आज पेश होगा नया विधेयक, हंगामे के आसार",
  },
];

// Extra cards used by /api/recalibrate — different headlines per section so
// re-calibration feels fresh, not a repeat of onboarding.
export const RECALIBRATION_POOL: CalibrationCard[] = [
  {
    section: "sarkari-naukri",
    headline_hi: "रेलवे भर्ती बोर्ड ने जारी किया ग्रुप-डी का रिजल्ट",
  },
  {
    section: "cricket",
    headline_hi: "T20 वर्ल्ड कप: भारतीय टीम की घोषणा आज, इन खिलाड़ियों की वापसी",
  },
  {
    section: "bollywood",
    headline_hi: "आलिया भट्ट की अगली फिल्म का पहला पोस्टर हुआ रिलीज़",
  },
  {
    section: "dharm-tyohar",
    headline_hi: "इस बार गणेश चतुर्थी पर बन रहा है विशेष शुभ योग",
  },
  {
    section: "rajniti",
    headline_hi: "मुख्यमंत्री ने किया बड़े बजट के ऐलान का संकेत",
  },
  {
    section: "sarkari-naukri",
    headline_hi: "SSC CGL 2026 का एडमिट कार्ड जारी, ऐसे करें डाउनलोड",
  },
  {
    section: "cricket",
    headline_hi: "रणजी ट्रॉफी में युवा बल्लेबाज़ ने जड़ा तिहरा शतक",
  },
  {
    section: "bollywood",
    headline_hi: "रणबीर कपूर की फिल्म की शूटिंग जयपुर में शुरू",
  },
  {
    section: "dharm-tyohar",
    headline_hi: "नवरात्रि की तैयारियां शुरू, बाज़ारों में रौनक",
  },
  {
    section: "rajniti",
    headline_hi: "विपक्ष ने सरकार को घेरा, सदन में हुई नारेबाज़ी",
  },
];

// Main feed pool. `city: null` = national news, otherwise a city slug that
// matches lib/data/cities.ts.
export const FEED_ARTICLES: Article[] = [
  { id: "a1", section: "sarkari-naukri", city: "lucknow", published_at: hoursAgo(1), headline_hi: "UP पुलिस भर्ती परीक्षा की नई तारीख घोषित" },
  { id: "a2", section: "cricket", city: null, published_at: hoursAgo(2), headline_hi: "IPL नीलामी: इस बार सबसे महंगा बिका यह गेंदबाज़" },
  { id: "a3", section: "bollywood", city: null, published_at: hoursAgo(3), headline_hi: "दीपिका पादुकोण की नई फिल्म का ट्रेलर रिलीज़" },
  { id: "a4", section: "dharm-tyohar", city: "varanasi", published_at: hoursAgo(4), headline_hi: "काशी में गंगा आरती का भव्य आयोजन" },
  { id: "a5", section: "rajniti", city: "patna", published_at: hoursAgo(5), headline_hi: "बिहार में नई सड़क योजना का ऐलान" },
  { id: "a6", section: "sarkari-naukri", city: null, published_at: hoursAgo(6), headline_hi: "बैंक PO भर्ती के लिए आवेदन की अंतिम तारीख नज़दीक" },
  { id: "a7", section: "cricket", city: "indore", published_at: hoursAgo(7), headline_hi: "इंदौर में होगा अगला अंतरराष्ट्रीय मैच" },
  { id: "a8", section: "bollywood", city: null, published_at: hoursAgo(8), headline_hi: "सलमान खान की फिल्म की रिलीज़ डेट आगे बढ़ी" },
  { id: "a9", section: "dharm-tyohar", city: null, published_at: hoursAgo(9), headline_hi: "इस साल कब है गणेश चतुर्थी, जानें शुभ मुहूर्त" },
  { id: "a10", section: "rajniti", city: "jaipur", published_at: hoursAgo(10), headline_hi: "राजस्थान में मंत्रिमंडल विस्तार की चर्चा तेज़" },
  { id: "a11", section: "sarkari-naukri", city: "kanpur", published_at: hoursAgo(11), headline_hi: "कानपुर में रोज़गार मेले का आयोजन, हज़ारों को मिलेगी नौकरी" },
  { id: "a12", section: "cricket", city: null, published_at: hoursAgo(12), headline_hi: "विराट कोहली ने जड़ा एक और शतक, फैंस झूमे" },
  { id: "a13", section: "bollywood", city: "jaipur", published_at: hoursAgo(13), headline_hi: "जयपुर में हुई बॉलीवुड सितारों की शादी, देखें तस्वीरें" },
  { id: "a14", section: "dharm-tyohar", city: "patna", published_at: hoursAgo(14), headline_hi: "पटना में छठ पूजा की तैयारियां शुरू" },
  { id: "a15", section: "rajniti", city: null, published_at: hoursAgo(15), headline_hi: "संसद के मानसून सत्र में आज होगी अहम बहस" },
  { id: "a16", section: "sarkari-naukri", city: "bhopal", published_at: hoursAgo(16), headline_hi: "मध्य प्रदेश में शिक्षक भर्ती का नोटिफिकेशन जारी" },
  { id: "a17", section: "cricket", city: "kanpur", published_at: hoursAgo(17), headline_hi: "कानपुर के ग्रीन पार्क में होगा घरेलू मुकाबला" },
  { id: "a18", section: "bollywood", city: null, published_at: hoursAgo(18), headline_hi: "अक्षय कुमार की फिल्म ने कमाए 100 करोड़" },
  { id: "a19", section: "dharm-tyohar", city: "indore", published_at: hoursAgo(19), headline_hi: "इंदौर में निकलेगी भव्य कलश यात्रा" },
  { id: "a20", section: "rajniti", city: "lucknow", published_at: hoursAgo(20), headline_hi: "यूपी विधानसभा में आज पेश होगा बजट" },
  { id: "a21", section: "sarkari-naukri", city: null, published_at: hoursAgo(21), headline_hi: "केंद्र सरकार की नई भर्ती नीति को मंजूरी" },
  { id: "a22", section: "cricket", city: null, published_at: hoursAgo(22), headline_hi: "महिला क्रिकेट टीम ने रचा इतिहास, जीता खिताब" },
  { id: "a23", section: "bollywood", city: "lucknow", published_at: hoursAgo(23), headline_hi: "लखनऊ में फिल्म फेस्टिवल का भव्य आगाज़" },
  { id: "a24", section: "dharm-tyohar", city: null, published_at: hoursAgo(24), headline_hi: "दिवाली की तारीख को लेकर पंचांग में स्पष्टता" },
  { id: "a25", section: "rajniti", city: "ranchi", published_at: hoursAgo(26), headline_hi: "झारखंड में नई योजना से जुड़ेंगे लाखों किसान" },
  { id: "a26", section: "sarkari-naukri", city: "jaipur", published_at: hoursAgo(28), headline_hi: "राजस्थान पुलिस भर्ती परिणाम घोषित" },
  { id: "a27", section: "cricket", city: "patna", published_at: hoursAgo(30), headline_hi: "पटना में क्रिकेट अकादमी का उद्घाटन" },
  { id: "a28", section: "bollywood", city: null, published_at: hoursAgo(32), headline_hi: "कैटरीना कैफ ने शेयर की फिल्म की पहली झलक" },
  { id: "a29", section: "dharm-tyohar", city: "gorakhpur", published_at: hoursAgo(34), headline_hi: "गोरखनाथ मंदिर में उमड़ी भक्तों की भीड़" },
  { id: "a30", section: "rajniti", city: null, published_at: hoursAgo(36), headline_hi: "अगले साल के आम चुनाव की तैयारियां शुरू" },
];

export function sectionArticleCount(section: SectionSlug): number {
  return FEED_ARTICLES.filter((a) => a.section === section).length;
}
