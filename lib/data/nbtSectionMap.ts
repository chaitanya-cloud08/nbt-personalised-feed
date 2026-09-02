// Reference map of Navbharat Times' full section/msid hierarchy (the wufs
// feed at https://global-feed.indiatimes.com/wufs/feed/list/article?msid=X
// uses these as the `msid` query param). Curated by hand from NBT's own
// site map, not discovered live — kept here purely as a lookup table so a
// new section/city integration doesn't need this list re-supplied. `path`
// is an array of english slugs from the top-level category down; `msid` is
// null where none exists (video/photo-only branches, placeholder rows,
// election specials, etc.).
export interface NbtSectionRow {
  path: string[];
  label_hi: string;
  msid: string | null;
}

export const NBT_SECTIONS: NbtSectionRow[] = [
  { path: ["india"], label_hi: "भारत", msid: "1564454" },
  { path: ["state"], label_hi: "राज्य", msid: "2279808" },

  // ---- Uttar Pradesh ----
  { path: ["state", "uttar-pradesh"], label_hi: "उतार प्रदेश", msid: "21236867" },
  { path: ["state", "uttar-pradesh", "lucknow"], label_hi: "लखनऊ", msid: "21248218" },
  { path: ["state", "uttar-pradesh", "noida"], label_hi: "नोएडा", msid: "2313728" },
  { path: ["state", "uttar-pradesh", "ghaziabad"], label_hi: "गाजियाबाद", msid: "2287639" },
  { path: ["state", "uttar-pradesh", "agra"], label_hi: "आगरा", msid: "61483684" },
  { path: ["state", "uttar-pradesh", "mathura"], label_hi: "मथुरा", msid: "19928262" },
  { path: ["state", "uttar-pradesh", "meerut"], label_hi: "मेरठ", msid: "11364157" },
  { path: ["state", "uttar-pradesh", "gorakhpur"], label_hi: "गोरखपुर", msid: "61483701" },
  { path: ["state", "uttar-pradesh", "ayodhya"], label_hi: "अयोध्या", msid: "19987335" },
  { path: ["state", "uttar-pradesh", "varanasi"], label_hi: "वाराणसी", msid: "61483673" },
  { path: ["state", "uttar-pradesh", "prayagraj"], label_hi: "प्रयागराज", msid: "5195544" },
  { path: ["state", "uttar-pradesh", "bulandshahr"], label_hi: "बुलंदशहर", msid: "19928235" },
  { path: ["state", "uttar-pradesh", "baghpat"], label_hi: "बागपत", msid: "19928219" },
  { path: ["state", "uttar-pradesh", "kanpur"], label_hi: "कानपुर", msid: "5194950" },
  { path: ["state", "uttar-pradesh", "saharanpur"], label_hi: "सहारनपुर", msid: "19928210" },
  { path: ["state", "uttar-pradesh", "aligarh"], label_hi: "अलीगढ़", msid: "75575224" },
  { path: ["state", "uttar-pradesh", "bareilly"], label_hi: "बरेली", msid: "75575203" },
  { path: ["state", "uttar-pradesh", "muradabad"], label_hi: "मुरादाबाद", msid: "75575184" },
  { path: ["state", "uttar-pradesh", "shahjahanpur"], label_hi: "शाहजहांपुर", msid: "75575131" },
  { path: ["state", "uttar-pradesh", "azamgarh"], label_hi: "आजमगढ़", msid: "75575106" },
  { path: ["state", "uttar-pradesh", "raebareli"], label_hi: "रायबरेली", msid: "75575044" },
  { path: ["state", "uttar-pradesh", "muzaffarnagar"], label_hi: "मुज्जफरनगर", msid: "75574943" },
  { path: ["state", "uttar-pradesh", "mirzapur"], label_hi: "मिर्जापुर", msid: "75575063" },
  { path: ["state", "uttar-pradesh", "jaunpur"], label_hi: "जौनपुर", msid: "92989849" },
  { path: ["state", "uttar-pradesh", "lakhimpur-kheri"], label_hi: "लखीमपुर खेरी", msid: "92989844" },
  { path: ["state", "uttar-pradesh", "pilibhit"], label_hi: "पीलीभीत", msid: "92989841" },
  { path: ["state", "uttar-pradesh", "pratapgarh-up"], label_hi: "प्रतापगढ़", msid: "92989839" },
  { path: ["state", "uttar-pradesh", "fatehpur"], label_hi: "फतेहपुर", msid: "92989835" },
  { path: ["state", "uttar-pradesh", "farrukhabad"], label_hi: "फर्रुखाबाद", msid: "92989831" },
  { path: ["state", "uttar-pradesh", "firozabad"], label_hi: "फ़िरोज़ाबाद", msid: "92989817" },
  { path: ["state", "uttar-pradesh", "badaun"], label_hi: "बदायूं", msid: "92989815" },
  { path: ["state", "uttar-pradesh", "ballia"], label_hi: "बलिया", msid: "92989796" },
  { path: ["state", "uttar-pradesh", "basti"], label_hi: "बस्ती", msid: "92989793" },
  { path: ["state", "uttar-pradesh", "bahraich"], label_hi: "बहराइच", msid: "92989786" },
  { path: ["state", "uttar-pradesh", "banda"], label_hi: "बाँदा", msid: "92989785" },
  { path: ["state", "uttar-pradesh", "barabanki"], label_hi: "बाराबंकी", msid: "92989781" },
  { path: ["state", "uttar-pradesh", "bijnor"], label_hi: "बिजनौर", msid: "92989774" },
  { path: ["state", "uttar-pradesh", "mau"], label_hi: "मऊ", msid: "92989767" },
  { path: ["state", "uttar-pradesh", "mahoba"], label_hi: "महोबा", msid: "92989763" },
  { path: ["state", "uttar-pradesh", "mainpuri"], label_hi: "मैनपुरी", msid: "92989761" },
  { path: ["state", "uttar-pradesh", "rampur"], label_hi: "रामपुर", msid: "92989754" },
  { path: ["state", "uttar-pradesh", "lalitpur"], label_hi: "Lalitpur", msid: "92989752" },
  { path: ["state", "uttar-pradesh", "shamli"], label_hi: "शामली", msid: "92989748" },
  { path: ["state", "uttar-pradesh", "shravasti"], label_hi: "श्रावस्ती", msid: "92989746" },
  { path: ["state", "uttar-pradesh", "sant-kabir-nagar"], label_hi: "संत कबीर नगर", msid: "92989739" },
  { path: ["state", "uttar-pradesh", "bhadohi"], label_hi: "भदोही", msid: "92989735" },
  { path: ["state", "uttar-pradesh", "sitapur"], label_hi: "सीतापुर", msid: "92989730" },
  { path: ["state", "uttar-pradesh", "sambhal"], label_hi: "संभल", msid: "92989724" },
  { path: ["state", "uttar-pradesh", "siddharthnagar"], label_hi: "सिद्धार्थ नगर", msid: "92989723" },
  { path: ["state", "uttar-pradesh", "sultanpur"], label_hi: "सुल्तानपुर", msid: "92989720" },
  { path: ["state", "uttar-pradesh", "sonbhadra"], label_hi: "सोनभद्र", msid: "92989719" },
  { path: ["state", "uttar-pradesh", "hamirpur-up"], label_hi: "हमीरपुर", msid: "92989708" },
  { path: ["state", "uttar-pradesh", "hardoi"], label_hi: "हरदोई", msid: "92989699" },
  { path: ["state", "uttar-pradesh", "hathras"], label_hi: "हाथरस", msid: "92989679" },
  { path: ["state", "uttar-pradesh", "maharajganj"], label_hi: "महाराजगंज", msid: "92989765" },
  { path: ["state", "uttar-pradesh", "hapur"], label_hi: "हापुर", msid: "92989677" },
  { path: ["state", "uttar-pradesh", "etah"], label_hi: "एटा", msid: "92989670" },
  { path: ["state", "uttar-pradesh", "kasganj"], label_hi: "कासगंज", msid: "92989668" },
  { path: ["state", "uttar-pradesh", "unnao"], label_hi: "उन्नाव", msid: "92989661" },
  { path: ["state", "uttar-pradesh", "kaushambi"], label_hi: "कौशांबी", msid: "92989659" },
  { path: ["state", "uttar-pradesh", "amroha"], label_hi: "अमरोहा", msid: "92989654" },
  { path: ["state", "uttar-pradesh", "chandauli"], label_hi: "चंदौली", msid: "92989637" },
  { path: ["state", "uttar-pradesh", "ghazipur"], label_hi: "गाजीपुर", msid: "92989634" },
  { path: ["state", "uttar-pradesh", "kannauj"], label_hi: "कन्नौज", msid: "92989629" },
  { path: ["state", "uttar-pradesh", "auraiya"], label_hi: "औरैया", msid: "92989626" },
  { path: ["state", "uttar-pradesh", "etawah"], label_hi: "इटावा", msid: "92989625" },
  { path: ["state", "uttar-pradesh", "jalaun"], label_hi: "जालौन", msid: "92989623" },
  { path: ["state", "uttar-pradesh", "kushinagar"], label_hi: "कुशीनगर", msid: "92989608" },
  { path: ["state", "uttar-pradesh", "jhansi"], label_hi: "झांसी", msid: "92989606" },
  { path: ["state", "uttar-pradesh", "amethi"], label_hi: "अमेठी", msid: "92989585" },
  { path: ["state", "uttar-pradesh", "deoria"], label_hi: "देवरिया", msid: "92989581" },
  { path: ["state", "uttar-pradesh", "chitrakoot"], label_hi: "चित्रकूट", msid: "92989572" },
  { path: ["state", "uttar-pradesh", "balrampur-up"], label_hi: "बलरामपुर", msid: "92989566" },
  { path: ["state", "uttar-pradesh", "gonda"], label_hi: "गोंडा", msid: "92989542" },
  { path: ["state", "uttar-pradesh", "ambedkarnagar"], label_hi: "अंबेडकर नगर", msid: "92989536" },
  { path: ["state", "uttar-pradesh", "other"], label_hi: "अन्य", msid: "21236867" },

  // ---- Bihar ----
  { path: ["state", "bihar"], label_hi: "बिहार", msid: "21236753" },
  { path: ["state", "bihar", "vidhan-sabha"], label_hi: "विधान सभा", msid: null },
  { path: ["state", "bihar", "patna"], label_hi: "पटना", msid: "5194946" },
  { path: ["state", "bihar", "muzaffarpur"], label_hi: "मुजफ्फरपुर", msid: "75670655" },
  { path: ["state", "bihar", "video"], label_hi: "वीडियो", msid: "21236753" },
  { path: ["state", "bihar", "photo"], label_hi: "तस्वीर", msid: "2339144" },
  { path: ["state", "bihar", "gaya"], label_hi: "गयाजी", msid: "75670636" },
  { path: ["state", "bihar", "purnia"], label_hi: "पूर्णिया", msid: "75670623" },
  { path: ["state", "bihar", "bhagalpur"], label_hi: "भागलपुर", msid: "75670594" },
  { path: ["state", "bihar", "sheikhpura"], label_hi: "शेखरपुरा", msid: "75670582" },
  { path: ["state", "bihar", "rohtas"], label_hi: "रोहतास", msid: "75670563" },
  { path: ["state", "bihar", "jahanabad"], label_hi: "जहानाबाद", msid: "75670543" },
  { path: ["state", "bihar", "nawada"], label_hi: "नवदा", msid: "75670535" },
  { path: ["state", "bihar", "aurangabad-bihar"], label_hi: "औरंगाबाद", msid: "75670520" },
  { path: ["state", "bihar", "arwal"], label_hi: "अरवल", msid: "75670503" },
  { path: ["state", "bihar", "banka"], label_hi: "बांका", msid: "75670495" },
  { path: ["state", "bihar", "munger"], label_hi: "मंगर", msid: "75670483" },
  { path: ["state", "bihar", "khagaria"], label_hi: "खगरिया", msid: "75670456" },
  { path: ["state", "bihar", "katihar"], label_hi: "कटिहार", msid: "75670428" },
  { path: ["state", "bihar", "kishanganj"], label_hi: "किशनगंज", msid: "75670412" },
  { path: ["state", "bihar", "araria"], label_hi: "अरारिया", msid: "75669873" },
  { path: ["state", "bihar", "madhepura"], label_hi: "मधेपुर", msid: "75669856" },
  { path: ["state", "bihar", "saharsa"], label_hi: "सहरसा", msid: "75669832" },
  { path: ["state", "bihar", "supaul"], label_hi: "सुपौल", msid: "75669815" },
  { path: ["state", "bihar", "darbhanga"], label_hi: "दरभंगा", msid: "75669801" },
  { path: ["state", "bihar", "samastipur"], label_hi: "समस्तीपुर", msid: "75669776" },
  { path: ["state", "bihar", "sitamarhi"], label_hi: "सीतामणि", msid: "75669745" },
  { path: ["state", "bihar", "sheohar"], label_hi: "शिवहर", msid: "75669735" },
  { path: ["state", "bihar", "madhubani"], label_hi: "मधुबनी", msid: "75669724" },
  { path: ["state", "bihar", "gopalganj"], label_hi: "गोपालगंज", msid: "75669715" },
  { path: ["state", "bihar", "west-champaran"], label_hi: "पश्चिम चंपारण", msid: "75669615" },
  { path: ["state", "bihar", "east-champaran"], label_hi: "पूर्वी चंपारण", msid: "75669603" },
  { path: ["state", "bihar", "vaishali"], label_hi: "वैशाली", msid: "75669584" },
  { path: ["state", "bihar", "buxar"], label_hi: "बक्सर", msid: "75669564" },
  { path: ["state", "bihar", "begusarai"], label_hi: "बेगूसराय", msid: "75669487" },
  { path: ["state", "bihar", "lakhisarai"], label_hi: "लखीसराय", msid: "75669293" },
  { path: ["state", "bihar", "kaimur"], label_hi: "कैमुर", msid: "75669249" },
  { path: ["state", "bihar", "siwan"], label_hi: "सिवान", msid: "75669224" },
  { path: ["state", "bihar", "saran"], label_hi: "सरन", msid: "75669196" },
  { path: ["state", "bihar", "nalanda"], label_hi: "नालंदा", msid: "75669182" },
  { path: ["state", "bihar", "ara"], label_hi: "आरा", msid: "75669573" },
  { path: ["state", "bihar", "jamui"], label_hi: "जमुई", msid: "75669553" },
  { path: ["state", "bihar", "other"], label_hi: "अन्य", msid: "21236753" },

  // ---- Madhya Pradesh ----
  { path: ["state", "madhya-pradesh"], label_hi: "मध्य प्रदेश", msid: "21236720" },
  { path: ["state", "madhya-pradesh", "lok-sabha"], label_hi: "मध्य प्रदेश लोकसभा", msid: null },
  { path: ["state", "madhya-pradesh", "bhopal"], label_hi: "भोपाल", msid: "5202503" },
  { path: ["state", "madhya-pradesh", "indore"], label_hi: "इंदौर", msid: "75669132" },
  { path: ["state", "madhya-pradesh", "gwalior"], label_hi: "ग्वालियर", msid: "75669132" },
  { path: ["state", "madhya-pradesh", "hoshangabad"], label_hi: "होशंगाबाद", msid: "75669145" },
  { path: ["state", "madhya-pradesh", "jabalpur"], label_hi: "जबलपुर", msid: "75669108" },
  { path: ["state", "madhya-pradesh", "satna"], label_hi: "सतना", msid: "75669084" },
  { path: ["state", "madhya-pradesh", "sagar"], label_hi: "सागर", msid: "75669066" },
  { path: ["state", "madhya-pradesh", "shahdol"], label_hi: "शाडोल", msid: "75669045" },
  { path: ["state", "madhya-pradesh", "ujjain"], label_hi: "उज्जैन", msid: "75669021" },
  { path: ["state", "madhya-pradesh", "khandwa"], label_hi: "खंडवा", msid: "75669004" },
  { path: ["state", "madhya-pradesh", "chhindwara"], label_hi: "छिंदवाड़ा", msid: "75668991" },
  { path: ["state", "madhya-pradesh", "mandsaur"], label_hi: "मन्दसौर", msid: "75668439" },
  { path: ["state", "madhya-pradesh", "ratlam"], label_hi: "रेटलाम", msid: "75668428" },
  { path: ["state", "madhya-pradesh", "balaghat"], label_hi: "बालाघाट", msid: "75668416" },
  { path: ["state", "madhya-pradesh", "morena"], label_hi: "मुराइना", msid: "75668324" },
  { path: ["state", "madhya-pradesh", "dewas"], label_hi: "देवता", msid: "75668315" },
  { path: ["state", "madhya-pradesh", "vidisha"], label_hi: "विदिशा", msid: "75668304" },
  { path: ["state", "madhya-pradesh", "barwani"], label_hi: "बदवानी", msid: "75668304" },
  { path: ["state", "madhya-pradesh", "khargone"], label_hi: "खारगोन", msid: "75668287" },
  { path: ["state", "madhya-pradesh", "shivpuri"], label_hi: "शिवपुरी", msid: "75668266" },
  { path: ["state", "madhya-pradesh", "datia"], label_hi: "दतिया", msid: "76131473" },
  { path: ["state", "madhya-pradesh", "alirajpur"], label_hi: "अलीराजपुर", msid: "76131459" },
  { path: ["state", "madhya-pradesh", "umaria"], label_hi: "उमरिया", msid: "76131411" },
  { path: ["state", "madhya-pradesh", "tikamgarh"], label_hi: "टिकमगढ़", msid: "76131394" },
  { path: ["state", "madhya-pradesh", "sheopur"], label_hi: "श्योपुर", msid: "76131388" },
  { path: ["state", "madhya-pradesh", "malwa"], label_hi: "मालवा", msid: "76131366" },
  { path: ["state", "madhya-pradesh", "agar"], label_hi: "अगर", msid: "76131353" },
  { path: ["state", "madhya-pradesh", "dindori"], label_hi: "डिंडोरी", msid: "76131346" },
  { path: ["state", "madhya-pradesh", "damoh"], label_hi: "दमोह", msid: "76131337" },
  { path: ["state", "madhya-pradesh", "bhind"], label_hi: "भिंड", msid: "76131327" },
  { path: ["state", "madhya-pradesh", "raisen"], label_hi: "रायसेन", msid: "76131322" },
  { path: ["state", "madhya-pradesh", "dhar"], label_hi: "धार", msid: "76131299" },
  { path: ["state", "madhya-pradesh", "neemuch"], label_hi: "नीमच", msid: "76131270" },
  { path: ["state", "madhya-pradesh", "katni"], label_hi: "कटनी", msid: "76131244" },
  { path: ["state", "madhya-pradesh", "seoni"], label_hi: "सिवनी", msid: "76131234" },
  { path: ["state", "madhya-pradesh", "mandla"], label_hi: "मंडला", msid: "76131220" },
  { path: ["state", "madhya-pradesh", "chhatarpur"], label_hi: "छतरपुर", msid: "76131201" },
  { path: ["state", "madhya-pradesh", "shajapur"], label_hi: "शाजापुर", msid: "76131190" },
  { path: ["state", "madhya-pradesh", "rewa"], label_hi: "रीवा", msid: "76131167" },
  { path: ["state", "madhya-pradesh", "panna"], label_hi: "पन्ना", msid: "76131152" },
  { path: ["state", "madhya-pradesh", "other"], label_hi: "अन्य", msid: "21236720" },
  { path: ["state", "madhya-pradesh", "niwari"], label_hi: "निवाड़ी", msid: "97560242" },
  { path: ["state", "madhya-pradesh", "rajgarh"], label_hi: "राजगढ़", msid: "97560227" },
  { path: ["state", "madhya-pradesh", "narsinghpur"], label_hi: "नरसिंहपुर", msid: "97560218" },
  { path: ["state", "madhya-pradesh", "jhabua"], label_hi: "झाबुआ", msid: "97560199" },
  { path: ["state", "madhya-pradesh", "harda"], label_hi: "हरदा", msid: "97560191" },
  { path: ["state", "madhya-pradesh", "guna"], label_hi: "गुना", msid: "97560182" },
  { path: ["state", "madhya-pradesh", "ashoknagar"], label_hi: "अशोकनगर", msid: "97560149" },
  { path: ["state", "madhya-pradesh", "anuppur"], label_hi: "अनुप्पुर", msid: "97560143" },
  { path: ["state", "madhya-pradesh", "sidhi"], label_hi: "सीधी", msid: "97560141" },
  { path: ["state", "madhya-pradesh", "sehore"], label_hi: "सीहोर", msid: "97560128" },
  { path: ["state", "madhya-pradesh", "burhanpur"], label_hi: "बुरहानपुर", msid: "97560114" },
  { path: ["state", "madhya-pradesh", "singrauli"], label_hi: "सिंगरौली", msid: "97560104" },
  { path: ["state", "madhya-pradesh", "betul"], label_hi: "बेतुल", msid: "97559947" },

  // ---- Delhi ----
  { path: ["state", "delhi"], label_hi: "दिल्ली", msid: "4836708" },
  { path: ["state", "delhi", "politics"], label_hi: "राजनीति", msid: "24234044" },
  { path: ["state", "delhi", "crime"], label_hi: "अपराध", msid: "4836735" },
  { path: ["state", "delhi", "development"], label_hi: "विकास", msid: "4836737" },

  // ---- Rajasthan ----
  { path: ["state", "rajasthan"], label_hi: "राजस्थान", msid: "21236734" },
  { path: ["state", "rajasthan", "jaipur"], label_hi: "जयपुर", msid: "5194923" },
  { path: ["state", "rajasthan", "ajmer"], label_hi: "अजमेर", msid: "75667939" },
  { path: ["state", "rajasthan", "alwar"], label_hi: "अलवर", msid: "75667925" },
  { path: ["state", "rajasthan", "barmer"], label_hi: "बाड़मेर", msid: "75667914" },
  { path: ["state", "rajasthan", "bharatpur"], label_hi: "भरतपुर", msid: "75667900" },
  { path: ["state", "rajasthan", "bhilwara"], label_hi: "भीलवाड़ा", msid: "75667879" },
  { path: ["state", "rajasthan", "churu"], label_hi: "चुरू", msid: "75667859" },
  { path: ["state", "rajasthan", "dausa"], label_hi: "दौसा", msid: "75667850" },
  { path: ["state", "rajasthan", "dungarpur"], label_hi: "डूंगरपुर", msid: "75667833" },
  { path: ["state", "rajasthan", "jaisalmer"], label_hi: "जैसलमेर", msid: "75667817" },
  { path: ["state", "rajasthan", "jhunjhunu"], label_hi: "झुंझुनू", msid: "75667801" },
  { path: ["state", "rajasthan", "jodhpur"], label_hi: "जोधपुर", msid: "75667788" },
  { path: ["state", "rajasthan", "kota"], label_hi: "कोटा", msid: "75667777" },
  { path: ["state", "rajasthan", "nagaur"], label_hi: "नागौर", msid: "75667769" },
  { path: ["state", "rajasthan", "pratapgarh-rj"], label_hi: "प्रतापगढ़", msid: "75667749" },
  { path: ["state", "rajasthan", "rajsamand"], label_hi: "राजसमंद", msid: "75667732" },
  { path: ["state", "rajasthan", "sikar"], label_hi: "सीकर", msid: "75667721" },
  { path: ["state", "rajasthan", "sriganganagar"], label_hi: "श्रीगंगानगर", msid: "75667706" },
  { path: ["state", "rajasthan", "udaipur"], label_hi: "उदयपुर", msid: "75667691" },
  { path: ["state", "rajasthan", "dholpur"], label_hi: "धौलपुर", msid: "76130139" },
  { path: ["state", "rajasthan", "chittorgarh"], label_hi: "चित्तौड़गढ़", msid: "76130128" },
  { path: ["state", "rajasthan", "sirohi"], label_hi: "सिरोही", msid: "76130171" },
  { path: ["state", "rajasthan", "jalore"], label_hi: "जालौर", msid: "79665459" },
  { path: ["state", "rajasthan", "bikaner"], label_hi: "बीकानेर", msid: "76130112" },
  { path: ["state", "rajasthan", "other"], label_hi: "अन्य", msid: "21236734" },
  { path: ["state", "rajasthan", "tonk"], label_hi: "टोंक", msid: "97597493" },
  { path: ["state", "rajasthan", "sawai-madhopur"], label_hi: "सवाई माधोपुर", msid: "97597468" },
  { path: ["state", "rajasthan", "pali"], label_hi: "पाली", msid: "97597410" },
  { path: ["state", "rajasthan", "karauli"], label_hi: "करौली", msid: "97597376" },
  { path: ["state", "rajasthan", "jhalawar"], label_hi: "झालावार", msid: "97597348" },
  { path: ["state", "rajasthan", "hanumangarh"], label_hi: "हनुमानगढ़", msid: "97597336" },
  { path: ["state", "rajasthan", "bundi"], label_hi: "बूंदी", msid: "97597285" },
  { path: ["state", "rajasthan", "baran"], label_hi: "बारा", msid: "97597266" },
  { path: ["state", "rajasthan", "banswara"], label_hi: "बांसवाड़ा", msid: "97597240" },

  // ---- Punjab-Haryana ----
  { path: ["state", "punjab-haryana"], label_hi: "पंजाब-हरियाणा", msid: "21236773" },
  { path: ["state", "punjab-haryana", "haryana-chunav"], label_hi: "हरियाणा चुनाव", msid: null },
  { path: ["state", "punjab-haryana", "gurugram"], label_hi: "गुरुग्राम", msid: "2313736" },
  { path: ["state", "punjab-haryana", "faridabad"], label_hi: "फरीदाबाद", msid: "2287613" },
  { path: ["state", "punjab-haryana", "chandigarh"], label_hi: "चंडीगढ़", msid: "5194922" },
  { path: ["state", "punjab-haryana", "ambala"], label_hi: "अंबाला", msid: "19928345" },
  { path: ["state", "punjab-haryana", "rewari"], label_hi: "रेवाड़ी", msid: "19928322" },
  { path: ["state", "punjab-haryana", "kurukshetra"], label_hi: "कुरुक्षेत्र", msid: "19928294" },
  { path: ["state", "punjab-haryana", "palwal"], label_hi: "पलवल", msid: "19928330" },
  { path: ["state", "punjab-haryana", "jind"], label_hi: "जींद", msid: "19928318" },
  { path: ["state", "punjab-haryana", "hisar"], label_hi: "हिसार", msid: "19928340" },
  { path: ["state", "punjab-haryana", "other"], label_hi: "अन्य", msid: "21478805" },

  // ---- Uttarakhand ----
  { path: ["state", "uttarakhand"], label_hi: "उत्तराखंड", msid: "21236621" },
  { path: ["state", "uttarakhand", "dehradun"], label_hi: "देहरादून", msid: "9661693" },
  { path: ["state", "uttarakhand", "haridwar-rishikesh"], label_hi: "हरिद्वार-ऋषिकेश", msid: "75574903" },
  { path: ["state", "uttarakhand", "nainital"], label_hi: "नैनीताल", msid: "75574862" },
  { path: ["state", "uttarakhand", "other"], label_hi: "अन्य", msid: "21479185" },

  // ---- Jharkhand ----
  { path: ["state", "jharkhand"], label_hi: "झारखंड", msid: "21236677" },
  { path: ["state", "jharkhand", "ranchi"], label_hi: "रांची", msid: "5194948" },
  { path: ["state", "jharkhand", "hazaribagh"], label_hi: "हजारीबाग", msid: "75667656" },
  { path: ["state", "jharkhand", "dhanbad"], label_hi: "धनबाद", msid: "75667620" },
  { path: ["state", "jharkhand", "jamshedpur"], label_hi: "जमशेदपुर", msid: "75667587" },
  { path: ["state", "jharkhand", "deoghar"], label_hi: "देवघर", msid: "75667673" },
  { path: ["state", "jharkhand", "chatra"], label_hi: "चत्रा", msid: "85530943" },
  { path: ["state", "jharkhand", "bokaro"], label_hi: "बोकारो", msid: "85530906" },
  { path: ["state", "jharkhand", "other"], label_hi: "अन्य", msid: "21236677" },
  { path: ["state", "jharkhand", "jamtara"], label_hi: "जामतारा", msid: "97597922" },
  { path: ["state", "jharkhand", "pakur"], label_hi: "पाकड", msid: "97597902" },
  { path: ["state", "jharkhand", "godda"], label_hi: "गोड्डा", msid: "97597867" },
  { path: ["state", "jharkhand", "sahibganj"], label_hi: "साहिबगंज", msid: "97597841" },
  { path: ["state", "jharkhand", "dumka"], label_hi: "दुमका", msid: "97597826" },
  { path: ["state", "jharkhand", "giridih"], label_hi: "गिरदिह", msid: "97597768" },
  { path: ["state", "jharkhand", "koderma"], label_hi: "कोडरमा", msid: "97597744" },
  { path: ["state", "jharkhand", "latehar"], label_hi: "लतेहर", msid: "97597724" },
  { path: ["state", "jharkhand", "garhwa"], label_hi: "गढ़वा", msid: "97597702" },
  { path: ["state", "jharkhand", "palamu"], label_hi: "पलामू", msid: "97597696" },
  { path: ["state", "jharkhand", "gumla"], label_hi: "गुमला", msid: "97597682" },
  { path: ["state", "jharkhand", "lohardaga"], label_hi: "लोहरदगा", msid: "97597656" },
  { path: ["state", "jharkhand", "simdega"], label_hi: "सिमडेगा", msid: "97597642" },
  { path: ["state", "jharkhand", "khunti"], label_hi: "खुंटी", msid: "97597630" },
  { path: ["state", "jharkhand", "ramgarh"], label_hi: "रामगढ़", msid: "97597611" },
  { path: ["state", "jharkhand", "seraikela-kharsawan"], label_hi: "सेराइकेला खारसावान", msid: "97597586" },
  { path: ["state", "jharkhand", "chaibasa"], label_hi: "चाईबासा", msid: "97597545" },

  // ---- Chhattisgarh ----
  { path: ["state", "chhattisgarh"], label_hi: "छत्तीसगढ", msid: "21236696" },
  { path: ["state", "chhattisgarh", "raipur"], label_hi: "रायपुर", msid: "5199178" },
  { path: ["state", "chhattisgarh", "other"], label_hi: "अन्य", msid: "21478889" },

  // ---- Himachal Pradesh ----
  { path: ["state", "himachal-pradesh"], label_hi: "हिमाचल प्रदेश", msid: "21236640" },
  { path: ["state", "himachal-pradesh", "shimla"], label_hi: "शिमला", msid: "20698884" },
  { path: ["state", "himachal-pradesh", "other"], label_hi: "अन्य", msid: "21479128" },

  // ---- Maharashtra ----
  { path: ["state", "maharashtra"], label_hi: "महाराष्ट्र", msid: "21236663" },
  { path: ["state", "maharashtra", "mumbai"], label_hi: "मुंबई", msid: "5722181" },
  { path: ["state", "maharashtra", "pune"], label_hi: "पुणे", msid: "21239264" },
  { path: ["state", "maharashtra", "nagpur"], label_hi: "नागपुर", msid: "21271064" },
  { path: ["state", "maharashtra", "amravati"], label_hi: "अमरावती", msid: "92652480" },
  { path: ["state", "maharashtra", "other"], label_hi: "अन्य", msid: "21479086" },

  // ---- Gujarat ----
  { path: ["state", "gujarat"], label_hi: "गुजरात", msid: "21236669" },
  { path: ["state", "gujarat", "ahmedabad"], label_hi: "अहमदाबाद", msid: "5194917" },
  { path: ["state", "gujarat", "other"], label_hi: "अन्य", msid: "21479059" },

  // ---- West Bengal ----
  { path: ["state", "west-bengal"], label_hi: "पश्चिम बंगाल", msid: "79935756" },
  { path: ["state", "west-bengal", "kolkata"], label_hi: "कोलकाता", msid: "79935789" },
  { path: ["state", "west-bengal", "assembly-election"], label_hi: "विधानसभा चुनाव", msid: null },

  // ---- North-East / Assam / Arunachal Pradesh / Karnataka ----
  { path: ["state", "north-east"], label_hi: "ईशान कोण", msid: "97912182" },
  { path: ["state", "assam"], label_hi: "असम", msid: "92681645" },
  { path: ["state", "assam", "guwahati"], label_hi: "गुवाहाटी", msid: "5194933" },
  { path: ["state", "assam", "dispur"], label_hi: "दिसपुर", msid: "92799452" },
  { path: ["state", "arunachal-pradesh"], label_hi: "अरुणाचल प्रदेश", msid: "92681822" },
  { path: ["state", "arunachal-pradesh", "itanagar"], label_hi: "ईटानगर", msid: "92797545" },
  { path: ["state", "karnataka"], label_hi: "कर्नाटक", msid: "93210099" },
  { path: ["state", "karnataka", "bengaluru"], label_hi: "बेंगलुरु", msid: "93210421" },

  // ---- Astrology / धर्म ----
  { path: ["astrology"], label_hi: "धर्म", msid: "17127056" },
  { path: ["astrology", "rashifal", "bolen-sitare"], label_hi: "राशिफल", msid: "17335279" },
  { path: ["astrology", "rashifal", "panchang"], label_hi: "पंचांग", msid: "1893544" },
  { path: ["astrology", "rashifal", "numerology"], label_hi: "अंक ज्योतिष", msid: "17335277" },
  { path: ["astrology", "rashifal", "financial-forecast"], label_hi: "मनी&करियर", msid: "17335274" },
  { path: ["astrology", "religion-rituals"], label_hi: "धर्म-कर्म", msid: "17127088" },
  { path: ["astrology", "religion-rituals", "panchang"], label_hi: "पंचांग", msid: "1893544" },
  { path: ["astrology", "religion-rituals", "arti-bhajan"], label_hi: "आरती", msid: "87303272" },
  { path: ["astrology", "religion-rituals", "festivals-and-fasts"], label_hi: "व्रत त्योहार", msid: "17334287" },
  { path: ["astrology", "spirituality"], label_hi: "अध्यात्म", msid: "64794996" },
  { path: ["astrology", "vaastu-fengshui"], label_hi: "वास्तु-फेंगशुई", msid: "17386312" },
  { path: ["astrology", "palmistry"], label_hi: "हस्तरेखा", msid: "17609715" },
  { path: ["astrology", "others"], label_hi: "अन्य", msid: "64795101" },

  // ---- Auto ----
  { path: ["auto"], label_hi: "ऑटो", msid: "2354730" },
  { path: ["auto", "car-bikes"], label_hi: "कार-बाइक", msid: "2355188" },
  { path: ["auto", "reviews"], label_hi: "रिव्यू", msid: "29486092" },
  { path: ["auto", "tips"], label_hi: "टिप्स", msid: "36716285" },

  // ---- Business ----
  { path: ["business"], label_hi: "बिजनेस", msid: "2279786" },
  { path: ["business", "business-news"], label_hi: "बिजनेस न्यूज", msid: "1215713388" },
  { path: ["business", "budget"], label_hi: "बजट", msid: "50994837" },
  { path: ["business", "budget", "rupee-flow"], label_hi: "रुपये का प्रवाह", msid: null },
  { path: ["business", "tax"], label_hi: "इनकम टैक्स", msid: "8414465" },
  { path: ["business", "personal-finance"], label_hi: "कमाएं-बचाएं", msid: "18558220" },
  { path: ["business", "financial-literacy"], label_hi: "Financial Literacy", msid: "108324109" },
  { path: ["business", "property"], label_hi: "प्रॉपर्टी", msid: "18572325" },
  { path: ["business", "railway"], label_hi: "रेलवे", msid: "93207908" },
  { path: ["business", "share-market"], label_hi: "शेयर बाजार", msid: "18572282" },
  { path: ["business", "about-renewable-energy"], label_hi: "", msid: null },
  { path: ["business", "business-career"], label_hi: "बिज़नेस", msid: "3531246" },
  { path: ["business", "video"], label_hi: "वीडियो", msid: "11873677" },
  { path: ["business", "business-dictionary"], label_hi: "ईटी की पाठशाला", msid: "9281144" },
  { path: ["business", "commodity"], label_hi: "कमोडिटीज़", msid: "18572317" },

  { path: ["crime"], label_hi: "क्राइम", msid: "93273647" },

  // ---- Education ----
  { path: ["education"], label_hi: "शिक्षा", msid: "2279784" },
  { path: ["education", "expert-advice"], label_hi: "सलाह", msid: "2303643" },
  { path: ["education", "education-news"], label_hi: "न्यूज़", msid: "2303761" },
  { path: ["education", "admission-alert"], label_hi: "ऐडमिशन अलर्ट", msid: "2303775" },
  { path: ["education", "gk-update"], label_hi: "GK अपडेट", msid: "4012427" },
  { path: ["education", "study-abroad"], label_hi: "विदेश अध्ययन", msid: "46643163" },
  { path: ["education", "exam-results"], label_hi: "रिजल्ट्स", msid: "46907855" },
  { path: ["education", "jobs-junction"], label_hi: "जॉब Junction", msid: "47479886" },
  { path: ["education", "exam-buster"], label_hi: "Exam Buster", msid: "50744488" },
  { path: ["education", "assembly-elections", "west-bengal"], label_hi: "विधानसभा चुनाव", msid: null },
  { path: ["education", "assembly-elections"], label_hi: "विधानसभा चुनाव", msid: null },

  // ---- Entertainment ----
  { path: ["entertainment"], label_hi: "मनोरंजन", msid: "2279793" },
  { path: ["entertainment", "hollywood-news"], label_hi: "हॉलीवुड", msid: "18145700" },
  { path: ["entertainment", "interviews"], label_hi: "इंटरव्यू", msid: "2303512" },
  { path: ["entertainment", "news-from-bollywood"], label_hi: "बॉलीवुड", msid: "2303550" },
  { path: ["entertainment", "movie-review"], label_hi: "मूवी रिव्यू", msid: "2325387" },
  { path: ["entertainment", "bhojpuri-cinema"], label_hi: "भोजपुरी", msid: "67179225" },
  { path: ["entertainment", "box-office"], label_hi: "बॉक्स ऑफिस", msid: "73470319" },
  { path: ["entertainment", "south-movie"], label_hi: "साउथ सिनेमा", msid: "73470856" },
  { path: ["entertainment", "web-series"], label_hi: "वेब सीरीज", msid: "92251523" },
  { path: ["entertainment", "web-series", "latest"], label_hi: "लेटेस्‍ट", msid: "92251580" },
  { path: ["entertainment", "web-series", "review"], label_hi: "रिव्यू", msid: "92251594" },
  { path: ["entertainment", "about-k-drama"], label_hi: "के-ड्रामा", msid: null },

  { path: ["good-news"], label_hi: "गुड न्यूज", msid: "48899289" },
  { path: ["government-schemes"], label_hi: "सरकारी योजनाओं", msid: null },
  { path: ["health-wellness"], label_hi: "स्वास्थ्य और वेलनेस", msid: "127795157" },
  { path: ["hindi-recipes"], label_hi: "खान-पान", msid: "78271831" },

  // ---- Jokes ----
  { path: ["jokes"], label_hi: "जोक्स", msid: "12545518" },
  { path: ["jokes", "chutkule"], label_hi: "चुटकुले", msid: "12545605" },
  { path: ["jokes", "vayang-baan"], label_hi: "vayang-baan", msid: "12545605" },
  { path: ["jokes", "social-humour"], label_hi: "सोशल मस्ती", msid: "53521192" },

  // ---- Lifestyle ----
  { path: ["lifestyle"], label_hi: "लाइफस्टाइल", msid: "2354729" },
  { path: ["lifestyle", "life-hacks"], label_hi: "लाइफ़ हैक्स", msid: "2355176" },
  { path: ["lifestyle", "fashion"], label_hi: "फैशन", msid: "2449982" },
  { path: ["lifestyle", "relationship"], label_hi: "रिलेशनशिप", msid: "3041664" },
  { path: ["lifestyle", "family"], label_hi: "फैमिली", msid: "5647266" },
  { path: ["lifestyle", "beauty-skin"], label_hi: "ब्यूटी & स्किन", msid: "6758763" },
  { path: ["lifestyle", "mera-safar"], label_hi: "मेरा-सफर", msid: null },

  // ---- Metro ----
  { path: ["metro"], label_hi: "मेट्रो", msid: "33503484" },
  { path: ["metro", "lucknow"], label_hi: "लखनऊ", msid: "21248218" },
  { path: ["metro", "delhi"], label_hi: "दिल्ली", msid: "4836708" },
  { path: ["metro", "mumbai"], label_hi: "मुंबई", msid: "5722181" },

  { path: ["newsbrief", "sports"], label_hi: "खेल ब्रीफ", msid: null },

  // ---- Photomazza ----
  { path: ["photomazza"], label_hi: "फोटो", msid: "2339144" },
  { path: ["photomazza", "national-photogallery"], label_hi: "देश", msid: "3531231" },
  { path: ["photomazza", "bollywood-hollywood-photogalleries"], label_hi: "मूवी गैलरी", msid: "3531235" },
  { path: ["photomazza", "sports-photos"], label_hi: "स्पोर्ट्स", msid: "3531240" },
  { path: ["photomazza", "photos-from-the-scene"], label_hi: "अन्य", msid: "3531242" },
  { path: ["photomazza", "business-career"], label_hi: "बिज़नेस", msid: "3531246" },
  { path: ["photomazza", "education-career"], label_hi: "एजुकेशन", msid: "47211278" },
  { path: ["photomazza", "state-photogallery"], label_hi: "शहर", msid: "48265779" },
  { path: ["photomazza", "world-photogallery"], label_hi: "दुनिया", msid: "51006700" },
  { path: ["photomazza", "travel"], label_hi: "ट्रैवल", msid: "64985397" },
  { path: ["photomazza", "television-photogalleries"], label_hi: "टीवी", msid: "65591230" },
  { path: ["photomazza", "funny-photos"], label_hi: "फनी फोटो", msid: "98370466" },

  // ---- Sports ----
  { path: ["sports"], label_hi: "खेल", msid: "2279790" },
  { path: ["sports", "wwe"], label_hi: "WWE", msid: "120721512" },
  { path: ["sports", "other-sports"], label_hi: "अन्य खेल", msid: "2359677" },
  { path: ["sports", "tennis"], label_hi: "टेनिस", msid: "2449825" },
  { path: ["sports", "cricket"], label_hi: "क्रिकेट", msid: "3521869" },
  { path: ["sports", "football"], label_hi: "फ़ुटबॉल", msid: "64446973" },
  { path: ["sports", "football", "fifa-world-cup"], label_hi: "फीफा वर्ल्ड कप", msid: "64401805" },
  { path: ["sports", "hockey"], label_hi: "हॉकी", msid: "66839961" },
  { path: ["sports", "pro-kabaddi-league"], label_hi: "प्रो-कबड्डी-लीग", msid: "70480557" },
  { path: ["sports", "cricket", "t20worldcup"], label_hi: "टी20 वर्ल्ड कप", msid: "86773537" },
  { path: ["sports", "badminton"], label_hi: "बैडमिंटन", msid: "92272364" },
  { path: ["sports", "athletics"], label_hi: "एथलेटिक्स", msid: "92272454" },
  { path: ["sports", "boxing"], label_hi: "बॉक्सिंग", msid: "92272497" },
  { path: ["sports", "wrestling"], label_hi: "रेसलिंग", msid: "92564305" },
  { path: ["sports", "cricket", "iplt20"], label_hi: "आईपीएलटी20.सीएमएस", msid: null },

  // ---- Travel ----
  { path: ["travel"], label_hi: "यात्रा", msid: "64679468" },
  { path: ["travel", "travel-tips"], label_hi: "यात्रा टिप्स", msid: "64682758" },
  { path: ["travel", "weekend-getaways"], label_hi: "वीकेंड यात्रा", msid: "64682779" },
  { path: ["travel", "religious-trip"], label_hi: "धर्म यात्रा", msid: "64682800" },
  { path: ["travel", "adventure-trip"], label_hi: "रोमांच यात्रा", msid: "64682845" },
  { path: ["travel", "honeymoon-destinations"], label_hi: "रोमांस यात्रा", msid: "64682864" },
  { path: ["travel", "destinations"], label_hi: "टूरिस्ट डेस्टिनेशंस", msid: "64682876" },

  // ---- TV ----
  { path: ["tv"], label_hi: "टीवी", msid: "65685377" },
  { path: ["tv", "bigg-boss"], label_hi: "बिग बॉस", msid: "65685418" },
  { path: ["tv", "news"], label_hi: "खबरें", msid: "65685443" },
  { path: ["tv", "tv-masala"], label_hi: "मसाला", msid: "65685819" },
  { path: ["tv", "khatron-ke-khiladi"], label_hi: "खतरों के खिलाड़ी 15", msid: "70344675" },

  // ---- Video ----
  { path: ["video"], label_hi: "वीडियो", msid: "4901865" },
  { path: ["video", "business"], label_hi: "बिज़नस", msid: "11873677" },
  { path: ["video", "religion"], label_hi: "धर्म", msid: "122906229" },
  { path: ["video", "tech"], label_hi: "टेक", msid: "20104392" },
  { path: ["video", "auto"], label_hi: "ऑटो", msid: "28471009" },
  { path: ["video", "fashion"], label_hi: "फैशन", msid: "4901872" },
  { path: ["video", "sports"], label_hi: "खेल", msid: "4901877" },
  { path: ["video", "entertainment"], label_hi: "मनोरंजन", msid: "4901881" },
  { path: ["video", "news"], label_hi: "न्यूज़", msid: "4901886" },
  { path: ["video", "funny"], label_hi: "मज़ेदार", msid: "5556078" },
  { path: ["video", "lifestyle"], label_hi: "लाइफस्टाइल", msid: "57791552" },
  { path: ["video", "fake-it-india"], label_hi: "fake-it-india", msid: "59429326" },
  { path: ["video", "education"], label_hi: "शिक्षा", msid: "59541120" },
  { path: ["video", "food-videos"], label_hi: "रेसिपी", msid: "59541333" },
  { path: ["video", "travel"], label_hi: "यात्रा", msid: "64985414" },
  { path: ["video", "tv"], label_hi: "टीवी", msid: "65765966" },

  // ---- Viral ----
  { path: ["viral"], label_hi: "वायरल", msid: "82150262" },
  { path: ["viral", "trending"], label_hi: "ट्रेंडिंग", msid: "82150271" },
  { path: ["viral", "life-hacks"], label_hi: "लाइफ़ हैक्स", msid: "82150310" },
  { path: ["viral", "omg-news"], label_hi: "हायो रब्‍बा", msid: "82150320" },
  { path: ["viral", "whatsapp-status"], label_hi: "व्हाट्सएप स्टेटस", msid: "82150330" },
  { path: ["viral", "photogallery"], label_hi: "फोटो गैलरी", msid: "82162379" },

  // ---- Visual story ----
  { path: ["visual-story"], label_hi: "विजुअल स्टोरीज़", msid: "89008313" },
  { path: ["visual-story", "world"], label_hi: "दुनिया", msid: "104948646" },
  { path: ["visual-story", "election"], label_hi: "चुनाव", msid: "89008407" },
  { path: ["visual-story", "india"], label_hi: "भारत", msid: "97311589" },
  { path: ["visual-story", "cricket"], label_hi: "क्रिकेट", msid: "99485499" },

  // ---- Web stories ----
  { path: ["web-stories", "travel"], label_hi: "यात्रा", msid: "74932792" },
  { path: ["web-stories", "sports"], label_hi: "खेल", msid: "74932839" },
  { path: ["web-stories", "entertainment"], label_hi: "मनोरंजन", msid: "74932867" },
  { path: ["web-stories", "food"], label_hi: "खान-पान", msid: "74933021" },
  { path: ["web-stories", "beauty"], label_hi: "ब्यूटी", msid: "74933043" },
  { path: ["web-stories", "health"], label_hi: "हेल्थ", msid: "74933066" },
  { path: ["web-stories", "fashion"], label_hi: "फैशन", msid: "74933087" },
  { path: ["web-stories", "gaming"], label_hi: "टेक-गैजेट", msid: "74933103" },
  { path: ["web-stories", "education"], label_hi: "शिक्षा", msid: "87243915" },
  { path: ["web-stories", "lifestyle"], label_hi: "लाइफस्टाइल", msid: "87248985" },

  // ---- World ----
  { path: ["world"], label_hi: "दुनिया", msid: "2279801" },
  { path: ["world", "other-countries"], label_hi: "बाकी दुनिया", msid: "2303141" },
  { path: ["world", "rest-of-europe"], label_hi: "बाकी यूरोप", msid: "2303158" },
  { path: ["world", "america"], label_hi: "अमेरिका", msid: "2303165" },
  { path: ["world", "asian-countries"], label_hi: "बाकी एशिया", msid: "2303182" },
  { path: ["world", "science-news"], label_hi: "साइंस न्यूज़", msid: "2355184" },
  { path: ["world", "britain"], label_hi: "ब्रिटेन", msid: "38417564" },
  { path: ["world", "uae"], label_hi: "यूएई", msid: "38417799" },
  { path: ["world", "pakistan"], label_hi: "पाकिस्तान", msid: "6879218" },
  { path: ["world", "china"], label_hi: "चीन", msid: "93798869" },

  { path: ["jungle-news"], label_hi: "जंगल न्यूज", msid: "97940682" },
  { path: ["real-estate"], label_hi: "रियल एस्टेट", msid: "3780152" },
  { path: ["legal"], label_hi: "लीगल", msid: "130166088" },

  // ---- Tech ----
  { path: ["tech"], label_hi: "टेक", msid: "19615041" },
  { path: ["tech", "ai-news"], label_hi: "एआई-न्यूज़", msid: "121925422" },
  { path: ["tech", "gadgets-news"], label_hi: "गैजेट्स-न्यूज़", msid: "66130905" },
  { path: ["tech", "tips-tricks"], label_hi: "टिप्स-ट्रिक्स", msid: "66131052" },
  { path: ["tech", "reviews"], label_hi: "रिव्यू", msid: null },

  // ---- Opinion ----
  { path: ["opinion"], label_hi: "विचार", msid: "2279782" },
  { path: ["opinion", "editorial"], label_hi: "संपादकीय", msid: "2007740431" },
];

export function findSectionByPath(...path: string[]): NbtSectionRow | undefined {
  return NBT_SECTIONS.find((row) => row.path.length === path.length && row.path.every((p, i) => p === path[i]));
}

/** All rows directly one level under `parentPath` (e.g. all states under ["state"], or all cities under ["state", "uttar-pradesh"]). */
export function childrenOf(parentPath: string[]): NbtSectionRow[] {
  return NBT_SECTIONS.filter(
    (row) => row.path.length === parentPath.length + 1 && parentPath.every((p, i) => row.path[i] === p)
  );
}

// Entries that sit at the same tree level as real cities/states but aren't
// one (election specials, video/photo sub-folders, catch-all "अन्य"
// buckets) — excluded from anything user-facing like the onboarding picker.
const NON_LOCATION_SLUGS = new Set([
  "other",
  "video",
  "photo",
  "vidhan-sabha",
  "lok-sabha",
  "haryana-chunav",
  "assembly-election",
]);

export interface PickerState {
  slug: string;
  label_hi: string;
  msid: string;
}

export interface PickerCity {
  slug: string;
  label_hi: string;
  msid: string;
  stateSlug: string;
  stateMsid: string;
}

/** States for the onboarding picker's first step. */
export function getPickerStates(): PickerState[] {
  return childrenOf(["state"])
    .filter((row) => row.msid !== null && !NON_LOCATION_SLUGS.has(row.path[1]))
    .map((row) => ({ slug: row.path[1], label_hi: row.label_hi, msid: row.msid as string }));
}

/** Cities for the onboarding picker's second step, once a state is chosen. */
export function getPickerCities(stateSlug: string): PickerCity[] {
  const state = findSectionByPath("state", stateSlug);
  if (!state?.msid) return [];
  return childrenOf(["state", stateSlug])
    .filter((row) => row.msid !== null && !NON_LOCATION_SLUGS.has(row.path[2]))
    .map((row) => ({
      slug: row.path[2],
      label_hi: row.label_hi,
      msid: row.msid as string,
      stateSlug,
      stateMsid: state.msid as string,
    }));
}

/** Finds a chosen city's full record (with its parent state's msid) by city slug alone. */
export function findPickerCity(citySlug: string): PickerCity | null {
  for (const state of getPickerStates()) {
    const city = getPickerCities(state.slug).find((c) => c.slug === citySlug);
    if (city) return city;
  }
  return null;
}
