/* ============ CONFIGURATION & DATA ============ */
let currentLang = localStorage.getItem('lang') || 'en';
let currentTheme = localStorage.getItem('theme') || 'light';

const schemes = [
  {
    id: "krishi-bhagya",
    titleEn: "Krishi Bhagya Scheme",
    titleKn: "ಕೃಷಿ ಭಾಗ್ಯ ಯೋಜನೆ",
    deptEn: "Department of Agriculture (GoK)",
    deptKn: "ಕೃಷಿ ಇಲಾಖೆ (ಕರ್ನಾಟಕ ಸರ್ಕಾರ)",
    descEn: "Rainwater harvesting program designed to help dry-land farmers construct farm ponds and deploy micro-irrigation systems.",
    descKn: "ಒಣಭೂಮಿ ರೈತರು ಮಳೆನೀರು ಸಂಗ್ರಹಿಸಿ ಕೃಷಿ ಹೊಂಡಗಳನ್ನು ನಿರ್ಮಿಸಲು ಮತ್ತು ಲಘು ನೀರಾವರಿ ಪದ್ಧತಿಗಳನ್ನು ಬಳಸಲು ನೆರವಾಗುವ ಯೋಜನೆ.",
    benefitEn: "80% to 90% subsidy for construction of Farm Ponds (Krishi Honda) and purchasing diesel pumpsets.",
    benefitKn: "ಕೃಷಿ ಹೊಂಡಗಳ ನಿರ್ಮಾಣಕ್ಕೆ ಮತ್ತು ಲಘು ನೀರಾವರಿ ಡೀಸೆಲ್ ಪಂಪ್‌ಸೆಟ್‌ಗಳಿಗೆ ೮೦% ರಿಂದ ೯೦% ರಿಯಾಯಿತಿ (ಸಬ್ಸಿಡಿ).",
    icon: "droplet",
    dbtUrl: "https://dbt.karnataka.gov.in/",
    filter: (land, category, irrigation, crop) => {
      return irrigation === 'rainfed' || land === 'small';
    }
  },
  {
    id: "ganga-kalyana",
    titleEn: "Ganga Kalyana Borewell Scheme",
    titleKn: "ಗಂಗಾ ಕಲ್ಯಾಣ ಕೊಳವೆ ಬಾವಿ ಯೋಜನೆ",
    deptEn: "KDDC / Social Welfare Corporations",
    deptKn: "ಹಿಂದುಳಿದ ವರ್ಗಗಳ ಕಲ್ಯಾಣ ಮತ್ತು ಸಮಾಜ ಕಲ್ಯಾಣ ಇಲಾಖೆ",
    descEn: "Drilling borewells and supplying irrigation pump sets to lands of small and marginal SC/ST/Minority farmers.",
    descKn: "ಪರಿಶಿಷ್ಟ ಜಾತಿ, ಪರಿಶಿಷ್ಟ ಪಂಗಡ ಮತ್ತು ಅಲ್ಪಸಂಖ್ಯಾತ ವರ್ಗಗಳ ಸಣ್ಣ ಮತ್ತು ಅತಿ ಸಣ್ಣ ರೈತರ ಕೃಷಿ ಭೂಮಿಗೆ ಕೊಳವೆ ಬಾವಿ ನೀರಾವರಿ ಒದಗಿಸುವುದು.",
    benefitEn: "100% subsidy (up to ₹3.5 Lakhs) for drilling borewells, pipeline installation, and BESCOM power grid connection.",
    benefitKn: "ಕೊಳವೆ ಬಾವಿ ಕೊರೆಯಲು, ಪೈಪ್‌ಲೈನ್ ಅಳವಡಿಸಲು ಮತ್ತು ವಿದ್ಯುತ್ ಸಂಪರ್ಕಕ್ಕಾಗಿ ೧೦೦% ರಿಯಾಯಿತಿ (₹೩.೫ ಲಕ್ಷದವರೆಗೆ ಉಚಿತ).",
    icon: "hard-hat",
    dbtUrl: "https://dbt.karnataka.gov.in/",
    filter: (land, category, irrigation, crop) => {
      return category === 'sc-st' && (irrigation === 'well' || irrigation === 'rainfed');
    }
  },
  {
    id: "pm-kisan",
    titleEn: "PM-KISAN & Karnataka Raita Samruddhi Yojana",
    titleKn: "ಪಿಎಂ-ಕಿಸಾನ್ ಮತ್ತು ಕರ್ನಾಟಕ ರೈತ ಸಮೃದ್ಧಿ",
    deptEn: "Ministry of Agriculture / Govt of Karnataka",
    deptKn: "ಕೃಷಿ ಸಚಿವಾಲಯ / ಕರ್ನಾಟಕ ಸರ್ಕಾರ",
    descEn: "Biannual direct income support to landholding farmer families across the state to meet farm input costs.",
    descKn: "ಕೃಷಿ ವೆಚ್ಚಗಳನ್ನು ಭರಿಸಲು ರಾಜ್ಯದ ಭೂಮಿ ಹೊಂದಿರುವ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ವರ್ಷದಲ್ಲಿ ನೇರ ನಗದು ವರ್ಗಾವಣೆ.",
    benefitEn: "₹6,000/year (Central PM-KISAN) + ₹4,000/year (State Raita Samruddhi Bonus) direct DBT transfer.",
    benefitKn: "ವರ್ಷಕ್ಕೆ ₹೬,೦೦ (ಕೇಂದ್ರ) + ₹೪,೦೦೦ (ರಾಜ್ಯದ ಬೋನಸ್) ನೇರವಾಗಿ ಡಿಬಿಟಿ ಮೂಲಕ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆ.",
    icon: "banknote",
    dbtUrl: "https://pmkisan.gov.in/",
    filter: (land, category, irrigation, crop) => {
      return true; // Eligible for all landholding farmers
    }
  },
  {
    id: "raita-vidya-nidhi",
    titleEn: "Chief Minister's Raita Vidya Nidhi Scholarship",
    titleKn: "ಮುಖ್ಯಮಂತ್ರಿ ರೈತ ವಿದ್ಯಾ ನಿಧಿ ವಿದ್ಯಾರ್ಥಿವೇತನ",
    deptEn: "Department of Agriculture (GoK)",
    deptKn: "ಕೃಷಿ ಇಲಾಖೆ (ಕರ್ನಾಟಕ ಸರ್ಕಾರ)",
    descEn: "Scholarship program for the children of farmers, agricultural laborers, and weavers to support technical and higher education.",
    descKn: "ರೈತರು, ಕೃಷಿ ಕಾರ್ಮಿಕರು ಮತ್ತು ನೇಕಾರರ ಮಕ್ಕಳು ಉನ್ನತ ಮತ್ತು ತಾಂತ್ರಿಕ ಶಿಕ್ಷಣ ಪಡೆಯಲು ಬೆಂಬಲಿಸುವ ವಿದ್ಯಾರ್ಥಿವೇತನ ಯೋಜನೆ.",
    benefitEn: "Annual academic scholarships ranging from ₹2,000 to ₹11,000 directly transferred to students' bank accounts.",
    benefitKn: "ವಾರ್ಷಿಕ ₹೨,೦೦೦ ರಿಂದ ₹೧೧,೦೦೦ ವರೆಗಿನ ವಿದ್ಯಾರ್ಥಿವೇತನವನ್ನು ನೇರವಾಗಿ ವಿದ್ಯಾರ್ಥಿಯ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ವರ್ಗಾಯಿಸಲಾಗುತ್ತದೆ.",
    icon: "graduation-cap",
    dbtUrl: "https://ssp.postmatric.karnataka.gov.in/",
    filter: (land, category, irrigation, crop) => {
      return true;
    }
  },
  {
    id: "pashu-bhagya",
    titleEn: "Pashu Bhagya Livestock Incentive",
    titleKn: "ಪಶು ಭಾಗ್ಯ ಯೋಜನೆ",
    deptEn: "Department of Animal Husbandry & Veterinary Services",
    deptKn: "ಪಶುಸಂಗೋಪನೆ ಮತ್ತು ಪಶುವೈದ್ಯಕೀಯ ಸೇವೆಗಳ ಇಲಾಖೆ",
    descEn: "Assisting farmers with financial support to establish dairy, sheep, goat, or poultry rearing units.",
    descKn: "ರೈತರು ಹೈನುಗಾರಿಕೆ, ಕುರಿ, ಮೇಕೆ ಅಥವಾ ಕೋಳಿ ಸಾಕಾಣಿಕೆ ಘಟಕಗಳನ್ನು ಸ್ಥಾಪಿಸಲು ಆರ್ಥಿಕ ನೆರವು ನೀಡುವುದು.",
    benefitEn: "33% to 50% capital subsidy on cattle purchase, plus low-interest commercial loans and cattle insurance cover.",
    benefitKn: "ಪಶು ಖರೀದಿಗೆ ೩೩% ರಿಂದ ೫೦% ವರೆಗೆ ಸಬ್ಸಿಡಿ, ಜೊತೆಗೆ ಕಡಿಮೆ ಬಡ್ಡಿ ದರದ ಕೃಷಿ ಸಾಲ ಮತ್ತು ಜಾನುವಾರು ವಿಮೆ.",
    icon: "beef",
    dbtUrl: "https://dbt.karnataka.gov.in/",
    filter: (land, category, irrigation, crop) => {
      return crop === 'livestock';
    }
  },
  {
    id: "pm-fasal-bima",
    titleEn: "PM Fasal Bima Yojana (Crop Insurance)",
    titleKn: "ಪಿಎಂ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ (ಬೆಳೆ ವಿಮೆ)",
    deptEn: "Agriculture Insurance Company of India / GoK",
    deptKn: "ಭಾರತೀಯ ಕೃಷಿ ವಿಮಾ ಸಂಸ್ಥೆ / ಕೃಷಿ ಇಲಾಖೆ",
    descEn: "Comprehensive insurance safeguard for farmers against crop loss arising from drought, flood, pests, and localized calamities.",
    descKn: "ಬರಗಾಲ, ಪ್ರವಾಹ, ಕೀಟಬಾಧೆ ಮುಂತಾದ ನೈಸರ್ಗಿಕ ವಿಕೋಪಗಳಿಂದ ಉಂಟಾಗುವ ಬೆಳೆ ಹಾನಿಗೆ ಸಮಗ್ರ ವಿಮೆ ರಕ್ಷಣೆ.",
    benefitEn: "Farmer pays low premiums: 1.5% for Rabi, 2% for Kharif crops, and 5% for commercial/horticultural yields.",
    benefitKn: "ಕಡಿಮೆ ಪ್ರೀಮಿಯಂ: ಆಹಾರ ಧಾನ್ಯಗಳಿಗೆ ೧.೫% ರಿಂದ ೨%, ವಾಣಿಜ್ಯ ಮತ್ತು ತೋಟಗಾರಿಕೆ ಬೆಳೆಗಳಿಗೆ ಕೇವಲ ೫% ಪ್ರೀಮಿಯಂ ದರ.",
    icon: "shield-alert",
    dbtUrl: "https://pmfby.gov.in/",
    filter: (land, category, irrigation, crop) => {
      return crop !== 'livestock';
    }
  },
  {
    id: "krishi-yantradhare",
    titleEn: "Krishi Yantradhare (Custom Hire Machinery)",
    titleKn: "ಕೃಷಿ ಯಂತ್ರಧಾರೆ ಯೋಜನೆ",
    deptEn: "Department of Agriculture (GoK)",
    deptKn: "ಕೃಷಿ ಇಲಾಖೆ (ಕರ್ನಾಟಕ ಸರ್ಕಾರ)",
    descEn: "Rent high-tech farm machinery, tractors, harvesters, and tillers at localized rental hubs located across Karnataka.",
    descKn: "ರಾಜ್ಯಾದ್ಯಂತ ಸ್ಥಾಪಿಸಲಾದ ಕೃಷಿ ಯಂತ್ರ ಬಾಡಿಗೆ ಕೇಂದ್ರಗಳ ಮೂಲಕ ಅತ್ಯಾಧುನಿಕ ಯಂತ್ರೋಪಕರಣಗಳನ್ನು ಬಾಡಿಗೆಗೆ ಪಡೆಯುವ ಯೋಜನೆ.",
    benefitEn: "Access to tractors and harvesting equipment at 50% cheaper rates than competitive private commercial market rentals.",
    benefitKn: "ಖಾಸಗಿ ಸಂಸ್ಥೆಗಳಿಗಿಂತ ೫೦% ರಷ್ಟು ಕಡಿಮೆ ದರದಲ್ಲಿ ಟ್ರ್ಯಾಕ್ಟರ್‌ಗಳು, ಬಿತ್ತನೆ ಯಂತ್ರಗಳು ಮತ್ತು ಕೊಯ್ಲು ಯಂತ್ರಗಳ ಬಾಡಿಗೆ ಸೌಲಭ್ಯ.",
    icon: "tractor",
    dbtUrl: "https://dbt.karnataka.gov.in/",
    filter: (land, category, irrigation, crop) => {
      return land === 'small';
    }
  }
];

const translations = {
  en: {
    "nav-predict": "Crop",
    "nav-map": "Map",
    "nav-mandi": "Mandi",
    "nav-market": "Crops",
    "nav-stocks": "Stocks",
    "nav-pricing": "Pricing",
    "nav-stories": "Stories",
    "nav-news": "News",
    "nav-home": "Home",
    "nav-mode": "Mode",
    "news-hero-title": "Raita Portal — Schemes & Subsidies",
    "news-hero-desc": "Access direct benefits, scholarships, and machinery subsidies customized for your land and cropping profile.",
    "cm-title": "Hon'ble Chief Minister of Karnataka",
    "cm-name": "Shri D K Shivakumar",
    "cm-quote": "\"Digital matching ensures transparency. Our government is committed to sending direct subsidies straight to the bank accounts of our farmers without leakages.\"",
    "schemes-title": "Subsidy & Schemes Matcher",
    "schemes-tag": "Direct Benefit Transfer",
    "schemes-desc": "Input your agricultural profile below to dynamically query all central and state government schemes available for your farm size and category.",
    "filter-profile-title": "Your Farm Profile",
    "lbl-land-size": "Land Holding Size",
    "opt-land-small": "Marginal / Small (< 5 Acres)",
    "opt-land-large": "Large Farm (≥ 5 Acres)",
    "lbl-farmer-cat": "Social Category",
    "opt-cat-scst": "SC / ST Category",
    "opt-cat-gen": "General / OBC / Minorities",
    "lbl-irr-source": "Irrigation Source",
    "opt-irr-rainfed": "Dry land / Rainfed",
    "opt-irr-well": "Borewell / Open Well",
    "opt-irr-canal": "Canal / River Water",
    "lbl-farm-type": "Primary Farming Focus",
    "opt-farm-cereals": "Cereals & Paddy",
    "opt-farm-plantation": "Plantation / Cash Crops",
    "opt-farm-horti": "Horticulture (Veg, Fruits)",
    "opt-farm-livestock": "Livestock / Dairy / Poultry",
    "btn-match-schemes": "Match Active Schemes",
    "welcome-schemes-title": "Find eligible government schemes",
    "welcome-schemes-desc": "Choose your farm attributes on the left and click match to see the list of schemes and incentives.",
    "news-feed-title": "Latest Krishi News & Bulletins",
    "news-feed-tag": "Karnataka State Feed",
    "news-cat-budget": "BUDGET & LOANS",
    "news-title-1": "Zero-Interest Crop Loan Limits Raised to ₹5 Lakhs",
    "news-desc-1": "The Karnataka Government raises the maximum limit of cooperative crop loans at 0% interest from ₹3 Lakhs to ₹5 Lakhs for the Kharif 2026 season.",
    "news-cat-weather": "WEATHER ADVISORY",
    "news-title-2": "IMD Predicts Sowing Friendly Rains Across North Districts",
    "news-desc-2": "Met department forecasts steady rainfall in Raichur, Kalaburagi, and Vijayapura over the next 6 days, providing ideal soil moisture for oilseeds.",
    "news-cat-market": "COLD STORAGE & INFRA",
    "news-title-3": "50% Subsidy for FPO Cold Storages Announced",
    "news-desc-3": "To reduce post-harvest losses, registered Farmer Producer Organisations (FPOs) can apply for a 50% capital subsidy to set up cold storage units.",
    
    // Matched items translations
    "scheme-dept": "Department:",
    "scheme-benefit": "Incentive / Benefit:",
    "scheme-eligible": "ELIGIBLE",
    "scheme-apply-btn": "View Details & Apply"
  },
  kn: {
    "nav-predict": "ಬೆಳೆ",
    "nav-map": "ನಕ್ಷೆ",
    "nav-mandi": "ಮಂಡಿ",
    "nav-market": "ಬೆಳೆಗಳು",
    "nav-stocks": "ಷೇರುಗಳು",
    "nav-pricing": "ದರಪಟ್ಟಿ",
    "nav-stories": "ಕಥೆಗಳು",
    "nav-news": "ಯೋಜನೆಗಳು",
    "nav-home": "ಮುಖಪುಟ",
    "nav-mode": "ಮೋಡ್",
    "news-hero-title": "ರೈತ ಪೋರ್ಟಲ್ — ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಸಬ್ಸಿಡಿಗಳು",
    "news-hero-desc": "ನಿಮ್ಮ ಭೂಮಿ ಮತ್ತು ಕೃಷಿ ಪ್ರೊಫೈಲ್‌ಗೆ ಅನುಗುಣವಾಗಿ ನೇರ ಪ್ರಯೋಜನಗಳು, ವಿದ್ಯಾರ್ಥಿವೇತನಗಳು ಮತ್ತು ಕೃಷಿ ಉಪಕರಣಗಳ ಸಬ್ಸಿಡಿಗಳನ್ನು ಪಡೆಯಿರಿ.",
    "cm-title": "ಕರ್ನಾಟಕದ ಗೌರವಾನ್ವಿತ ಮುಖ್ಯಮಂತ್ರಿಗಳು",
    "cm-name": "ಶ್ರೀ ಡಿ ಕೆ ಶಿವಕುಮಾರ್",
    "cm-quote": "\"ಡಿಜಿಟಲ್ ಹೊಂದಾಣಿಕೆಯು ಪಾರದರ್ಶಕತೆಯನ್ನು ನೀಡುತ್ತದೆ. ನಮ್ಮ ಸರ್ಕಾರವು ಯಾವುದೇ ಸೋರಿಕೆಯಿಲ್ಲದೆ ನೇರವಾಗಿ ನಮ್ಮ ರೈತರ ಬ್ಯಾಂಕ್ ಖಾತೆಗಳಿಗೆ ಸಬ್ಸಿಡಿಗಳನ್ನು ಜಮಾ ಮಾಡಲು ಬದ್ಧವಾಗಿದೆ.\"",
    "schemes-title": "ಸಬ್ಸಿಡಿ ಮತ್ತು ಯೋಜನೆಗಳ ಹೊಂದಾಣಿಕೆ ಸಾಧನ",
    "schemes-tag": "ನೇರ ಲಾಭ ವರ್ಗಾವಣೆ (DBT)",
    "schemes-desc": "ನಿಮ್ಮ ಭೂಮಿಯ ಗಾತ್ರ ಮತ್ತು ವರ್ಗಕ್ಕೆ ಲಭ್ಯವಿರುವ ಕೇಂದ್ರ ಮತ್ತು ರಾಜ್ಯ ಸರ್ಕಾರದ ಯೋಜನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ನಿಮ್ಮ ಕೃಷಿ ಪ್ರೊಫೈಲ್ ಅನ್ನು ನಮೂದಿಸಿ.",
    "filter-profile-title": "ನಿಮ್ಮ ಕೃಷಿ ವಿವರ",
    "lbl-land-size": "ಭೂ ಹಿಡುವಳಿ ಗಾತ್ರ",
    "opt-land-small": "ಸಣ್ಣ / ಅತಿ ಸಣ್ಣ ರೈತರು (< ೫ ಎಕರೆ)",
    "opt-land-large": "ದೊಡ್ಡ ರೈತರು (≥ ೫ ಎಕರೆ)",
    "lbl-farmer-cat": "ಸಾಮಾಜಿಕ ವರ್ಗ",
    "opt-cat-scst": "ಪರಿಶಿಷ್ಟ ಜಾತಿ / ಪರಿಶಿಷ್ಟ ಪಂಗಡ (SC / ST)",
    "opt-cat-gen": "ಸಾಮಾನ್ಯ ವರ್ಗ / ಹಿಂದುಳಿದ ವರ್ಗ / ಅಲ್ಪಸಂಖ್ಯಾತರು",
    "lbl-irr-source": "ನೀರಾವರಿ ಮೂಲ",
    "opt-irr-rainfed": "ಖುಷ್ಕಿ ಭೂಮಿ / ಮಳೆ ಆಶ್ರಿತ",
    "opt-irr-well": "ಕೊಳವೆ ಬಾವಿ / ತೆರೆದ ಬಾವಿ",
    "opt-irr-canal": "ಕಾಲುವೆ / ನದಿ ನೀರು",
    "lbl-farm-type": "ಪ್ರಾಥಮಿಕ ಕೃಷಿ ವಿಧಾನ",
    "opt-farm-cereals": "ಧಾನ್ಯಗಳು ಮತ್ತು ಭತ್ತ",
    "opt-farm-plantation": "ತೋಟಗಾರಿಕೆ / ವಾಣಿಜ್ಯ ಬೆಳೆಗಳು",
    "opt-farm-horti": "ತರಕಾರಿ, ಹಣ್ಣುಗಳು, ಹೂವುಗಳು",
    "opt-farm-livestock": "ಪಶುಸಂಗೋಪನೆ / ಡೈರಿ / ಕೋಳಿ ಸಾಕಣೆ",
    "btn-match-schemes": "ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ",
    "welcome-schemes-title": "ಅರ್ಹ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಕಂಡುಕೊಳ್ಳಿ",
    "welcome-schemes-desc": "ಯೋಜನೆಗಳು ಮತ್ತು ಪ್ರೋತ್ಸಾಹಕಗಳ ಪಟ್ಟಿಯನ್ನು ನೋಡಲು ಎಡಭಾಗದಲ್ಲಿ ನಿಮ್ಮ ಕೃಷಿ ಗುಣಲಕ್ಷಣಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ಬಟನ್ ಒತ್ತಿರಿ.",
    "news-feed-title": "ತಾಜಾ ಕೃಷಿ ಸುದ್ದಿಗಳು ಮತ್ತು ಬುಲೆಟಿನ್ಗಳು",
    "news-feed-tag": "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಕೃಷಿ ವರದಿಗಳು",
    "news-cat-budget": "ಬಜೆಟ್ ಮತ್ತು ಸಾಲಗಳು",
    "news-title-1": "ಶೂನ್ಯ ಬಡ್ಡಿ ದರದ ಬೆಳೆ ಸಾಲದ ಮಿತಿ ₹೫ ಲಕ್ಷಕ್ಕೆ ಏರಿಕೆ",
    "news-desc-1": "ಕರ್ನಾಟಕ ಸರ್ಕಾರವು ಸಹಕಾರಿ ಸಂಘಗಳ ಮೂಲಕ ನೀಡಲಾಗುವ ಶೂನ್ಯ ಬಡ್ಡಿ ದರದ ಕೃಷಿ ಬೆಳೆ ಸಾಲದ ಗರಿಷ್ಠ ಮಿತಿಯನ್ನು ಪ್ರಸಕ್ತ ಮುಂಗಾರು ಹಂಗಾಮಿಗೆ ₹೩ ಲಕ್ಷದಿಂದ ₹೫ ಲಕ್ಷಕ್ಕೆ ಏರಿಸಿದೆ.",
    "news-cat-weather": "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ",
    "news-title-2": "ಉತ್ತರ ಕರ್ನಾಟಕ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಬಿತ್ತನೆಗೆ ಪೂರಕ ಮಳೆ ಮುನ್ಸೂಚನೆ",
    "news-desc-2": "ಮುಂದಿನ ೬ ದಿನಗಳಲ್ಲಿ ರಾಯಚೂರು, ಕಲಬುರಗಿ ಮತ್ತು ವಿಜಯಪುರ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಉತ್ತಮ ಮಳೆಯಾಗಲಿದ್ದು, ಎಣ್ಣೆಕಾಳು ಬಿತ್ತನೆಗೆ ಮಣ್ಣಿನಲ್ಲಿ ತೇವಾಂಶ ಪೂರಕವಾಗಿದೆ ಎಂದು ಹವಾಮಾನ ಇಲಾಖೆ ತಿಳಿಸಿದೆ.",
    "news-cat-market": "ಶೀತಲೀಕರಣ ಮತ್ತು ಮೂಲಸೌಕರ್ಯ",
    "news-title-3": "FPO ಶೀತಲೀಕರಣ ಘಟಕಗಳಿಗೆ ೫೦% ಬಂಡವಾಳ ಸಬ್ಸಿಡಿ ಘೋಷಣೆ",
    "news-desc-3": "ಕೊಯ್ಲಿನ ನಂತರದ ನಷ್ಟವನ್ನು ತಪ್ಪಿಸಲು, ನೋಂದಾಯಿತ ರೈತ ಉತ್ಪಾದಕ ಸಂಸ್ಥೆಗಳು (FPO) ಶೀತಲೀಕರಣ ಘಟಕಗಳನ್ನು ಸ್ಥಾಪಿಸಲು ೫೦% ವರೆಗೆ ಸಬ್ಸಿಡಿಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು.",
    
    // Matched items translations
    "scheme-dept": "ಇಲಾಖೆ:",
    "scheme-benefit": "ಪ್ರಯೋಜನ / ಸಬ್ಸಿಡಿ ವಿವರ:",
    "scheme-eligible": "ಅರ್ಹತೆ ಹೊಂದಿದೆ",
    "scheme-apply-btn": "ವಿವರಗಳು ಮತ್ತು ಅರ್ಜಿ"
  }
};

/* ============ PAGE TRANSITION AND INITIALIZATION ============ */
document.addEventListener("DOMContentLoaded", () => {
  // Sync localStorage with current theme and language
  applyTheme();
  applyLanguage();
  lucide.createIcons();
});

function applyTheme() {
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
}

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', currentTheme);
  applyTheme();
}

function applyLanguage() {
  document.getElementById('lang-btn-text').textContent = currentLang === 'en' ? 'ಕನ್ನಡ' : 'English';
  
  // Replace static strings using data-keys
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    const translation = translations[currentLang][key];
    if (translation) {
      if (el.tagName === 'INPUT') {
        el.placeholder = translation;
      } else {
        el.textContent = translation;
      }
    }
  });
}

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'kn' : 'en';
  localStorage.setItem('lang', currentLang);
  applyLanguage();

  // If results are actively rendered, refresh them in the correct language
  if (document.getElementById('schemes-results-grid').style.display === 'flex') {
    runSchemesMatcher();
  }
}

/* ============ SCHEMES MATCHING LOGIC ============ */
function runSchemesMatcher() {
  const land = document.getElementById('filter-land').value;
  const category = document.getElementById('filter-category').value;
  const irrigation = document.getElementById('filter-irrigation').value;
  const crop = document.getElementById('filter-crop-type').value;

  const matched = schemes.filter(s => s.filter(land, category, irrigation, crop));

  const welcomeCard = document.getElementById('schemes-welcome');
  const resultsGrid = document.getElementById('schemes-results-grid');

  welcomeCard.style.display = 'none';
  resultsGrid.style.display = 'flex';
  resultsGrid.innerHTML = '';

  const labelDept = currentLang === 'en' ? translations.en["scheme-dept"] : translations.kn["scheme-dept"];
  const labelBenefit = currentLang === 'en' ? translations.en["scheme-benefit"] : translations.kn["scheme-benefit"];
  const labelBtn = currentLang === 'en' ? translations.en["scheme-apply-btn"] : translations.kn["scheme-apply-btn"];
  const labelEligible = currentLang === 'en' ? translations.en["scheme-eligible"] : translations.kn["scheme-eligible"];

  matched.forEach(s => {
    const card = document.createElement('div');
    card.className = 'glass-card';
    card.style.cssText = `
      padding: 28px;
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 20px;
      align-items: start;
      background: var(--surface-card);
      border: 1px solid var(--line-strong);
      position: relative;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    // Add CSS hover animation dynamically via JS styling
    card.onmouseenter = () => {
      card.style.transform = 'translateY(-4px)';
      card.style.boxShadow = 'var(--shadow-md)';
    };
    card.onmouseleave = () => {
      card.style.transform = 'none';
      card.style.boxShadow = 'none';
    };

    const title = currentLang === 'en' ? s.titleEn : s.titleKn;
    const dept = currentLang === 'en' ? s.deptEn : s.deptKn;
    const desc = currentLang === 'en' ? s.descEn : s.descKn;
    const benefit = currentLang === 'en' ? s.benefitEn : s.benefitKn;

    card.innerHTML = `
      <div class="scheme-icon-wrapper" style="width: 52px; height: 52px; border-radius: 12px; background: rgba(45, 90, 55, 0.1); display: flex; align-items: center; justify-content: center; color: var(--field);">
        <i data-lucide="${s.icon}"></i>
      </div>
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <h4 style="font-size: 1.25rem; font-family: 'Fraunces', serif; color: var(--ink); margin: 0;">${title}</h4>
          <span style="font-size: 0.72rem; font-weight: 700; color: #fff; background: var(--field); padding: 4px 10px; border-radius: 30px; letter-spacing: 0.04em;">${labelEligible}</span>
        </div>
        <p style="font-size: 0.8rem; font-weight: 600; color: var(--turmeric); margin: 6px 0 12px 0;">${labelDept} ${dept}</p>
        <p style="font-size: 0.9rem; opacity: 0.8; line-height: 1.5; margin: 0 0 16px 0; color: var(--ink);">${desc}</p>
        <div style="background: rgba(217, 155, 38, 0.08); padding: 14px 18px; border-radius: 8px; border-left: 3.5px solid var(--turmeric); margin-bottom: 20px;">
          <p style="font-size: 0.75rem; font-weight: 700; margin: 0 0 4px 0; color: var(--ink); text-transform: uppercase; letter-spacing: 0.02em;">${labelBenefit}</p>
          <p style="font-size: 0.86rem; font-weight: 500; margin: 0; color: var(--ink); line-height: 1.48;">${benefit}</p>
        </div>
        <button class="btn btn-ghost" onclick="redirectToDbt('${s.id}')" style="font-size: 0.85rem; border-color: var(--line-strong); color: var(--ink); padding: 10px 20px;">
          ${labelBtn}
        </button>
      </div>
    `;

    resultsGrid.appendChild(card);
  });

  lucide.createIcons();
}

function redirectToDbt(schemeId) {
  const scheme = schemes.find(s => s.id === schemeId);
  if (!scheme) return;
  const name = currentLang === 'en' ? scheme.titleEn : scheme.titleKn;
  const dbtUrl = scheme.dbtUrl;
  
  // Show a redirection toast using the page toast container
  const container = document.getElementById('toast-container');
  if (container) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: var(--surface-card);
      border: 1.5px solid var(--field);
      border-radius: 8px;
      box-shadow: var(--shadow-lg);
      font-size: 0.88rem;
      animation: slideIn 0.3s ease forwards;
    `;

    const msg = currentLang === 'en' 
      ? `Redirecting to official government portal for ${name}...` 
      : `${name} ಗಾಗಿ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್‌ಗೆ ಮರುನಿರ್ದೇಶಿಸಲಾಗುತ್ತಿದೆ...`;

    toast.innerHTML = `
      <i data-lucide="check-circle" style="color: var(--field); width: 20px; height: 20px;"></i>
      <span style="font-weight: 600; color: var(--ink);">${msg}</span>
    `;

    container.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease forwards';
      toast.addEventListener('animationend', () => toast.remove());
    }, 4000);
  }

  // Open the official government portal directly in a new tab
  window.open(dbtUrl, '_blank');
}
