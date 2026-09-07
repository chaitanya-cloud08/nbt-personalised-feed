export interface FestivalEntry {
  name_hi: string;
  date: string; // YYYY-MM-DD
  tag: string;
}

// Static festival calendar — no DB table needed. Full-year 2026 Hindu/
// regional calendar; can be updated yearly by editing this file.
export const FESTIVAL_CALENDAR: FestivalEntry[] = [
  { name_hi: "मकर संक्रांति / पोंगल", date: "2026-01-14", tag: "makar-sankranti-pongal" },
  { name_hi: "वसंत पंचमी", date: "2026-01-23", tag: "vasant-panchami" },
  { name_hi: "थाइपूसम", date: "2026-02-01", tag: "thaipusam" },
  { name_hi: "महाशिवरात्रि", date: "2026-02-15", tag: "maha-shivratri" },
  { name_hi: "होलिका दहन", date: "2026-03-03", tag: "holika-dahan" },
  { name_hi: "होली", date: "2026-03-04", tag: "holi" },
  { name_hi: "उगादी / गुड़ी पड़वा", date: "2026-03-19", tag: "ugadi-gudi-padwa" },
  { name_hi: "रामनवमी", date: "2026-03-27", tag: "ram-navami" },
  { name_hi: "हनुमान जयंती", date: "2026-04-02", tag: "hanuman-jayanti" },
  { name_hi: "बैसाखी / विशु", date: "2026-04-14", tag: "vaisakhi-vishu" },
  { name_hi: "तमिल नववर्ष", date: "2026-04-14", tag: "tamil-new-year" },
  { name_hi: "बंगाली नववर्ष / बिहू", date: "2026-04-15", tag: "bengali-new-year-bihu" },
  { name_hi: "अक्षय तृतीया", date: "2026-04-19", tag: "akshaya-tritiya" },
  { name_hi: "सावित्री पूजा", date: "2026-05-16", tag: "savitri-pooja" },
  { name_hi: "पुरी रथ यात्रा", date: "2026-07-16", tag: "puri-rath-yatra" },
  { name_hi: "गुरु पूर्णिमा", date: "2026-07-29", tag: "guru-purnima" },
  { name_hi: "नाग पंचमी", date: "2026-08-17", tag: "nag-panchami" },
  { name_hi: "ओणम", date: "2026-08-26", tag: "onam" },
  { name_hi: "रक्षा बंधन", date: "2026-08-28", tag: "raksha-bandhan" },
  { name_hi: "वरलक्ष्मी व्रत", date: "2026-08-28", tag: "varalakshmi-vrat" },
  { name_hi: "कृष्ण जन्माष्टमी", date: "2026-09-04", tag: "janmashtami" },
  { name_hi: "गणेश चतुर्थी", date: "2026-09-14", tag: "ganesh-chaturthi" },
  { name_hi: "विश्वकर्मा पूजा", date: "2026-09-17", tag: "vishwakarma-puja" },
  { name_hi: "महालया अमावस्या", date: "2026-10-10", tag: "mahalaya-amavasya" },
  { name_hi: "नवरात्रि प्रारंभ", date: "2026-10-11", tag: "navratri-begins" },
  { name_hi: "नवरात्रि समाप्त / महानवमी", date: "2026-10-19", tag: "navratri-ends-maha-navami" },
  { name_hi: "दशहरा", date: "2026-10-20", tag: "dussehra" },
  { name_hi: "शरद पूर्णिमा", date: "2026-10-25", tag: "sharad-purnima" },
  { name_hi: "करवा चौथ", date: "2026-10-29", tag: "karva-chauth" },
  { name_hi: "धनतेरस", date: "2026-11-06", tag: "dhanteras" },
  { name_hi: "दिवाली", date: "2026-11-08", tag: "diwali" },
  { name_hi: "भाई दूज", date: "2026-11-11", tag: "bhai-dooj" },
  { name_hi: "छठ पूजा", date: "2026-11-15", tag: "chhath-puja" },
  { name_hi: "कार्तिक पूर्णिमा", date: "2026-11-24", tag: "kartik-purnima" },
  { name_hi: "धनु संक्रांति", date: "2026-12-16", tag: "dhanu-sankranti" },
  { name_hi: "गीता जयंती", date: "2026-12-20", tag: "geeta-jayanti" },
];
