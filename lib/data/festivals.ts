export interface FestivalEntry {
  name_hi: string;
  date: string; // YYYY-MM-DD
  tag: string;
}

// Static festival calendar — no DB table needed. Dates are illustrative
// (India, 2026-27 cycle) and can be updated yearly by editing this file.
export const FESTIVAL_CALENDAR: FestivalEntry[] = [
  { name_hi: "जन्माष्टमी", date: "2026-09-04", tag: "janmashtami" },
  { name_hi: "गणेश चतुर्थी", date: "2026-09-14", tag: "ganesh-chaturthi" },
  { name_hi: "विश्वकर्मा पूजा", date: "2026-09-17", tag: "vishwakarma-puja" },
  { name_hi: "नवरात्रि", date: "2026-10-11", tag: "navratri" },
  { name_hi: "दशहरा", date: "2026-10-20", tag: "dussehra" },
  { name_hi: "करवा चौथ", date: "2026-10-28", tag: "karva-chauth" },
  { name_hi: "धनतेरस", date: "2026-11-06", tag: "dhanteras" },
  { name_hi: "दिवाली", date: "2026-11-08", tag: "diwali" },
  { name_hi: "भाई दूज", date: "2026-11-10", tag: "bhai-dooj" },
  { name_hi: "छठ पूजा", date: "2026-11-15", tag: "chhath-puja" },
  { name_hi: "क्रिसमस", date: "2026-12-25", tag: "christmas" },
  { name_hi: "मकर संक्रांति", date: "2027-01-14", tag: "makar-sankranti" },
  { name_hi: "होली", date: "2027-03-03", tag: "holi" },
];
