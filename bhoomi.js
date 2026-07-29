const googleSheetsWebhookUrl = 'https://script.google.com/macros/s/AKfycbxm98Q39OVRtnvzmZ_XtA6pqMAOLGPoTrxNTADnabhqSE8pzV-0sphoK_suIt_ytTYU/exec';
const backendUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:' || !window.location.hostname)
  ? 'http://localhost:5000/api'
  : '/api';
let isBackendActive = false;

async function checkBackendStatus() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${backendUrl}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      isBackendActive = true;
      console.log("Connected to Bhoomi Express backend!");
    } else {
      isBackendActive = false;
    }
  } catch (e) {
    isBackendActive = false;
    console.log("Bhoomi Express backend offline. Using client-side Supabase/local mock fallback.");
  }
  checkAuthStatus();
}

const supabaseUrl = localStorage.getItem('supabase_url') || 'https://zhehkaqvektjrzqmywfv.supabase.co';
const supabaseKey = localStorage.getItem('supabase_anon_key') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoZWhrYXF2ZWt0anJ6cW15d2Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNzg2MzgsImV4cCI6MjEwMDY1NDYzOH0._2V_aMXF-ULZoo3VbslpBkKwFic8zXMieaS4KycTKOU';
let supabaseClient = null;
if (supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && typeof supabase !== 'undefined') {
  try {
    supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
  } catch (e) {
    console.error("Supabase config invalid:", e);
  }
}
let currentUser = JSON.parse(localStorage.getItem('bhoomi_user') || 'null');

/* ============ I18N / TRANSLATIONS ============ */
let currentLang = localStorage.getItem('lang') || 'en';

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
    "nav-signin": "Sign in",
    "nav-cart": "Cart",
    "nav-mode": "Mode",
    "advisory-title": "Monsoon advisory:",
    "alert-text": "onset over coastal Karnataka running ~4 days behind schedule — check the prediction tool before sowing Kharif paddy.",
    "predict-title": "Find the perfect crop for your land",
    "predict-note": "Input your parameters to get high-accuracy suitability metrics.",
    "map-title": "Karnataka, district by district",
    "map-tag": "Hover to explore",
    "map-note": "A geographically accurate district map of Karnataka. Hover over any district to highlight its borders, and click or tap to inspect its signature crop and live mandi price index.",
    "mandi-title": "Live Mandi Prices",
    "mandi-note": "Daily wholesale commodity market rates across major APMCs in Karnataka.",
    "market-title": "District Famous Crops",
    "market-note": "Explore and buy signature crops cultivated across Karnataka's 31 districts, with yield estimation tools.",
    "per quintal": "per quintal",
    "stocks-title": "AgroSeeds Stocks",
    "stocks-note": "Live price index of leading agricultural seeds corporations trading in local regional exchanges.",
    "pricing-title": "Simple, transparent pricing",
    "pricing-note": "Empowering farmers and dealers with high-fidelity soil analytics and price forecasts.",
    "pricing-tag": "Pricing Plans",
    "yearly-discount": "Save 20%",
    "free-desc": "For individual farmers checking prices and planning the season.",
    "premium-desc": "For seed dealers, mandi agents and Farmer Producer Organisations managing volume.",
    "enterprise-desc": "For large dealers, exporters and co-operatives needing customized analytics.",
    "feat-recommendation": "Crop recommendation tool",
    "feat-mandi-basic": "Basic district map & mandi rates",
    "feat-soil-basic": "Basic soil moisture data",
    "feat-monsoon-weekly": "Weekly monsoon advisory banner",
    "feat-premium-inclusive": "Everything in Free",
    "feat-soil-highfid": "High-fidelity soil analytics (Interactive)",
    "feat-price-forecasts": "ML Crop price forecasts (3-Month)",
    "feat-priority-stock": "Bulk seed pricing & priority stock alerts",
    "feat-mandi-alerts": "Mandi price change alerts (SMS/email)",
    "feat-premium-all": "Everything in Premium",
    "feat-iot-sensors": "Real-time IoT soil sensors integration",
    "feat-api-access": "API access for custom forecasting",
    "feat-support-agronomist": "Dedicated agronomist support (24/7)",
    "feat-badge-enhanced": "Enhanced",
    "btn-preview-interactive": "Try Soil & Forecast Demo",
    "preview-title": "Premium Analytics & Forecast Playground",
    "preview-subtitle": "Interact with our high-fidelity tools for Kalaburagi District.",
    "tab-soil": "Soil NPK Analysis",
    "tab-forecast": "Price Trend Forecast",
    "soil-health-title": "High-Fidelity Soil Nutrients (NPK) Profile",
    "soil-health-desc": "Our high-resolution spatial model analyzes soil elements dynamically. Below is the current nutrient density index compared to the optimal range for sowing Tur Dal.",
    "soil-opt-note": "Best crop fit: Red Gram (Tur Dal)",
    "forecast-trend-title": "ML-Based Mandi Price Forecast (₹ per Quintal)",
    "forecast-trend-desc": "Predictive modeling trained on 15 years of harvest data, rain estimates, and international trade trends. Drag the slider to forecast price changes.",
    "forecast-horizon": "Forecast Horizon",
    "forecast-crop": "Tur Dal Price (Forecasted)",
    "history-title": "Your Sowing Logs",
    "confidence-lbl": "Match Confidence",
    "history-empty": "Please sign in to view your sowing log history.",
    "history-loading": "Loading your logs...",
    "history-no-records": "No sowing logs found. Run a prediction to record your first suitability log.",
    "stories-title": "Farmer success stories",
    "stories-note": "Real accounts of local farmers using Bhoomi to optimize sowing and maximize yields.",
    "lbl-district": "Select District",
    "lbl-season": "Sowing Season",
    "lbl-soil": "Soil Type",
    "lbl-rain": "Water Availability",
    "btn-predict": "Predict Crop",
    "kharif": "Kharif (Monsoon)",
    "rabi": "Rabi (Winter)",
    "summer": "Summer (Zaid)",
    "red-loamy": "Red Loamy",
    "black-cotton": "Black Cotton (Regur)",
    "laterite": "Laterite",
    "alluvial": "Alluvial",
    "sandy": "Sandy / Coastal",
    "low": "Low",
    "medium": "Medium",
    "high": "High",
    "climate-soil": "Climate & Soil",
    "soil-moisture": "Soil Moisture",
    "forecast": "5-Day Forecast",
    "monsoon-timeline": "Monsoon Timeline",
    "days-delayed": "days delayed",
    "on-track": "On Track",
    "ahead": "Ahead",
    "behind": "Behind",
    "district-detail": "District detail",
    "map-placeholder": "Hover over any district on the map to inspect its signature crop and indicative mandi price.",
    "mandi-placeholder": "Search mandi markets or crops...",
    "sort-name": "Sort: District (A–Z)",
    "sort-price-high": "Sort: Price (high → low)",
    "sort-price-low": "Sort: Price (low → high)",
    "table-dist": "District",
    "table-crop": "Famous crop",
    "table-price": "Mandi Rate",
    "table-change": "7-Day Trend",
    "indicative-price": "Indicative mandi price",
    "7-day-trend": "7-day trend",
    "free-plan": "Free Plan",
    "premium-plan": "Premium — for dealers & FPOs",
    "enterprise-plan": "Enterprise FPO",
    "start-free": "Start Free",
    "start-premium": "Start Premium",
    "contact-sales": "Contact Sales",

    // Arbitrage
    "arbitrage-title": "Mandi Arbitrage Calculator",
    "arbitrage-desc": "Find the most profitable destination market for your crops after accounting for travel costs.",
    "select-crop": "Select Crop",
    "select-quantity": "Quantity (Quintals)",
    "calc-btn": "Calculate Arbitrage Profit",
    "best-destination": "Best Destination",
    "est-distance": "Est. Distance",
    "transport-cost": "Transport Cost",
    "net-profit-boost": "Net Profit Boost",

    // Yield simulator
    "yield-sim-title": "Sowing Yield Simulator",
    "land-size": "Land Size",
    "seed-qty": "Seeds Required",
    "sowing-cost": "Sowing Cost",
    "exp-yield": "Expected Yield",
    "proj-revenue": "Projected Revenue",
    "acres": "Acres",
    "bags": "Bags",

    // Chatbot
    "chat-title": "Bhoomi Saathi — AI Agri-Advisor",
    "chat-placeholder": "Ask about sowing, pests, or fertilizer...",
    "chat-welcome": "Namaskara! I am Bhoomi Saathi, your digital agronomy helper. How can I assist you today?",
    "chat-q1": "When is the best time to sow Paddy?",
    "chat-q2": "How do I control Tomato blight pests?",
    "chat-q3": "Which crops grow best in black soil?",
    "chat-q4": "Show me today's top Mandi rates.",

    "Soybean & Tur Dal": "Soybean & Tur Dal",
    "Tur Dal (Red Gram)": "Tur Dal (Red Gram)",
    "Tur Dal & Paddy": "Tur Dal & Paddy",
    "Grapes": "Grapes",
    "Sugarcane & Limes": "Sugarcane & Limes",
    "Paddy (Rice Bowl)": "Paddy (Rice Bowl)",
    "Cotton & Sunflower": "Cotton & Sunflower",
    "Cotton & Jowar": "Cotton & Jowar",
    "Sunflower & Maize": "Sunflower & Maize",
    "Paddy & Sugarcane": "Paddy & Sugarcane",
    "Maize & Cotton": "Maize & Cotton",
    "Groundnut & Bajra": "Groundnut & Bajra",
    "Onion & Maize": "Onion & Maize",
    "Paddy & Green Gram": "Paddy & Green Gram",
    "Chili & Cotton": "Chili & Cotton",
    "Jowar & Sunflower": "Jowar & Sunflower",
    "Sorghum & Green Gram": "Sorghum & Green Gram",
    "Sugarcane & Maize": "Sugarcane & Maize",
    "Cardamom & Coffee": "Cardamom & Coffee",
    "Areca nut & Spices": "Areca nut & Spices",
    "Chili & Maize": "Chili & Maize",
    "Banana & Coconut": "Banana & Coconut",
    "Coconut & Groundnut": "Coconut & Groundnut",
    "Mulberry (Silk) & Tomato": "Mulberry (Silk) & Tomato",
    "Grapes & Mulberry": "Grapes & Mulberry",
    "Areca nut & Cashew": "Areca nut & Cashew",
    "Coffee & Potato": "Coffee & Potato",
    "Sugarcane": "Sugarcane",
    "Mulberry & Vegetables": "Mulberry & Vegetables",
    "Vegetables & Flowers": "Vegetables & Flowers",
    "Coffee & Pepper": "Coffee & Pepper",
    "Sugarcane & Tobacco": "Sugarcane & Tobacco",
    "Mulberry / Silk City": "Mulberry / Silk City",
    "Turmeric & Cotton": "Turmeric & Cotton",

    "Paddy": "Paddy",
    "Maize": "Maize",
    "Cotton": "Cotton",
    "Sugarcane": "Sugarcane",
    "Groundnut": "Groundnut",
    "Tur Dal": "Tur Dal",
    "Grapes": "Grapes",
    "Coffee": "Coffee",

    "cereal": "Cereal",
    "cash": "Cash",
    "pulse": "Pulse",
    "horti": "Horticulture"
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
    "nav-signin": "ಲಾಗಿನ್",
    "nav-cart": "ಕಾರ್ಟ್",
    "nav-mode": "ಮೋಡ್",
    "advisory-title": "ಮುಂಗಾರು ಸೂಚನೆ:",
    "alert-text": "ಕರಾವಳಿ ಕರ್ನಾಟಕದಲ್ಲಿ ಮುಂಗಾರು ಪ್ರವೇಶ ~೪ ದಿನ ತಡವಾಗಿದೆ — ಖಾರೀಫ್ ಭತ್ತ ಬಿತ್ತನೆ ಮಾಡುವ ಮುನ್ನ ಮುನ್ಸೂಚನೆ ಪರಿಶೀಲಿಸಿ.",
    "predict-title": "ನಿಮ್ಮ ಭೂಮಿಗೆ ಸೂಕ್ತವಾದ ಬೆಳೆಯನ್ನು ಕಂಡುಕೊಳ್ಳಿ",
    "predict-note": "ನಿಮ್ಮ ಮಣ್ಣು ಮತ್ತು ಜಿಲ್ಲೆಯ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ ನಿಖರವಾದ ಬೆಳೆ ಮುನ್ಸೂಚನೆ ಪಡೆಯಿರಿ.",
    "map-title": "ಕರ್ನಾಟಕ ಜಿಲ್ಲಾವಾರು ವಿವರ",
    "map-tag": "ಮಾಹಿತಿ ಪಡೆಯಲು ಕರ್ಸರ್ ಚಲಾಯಿಸಿ",
    "map-note": "ಕರ್ನಾಟಕದ ಭೌಗೋಳಿಕ ಜಿಲ್ಲಾ ನಕ್ಷೆ. ಜಿಲ್ಲೆಯ ಗಡಿ ಮತ್ತು ಬೆಳೆ ವಿವರಗಳನ್ನು ನೋಡಲು ನಕ್ಷೆಯ ಮೇಲೆ ಮೌಸ್ ಚಲಾಯಿಸಿ ಅಥವಾ ಕ್ಲಿಕ್ ಮಾಡಿ.",
    "mandi-title": "ಲೈವ್ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
    "mandi-note": "ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆಗಳ ದೈನಂದಿನ ಹೋಲ್ಸೇಲ್ ಬೆಲೆಗಳು.",
    "market-title": "ಜಿಲ್ಲಾವಾರು ಪ್ರಸಿದ್ಧ ಬೆಳೆಗಳು",
    "market-note": "ಕರ್ನಾಟಕದ 31 ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಬೆಳೆಯಲಾಗುವ ಪ್ರಸಿದ್ಧ ಬೆಳೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ ಮತ್ತು ಇಳುವರಿ ಅಂದಾಜು ಪರಿಶೀಲಿಸಿ.",
    "per quintal": "ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್",
    "stocks-title": "ಬೀಜ ಕಂಪನಿಗಳ ಷೇರುಗಳು",
    "stocks-note": "ಸ್ಥಳೀಯ ವಿನಿಮಯ ಕೇಂದ್ರಗಳಲ್ಲಿ ಪ್ರಮುಖ ಕೃಷಿ ಬೀಜ ಕಂಪನಿಗಳ ಷೇರು ಮೌಲ್ಯ.",
    "pricing-title": "ಸರಳ ಮತ್ತು ಪಾರದರ್ಶಕ ದರಗಳು",
    "pricing-note": "ರೈತರು ಮತ್ತು ವಿತರಕರಿಗೆ ನಿಖರವಾದ ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಮುನ್ಸೂಚನೆ ಸೇವೆಗಳು.",
    "pricing-tag": "ದರಪಟ್ಟಿ",
    "yearly-discount": "೨೦% ಉಳಿತಾಯ",
    "free-desc": "ಬೆಲೆಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಮತ್ತು ಹಂಗಾಮು ಯೋಜನೆ ರೂಪಿಸಲು ವೈಯಕ್ತಿಕ ರೈತರಿಗೆ.",
    "premium-desc": "ಹೆಚ್ಚಿನ ಪ್ರಮಾಣದ ವಹಿವಾಟು ನಡೆಸುವ ಬೀಜ ವಿತರಕರು, ಮಂಡಿ ಏಜೆಂಟರು ಮತ್ತು FPOಗಳಿಗೆ.",
    "enterprise-desc": "ಕಸ್ಟಮೈಸ್ ಮಾಡಿದ ವಿಶ್ಲೇಷಣೆಯ ಅಗತ್ಯವಿರುವ ದೊಡ್ಡ ವಿತರಕರು, ರಫ್ತುದಾರರು ಮತ್ತು ಸಹಕಾರಿ ಸಂಸ್ಥೆಗಳಿಗೆ.",
    "feat-recommendation": "ಬೆಳೆ ಶಿಫಾರಸು ಸಾಧನ",
    "feat-mandi-basic": "ಮೂಲಭೂತ ನಕ್ಷೆ ಮತ್ತು ಮಂಡಿ ದರಗಳು",
    "feat-soil-basic": "ಮೂಲಭೂತ ಮಣ್ಣಿನ ತೇವಾಂಶ ಮಾಹಿತಿ",
    "feat-monsoon-weekly": "ವಾರದ ಮುಂಗಾರು ಮುನ್ಸೂಚನೆ ಬ್ಯಾನರ್",
    "feat-premium-inclusive": "ಉಚಿತ ಯೋಜನೆಯಲ್ಲಿರುವ ಎಲ್ಲಾ ಸೇವೆಗಳು",
    "feat-soil-highfid": "ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ (ಸಂವಾದಾತ್ಮಕ)",
    "feat-price-forecasts": "ಬೆಳೆ ದರ ಮುನ್ಸೂಚನೆ (೩ ತಿಂಗಳ ಔಟ್‌ಲುಕ್)",
    "feat-priority-stock": "ಸಗಟು ಬೀಜ ಬೆಲೆ ಮತ್ತು ಆದ್ಯತೆಯ ಸ್ಟಾಕ್ ಎಚ್ಚರಿಕೆಗಳು",
    "feat-mandi-alerts": "ಮಂಡಿ ದರ ಬದಲಾವಣೆ ಎಚ್ಚರಿಕೆಗಳು (SMS/ಇಮೇಲ್)",
    "feat-premium-all": "ಪ್ರೀಮಿಯಂ ಯೋಜನೆಯಲ್ಲಿರುವ ಎಲ್ಲಾ ಸೇವೆಗಳು",
    "feat-iot-sensors": "ರಿಯಲ್-ಟೈಮ್ IoT ಮಣ್ಣಿನ ಸೆನ್ಸಾರ್ ಅಳವಡಿಕೆ",
    "feat-api-access": "ಕಸ್ಟಮ್ ಬೆಳೆ ಮುನ್ಸೂಚನೆಗಾಗಿ API ಪ್ರವೇಶ",
    "feat-support-agronomist": "ದಿನದ ೨೪ ಗಂಟೆ ತಜ್ಞ ಕೃಷಿ ವಿಜ್ಞಾನಿಗಳ ನೆರವು",
    "feat-badge-enhanced": "ಉತ್ತಮಗೊಳಿಸಲಾಗಿದೆ",
    "btn-preview-interactive": "ಮಣ್ಣು ಮತ್ತು ದರ ಮುನ್ಸೂಚನೆ ಡೆಮೊ",
    "preview-title": "ಪ್ರೀಮಿಯಂ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಮುನ್ಸೂಚನೆ ಆಟದ ಮೈದಾನ",
    "preview-subtitle": "ಕಲಬುರಗಿ ಜಿಲ್ಲೆಯ ನಮ್ಮ ಅತ್ಯಾಧುನಿಕ ಪರಿಕರಗಳನ್ನು ಬಳಸಿ ನೋಡಿ.",
    "tab-soil": "ಮಣ್ಣಿನ NPK ವಿಶ್ಲೇಷಣೆ",
    "tab-forecast": "ಬೆಲೆ ಪ್ರವೃತ್ತಿ ಮುನ್ಸೂಚನೆ",
    "soil-health-title": "ಅತ್ಯುನ್ನತ ಗುಣಮಟ್ಟದ ಮಣ್ಣಿನ ಪೋಷಕಾಂಶಗಳ (NPK) ಸ್ಥಿತಿ",
    "soil-health-desc": "ನಮ್ಮ ಹೈ-ರೆಸಲ್ಯೂಶನ್ ಭೌಗೋಳಿಕ ಮಾದರಿಯು ಮಣ್ಣಿನ ಅಂಶಗಳನ್ನು ಕ್ರಿಯಾತ್ಮಕವಾಗಿ ವಿಶ್ಲೇಷಿಸುತ್ತದೆ. ಕೆಳಗೆ ತೊಗರಿ ಬೇಳೆ ಬಿತ್ತನೆಗೆ ಅಗತ್ಯವಿರುವ ಸೂಕ್ತ ಶ್ರೇಣಿಯೊಂದಿಗೆ ಪ್ರಸ್ತುತ ಪೋಷಕಾಂಶದ ಸಾಂದ್ರತೆಯನ್ನು ಹೋಲಿಸಲಾಗಿದೆ.",
    "soil-opt-note": "ಉತ್ತಮ ಬೆಳೆ ಹೊಂದಾಣಿಕೆ: ತೊಗರಿ ಬೇಳೆ (ಕೆಂಪು ಬೇಳೆ)",
    "forecast-trend-title": "ML ಆಧಾರಿತ ಮಂಡಿ ದರ ಮುನ್ಸೂಚನೆ (ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್‌ಗೆ ₹)",
    "forecast-trend-desc": "೧೫ ವರ್ಷಗಳ ಕೃಷಿ ಮಾಹಿತಿ, ಮಳೆ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಅಂತರರಾಷ್ಟ್ರೀಯ ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿಗಳಿಂದ ತರಬೇತಿ ಪಡೆದ ಭವಿಷ್ಯಸೂಚಕ ಮಾದರಿ. ಬೆಲೆ ಬದಲಾವಣೆಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಸ್ಲೈಡರ್ ಎಳೆಯಿರಿ.",
    "forecast-horizon": "ಮುನ್ಸೂಚನೆ ಅವಧಿ",
    "forecast-crop": "ತೊಗರಿ ಬೇಳೆ ದರ (ಮುನ್ಸೂಚನೆ)",
    "history-title": "ನಿಮ್ಮ ಬಿತ್ತನೆ ದಾಖಲೆಗಳು",
    "confidence-lbl": "ಹೊಂದಾಣಿಕೆಯ ಭರವಸೆ",
    "history-empty": "ನಿಮ್ಮ ಬಿತ್ತನೆ ದಾಖಲೆಗಳನ್ನು ನೋಡಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ.",
    "history-loading": "ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    "history-no-records": "ಯಾವುದೇ ಬಿತ್ತನೆ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ಬೆಳೆ ಹೊಂದಾಣಿಕೆಯನ್ನು ಪರಿಶೀಲಿಸಿ ಮೊದಲ ದಾಖಲೆಯನ್ನು ರಚಿಸಿ.",
    "stories-title": "ರೈತರ ಯಶಸ್ಸಿನ ಕಥೆಗಳು",
    "stories-note": "ಭೂಮಿ ತಂತ್ರಜ್ಞಾನ ಬಳಸಿ ಗರಿಷ್ಠ ಇಳುವರಿ ಪಡೆದ ನಮ್ಮ ಹೆಮ್ಮೆಯ ರೈತರ ಅನುಭವಗಳು.",
    "lbl-district": "ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
    "lbl-season": "ಬಿತ್ತನೆ ಹಂಗಾಮು",
    "lbl-soil": "ಮಣ್ಣಿನ ಪ್ರಕಾರ",
    "lbl-rain": "ನೀರಿನ ಲಭ್ಯತೆ",
    "btn-predict": "ಬೆಳೆ ಊಹಿಸಿ",
    "kharif": "ಖಾರೀಫ್ (ಮುಂಗಾರು)",
    "rabi": "ರಬಿ (ಹಿಂಗಾರು)",
    "summer": "ಬೇಸಿಗೆ (ಜಾಹೀದ್)",
    "red-loamy": "ಕೆಂಪು ಲೋಮಿ",
    "black-cotton": "ಕಪ್ಪು ಹತ್ತಿ ಮಣ್ಣು",
    "laterite": "ಲ್ಯಾಟರೈಟ್ ಮಣ್ಣು",
    "alluvial": "ಮೆಕ್ಕಲು ಮಣ್ಣು",
    "sandy": "ಮರಳು ಮಿಶ್ರಿತ ಕೆಂಪು ಮಣ್ಣು",
    "low": "ಕಡಿಮೆ",
    "medium": "ಮಧ್ಯಮ",
    "high": "ಹೆಚ್ಚು",
    "climate-soil": "ಹವಾಮಾನ ಮತ್ತು ಮಣ್ಣು",
    "soil-moisture": "ಮಣ್ಣಿನ ತೇವಾಂಶ",
    "forecast": "೫ ದಿನಗಳ ಹವಾಮಾನ",
    "monsoon-timeline": "ಮುಂಗಾರು ಪ್ರವೇಶ ಮಾಹಿತಿ",
    "days-delayed": "ದಿನ ತಡವಾಗಿದೆ",
    "on-track": "ಸರಿಯಾದ ಸಮಯದಲ್ಲಿದೆ",
    "ahead": "ಮುಂಚಿತವಾಗಿದೆ",
    "behind": "ತಡವಾಗಿದೆ",
    "district-detail": "ಜಿಲ್ಲಾ ವಿವರಗಳು",
    "map-placeholder": "ಜಿಲ್ಲೆಯ ಪ್ರಮುಖ ಬೆಳೆ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಬೆಲೆಯನ್ನು ನೋಡಲು ನಕ್ಷೆಯ ಮೇಲೆ ಮೌಸ್ ಚಲಾಯಿಸಿ.",
    "mandi-placeholder": "ಮಾರುಕಟ್ಟೆ ಅಥವಾ ಬೆಳೆಯನ್ನು ಹುಡುಕಿ...",
    "sort-name": "ಕ್ರಮಬದ್ಧತೆ: ಜಿಲ್ಲಾವಾರು",
    "sort-price-high": "ಕ್ರಮಬದ್ಧತೆ: ಗರಿಷ್ಠ ಬೆಲೆ",
    "sort-price-low": "ಕ್ರಮಬದ್ಧತೆ: ಕನಿಷ್ಠ ಬೆಲೆ",
    "table-dist": "ಜಿಲ್ಲೆ",
    "table-crop": "ಪ್ರಮುಖ ಬೆಳೆ",
    "table-price": "ಮಾರುಕಟ್ಟೆ ದರ",
    "table-change": "೭ ದಿನದ ಒಲವು",
    "indicative-price": "ಸೂಚಿತ ಮಾರುಕಟ್ಟೆ ದರ",
    "7-day-trend": "೭ ದಿನದ ಟ್ರೆಂಡ್",
    "free-plan": "ಉಚಿತ ಯೋಜನೆ",
    "premium-plan": "ಪ್ರೀಮಿಯಂ — ವಿತರಕರು ಮತ್ತು FPOಗಳಿಗೆ",
    "enterprise-plan": "ಎಂಟರ್ಪ್ರೈಸ್ FPO",
    "start-free": "ಉಚಿತವಾಗಿ ಆರಂಭಿಸಿ",
    "start-premium": "ಪ್ರೀಮಿಯಂ ಆರಂಭಿಸಿ",
    "contact-sales": "ಸಂಪರ್ಕಿಸಿ",

    // Arbitrage
    "arbitrage-title": "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಹೋಲಿಕೆ ಮತ್ತು ಸಾರಿಗೆ ಲಾಭ ಲೆಕ್ಕಾಚಾರ",
    "arbitrage-desc": "ಸಾರಿಗೆ ವೆಚ್ಚ ಕಳೆದು ಯಾವ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಮಾರಾಟ ಮಾಡಿದರೆ ಗರಿಷ್ಠ ಲಾಭ ಸಿಗುತ್ತದೆ ಎಂದು ಲೆಕ್ಕ ಹಾಕಿ.",
    "select-crop": "ಬೆಳೆ ಆಯ್ಕೆ ಮಾಡಿ",
    "select-quantity": "ಪ್ರಮಾಣ (ಕ್ವಿಂಟಾಲ್)",
    "calc-btn": "ಸಾರಿಗೆ ಲಾಭ ಲೆಕ್ಕ ಹಾಕಿ",
    "best-destination": "ಗರಿಷ್ಠ ಲಾಭದ ಮಾರುಕಟ್ಟೆ",
    "est-distance": "ಅಂದಾಜು ದೂರ",
    "transport-cost": "ಸಾರಿಗೆ ವೆಚ್ಚ",
    "net-profit-boost": "ನಿವ್ವಳ ಹೆಚ್ಚುವರಿ ಲಾಭ",

    // Yield simulator
    "yield-sim-title": "ಇಳುವರಿ ಮತ್ತು ಆದಾಯ ಅಂದಾಜು",
    "land-size": "ಭೂಮಿಯ ವಿಸ್ತೀರ್ಣ",
    "seed-qty": "ಅಗತ್ಯವಿರುವ ಬೀಜಗಳು",
    "sowing-cost": "ಬಿತ್ತನೆ ವೆಚ್ಚ",
    "exp-yield": "ನಿರೀಕ್ಷಿತ ಇಳುವರಿ",
    "proj-revenue": "ಅಂದಾಜು ಒಟ್ಟು ಆದಾಯ",
    "acres": "ಎಕರೆಗಳು",
    "bags": "ಚೀಲಗಳು",

    // Chatbot
    "chat-title": "ಭೂಮಿ ಸಾಥಿ — AI ಕೃಷಿ ಸಲಹೆಗಾರ",
    "chat-placeholder": "ಬಿತ್ತನೆ, ಕೀಟನಾಶಕ ಅಥವಾ ಮಾರುಕಟ್ಟೆ ಬಗ್ಗೆ ಕೇಳಿ...",
    "chat-welcome": "ನಮಸ್ಕಾರ! ನಾನು ಭೂಮಿ ಸಾಥಿ, ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಕೃಷಿ ಸಹಾಯಕ. ಇವತ್ತು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
    "chat-q1": "ಭತ್ತ ಬಿತ್ತನೆಗೆ ಉತ್ತಮ ಸಮಯ ಯಾವುದು?",
    "chat-q2": "ಟೊಮೆಟೊ ಎಲೆ ಮುರುಟು ರೋಗ ತಡೆಗಟ್ಟುವುದು ಹೇಗೆ?",
    "chat-q3": "ಕಪ್ಪು ಮಣ್ಣಿನಲ್ಲಿ ಯಾವ ಬೆಳೆ ಉತ್ತಮವಾಗಿ ಬೆಳೆಯುತ್ತದೆ?",
    "chat-q4": "ಇವತ್ತಿನ ಪ್ರಮುಖ ಮಾರುಕಟ್ಟೆ ದರಗಳನ್ನು ತೋರಿಸಿ.",

    "Soybean & Tur Dal": "ಸೋಯಾಬೀನ್ ಮತ್ತು ತೊಗರಿ ಬೇಳೆ",
    "Tur Dal (Red Gram)": "ತೊಗರಿ ಬೇಳೆ (ಕೆಂಪು ಬೇಳೆ)",
    "Tur Dal & Paddy": "ತೊಗರಿ ಬೇಳೆ ಮತ್ತು ಭತ್ತ",
    "Grapes": "ದ್ರಾಕ್ಷಿ",
    "Sugarcane & Limes": "ಕಬ್ಬು ಮತ್ತು ನಿಂಬೆಹಣ್ಣು",
    "Paddy (Rice Bowl)": "ಭತ್ತ (ಭತ್ತದ ಕಣಜ)",
    "Cotton & Sunflower": "ಹತ್ತಿ ಮತ್ತು ಸೂರ್ಯಕಾಂತಿ",
    "Cotton & Jowar": "ಹತ್ತಿ ಮತ್ತು ಜೋಳ",
    "Sunflower & Maize": "ಸೂರ್ಯಕಾಂತಿ ಮತ್ತು ಮೆಕ್ಕೆಜೋಳ",
    "Paddy & Sugarcane": "ಭತ್ತ ಮತ್ತು ಕಬ್ಬು",
    "Maize & Cotton": "ಮೆಕ್ಕೆಜೋಳ ಮತ್ತು ಹತ್ತಿ",
    "Groundnut & Bajra": "ಕಡಲೆಕಾಯಿ ಮತ್ತು ಸಜ್ಜೆ",
    "Onion & Maize": "ಈರುಳ್ಳಿ ಮತ್ತು ಮೆಕ್ಕೆಜೋಳ",
    "Paddy & Green Gram": "ಭತ್ತ ಮತ್ತು ಹೆಸರು ಬೇಳೆ",
    "Chili & Cotton": "ಮೆಣಸಿನಕಾಯಿ ಮತ್ತು ಹತ್ತಿ",
    "Jowar & Sunflower": "ಜೋಳ ಮತ್ತು ಸೂರ್ಯಕಾಂತಿ",
    "Sorghum & Green Gram": "ಜೋಳ ಮತ್ತು ಹೆಸರು ಬೇಳೆ",
    "Sugarcane & Maize": "ಕಬ್ಬು ಮತ್ತು ಮೆಕ್ಕೆಜೋಳ",
    "Cardamom & Coffee": "ಏಲಕ್ಕಿ ಮತ್ತು ಕಾಫಿ",
    "Areca nut & Spices": "ಅಡಿಕೆ ಮತ್ತು ಸಾಂಬಾರ ಪದಾರ್ಥಗಳು",
    "Chili & Maize": "ಮೆಣಸಿನಕಾಯಿ ಮತ್ತು ಮೆಕ್ಕೆಜೋಳ",
    "Banana & Coconut": "ಬಾಳೆಹಣ್ಣು ಮತ್ತು ತೆಂಗಿನಕಾಯಿ",
    "Coconut & Groundnut": "ತೆಂಗಿನಕಾಯಿ ಮತ್ತು ಕಡಲೆಕಾಯಿ",
    "Mulberry (Silk) & Tomato": "ರೇಷ್ಮೆ ಮತ್ತು ಟೊಮೆಟೊ",
    "Grapes & Mulberry": "ದ್ರಾಕ್ಷಿ ಮತ್ತು ರೇಷ್ಮೆ",
    "Areca nut & Cashew": "ಅಡಿಕೆ ಮತ್ತು ಗೋಡಂಬಿ",
    "Coffee & Potato": "ಕಾಫಿ ಮತ್ತು ಆಲೂಗಡ್ಡೆ",
    "Sugarcane": "ಕಬ್ಬು",
    "Mulberry & Vegetables": "ರೇಷ್ಮೆ ಮತ್ತು ತರಕಾರಿಗಳು",
    "Vegetables & Flowers": "ತರಕಾರಿಗಳು ಮತ್ತು ಹೂಗಳು",
    "Coffee & Pepper": "ಕಾಫಿ ಮತ್ತು ಕಾಳುಮೆಣಸು",
    "Sugarcane & Tobacco": "ಕಬ್ಬು ಮತ್ತು ತಂಬಾಕು",
    "Mulberry / Silk City": "ರೇಷ್ಮೆ / ರೇಷ್ಮೆ ನಗರಿ",
    "Turmeric & Cotton": "ಅರಿಶಿನ ಮತ್ತು ಹತ್ತಿ",

    "Paddy": "ಭತ್ತ",
    "Maize": "ಮೆಕ್ಕೆಜೋಳ",
    "Cotton": "ಹತ್ತಿ",
    "Sugarcane": "ಕಬ್ಬು",
    "Groundnut": "ಕಡಲೆಕಾಯಿ",
    "Tur Dal": "ತೊಗರಿ ಬೇಳೆ",
    "Grapes": "ದ್ರಾಕ್ಷಿ",
    "Coffee": "ಕಾಫಿ",

    // Districts
    "Bidar": "ಬೀದರ್",
    "Kalaburagi": "ಕಲಬುರಗಿ",
    "Yadgir": "ಯಾದಗಿರಿ",
    "Vijayapura": "ವಿಜಯಪುರ",
    "Bagalkote": "ಬಾಗಲಕೋಟೆ",
    "Raichur": "ರಾಯಚೂರು",
    "Koppal": "ಕೊಪ್ಪಳ",
    "Belagavi": "ಬೆಳಗಾವಿ",
    "Dharwad": "ಧಾರವಾಡ",
    "Gadag": "ಗದಗ್",
    "Ballari": "ಬಳ್ಳಾರಿ",
    "Vijayanagara": "ವಿಜಯನಗರ",
    "Uttara Kannada": "ಉತ್ತರ ಕನ್ನಡ",
    "Haveri": "ಹಾವೇರಿ",
    "Davanagere": "ದಾವಣಗೆರೆ",
    "Chitradurga": "ಚಿತ್ರದುರ್ಗ",
    "Udupi": "ಉಡುಪಿ",
    "Shivamogga": "ಶಿವಮೊಗ್ಗ",
    "Chikkamagaluru": "ಚಿಕ್ಕಮಗಳೂರು",
    "Tumakuru": "ತುಮಕೂರು",
    "Kolar": "ಕೋಲಾರ",
    "Chikkaballapura": "ಚಿಕ್ಕಬಳ್ಳಾಪುರ",
    "Dakshina Kannada": "ದಕ್ಷಿಣ ಕನ್ನಡ",
    "Hassan": "ಹಾಸನ",
    "Mandya": "ಮಂಡ್ಯ",
    "Bengaluru Rural": "ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ",
    "Bengaluru Urban": "ಬೆಂಗಳೂರು ನಗರ",
    "Kodagu": "ಕೊಡಗು",
    "Mysuru": "ಮೈಸೂರು",
    "Ramanagara": "ರಾಮನಗರ",
    "Chamarajanagara": "ಚಾಮರಾಜನಗರ",

    "cereal": "ಧಾನ್ಯಗಳು",
    "cash": "ವಾಣಿಜ್ಯ ಬೆಳೆಗಳು",
    "pulse": "ದ್ವಿದಳ ಧಾನ್ಯಗಳು",
    "horti": "ತೋಟಗಾರಿಕೆ"
  }
};

function updatePageTranslations() {
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
  document.getElementById('lang-btn-text').textContent = currentLang === 'en' ? 'ಕನ್ನಡ' : 'English';
  updatePageTranslations();

  // Re-populate and re-render dynamic items
  const sortedDist = districts.slice().sort((a, b) => a.name.localeCompare(b.name));
  renderMandi(sortedDist);
  buildSeedGrid();
  buildStockGrid();
  buildMap();
  updateClimateDashboard(document.getElementById('sel-district').value);
  populateArbitrageDropdowns();
}

function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) || key;
}

/* ============ DATA ============ */
const districts = [
  { name: "Bidar", crop: "Soybean & Tur Dal", cat: "pulse", price: 6800, chg: 1.2, col: 9, row: 0 },
  { name: "Kalaburagi", crop: "Tur Dal (Red Gram)", cat: "pulse", price: 7200, chg: -0.6, col: 8, row: 1 },
  { name: "Yadgir", crop: "Tur Dal & Paddy", cat: "pulse", price: 7050, chg: 0.4, col: 7, row: 2 },

  { name: "Vijayapura", crop: "Grapes", cat: "cash", price: 3600, chg: 2.1, col: 6, row: 0 },
  { name: "Bagalkote", crop: "Sugarcane & Limes", cat: "cash", price: 3350, chg: 0.8, col: 6, row: 1 },
  { name: "Raichur", crop: "Paddy (Rice Bowl)", cat: "cereal", price: 2180, chg: -0.3, col: 8, row: 2 },
  { name: "Koppal", crop: "Cotton & Sunflower", cat: "cash", price: 7300, chg: 1.5, col: 7, row: 3 },

  { name: "Belagavi", crop: "Sugarcane", cat: "cash", price: 3300, chg: 0.5, col: 4, row: 1 },
  { name: "Dharwad", crop: "Cotton & Chili", cat: "cash", price: 7450, chg: -1.1, col: 5, row: 2 },
  { name: "Gadag", crop: "Cotton & Chili", cat: "cash", price: 7400, chg: 0.9, col: 6, row: 2 },
  { name: "Ballari", crop: "Cotton & Paddy", cat: "cash", price: 7280, chg: 0.2, col: 7, row: 2.9 },
  { name: "Vijayanagara", crop: "Cotton & Paddy", cat: "cash", price: 7260, chg: 0.3, col: 8, row: 3.5 },

  { name: "Uttara Kannada", crop: "Areca nut & Spices", cat: "cash", price: 46500, chg: 1.8, col: 3, row: 3 },
  { name: "Haveri", crop: "Maize & Cotton", cat: "cereal", price: 2160, chg: 0.6, col: 5, row: 3.4 },
  { name: "Davanagere", crop: "Maize", cat: "cereal", price: 2140, chg: -0.4, col: 6, row: 4 },
  { name: "Chitradurga", crop: "Groundnut & Onion", cat: "pulse", price: 6150, chg: 1.0, col: 7, row: 4.4 },

  { name: "Udupi", crop: "Coconut & Areca nut", cat: "cash", price: 44800, chg: 0.7, col: 2.5, row: 4.3 },
  { name: "Shivamogga", crop: "Areca nut & Paddy", cat: "cash", price: 45200, chg: 1.1, col: 4, row: 4.3 },
  { name: "Chikkamagaluru", crop: "Coffee", cat: "cash", price: 19500, chg: 2.4, col: 5, row: 4.7 },
  { name: "Tumakuru", crop: "Coconut & Groundnut", cat: "horti", price: 6050, chg: 0.5, col: 7, row: 5.1 },
  { name: "Kolar", crop: "Mulberry (Silk) & Tomato", cat: "horti", price: 3800, chg: -0.8, col: 8.3, row: 5 },
  { name: "Chikkaballapura", crop: "Grapes & Mulberry", cat: "horti", price: 3700, chg: 1.3, col: 7.7, row: 4.5 },

  { name: "Dakshina Kannada", crop: "Areca nut & Cashew", cat: "cash", price: 45900, chg: 0.9, col: 2.5, row: 5.4 },
  { name: "Hassan", crop: "Coffee & Potato", cat: "cash", price: 19100, chg: -0.5, col: 4.3, row: 5.6 },
  { name: "Mandya", crop: "Sugarcane", cat: "cash", price: 3280, chg: 0.4, col: 5.6, row: 6 },
  { name: "Bengaluru Rural", crop: "Mulberry & Vegetables", cat: "horti", price: 3650, chg: 0.6, col: 7, row: 5.9 },
  { name: "Bengaluru Urban", crop: "Vegetables & Flowers", cat: "horti", price: 2800, chg: 1.7, col: 8, row: 5.9 },

  { name: "Kodagu", crop: "Coffee & Pepper", cat: "cash", price: 20200, chg: 1.9, col: 3.2, row: 6.4 },
  { name: "Mysuru", crop: "Sugarcane & Tobacco", cat: "cash", price: 3400, chg: 0.3, col: 4.8, row: 6.7 },
  { name: "Ramanagara", crop: "Mulberry / Silk City", cat: "horti", price: 3900, chg: -0.2, col: 6.3, row: 6.6 },

  { name: "Chamarajanagara", crop: "Turmeric & Cotton", cat: "cash", price: 14800, chg: 2.0, col: 4.6, row: 7.3 }
];

const catColor = { cereal: "#2D5A37", cash: "#D99B26", pulse: "#8C6B2E", horti: "#1F3A44" };

const cropEmojis = {
  paddy: "🌾",
  rice: "🌾",
  coffee: "☕",
  sugarcane: "🎋",
  areca: "🌰",
  cotton: "☁️",
  grapes: "🍇",
  soybean: "🫘",
  maize: "🌽",
  groundnut: "🥜",
  coconut: "🥥",
  tomato: "🍅",
  mulberry: "🍃",
  turmeric: "🫚",
  vegetables: "🥦",
  flowers: "🌸",
  tur: "🫘",
  chili: "🌶️",
  cashew: "🥜",
  pepper: "🫛",
  potato: "🥔",
  tobacco: "🍂",
  spices: "🌶️",
  onion: "🧅"
};

function getCropEmoji(cropText) {
  const lower = cropText.toLowerCase();
  for (const [key, emoji] of Object.entries(cropEmojis)) {
    if (lower.includes(key)) return emoji;
  }
  return "🌱";
}

const seedProducts = districts.map(d => {
  return {
    name: `${d.crop} (${d.name})`,
    crop: d.crop,
    district: d.name,
    emoji: getCropEmoji(d.crop),
    brand: `${d.name} FPO`,
    unit: "per quintal",
    price: d.price
  };
});

const stocks = [
  { name: "KaveriAgro Seeds", ticker: "KAVAGR", price: 1284.50, chg: 1.8 },
  { name: "MalnadSeeds Corp", ticker: "MLNSD", price: 642.10, chg: -0.9 },
  { name: "DeccanHybrid Ltd", ticker: "DCNHYB", price: 2103.75, chg: 2.4 },
  { name: "TungabhadraAgro", ticker: "TNGBAG", price: 398.20, chg: -0.3 },
  { name: "Malenadu CropChem", ticker: "MLNCC", price: 875.60, chg: 0.6 },
  { name: "Bayaluseeme Agritech", ticker: "BYLSAG", price: 1560.90, chg: 3.1 }
];

/* ============ TICKER ============ */
function buildTicker() {
  const el = document.getElementById('ticker');
  const items = stocks.map(s => {
    const up = s.chg >= 0;
    return `<span>${s.ticker} <span class="mono">₹${s.price.toFixed(2)}</span> <span class="${up ? 'tk-up' : 'tk-down'}">${up ? '▲' : '▼'} ${Math.abs(s.chg)}%</span></span>`;
  }).join("");
  el.innerHTML = items + items;
}

/* ============ PREDICTION ============ */
function populateDistrictSelect() {
  const sel = document.getElementById('sel-district');
  districts.slice().sort((a, b) => a.name.localeCompare(b.name)).forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.name; opt.textContent = d.name;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', (e) => {
    updateClimateDashboard(e.target.value);
  });
}

function runPrediction() {
  const distName = document.getElementById('sel-district').value;
  const season = document.getElementById('sel-season').value;
  const soil = document.getElementById('sel-soil').value;
  const rain = document.getElementById('sel-rain').value;
  const d = districts.find(x => x.name === distName);
  if (!d) return;

  let confidence = 72;
  const seasonBoost = { kharif: 8, rabi: 4, summer: 2 };
  const soilBoost = { "black-cotton": 6, "red-loamy": 5, "alluvial": 4, "laterite": 3, "sandy": 2 };
  const rainBoost = { high: 5, medium: 3, low: 1 };
  confidence += (seasonBoost[season] || 0) + (soilBoost[soil] || 0) + (rainBoost[rain] || 0);
  confidence = Math.min(confidence, 96);

  const altPool = districts.filter(x => x.cat === d.cat && x.name !== d.name).slice(0, 3).map(x => x.crop);

  const box = document.getElementById('predict-result');
  box.classList.add('loading-state');

  const waitMsg1 = currentLang === 'en' ? "Analyzing soil profile..." : "ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ ಮಾಡಲಾಗುತ್ತಿದೆ...";
  const waitMsg2 = currentLang === 'en' ? "Simulating precipitation metrics..." : "ಮಳೆ ಅಳತೆಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...";
  const waitMsg3 = currentLang === 'en' ? "Evaluating historical yields..." : "ಹಳೆಯ ಇಳುವರಿ ಮಾಹಿತಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...";

  box.innerHTML = `
    <div class="spinner-container">
      <div class="spinner-ring"></div>
      <div class="spinner-text" id="spinner-text">${waitMsg1}</div>
    </div>
  `;

  // Dynamic loading text updates
  setTimeout(() => {
    const textEl = document.getElementById('spinner-text');
    if (textEl) textEl.textContent = waitMsg2;
  }, 500);

  setTimeout(() => {
    const textEl = document.getElementById('spinner-text');
    if (textEl) textEl.textContent = waitMsg3;
  }, 1000);

  setTimeout(() => {
    box.classList.remove('loading-state');
    box.style.opacity = '0';
    box.style.transform = 'translateY(15px)';

    const displayCrop = t(d.crop);
    const displaySeason = t(season);
    const displaySoil = t(soil);
    const displayRain = t(rain);
    const displayAlts = altPool.length ? altPool.map(c => t(c)).join(", ") : "—";

    // Render result
    box.innerHTML = `
      <span class="eyebrow" style="color:var(--turmeric); background:rgba(217,155,38,0.15); border:none;">${currentLang === 'en' ? 'Recommended for' : 'ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಳೆ:'} ${d.name}</span>
      <div class="crop-name">${displayCrop}</div>
      <div style="font-size:0.88rem; color:rgba(250,248,245,0.75);">${currentLang === 'en' ? 'Season' : 'ಹಂಗಾಮು'}: ${displaySeason} · ${currentLang === 'en' ? 'Soil' : 'ಮಣ್ಣು'}: ${displaySoil} · ${currentLang === 'en' ? 'Rainfall' : 'ಮಳೆ'}: ${displayRain}</div>
      <div class="confidence-bar"><div class="confidence-fill" id="conf-fill" style="width:0%;"></div></div>
      <div style="font-size:0.82rem; color:rgba(250,248,245,0.7);"><span id="conf-pct" class="mono">0</span>% ${currentLang === 'en' ? 'fit to selected conditions' : 'ಆಯ್ಕೆ ಮಾಡಿದ ಪರಿಸ್ಥಿತಿಗೆ ಸೂಕ್ತವಾಗಿದೆ'}</div>
      <div class="alt-crops">${currentLang === 'en' ? 'Other crops common in similar districts' : 'ಇದೇ ರೀತಿಯ ಇತರ ಬೆಳೆಗಳು'}: ${displayAlts}</div>
    `;

    // Trigger result fade-in
    requestAnimationFrame(() => {
      box.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      box.style.opacity = '1';
      box.style.transform = 'translateY(0)';

      // Animate progress bar fill
      setTimeout(() => {
        const fillEl = document.getElementById('conf-fill');
        if (fillEl) fillEl.style.width = `${confidence}%`;
      }, 50);

      // Animate percent count-up
      let count = 0;
      const target = confidence;
      const counterEl = document.getElementById('conf-pct');
      if (counterEl) {
        const interval = setInterval(() => {
          if (count >= target) {
            counterEl.textContent = target;
            clearInterval(interval);
          } else {
            count += Math.ceil((target - count) / 6) || 1;
            counterEl.textContent = count;
          }
        }, 25);
      }
      savePredictionToDB(distName, season, soil, rain, d.crop, confidence);
    });
  }, 1500);
}

function updateClimateDashboard(districtName) {
  const dist = districts.find(d => d.name === districtName);
  const container = document.getElementById('predict-dashboard');
  if (!container || !dist) return;

  const idx = districts.indexOf(dist);
  const seed = (idx * 31 + districtName.length) % 100;

  const moisture = 35 + (seed % 51);
  const dasharray = 213.6;
  const dashoffset = dasharray - (moisture / 100) * dasharray;

  let region = "South Interior";
  if (dist.row <= 3) region = "North Interior";
  else if (dist.col <= 1) region = "Coastal";

  let monsoonText = "On Track";
  let monsoonColor = "hsl(140, 50%, 42%)";
  if (seed % 3 === 0) {
    monsoonText = "Delayed (~4d)";
    monsoonColor = "var(--chili)";
  } else if (seed % 5 === 0) {
    monsoonText = "Ahead (~2d)";
    monsoonColor = "var(--turmeric)";
  }

  const isDark = document.body.classList.contains('dark-theme');
  if (isDark) {
    if (monsoonColor === "hsl(140, 50%, 42%)") monsoonColor = "hsl(140, 65%, 65%)";
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const startDay = new Date().getDay();

  let forecastHTML = "";
  const iconsPool = ["cloud-rain", "cloud-lightning", "cloud-sun", "cloud", "sun"];
  const tempsPool = [24, 26, 28, 30, 32];

  for (let i = 1; i <= 5; i++) {
    const dayIndex = (startDay + i) % 7;
    const dayName = weekDays[dayIndex];

    const wSeed = (seed + i * 17) % 5;
    const icon = iconsPool[wSeed];
    const temp = tempsPool[(seed + i) % 5] + (wSeed % 3) - 1;

    let iconColor = "var(--ink)";
    if (icon === "sun") iconColor = "var(--turmeric)";
    else if (icon === "cloud-rain" || icon === "cloud-lightning") iconColor = "#5DADE2";
    else if (icon === "cloud-sun") iconColor = "#F5B041";

    forecastHTML += `
      <div class="forecast-day-card" style="flex:1; background:var(--surface-card); border:1px solid var(--line); border-radius:var(--radius-sm); padding:10px 4px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:6px;">
        <span style="font-size:0.72rem; font-weight:600; opacity:0.7; color:var(--ink);">${dayName}</span>
        <i data-lucide="${icon}" style="width:16px; height:16px; color:${iconColor};"></i>
        <span style="font-family:'IBM Plex Mono',monospace; font-size:0.8rem; font-weight:700; color:var(--ink);">${temp}°C</span>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="dashboard-content reveal reveal-visible" style="width:100%;">
      <span class="eyebrow" style="color:var(--turmeric); background:rgba(217,155,38,0.15); border:none; margin-bottom:12px;">Climate &amp; Soil</span>
      <h3 style="font-size:1.2rem; font-family:'Inter',sans-serif; font-weight:700; margin-bottom:20px; color:var(--ink);">${districtName} Sowing Window</h3>
      
      <div class="soil-gauge-row" style="display:flex; align-items:center; gap:20px; margin-bottom:24px;">
        <div class="gauge-container" style="position:relative; width:80px; height:80px; flex-shrink:0;">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="var(--line-strong)" stroke-width="6"></circle>
            <circle cx="40" cy="40" r="34" fill="none" stroke="var(--field)" stroke-width="6" 
                    stroke-dasharray="213.6" stroke-dashoffset="${dashoffset}" 
                    stroke-linecap="round" style="transform: rotate(-90deg); transform-origin: 50% 50%; transition: stroke-dashoffset 0.8s ease;"></circle>
          </svg>
          <div class="gauge-value" style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-family:'IBM Plex Mono',monospace; font-weight:700; font-size:1.1rem; color:var(--ink);">${moisture}%</div>
        </div>
        <div>
          <div style="font-weight:700; font-size:0.9rem; color:var(--ink);">Soil Moisture Index</div>
          <div style="font-size:0.78rem; color:var(--ink); opacity:0.65; margin-top:2px; line-height:1.3;">Kharif root-zone saturation profile</div>
        </div>
      </div>

      <div class="weather-forecast" style="margin-bottom:24px;">
        <div style="font-weight:700; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--ink); opacity:0.6; margin-bottom:12px;">5-Day Outlook</div>
        <div class="forecast-days" style="display:flex; justify-content:space-between; gap:8px;">
          ${forecastHTML}
        </div>
      </div>

      <div class="monsoon-status" style="border-top:1px solid var(--line); padding-top:16px;">
        <div style="font-weight:700; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--ink); opacity:0.6; margin-bottom:8px;">Monsoon Timeline</div>
        <div style="display:flex; justify-content:space-between; font-size:0.82rem;">
          <span style="color:var(--ink);">Region: ${region} Karnataka</span>
          <span style="color:${monsoonColor}; font-weight:700;">${monsoonText}</span>
        </div>
      </div>
    </div>
  `;

  lucide.createIcons();
}

/* ============ ARBITRAGE CALCULATOR ============ */
function getCommodityPrice(dist, commodity) {
  const basePrices = {
    "Paddy": 2100,
    "Maize": 2150,
    "Cotton": 7300,
    "Sugarcane": 3300,
    "Groundnut": 6100,
    "Tur Dal": 7000,
    "Grapes": 3600,
    "Coffee": 19500
  };

  const base = basePrices[commodity] || 2000;

  // Use a pseudo-random hash based on district name to create stable, realistic price variations
  let hash = 0;
  for (let i = 0; i < dist.name.length; i++) {
    hash = dist.name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const percentChange = (Math.abs(hash) % 15) / 100 * (hash < 0 ? -1 : 1);
  return Math.round(base * (1 + percentChange));
}

function populateArbitrageDropdowns() {
  const cropSel = document.getElementById('arb-crop');
  const baseSel = document.getElementById('arb-base');
  if (!cropSel || !baseSel) return;

  cropSel.innerHTML = "";
  baseSel.innerHTML = "";

  const commodities = [
    "Paddy",
    "Maize",
    "Cotton",
    "Sugarcane",
    "Groundnut",
    "Tur Dal",
    "Grapes",
    "Coffee"
  ];

  commodities.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = t(c);
    cropSel.appendChild(opt);
  });

  districts.slice().sort((a, b) => a.name.localeCompare(b.name)).forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.name; opt.textContent = d.name;
    baseSel.appendChild(opt);
  });
}

function calculateArbitrage() {
  const crop = document.getElementById('arb-crop').value;
  const qty = parseFloat(document.getElementById('arb-qty').value) || 0;
  const baseName = document.getElementById('arb-base').value;
  const resultsDiv = document.getElementById('arb-results');

  const dBase = districts.find(d => d.name === baseName);
  if (!dBase || qty <= 0) return;

  const basePrice = getCommodityPrice(dBase, crop);

  // Calculate logistics arbitrage across all other 30 districts
  const options = [];
  districts.forEach(d => {
    if (d.name === baseName) return;

    const dx = d.col - dBase.col;
    const dy = d.row - dBase.row;
    const distanceKm = Math.round(Math.sqrt(dx * dx + dy * dy) * 35); // 35 km per grid unit
    const transportRate = 1.2; // ₹1.20 per quintal per km (volume freight discount)
    const unitTransportCost = Math.round(distanceKm * transportRate);
    const totalTransportCost = unitTransportCost * qty;

    const targetPrice = getCommodityPrice(d, crop);
    const baseRevenue = basePrice * qty;
    const targetRevenue = targetPrice * qty;
    const netProfit = targetRevenue - baseRevenue - totalTransportCost;

    options.push({
      district: d.name,
      price: targetPrice,
      distance: distanceKm,
      unitTransportCost: unitTransportCost,
      totalTransportCost: totalTransportCost,
      netProfit: netProfit
    });
  });

  // Sort by net profit descending
  options.sort((a, b) => b.netProfit - a.netProfit);

  resultsDiv.style.display = 'block';

  if (options.length === 0 || options[0].netProfit <= 0) {
    resultsDiv.innerHTML = `
      <div style="padding: 16px; background: rgba(255,255,255,0.04); border-radius: var(--radius-sm); border: 1px solid var(--line); text-align: center; color: var(--ink);">
        <i data-lucide="info" style="width: 24px; height: 24px; margin: 0 auto 8px; display: block; opacity: 0.6;"></i>
        <div style="font-weight: 700; font-size: 0.95rem;">${currentLang === 'en' ? 'No Profit Arbitrage Found' : 'ಹೆಚ್ಚುವರಿ ಲಾಭದ ಅವಕಾಶಗಳಿಲ್ಲ'}</div>
        <p style="font-size: 0.8rem; opacity: 0.7; margin-top: 4px;">${currentLang === 'en' ? 'Selling locally is the most profitable choice for this crop after factoring in logistics.' : 'ಸಾರಿಗೆ ವೆಚ್ಚಗಳನ್ನು ಪರಿಗಣಿಸಿದರೆ, ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆಯಲ್ಲೇ ಮಾರಾಟ ಮಾಡುವುದು ಅತ್ಯಂತ ಲಾಭದಾಯಕವಾಗಿದೆ.'}</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  const best = options[0];

  let optionsHTML = options.slice(1, 6).map(opt => { // Show top 5 alternative markets
    const isProfitable = opt.netProfit > 0;
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; border-bottom:1px solid var(--line); font-size:0.8rem; color:var(--ink);">
        <div>
          <div style="font-weight:600;">${opt.district} APMC</div>
          <div style="opacity:0.6; font-size:0.75rem;">${currentLang === 'en' ? 'Mandi Rate' : 'ಮಾರುಕಟ್ಟೆ ದರ'}: ₹${opt.price.toLocaleString('en-IN')}/q | ${opt.distance} km</div>
        </div>
        <div style="text-align:right;">
          <div style="font-weight:700; color:${isProfitable ? '#6FD088' : '#FF8A80'};">${isProfitable ? '+' : ''}₹${Math.round(opt.netProfit).toLocaleString('en-IN')}</div>
          <div style="opacity:0.5; font-size:0.72rem;">${currentLang === 'en' ? 'shipping' : 'ಸಾರಿಗೆ'}: ₹${Math.round(opt.totalTransportCost).toLocaleString('en-IN')}</div>
        </div>
      </div>
    `;
  }).join("");

  resultsDiv.innerHTML = `
    <div class="arbitrage-dashboard" style="display:grid; grid-template-columns:1.2fr 1fr; gap:28px;">
      <div style="background:rgba(217, 155, 38, 0.08); border:1.5px dashed var(--turmeric); border-radius:var(--radius-sm); padding:20px; color:var(--ink);">
        <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; letter-spacing:0.05em; opacity:0.7; color:var(--turmeric);">${t('best-destination')}</div>
        <div style="font-size:1.6rem; font-weight:800; margin-top:4px;">${best.district} APMC</div>
        <div style="font-size:0.85rem; opacity:0.8; margin-top:2px;">${currentLang === 'en' ? 'Target Mandi Price' : 'ಗುರಿ ಮಾರುಕಟ್ಟೆ ದರ'}: <strong>₹${best.price.toLocaleString('en-IN')}</strong> / quintal</div>
        
        <div style="margin-top:20px; display:grid; grid-template-columns:1fr 1fr; gap:16px; border-top:1px solid rgba(217, 155, 38, 0.2); padding-top:16px; font-size:0.8rem;">
          <div>
            <div style="opacity:0.65;">${t('est-distance')}</div>
            <div style="font-weight:700; font-size:1rem;">${best.distance} km</div>
          </div>
          <div>
            <div style="opacity:0.65;">${t('transport-cost')}</div>
            <div style="font-weight:700; font-size:1rem;">₹${Math.round(best.totalTransportCost).toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="font-size:0.75rem; text-transform:uppercase; font-weight:700; opacity:0.6; margin-bottom:8px; color:var(--ink);">${t('net-profit-boost')}</div>
          <div style="font-size:2.2rem; font-weight:800; color:#6FD088; font-family:'IBM Plex Mono',monospace;">+₹${Math.round(best.netProfit).toLocaleString('en-IN')}</div>
          <div style="font-size:0.78rem; opacity:0.65; margin-top:4px; color:var(--ink);">${currentLang === 'en' ? 'Extra profit generated after transport logistics costs.' : 'ಸಾರಿಗೆ ಮತ್ತು ಲೋಡಿಂಗ್ ವೆಚ್ಚ ಕಳೆದು ಸಿಗುವ ಹೆಚ್ಚುವರಿ ನಿವ್ವಳ ಲಾಭ.'}</div>
        </div>
        
        <button class="btn btn-ghost" style="margin-top:16px; width:100%; justify-content:center;" onclick="toggleArbitrageMarkets()">${currentLang === 'en' ? 'Show Alternative Markets' : 'ಇತರ ಮಾರುಕಟ್ಟೆಗಳನ್ನು ತೋರಿಸಿ'}</button>
      </div>
    </div>
    
    <div id="arb-alternatives" style="display:none; margin-top:24px; border-top:1px solid var(--line); padding-top:16px;">
      <h4 style="font-size:0.8rem; text-transform:uppercase; opacity:0.6; margin-bottom:12px; color:var(--ink);">${currentLang === 'en' ? 'Alternative APMC Destinations' : 'ಇತರ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆಗಳು'}</h4>
      ${optionsHTML || `<div style="font-size:0.75rem; opacity:0.5; text-align:center; padding:12px;">${currentLang === 'en' ? 'No other markets trade this crop.' : 'ಬೇರೆ ಯಾವುದೇ ಮಾರುಕಟ್ಟೆಗಳಲ್ಲಿ ಈ ಬೆಳೆ ಇಲ್ಲ.'}</div>`}
    </div>
  `;

  lucide.createIcons();
}

function toggleArbitrageMarkets() {
  const alt = document.getElementById('arb-alternatives');
  if (alt) {
    const hidden = alt.style.display === 'none';
    alt.style.display = hidden ? 'block' : 'none';
  }
}

/* ============ MAP ============ */
function buildMap() {
  const svg = document.getElementById('ka-map');
  svg.innerHTML = ""; // Clear existing blocks

  const nameToCode = {
    "Bidar": "BID", "Kalaburagi": "GUL", "Yadgir": "YAD", "Vijayapura": "BIJ",
    "Belagavi": "BEL", "Uttara Kannada": "UTT", "Shivamogga": "SHI", "Udupi": "UDU",
    "Dakshina Kannada": "DAK", "Kodagu": "KOD", "Mysuru": "MYS", "Chamarajanagara": "CHA",
    "Mandya": "MAN", "Ramanagara": "RAM", "Bengaluru Urban": "BUR", "Bengaluru Rural": "BRU",
    "Kolar": "KOL", "Chikkaballapura": "CHI", "Tumakuru": "TUM", "Chitradurga": "CHD",
    "Davanagere": "DAV", "Vijayanagara": "VIJ", "Ballari": "BAL", "Raichur": "RAI",
    "Koppal": "KOP", "Gadag": "GAD", "Dharwad": "DHR", "Bagalkote": "BAG",
    "Hassan": "HAS", "Chikkamagaluru": "CHK", "Haveri": "HAV"
  };

  districts.forEach(d => {
    const code = nameToCode[d.name];
    const pathD = drawPath[code];
    if (!pathD) return;

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "district-cell");
    g.setAttribute("data-name", d.name);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathD);
    path.setAttribute("fill", catColor[d.cat]);
    path.setAttribute("fill-opacity", "0.85");
    path.setAttribute("stroke", "var(--paper)");
    path.setAttribute("stroke-width", "2.5");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("vector-effect", "non-scaling-stroke");

    // Native browser tooltip fallback
    const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = `${d.name} (${d.crop})`;
    path.appendChild(title);

    g.appendChild(path);

    g.addEventListener('mouseenter', () => showDistrict(d));
    g.addEventListener('click', () => showDistrict(d, true));
    svg.appendChild(g);
  });
}

function showDistrict(d, pin) {
  document.querySelectorAll('.district-cell').forEach(el => {
    el.classList.toggle('active', el.dataset.name === d.name);
  });
  const info = document.getElementById('map-info');

  if (pin) {
    // 1. Sync to Crop recommendation form & dashboard
    const selDist = document.getElementById('sel-district');
    if (selDist) {
      selDist.value = d.name;
      updateClimateDashboard(d.name);
    }

    // 2. Sync to Mandi Arbitrage Calculator base district
    const arbBase = document.getElementById('arb-base');
    if (arbBase) {
      arbBase.value = d.name;
      const arbQty = document.getElementById('arb-qty');
      if (arbQty && (!arbQty.value || parseFloat(arbQty.value) <= 0)) {
        arbQty.value = 50; // default quantity to show immediate results
      }
      calculateArbitrage();
    }
  }

  // Transition fade out
  info.style.opacity = '0';
  info.style.transform = 'translateY(8px)';

  setTimeout(() => {
    info.innerHTML = `
      <span class="eyebrow" style="color:var(--turmeric); background:rgba(217,155,38,0.15); border:none;">${t('district-detail')}</span>
      <div class="dist-name">${d.name}</div>
      <span class="crop-tag">${t(d.crop)}</span>
      <div class="stat-row"><span>${t('indicative-price')}</span><span class="mono">₹${d.price.toLocaleString('en-IN')}</span></div>
      <div class="stat-row"><span>${t('7-day-trend')}</span><span class="mono" style="color:${d.chg >= 0 ? '#6FD088' : '#FF8A80'};">${d.chg >= 0 ? '▲' : '▼'} ${Math.abs(d.chg)}%</span></div>
    `;

    // Transition fade in
    requestAnimationFrame(() => {
      info.style.transition = 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      info.style.opacity = '1';
      info.style.transform = 'translateY(0)';
    });
  }, 120);
}

/* ============ MANDI TABLE ============ */
function renderMandi(list) {
  const body = document.getElementById('mandi-body');
  body.innerHTML = list.map(d => `
    <tr>
      <td style="font-weight:600;">${d.name}</td>
      <td>${t(d.crop)}</td>
      <td class="price-cell">₹${d.price.toLocaleString('en-IN')}</td>
      <td class="${d.chg >= 0 ? 'chg-up' : 'chg-down'}">${d.chg >= 0 ? '▲' : '▼'} ${Math.abs(d.chg)}%</td>
    </tr>
  `).join("");
}

function refreshMandi() {
  const q = document.getElementById('mandi-search').value.toLowerCase();
  const sort = document.getElementById('mandi-sort').value;
  let list = districts.filter(d => {
    const nameMatch = d.name.toLowerCase().includes(q);
    const engCropMatch = d.crop.toLowerCase().includes(q);
    const knCropMatch = t(d.crop).toLowerCase().includes(q);
    return nameMatch || engCropMatch || knCropMatch;
  });
  if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
  if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
  renderMandi(list);
}

/* ============ MARKETPLACE ============ */
const seedMultipliers = districts.map(d => {
  let seedsPerAcre = 10;
  let yieldPerAcre = 15;
  let seedPrice = 120;
  let unit = "kg";

  if (d.cat === 'cereal') {
    seedsPerAcre = 25;
    yieldPerAcre = 20;
    seedPrice = 80;
  } else if (d.cat === 'pulse') {
    seedsPerAcre = 15;
    yieldPerAcre = 12;
    seedPrice = 125;
  } else if (d.cat === 'horti') {
    seedsPerAcre = 2;
    yieldPerAcre = 15;
    seedPrice = 350;
    unit = "kg";
  } else { // cash
    seedsPerAcre = 8;
    yieldPerAcre = 14;
    seedPrice = 180;
  }

  // Special overrides
  const lower = d.crop.toLowerCase();
  if (lower.includes("sugarcane")) {
    seedsPerAcre = 100;
    yieldPerAcre = 350;
    seedPrice = 15;
  } else if (lower.includes("coffee")) {
    seedsPerAcre = 5;
    yieldPerAcre = 8;
    seedPrice = 240;
  } else if (lower.includes("areca")) {
    seedsPerAcre = 4;
    yieldPerAcre = 12;
    seedPrice = 450;
  } else if (lower.includes("coconut")) {
    seedsPerAcre = 60;
    yieldPerAcre = 75;
    seedPrice = 75;
    unit = "units";
  }

  return {
    seeds: seedsPerAcre,
    yield: yieldPerAcre,
    seedPrice: seedPrice,
    price: d.price,
    unit: unit
  };
});

function buildSeedGrid() {
  const grid = document.getElementById('seed-grid');
  grid.innerHTML = seedProducts.map((s, i) => {
    const localizedName = `${t(s.crop)} (${t(s.district)})`;
    return `
    <div class="seed-card" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div style="display: flex; gap: 16px;">
        <div class="seed-swatch">${s.emoji}</div>
        <div class="seed-body" style="flex: 1;">
          <h3 style="font-size:1.02rem; font-weight:700; margin-bottom:4px;">${localizedName}</h3>
          <div class="seed-meta">${s.brand} · ${t(s.unit)}</div>
          <div class="seed-price-row" style="margin-top:10px; display: flex; flex-direction: column; align-items: flex-start; gap: 8px;">
            <span class="seed-price">₹${s.price}</span>
            <button class="btn-small" onclick="addToCart(${i}, this)" style="display: inline-flex; align-items: center; gap: 6px; width: 100%; justify-content: center;">
              <i data-lucide="shopping-cart" style="width: 14px; height: 14px;"></i>
              <span>${currentLang === 'en' ? 'CART' : 'ಕಾರ್ಟ್'}</span>
            </button>
          </div>
        </div>
      </div>
      
      <button class="btn-calc-toggle" onclick="toggleYieldSim(${i})" style="margin-top: 14px; width: 100%; border: 1px solid var(--line); background: transparent; color: var(--ink); border-radius: var(--radius-sm); padding: 8px 12px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer;">
        <i data-lucide="sprout" style="width: 14px; height: 14px;"></i>
        <span>${currentLang === 'en' ? 'Estimate Sowing Yield' : 'ಇಳುವರಿ ಅಂದಾಜು ಲೆಕ್ಕ'}</span>
      </button>

      <div id="yield-sim-${i}" style="display: none; margin-top: 16px; border-top: 1px dashed var(--line); padding-top: 16px;">
        <div class="field-row" style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 600; color: var(--ink); margin-bottom: 6px;">
            <span>${t('land-size')}</span>
            <span class="mono" style="color: var(--turmeric);"><span id="acres-val-${i}">5</span> ${t('acres')}</span>
          </div>
          <input type="range" id="acres-slider-${i}" min="1" max="25" value="5" oninput="updateYieldSim(${i})" style="width: 100%; accent-color: var(--turmeric); cursor: pointer;">
        </div>

        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--line); border-radius: var(--radius-sm); padding: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; font-size: 0.75rem; color: var(--ink);">
          <div>
            <div style="opacity: 0.65;">${t('seed-qty')}</div>
            <div style="font-weight: 700;" id="qty-val-${i}">50 kg</div>
          </div>
          <div>
            <div style="opacity: 0.65;">${t('sowing-cost')}</div>
            <div style="font-weight: 700; color: var(--chili);" id="cost-val-${i}">₹2,100</div>
          </div>
          <div style="grid-column: span 2; border-top: 1px solid var(--line); padding-top: 8px;"></div>
          <div>
            <div style="opacity: 0.65;">${t('exp-yield')}</div>
            <div style="font-weight: 700;" id="yield-val-${i}">80 quintals</div>
          </div>
          <div>
            <div style="opacity: 0.65;">${t('proj-revenue')}</div>
            <div style="font-weight: 700; color: #6FD088;" id="rev-val-${i}">₹17,600</div>
          </div>
        </div>
      </div>
    </div>`;
  }).join("");
  lucide.createIcons();
}

function toggleYieldSim(idx) {
  const panel = document.getElementById(`yield-sim-${idx}`);
  if (panel) {
    const isHidden = panel.style.display === 'none';
    if (isHidden) {
      // Collapse all other yield simulation panels
      document.querySelectorAll('[id^="yield-sim-"]').forEach(p => {
        p.style.display = 'none';
      });
      panel.style.display = 'block';
      updateYieldSim(idx);
    } else {
      panel.style.display = 'none';
    }
  }
}

function updateYieldSim(idx) {
  const slider = document.getElementById(`acres-slider-${idx}`);
  const acresVal = document.getElementById(`acres-val-${idx}`);
  const qtyVal = document.getElementById(`qty-val-${idx}`);
  const costVal = document.getElementById(`cost-val-${idx}`);
  const yieldVal = document.getElementById(`yield-val-${idx}`);
  const revVal = document.getElementById(`rev-val-${idx}`);

  if (!slider) return;

  const acres = parseFloat(slider.value);
  acresVal.textContent = acres;

  const mult = seedMultipliers[idx];
  const seedProduct = seedProducts[idx];

  const qty = acres * mult.seeds;
  const seedCost = qty * (mult.seedPrice || seedProduct.price);
  const expYield = acres * mult.yield;
  const revenue = expYield * mult.price;

  const qtyUnit = currentLang === 'en' ? mult.unit : (mult.unit === 'packets' ? 'ಪ್ಯಾಕೆಟ್' : (mult.unit === 'units' ? 'ಘಟಕ' : 'ಕೆಜಿ'));
  qtyVal.textContent = `${qty} ${qtyUnit}`;
  costVal.textContent = `₹${seedCost.toLocaleString('en-IN')}`;

  const yieldUnit = currentLang === 'en' ? 'quintals' : 'ಕ್ವಿಂಟಾಲ್';
  yieldVal.textContent = `${expYield} ${yieldUnit}`;
  revVal.textContent = `₹${revenue.toLocaleString('en-IN')}`;
}

/* ============ CART ============ */
let cart = [];

function addToCart(idx, btnEl) {
  const s = seedProducts[idx];
  const existing = cart.find(c => c.name === s.name);
  if (existing) { existing.qty += 1; } else { cart.push({ name: s.name, price: s.price, unit: s.unit, qty: 1 }); }
  renderCart();

  if (btnEl) {
    const original = btnEl.innerHTML;
    btnEl.innerHTML = currentLang === 'en' ? "Added ✓" : "ಸೇರಿಸಲಾಗಿದೆ ✓";
    setTimeout(() => { btnEl.innerHTML = original; }, 1200);

    // Fly-to-cart particle animation
    try {
      const startRect = btnEl.getBoundingClientRect();
      const cartBtn = document.querySelector('.nav-actions button:last-child') || document.querySelector('.icon-btn');
      if (cartBtn) {
        const endRect = cartBtn.getBoundingClientRect();

        // Spawn flying emoji at button center
        const flyer = document.createElement('div');
        flyer.className = 'flying-emoji';
        flyer.textContent = s.emoji || "🌱";
        flyer.style.left = `${window.scrollX + startRect.left + startRect.width / 2 - 16}px`;
        flyer.style.top = `${window.scrollY + startRect.top + startRect.height / 2 - 16}px`;
        // Use absolute positioning relative to body (incorporate scroll)
        flyer.style.position = 'absolute';
        document.body.appendChild(flyer);

        // Reflow
        flyer.offsetHeight;

        // Target translations relative to start coordinate
        const dx = endRect.left + endRect.width / 2 - (startRect.left + startRect.width / 2);
        const dy = endRect.top + endRect.height / 2 - (startRect.top + startRect.height / 2);

        flyer.style.transform = `translate(${dx}px, ${dy}px) scale(0.2) rotate(360deg)`;
        flyer.style.opacity = '0.1';

        setTimeout(() => {
          flyer.remove();
          // Bounce cart button
          cartBtn.classList.add('wobble-active');
          setTimeout(() => cartBtn.classList.remove('wobble-active'), 600);
        }, 850);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Slide open the cart drawer with a delay so user sees the flying animation finish
  setTimeout(() => {
    openCart();
  }, 950);
}

function removeFromCart(name) {
  cart = cart.filter(c => c.name !== name);
  renderCart();
}

function renderCart() {
  const itemsEl = document.getElementById('cart-items');
  const countEl = document.getElementById('cart-count');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalQty = cart.reduce((sum, c) => sum + c.qty, 0);
  countEl.textContent = totalQty;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty">Your cart is empty.<br>Add crops from the marketplace below.</div>`;
  } else {
    itemsEl.innerHTML = cart.map(c => `
      <div class="cart-line">
        <div>
          <div class="cart-line-name">${c.name}</div>
          <div class="cart-line-meta">${c.unit} · qty ${c.qty}</div>
          <button class="cart-remove" onclick="removeFromCart('${c.name}')">Remove</button>
        </div>
        <div class="cart-line-price">₹${(c.price * c.qty).toLocaleString('en-IN')}</div>
      </div>
    `).join("");
  }
  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
}

function openCart() {
  const overlay = document.getElementById('drawer-overlay');
  const drawer = document.getElementById('cart-drawer');
  overlay.style.display = 'block';
  overlay.offsetHeight; // force reflow
  overlay.classList.add('open');
  drawer.classList.add('open');

  // Hide chatbot FAB and open drawer
  const chatbotFab = document.querySelector('.chatbot-fab');
  const chatbotDrawer = document.getElementById('chat-drawer');
  const fabIcon = document.getElementById('chat-fab-icon');
  if (chatbotFab) chatbotFab.style.display = 'none';
  if (chatbotDrawer) chatbotDrawer.style.display = 'none';
  if (fabIcon) {
    fabIcon.setAttribute('data-lucide', 'message-square');
    lucide.createIcons();
  }

}

function closeCart() {
  const overlay = document.getElementById('drawer-overlay');
  const drawer = document.getElementById('cart-drawer');
  overlay.classList.remove('open');
  drawer.classList.remove('open');
  setTimeout(() => {
    if (!overlay.classList.contains('open')) {
      overlay.style.display = 'none';
    }
  }, 500);

  // Restore chatbot FAB
  const chatbotFab = document.querySelector('.chatbot-fab');
  if (chatbotFab) chatbotFab.style.display = 'flex';
}

/* ============ AUTH MODAL ============ */
let authMode = 'login';
let authRole = 'farmer';

function openAuth() {
  const overlay = document.getElementById('auth-overlay');
  overlay.style.display = 'flex';
  overlay.offsetHeight; // force reflow
  overlay.classList.add('open');
}
function closeAuth() {
  const overlay = document.getElementById('auth-overlay');
  overlay.classList.remove('open');
  setTimeout(() => {
    if (!overlay.classList.contains('open')) {
      overlay.style.display = 'none';
    }
  }, 400);
}

function switchAuthTab(mode) {
  authMode = mode;
  document.getElementById('tab-login').classList.toggle('active', mode === 'login');
  document.getElementById('tab-signup').classList.toggle('active', mode === 'signup');
  document.getElementById('auth-name-field').style.display = mode === 'signup' ? 'block' : 'none';
  document.getElementById('auth-submit-btn').textContent = mode === 'signup' ? 'Create account' : 'Log in';
}

function switchRole(role) {
  authRole = role;
  document.getElementById('role-farmer').classList.toggle('active', role === 'farmer');
  document.getElementById('role-buyer').classList.toggle('active', role === 'buyer');
  const roleAdmin = document.getElementById('role-admin');
  if (roleAdmin) {
    roleAdmin.classList.toggle('active', role === 'admin');
  }
}

/* ============ AUTH / DATABASE SERVICES ============ */
function checkAuthStatus() {
  if (isBackendActive) {
    const token = localStorage.getItem('bhoomi_token');
    currentUser = JSON.parse(localStorage.getItem('bhoomi_user') || 'null');
    if (token && currentUser) {
      updateAuthUI();
      loadUserHistory();
    } else {
      currentUser = null;
      localStorage.removeItem('bhoomi_user');
      localStorage.removeItem('bhoomi_token');
      updateAuthUI();
    }
  } else if (supabaseClient) {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) {
        currentUser = {
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata.full_name || '',
          role: (session.user.email.toLowerCase().includes('admin')) ? 'admin' : (session.user.user_metadata.role || 'farmer')
        };
        localStorage.setItem('bhoomi_user', JSON.stringify(currentUser));
        localStorage.setItem('bhoomi_token', session.access_token);
        updateAuthUI();
        loadUserHistory();
      } else {
        currentUser = null;
        localStorage.removeItem('bhoomi_user');
        localStorage.removeItem('bhoomi_token');
        updateAuthUI();
      }
    });
  } else {
    updateAuthUI();
    if (currentUser) {
      loadUserHistory();
    }
  }
}

function updateAuthUI() {
  const navBtnText = document.getElementById('nav-auth-text');
  const histPanel = document.getElementById('predict-history');
  const adminPanel = document.getElementById('admin-panel');

  if (currentUser && currentUser.role === 'admin') {
    if (!window.location.pathname.includes('admin.html')) {
      window.location.href = 'admin.html';
      return;
    }
  }

  if (!navBtnText) return;

  if (currentUser) {
    navBtnText.textContent = currentUser.email.split('@')[0].toUpperCase() + " (Sign out)";
    navBtnText.removeAttribute('data-key');
    if (histPanel) histPanel.style.display = 'block';

    // Show Admin Panel if user is admin
    if (adminPanel) {
      if (currentUser.role === 'admin') {
        adminPanel.style.display = 'block';
        loadAdminOrders();
      } else {
        adminPanel.style.display = 'none';
      }
    }
  } else {
    navBtnText.textContent = currentLang === 'en' ? 'Sign in' : 'ಲಾಗಿನ್';
    navBtnText.setAttribute('data-key', 'nav-signin');
    if (histPanel) histPanel.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'none';
  }
}

function handleAuthAction() {
  if (currentUser) {
    // Sign out
    if (isBackendActive) {
      fetch(`${backendUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bhoomi_token')}`
        }
      }).catch(err => console.error("Backend logout error:", err));

      currentUser = null;
      localStorage.removeItem('bhoomi_user');
      localStorage.removeItem('bhoomi_token');
      updateAuthUI();
      const body = document.getElementById('history-body');
      if (body) body.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:24px; opacity:0.6;" data-key="history-empty">${t('history-empty')}</td></tr>`;
    } else if (supabaseClient) {
      supabaseClient.auth.signOut().then(() => {
        currentUser = null;
        localStorage.removeItem('bhoomi_user');
        localStorage.removeItem('bhoomi_token');
        updateAuthUI();
        const body = document.getElementById('history-body');
        if (body) body.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:24px; opacity:0.6;" data-key="history-empty">${t('history-empty')}</td></tr>`;
      });
    } else {
      currentUser = null;
      localStorage.removeItem('bhoomi_user');
      localStorage.removeItem('bhoomi_token');
      updateAuthUI();
      const body = document.getElementById('history-body');
      if (body) body.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:24px; opacity:0.6;" data-key="history-empty">${t('history-empty')}</td></tr>`;
    }
  } else {
    openAuth();
  }
}

async function signInWithGoogle() {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      alert("Google login failed: " + err.message);
    }
  } else {
    // Mock login fallback
    currentUser = {
      id: 'mock-google-id-' + Date.now(),
      email: 'farmer.google@gmail.com',
      full_name: 'Google Demo User',
      role: 'farmer'
    };
    localStorage.setItem('bhoomi_user', JSON.stringify(currentUser));
    updateAuthUI();
    loadUserHistory();
    closeAuth();
    alert("Logged in with Mock Google Account!");
  }
}

async function submitAuth() {
  const email = document.getElementById('auth-email-field').value.trim();
  const password = document.getElementById('auth-password-field').value.trim();
  const name = document.getElementById('auth-name-field').value.trim();
  const msg = document.getElementById('auth-msg');

  if (!email || !password) return;

  msg.textContent = currentLang === 'en' ? "Processing..." : "ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...";

  if (isBackendActive) {
    try {
      const endpoint = authMode === 'signup' ? '/auth/signup' : '/auth/login';
      const bodyData = authMode === 'signup' 
        ? { email, password, name, role: authRole }
        : { email, password };

      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Authentication failed');
      }

      const session = result.data.session;
      const user = result.data.user;

      if (session) {
        localStorage.setItem('bhoomi_token', session.access_token);
        currentUser = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata.full_name || '',
          role: (user.email.toLowerCase().includes('admin')) ? 'admin' : (user.user_metadata.role || 'farmer')
        };
        localStorage.setItem('bhoomi_user', JSON.stringify(currentUser));
        updateAuthUI();
        loadUserHistory();
        msg.textContent = currentLang === 'en' ? "Welcome!" : "ಸ್ವಾಗತ!";
        setTimeout(closeAuth, 1000);
      } else {
        msg.textContent = currentLang === 'en' ? "Sign up success! Check email for confirmation link." : "ಖಾತೆ ರಚನೆಯಾಗಿದೆ! ದಯವಿಟ್ಟು ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ.";
        setTimeout(closeAuth, 2000);
      }
    } catch (err) {
      msg.textContent = `Error: ${err.message}`;
    }
  } else if (supabaseClient) {
    try {
      if (authMode === 'signup') {
        const { data, error } = await supabaseClient.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              full_name: name,
              role: authRole
            }
          }
        });
        if (error) throw error;

        if (data && data.user) {
          if (data.session) {
            currentUser = {
              id: data.user.id,
              email: data.user.email,
              full_name: data.user.user_metadata.full_name || '',
              role: (data.user.email.toLowerCase().includes('admin')) ? 'admin' : (data.user.user_metadata.role || 'farmer')
            };
            localStorage.setItem('bhoomi_user', JSON.stringify(currentUser));
            localStorage.setItem('bhoomi_token', data.session.access_token);
            updateAuthUI();
            loadUserHistory();
            msg.textContent = currentLang === 'en' ? "Sign up success! Logged in." : "ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ!";
          } else {
            msg.textContent = currentLang === 'en' ? "Sign up success! Check email for confirmation link." : "ಖಾತೆ ರಚನೆಯಾಗಿದೆ! ದಯವಿಟ್ಟು ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ.";
          }
        }
        setTimeout(closeAuth, 2000);
      } else {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password
        });
        if (error) throw error;

        currentUser = {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata.full_name || '',
          role: (data.user.email.toLowerCase().includes('admin')) ? 'admin' : (data.user.user_metadata.role || 'farmer')
        };
        localStorage.setItem('bhoomi_user', JSON.stringify(currentUser));
        localStorage.setItem('bhoomi_token', data.session.access_token);
        updateAuthUI();
        loadUserHistory();
        msg.textContent = currentLang === 'en' ? "Welcome back!" : "ಸ್ವಾಗತ!";
        setTimeout(closeAuth, 1000);
      }
    } catch (err) {
      msg.textContent = `Error: ${err.message}`;
    }
  } else {
    // Mock authentication using localStorage
    if (authMode === 'signup') {
      const mockUsers = JSON.parse(localStorage.getItem('bhoomi_mock_users') || '[]');
      if (mockUsers.some(u => u.email === email)) {
        msg.textContent = currentLang === 'en' ? "Email already exists (Mock Database)" : "ಈ ಇಮೇಲ್ ಈಗಾಗಲೇ ಅಸ್ತಿತ್ವದಲ್ಲಿದೆ (ಮಾಕ್ ಡೇಟಾಬೇಸ್)";
        return;
      }
      mockUsers.push({ email, password, name, role: authRole });
      localStorage.setItem('bhoomi_mock_users', JSON.stringify(mockUsers));
      msg.textContent = currentLang === 'en' ? "Sign up success (Mock Database)!" : "ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ರಚನೆಯಾಗಿದೆ (ಮಾಕ್ ಡೇಟಾಬೇಸ್)!";
      setTimeout(closeAuth, 1200);
    } else {
      const mockUsers = JSON.parse(localStorage.getItem('bhoomi_mock_users') || '[]');
      const user = mockUsers.find(u => u.email === email && u.password === password);
      if (user) {
        currentUser = { id: 'mock-uuid-' + Date.now(), email: user.email, full_name: user.name, role: (user.email.toLowerCase().includes('admin')) ? 'admin' : user.role };
        localStorage.setItem('bhoomi_user', JSON.stringify(currentUser));
        updateAuthUI();
        loadUserHistory();
        msg.textContent = currentLang === 'en' ? "Welcome (Mock Database)!" : "ಸ್ವಾಗತ (ಮಾಕ್ ಡೇಟಾಬೇಸ್)!";
        setTimeout(closeAuth, 1000);
      } else {
        msg.textContent = currentLang === 'en' ? "Invalid credentials (Mock Database)" : "ತಪ್ಪು ವಿವರಗಳು (ಮಾಕ್ ಡೇಟಾಬೇಸ್)";
      }
    }
  }
}

async function savePredictionToDB(district, season, soil, rain, crop, confidence) {
  if (!currentUser) return;

  const record = {
    district,
    season,
    soil,
    rain,
    crop,
    confidence
  };

  if (isBackendActive) {
    try {
      const token = localStorage.getItem('bhoomi_token');
      const response = await fetch(`${backendUrl}/predictions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(record)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to save prediction');
    } catch (err) {
      console.error("Backend database save error:", err);
    }
  } else if (supabaseClient) {
    try {
      const { error } = await supabaseClient
        .from('predictions')
        .insert([{ ...record, user_id: currentUser.id }]);
      if (error) throw error;
    } catch (err) {
      console.error("Database save error:", err);
    }
  }

  // Save locally to history
  const key = `bhoomi_history_${currentUser.email}`;
  const history = JSON.parse(localStorage.getItem(key) || '[]');
  const recordWithTime = { ...record, created_at: new Date().toISOString() };
  history.unshift(recordWithTime);
  localStorage.setItem(key, JSON.stringify(history));

  // Save globally for mock admin predictions log
  const allMockPredictions = JSON.parse(localStorage.getItem('bhoomi_all_mock_predictions') || '[]');
  allMockPredictions.unshift({
    ...record,
    user_email: currentUser ? currentUser.email : 'Guest',
    user_id: currentUser ? currentUser.id : 'mock-user-id',
    created_at: new Date().toISOString()
  });
  localStorage.setItem('bhoomi_all_mock_predictions', JSON.stringify(allMockPredictions));

  loadUserHistory();
}

async function loadUserHistory() {
  if (!currentUser) return;

  const body = document.getElementById('history-body');
  if (!body) return;

  body.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:24px; opacity:0.6;">${t('history-loading')}</td></tr>`;

  let logs = [];

  if (isBackendActive) {
    try {
      const token = localStorage.getItem('bhoomi_token');
      const response = await fetch(`${backendUrl}/predictions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to fetch predictions');
      logs = result.data;
    } catch (err) {
      console.error("Backend database fetch error, using local storage cache:", err);
      const key = `bhoomi_history_${currentUser.email}`;
      logs = JSON.parse(localStorage.getItem(key) || '[]');
    }
  } else if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('predictions')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      logs = data;
    } catch (err) {
      console.error("Database fetch error, using local storage cache:", err);
      const key = `bhoomi_history_${currentUser.email}`;
      logs = JSON.parse(localStorage.getItem(key) || '[]');
    }
  } else {
    const key = `bhoomi_history_${currentUser.email}`;
    logs = JSON.parse(localStorage.getItem(key) || '[]');
  }

  if (logs.length === 0) {
    body.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:24px; opacity:0.6;" data-key="history-no-records">${t('history-no-records')}</td></tr>`;
    return;
  }

  body.innerHTML = logs.map(log => `
        <tr>
          <td style="font-weight:600;">${log.district}</td>
          <td>${t(log.season)}</td>
          <td>${t(log.soil)}</td>
          <td>${t(log.rain)}</td>
          <td style="color:var(--turmeric); font-weight:700;">${t(log.crop)}</td>
          <td class="price-cell" style="text-align:right; color:#6FD088;">${log.confidence}% Match</td>
        </tr>
      `).join("");
}

/* ============ PAYMENT SYSTEM ============ */
let qrTimerInterval = null;
let selectedBankName = '';

function openPayment() {
  if (cart.length === 0) {
    alert(currentLang === 'en' ? 'Your cart is empty!' : 'ನಿಮ್ಮ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ!');
    return;
  }

  if (!currentUser) {
    alert(currentLang === 'en' ? 'Please sign in to place an order.' : 'ಆರ್ಡರ್ ಮಾಡಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ.');
    openAuth();
    return;
  }

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const formatted = `₹${subtotal.toLocaleString('en-IN')}`;
  
  document.getElementById('upi-total').textContent = formatted;
  document.getElementById('qr-total').textContent = formatted;
  document.getElementById('net-total').textContent = formatted;
  const codTotalEl = document.getElementById('cod-total');
  if (codTotalEl) codTotalEl.textContent = formatted;

  // Reset inputs
  document.getElementById('upi-id-input').value = '';
  document.getElementById('upi-pay-btn').disabled = true;
  document.getElementById('other-banks-select').value = '';
  
  // Reset bank cards selection
  const cards = document.querySelectorAll('.bank-card');
  cards.forEach(c => c.classList.remove('selected'));
  document.getElementById('net-pay-btn').disabled = true;
  selectedBankName = '';

  // Hide overlay status views
  const statusOverlay = document.getElementById('payment-status-overlay');
  statusOverlay.style.display = 'none';
  statusOverlay.classList.remove('open');
  document.getElementById('payment-status-loading').style.display = 'flex';
  document.getElementById('payment-status-success').style.display = 'none';

  // Default tab
  switchPaymentTab('upi');

  // Open Payment Overlay
  const overlay = document.getElementById('payment-overlay');
  overlay.style.display = 'flex';
  overlay.offsetHeight; // force reflow
  overlay.classList.add('open');

  // Load Lucide Icons inside modal
  if (window.lucide) {
    lucide.createIcons();
  }
}

function closePayment() {
  const overlay = document.getElementById('payment-overlay');
  overlay.classList.remove('open');
  setTimeout(() => {
    if (!overlay.classList.contains('open')) {
      overlay.style.display = 'none';
    }
  }, 400);
  
  if (qrTimerInterval) {
    clearInterval(qrTimerInterval);
    qrTimerInterval = null;
  }
}

function switchPaymentTab(tabName) {
  const tabs = ['upi', 'qr', 'net', 'cod'];
  tabs.forEach(t => {
    const tabBtn = document.getElementById(`tab-pay-${t}`);
    const panel = document.getElementById(`panel-pay-${t}`);
    if (tabBtn) tabBtn.classList.toggle('active', t === tabName);
    if (panel) panel.classList.toggle('active', t === tabName);
  });

  if (qrTimerInterval) {
    clearInterval(qrTimerInterval);
    qrTimerInterval = null;
  }

  if (tabName === 'qr') {
    startQrTimer();
  }
}

function startQrTimer() {
  let timeLeft = 300; // 5 mins
  const timerEl = document.getElementById('qr-timer');
  if (!timerEl) return;

  function updateTimer() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    timerEl.style.color = timeLeft < 60 ? 'var(--chili)' : 'var(--ink)';
  }

  updateTimer();

  qrTimerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(qrTimerInterval);
      qrTimerInterval = null;
      timerEl.textContent = "EXPIRED";
      timerEl.style.color = 'var(--chili)';
    } else {
      updateTimer();
    }
  }, 1000);
}

function validateUpiInput() {
  const input = document.getElementById('upi-id-input');
  const btn = document.getElementById('upi-pay-btn');
  if (!input || !btn) return;
  
  const val = input.value.trim();
  // Validates standard format containing @ with characters on both sides
  const isValid = val.includes('@') && val.split('@')[0].length >= 2 && val.split('@')[1].length >= 2;
  btn.disabled = !isValid;
}

function selectBank(bankId) {
  const cards = document.querySelectorAll('.bank-card');
  cards.forEach(c => c.classList.remove('selected'));
  
  const selectedCard = document.getElementById(`bank-${bankId.toLowerCase()}`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
  }

  // Reset dropdown selection
  document.getElementById('other-banks-select').value = '';
  
  selectedBankName = bankId;
  document.getElementById('net-pay-btn').disabled = false;
}

function selectBankDropdown(selectEl) {
  const cards = document.querySelectorAll('.bank-card');
  cards.forEach(c => c.classList.remove('selected'));

  if (selectEl.value === '') {
    selectedBankName = '';
    document.getElementById('net-pay-btn').disabled = true;
  } else {
    selectedBankName = selectEl.value;
    document.getElementById('net-pay-btn').disabled = false;
  }
}

async function processPayment(method) {
  // Clear any active timer
  if (qrTimerInterval) {
    clearInterval(qrTimerInterval);
    qrTimerInterval = null;
  }

  const statusOverlay = document.getElementById('payment-status-overlay');
  const loadingContent = document.getElementById('payment-status-loading');
  const successContent = document.getElementById('payment-status-success');

  statusOverlay.style.display = 'flex';
  statusOverlay.offsetHeight; // force reflow
  statusOverlay.classList.add('open');
  loadingContent.style.display = 'flex';
  successContent.style.display = 'none';

  // Simulate verification delay (1.5 seconds)
  setTimeout(async () => {
    loadingContent.style.display = 'none';
    successContent.style.display = 'flex';

    // Log order in Database
    const payment_method = method.toUpperCase();
    const payment_details = method === 'upi' ? document.getElementById('upi-id-input').value.trim() : (method === 'net' ? selectedBankName : (method === 'cod' ? 'CASH_ON_DELIVERY' : 'QR_CODE'));
    
    const itemsWithMeta = [
      ...cart.map(item => ({ name: item.name, price: item.price, qty: item.qty, unit: item.unit })),
      {
        isMetadata: true,
        email: currentUser ? currentUser.email : 'Guest',
        payment_method,
        payment_details
      }
    ];

    const order = {
      items: itemsWithMeta,
      subtotal: cart.reduce((sum, c) => sum + c.price * c.qty, 0)
    };

    // Always dispatch order to Node.js backend & Google Sheets Webhook
    let backendSuccess = false;
    try {
      const token = localStorage.getItem('bhoomi_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token && token !== 'null' && token !== 'undefined') {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`${backendUrl}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(order)
      });
      if (res && res.ok) backendSuccess = true;
    } catch (err) {
      console.log("Backend order post attempt:", err);
    }

    // Direct Browser Fallback to Google Sheets if local Node backend was not reachable
    if (!backendSuccess && typeof googleSheetsWebhookUrl !== 'undefined' && googleSheetsWebhookUrl) {
      try {
        const cropItems = cart.map(i => `${i.name} (x${i.qty || 1})`).join(', ');
        const payload = {
          action: 'create',
          orderId: 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
          date: new Date().toLocaleString('en-IN'),
          userEmail: currentUser ? currentUser.email : 'Guest',
          items: cropItems || 'N/A',
          subtotal: order.subtotal,
          paymentMethod: payment_method || 'COD',
          paymentDetails: payment_details || 'N/A',
          status: 'Pending'
        };
        fetch(googleSheetsWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(e => console.error("Direct Google Sheets Sync Warning:", e));
      } catch (err) {
        console.error("Direct Google Sheets Sync Error:", err);
      }
    }

    // Save order locally for local mock lookup
    const key = `bhoomi_orders_${currentUser ? currentUser.email : 'guest'}`;
    const orders = JSON.parse(localStorage.getItem(key) || '[]');
    orders.unshift({ ...order, created_at: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(orders));

    // Save order globally for mock admin lookup
    const allMockOrders = JSON.parse(localStorage.getItem('bhoomi_all_mock_orders') || '[]');
    allMockOrders.unshift({ 
      id: 'MOCK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      items: itemsWithMeta, 
      subtotal: order.subtotal,
      user_id: currentUser ? currentUser.id : 'mock-user-id', 
      user_email: currentUser ? currentUser.email : 'Guest', 
      created_at: new Date().toISOString() 
    });
    localStorage.setItem('bhoomi_all_mock_orders', JSON.stringify(allMockOrders));

    // Clear cart and close drawer
    cart = [];
    renderCart();

    // After showing the success tick animation for 3 seconds, close modals
    setTimeout(() => {
      closePayment();
      closeCart();
    }, 3000);

  }, 1500);
}

/* ============ STOCKS ============ */
function sparklinePath(seed) {
  let v = 50, pts = [];
  let s = seed;
  for (let i = 0; i < 20; i++) {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    v += (r - 0.5) * 14;
    v = Math.max(10, Math.min(90, v));
    pts.push(v);
  }
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${i * (200 / 19)},${40 - (p / 100 * 36)}`).join(" ");
}

function buildStockGrid() {
  const grid = document.getElementById('stock-grid');
  grid.innerHTML = stocks.map((s, i) => {
    const up = s.chg >= 0;
    const pathData = sparklinePath(i * 17 + 3);
    return `
    <div class="stock-card">
      <div class="stock-top">
        <div><div class="stock-name">${s.name}</div><div class="stock-ticker">${s.ticker}</div></div>
      </div>
      <div class="stock-price">₹${s.price.toFixed(2)}</div>
      <div class="stock-change" style="color:${up ? '#6FD088' : '#FF8A80'};">${up ? '▲' : '▼'} ${Math.abs(s.chg)}% today</div>
      <svg class="spark" viewBox="0 0 200 40" preserveAspectRatio="none">
        <path class="spark-path" d="${pathData}" fill="none" stroke="${up ? '#6FD088' : '#FF8A80'}" stroke-width="2.5"/>
      </svg>
    </div>`;
  }).join("");
}
/* ============ DYNAMIC INTRODUCTIONS & HELPER FUNCTIONS ============ */

// Scroll Reveal Observer
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        // If it's a stock section, let's also trigger stock sparkline animations
        if (entry.target.classList.contains('stock-grid')) {
          entry.target.classList.add('spark-card-visible');
        }
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// Scroll Progress Tracker
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;
  window.addEventListener('scroll', () => {
    const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (windowScroll / height) * 100 : 0;
    progressBar.style.width = scrolled + '%';
  });
}

// Theme Toggle logic
function initTheme() {
  const isDark = localStorage.getItem('theme') === 'dark';
  if (isDark) {
    document.body.classList.add('dark-theme');
  }
}

function toggleTheme() {
  const body = document.body;
  body.classList.toggle('dark-theme');
  const isDark = body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

/* ============ INIT ============ */
initTheme();
if (currentLang === 'kn') {
  document.getElementById('lang-btn-text').textContent = 'English';
}
updatePageTranslations();
lucide.createIcons();
buildTicker();
populateDistrictSelect();
updateClimateDashboard(document.getElementById('sel-district').value);
populateArbitrageDropdowns();
buildMap();
renderMandi(districts.slice().sort((a, b) => a.name.localeCompare(b.name)));
buildSeedGrid();
buildStockGrid();
initScrollReveal();
initScrollProgress();
checkBackendStatus();
document.getElementById('mandi-search').addEventListener('input', refreshMandi);
document.getElementById('mandi-sort').addEventListener('change', refreshMandi);



/* ============ BHOOMI SAATHI CHATBOT ============ */
const botRepliesEn = {
  paddy: "🌾 For Paddy (Rice), the ideal sowing window in Karnataka is during the Kharif season (June to July) as it requires ample monsoon rain. For Rabi Paddy, sow between November and December.",
  tomato: "🍅 Tomato leaf curl virus and fruit borers are common pests. Use Neem oil sprays, maintain crop rotation, and install yellow sticky traps to control whiteflies naturally.",
  soil: "🪨 Black cotton soil holds moisture exceptionally well. It is ideal for growing Cotton, Soybean, Chickpea (Bengaluru Gram), and Wheat.",
  mandi: "📊 Today's highest market price in Karnataka is for Coffee & Pepper in Kodagu (₹20,200/q), followed by Turmeric & Cotton in Chamarajanagara (₹14,800/q). Check the Mandi section for local detail!",
  default: "🌱 Thank you for asking! I can help you with crop sowing calendars, organic pest remedies, soil compatibility, and market price trends. Try one of the quick chips below!"
};

const botRepliesKn = {
  paddy: "🌾 ಭತ್ತದ ಬಿತ್ತನೆಗೆ ಜೂನ್ ಮತ್ತು ಜುಲೈ ತಿಂಗಳುಗಳು (ಮುಂಗಾರು ಹಂಗಾಮು) ಅತ್ಯಂತ ಸೂಕ್ತವಾಗಿದೆ. ಹಿಂಗಾರು ಭತ್ತಕ್ಕೆ ನವೆಂಬರ್‌ನಿಂದ ಡಿಸೆಂಬರ್ ನಡುವೆ ಬಿತ್ತನೆ ಮಾಡಿ.",
  tomato: "🍅 ಟೊಮೆಟೊ ಎಲೆ ಮುರುಟು ರೋಗ ಮತ್ತು ಕಾಯಿ ಕೊರಕ ಜೀರುಂಡೆಗಳು ಸಾಮಾನ್ಯ ಕೀಟಗಳಾಗಿವೆ. ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪಡಿಸಿ ಮತ್ತು ಹಳದಿ ಬಣ್ಣದ ಅಂಟು ಪಟ್ಟಿಗಳನ್ನು ಬಳಸಿ ಕೀಟ ನಿಯಂತ್ರಣ ಮಾಡಿ.",
  soil: "🪨 ಕಪ್ಪು ಹತ್ತಿ ಮಣ್ಣು ಹೆಚ್ಚಿನ ತೇವಾಂಶವನ್ನು ಹಿಡಿದಿಟ್ಟುಕೊಳ್ಳುತ್ತದೆ. ಇದು ಹತ್ತಿ, ಸೋಯಾಬೀನ್, ಕಡಲೆ ಮತ್ತು ಗೋಧಿ ಬೆಳೆಯಲು ಅತ್ಯಂತ ಉತ್ತಮವಾಗಿದೆ.",
  mandi: "📊 ಇಂದಿನ ಗರಿಷ್ಠ ಮಾರುಕಟ್ಟೆ ದರ ಕೊಡಗಿನಲ್ಲಿ ಕಾಫಿ ಮತ್ತು ಮೆಣಸಿಗೆ (ಕ್ವಿಂಟಾಲ್‌ಗೆ ₹20,200) ದಾಖಲಾಗಿದೆ. ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ಮಂಡಿ ದರಗಳ ಪಟ್ಟಿಯನ್ನು ಪರಿಶೀಲಿಸಿ!",
  default: "🌱 ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಧನ್ಯವಾದಗಳು! ಬೆಳೆ ಬಿತ್ತನೆ ಮಾಹಿತಿ, ಕೀಟ ನಿಯಂತ್ರಣ ಕ್ರಮಗಳು ಮತ್ತು ಮಾರುಕಟ್ಟೆ ದರಗಳ ಬಗ್ಗೆ ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ಕೆಳಗಿನ ಚಿಪ್ಸ್ ಒತ್ತಿ ನೋಡಿ!"
};

function toggleChat() {
  const drawer = document.getElementById('chat-drawer');
  const fabIcon = document.getElementById('chat-fab-icon');
  if (!drawer) return;

  const isOpen = drawer.style.display === 'flex';
  if (isOpen) {
    drawer.style.display = 'none';
    fabIcon.setAttribute('data-lucide', 'message-square');
  } else {
    drawer.style.display = 'flex';
    fabIcon.setAttribute('data-lucide', 'x');
    const log = document.getElementById('chat-log');
    log.scrollTop = log.scrollHeight;
    document.getElementById('chat-input').focus();
  }
  lucide.createIcons();
}

function sendChatMessage(textOverride) {
  const input = document.getElementById('chat-input');
  const log = document.getElementById('chat-log');
  if (!input || !log) return;

  const text = (textOverride || input.value).trim();
  if (!text) return;

  if (!textOverride) {
    input.value = "";
  }

  // Append User message
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.textContent = text;
  log.appendChild(userBubble);
  log.scrollTop = log.scrollHeight;

  // Append Typing indicator
  const typeBubble = document.createElement('div');
  typeBubble.className = 'chat-bubble bot typing-bubble';
  typeBubble.innerHTML = `
    <div class="chat-typing">
      <div class="chat-type-dot"></div>
      <div class="chat-type-dot"></div>
      <div class="chat-type-dot"></div>
    </div>
  `;
  log.appendChild(typeBubble);
  log.scrollTop = log.scrollHeight;

  // Simulate delay
  setTimeout(async () => {
    // Remove typing bubble
    const currentTyping = log.querySelector('.typing-bubble');
    if (currentTyping) {
      currentTyping.remove();
    }

    let replyText = "";
    if (isBackendActive) {
      try {
        const response = await fetch(`${backendUrl}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, lang: currentLang })
        });
        const result = await response.json();
        replyText = result.reply || "Error getting reply from server.";
      } catch (err) {
        console.error("Backend chatbot error, falling back:", err);
        // Fallback local logic
        const query = text.toLowerCase();
        let replyKey = 'default';
        if (query.includes('paddy') || query.includes('rice') || query.includes('ಭತ್ತ') || query.includes('ಅಕ್ಕಿ')) {
          replyKey = 'paddy';
        } else if (query.includes('tomato') || query.includes('pest') || query.includes('disease') || query.includes('ಟೊಮೆಟೊ') || query.includes('ಕೀಟ')) {
          replyKey = 'tomato';
        } else if (query.includes('soil') || query.includes('black') || query.includes('ಮಣ್ಣು') || query.includes('ಕಪ್ಪು')) {
          replyKey = 'soil';
        } else if (query.includes('mandi') || query.includes('rate') || query.includes('price') || query.includes('ಮಾರುಕಟ್ಟೆ') || query.includes('ದರ')) {
          replyKey = 'mandi';
        }
        replyText = currentLang === 'en' ? botRepliesEn[replyKey] : botRepliesKn[replyKey];
      }
    } else {
      // Determine response locally
      const query = text.toLowerCase();
      let replyKey = 'default';
      if (query.includes('paddy') || query.includes('rice') || query.includes('ಭತ್ತ') || query.includes('ಅಕ್ಕಿ')) {
        replyKey = 'paddy';
      } else if (query.includes('tomato') || query.includes('pest') || query.includes('disease') || query.includes('ಟೊಮೆಟೊ') || query.includes('ಕೀಟ')) {
        replyKey = 'tomato';
      } else if (query.includes('soil') || query.includes('black') || query.includes('ಮಣ್ಣು') || query.includes('ಕಪ್ಪು')) {
        replyKey = 'soil';
      } else if (query.includes('mandi') || query.includes('rate') || query.includes('price') || query.includes('ಮಾರುಕಟ್ಟೆ') || query.includes('ದರ')) {
        replyKey = 'mandi';
      }
      replyText = currentLang === 'en' ? botRepliesEn[replyKey] : botRepliesKn[replyKey];
    }

    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot';
    botBubble.textContent = replyText;
    log.appendChild(botBubble);
    log.scrollTop = log.scrollHeight;
  }, 1200);
}

function askChatbotQuestion(index) {
  const chips = [
    currentLang === 'en' ? "When is the best time to sow Paddy?" : "ಭತ್ತ ಬಿತ್ತನೆಗೆ ಅತ್ಯಂತ ಸೂಕ್ತ ಸಮಯ ಯಾವುದು?",
    currentLang === 'en' ? "How do I control Tomato pests?" : "ಟೊಮೆಟೊ ಕೀಟಗಳನ್ನು ನಿಯಂತ್ರಿಸುವುದು ಹೇಗೆ?",
    currentLang === 'en' ? "Which crops grow best in black soil?" : "ಕಪ್ಪು ಮಣ್ಣಿನಲ್ಲಿ ಯಾವ ಬೆಳೆಗಳು ಚೆನ್ನಾಗಿ ಬೆಳೆಯುತ್ತವೆ?",
    currentLang === 'en' ? "Show me today's top Mandi rates." : "ಇಂದಿನ ಪ್ರಮುಖ ಮಾರುಕಟ್ಟೆ ದರಗಳನ್ನು ತೋರಿಸಿ."
  ];
  sendChatMessage(chips[index]);
}

function showToast(titleKey, textKey, durationMs = 5000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast toast-warning';

  const title = (translations[currentLang] && translations[currentLang][titleKey]) || titleKey;
  const text = (translations[currentLang] && translations[currentLang][textKey]) || textKey;

  toast.innerHTML = `
        <div class="toast-icon">
          <i data-lucide="cloud-rain" style="width: 18px; height: 18px;"></i>
        </div>
        <div class="toast-content">
          <div class="toast-title" data-key="${titleKey}">${title}</div>
          <div class="toast-text" data-key="${textKey}">${text}</div>
        </div>
        <button class="toast-close" aria-label="Close Notification">
          <i data-lucide="x" style="width: 14px; height: 14px;"></i>
        </button>
        <div class="toast-progress" style="animation-duration: ${durationMs}ms;"></div>
      `;

  // Close button handler
  toast.querySelector('.toast-close').addEventListener('click', () => {
    dismissToast(toast);
  });

  container.appendChild(toast);
  lucide.createIcons();

  // Set timeout to dismiss
  const timer = setTimeout(() => {
    dismissToast(toast);
  }, durationMs);

  // Store timer on element in case of manual dismiss
  toast.dataset.timerId = timer;
}

function dismissToast(toast) {
  if (toast.classList.contains('toast-dismissing')) return;
  toast.classList.add('toast-dismissing');
  if (toast.dataset.timerId) {
    clearTimeout(parseInt(toast.dataset.timerId));
  }
  toast.addEventListener('animationend', () => {
    toast.remove();
  });
}

/* ============ PRICING INTERACTIVE SYSTEM ============ */
let currentBillingCycle = 'monthly';

function toggleBillingCycle() {
  const btn = document.getElementById('pricing-toggle');
  const monthlyLabel = document.getElementById('billing-monthly');
  const yearlyLabel = document.getElementById('billing-yearly');
  const premiumPrice = document.getElementById('premium-price');

  if (!btn || !monthlyLabel || !yearlyLabel || !premiumPrice) return;

  if (currentBillingCycle === 'monthly') {
    currentBillingCycle = 'yearly';
    btn.classList.add('yearly-active');
    monthlyLabel.classList.remove('active');
    yearlyLabel.classList.add('active');

    // Update Premium Price (₹399/mo billed yearly)
    premiumPrice.innerHTML = `₹399<span class="billing-period">/${currentLang === 'en' ? 'month, billed yearly' : 'ತಿಂಗಳಿಗೆ, ವಾರ್ಷಿಕ ಬಿಲ್'}</span>`;
  } else {
    currentBillingCycle = 'monthly';
    btn.classList.remove('yearly-active');
    monthlyLabel.classList.add('active');
    yearlyLabel.classList.remove('active');

    // Update Premium Price back to standard ₹499
    premiumPrice.innerHTML = `₹499<span class="billing-period">/${currentLang === 'en' ? 'month' : 'ತಿಂಗಳಿಗೆ'}</span>`;
  }
}

function toggleFeaturePreview() {
  const panel = document.getElementById('feature-preview-panel');
  if (!panel) return;

  const isHidden = panel.style.display === 'none';
  if (isHidden) {
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    // Initial setup of demo variables
    updatePriceForecastDemo();
  } else {
    panel.style.display = 'none';
  }
}

function switchPreviewTab(tab) {
  const soilTab = document.getElementById('tab-btn-soil');
  const forecastTab = document.getElementById('tab-btn-forecast');
  const soilContent = document.getElementById('content-prev-soil');
  const forecastContent = document.getElementById('content-prev-forecast');

  if (!soilTab || !forecastTab || !soilContent || !forecastContent) return;

  if (tab === 'soil') {
    soilTab.classList.add('active');
    forecastTab.classList.remove('active');
    soilContent.style.display = 'block';
    forecastContent.style.display = 'none';
  } else {
    soilTab.classList.remove('active');
    forecastTab.classList.add('active');
    soilContent.style.display = 'none';
    forecastContent.style.display = 'block';
    updatePriceForecastDemo();
  }
}

function updatePriceForecastDemo() {
  const slider = document.getElementById('forecast-slider');
  const label = document.getElementById('forecast-month-label');
  const priceVal = document.getElementById('forecast-price-val');
  const pctVal = document.getElementById('forecast-pct-val');
  const node = document.getElementById('forecast-graph-node');

  if (!slider || !label || !priceVal || !pctVal) return;

  const val = parseInt(slider.value);

  // Forecast states
  const states = [
    { month: 'July (Current)', price: 7200, pct: '0%', text: 'current rate', class: 'neutral', x: 10, y: 70, dir: 'up' },
    { month: 'August (Late Monsoon)', price: 7250, pct: '+0.7%', text: 'vs current rate', class: 'up', x: 160, y: 65, dir: 'up' },
    { month: 'September (Harvest Period)', price: 7450, pct: '+3.4%', text: 'vs current rate', class: 'up', x: 310, y: 50, dir: 'up' },
    { month: 'October (Post-Harvest Peak)', price: 7700, pct: '+6.9%', text: 'vs current rate', class: 'up', x: 460, y: 30, dir: 'up' }
  ];

  const current = states[val];

  // Update label
  const localizedMonths = {
    'July (Current)': currentLang === 'en' ? 'July (Current)' : 'ಜುಲೈ (ಪ್ರಸ್ತುತ)',
    'August (Late Monsoon)': currentLang === 'en' ? 'August (Late Monsoon)' : 'ಆಗಸ್ಟ್ (ತಡ ಮುಂಗಾರು)',
    'September (Harvest Period)': currentLang === 'en' ? 'September (Harvest Period)' : 'ಸೆಪ್ಟೆಂಬರ್ (ಕೊಯ್ಲು ಸಮಯ)',
    'October (Post-Harvest Peak)': currentLang === 'en' ? 'October (Post-Harvest Peak)' : 'ಅಕ್ಟೋಬರ್ (ಕೊಯ್ಲಿನ ನಂತರದ ಗರಿಷ್ಠ)'
  };

  label.textContent = localizedMonths[current.month];
  priceVal.textContent = `₹${current.price.toLocaleString('en-IN')}`;

  const comparisonText = currentLang === 'en' ? 'vs current rate' : 'ಪ್ರಸ್ತುತ ದರಕ್ಕೆ ಹೋಲಿಸಿದರೆ';
  pctVal.innerHTML = `
        <i data-lucide="${current.dir === 'up' ? 'trending-up' : 'trending-down'}" style="width: 14px; height: 14px; margin-right: 4px;"></i>
        <span>${current.pct} ${comparisonText}</span>
      `;

  // Move SVG Graph Node tracker
  if (node) {
    node.setAttribute('cx', current.x);
    node.setAttribute('cy', current.y);
  }

  lucide.createIcons();
}

async function loadAdminOrders() {
  const body = document.getElementById('admin-orders-body');
  if (!body) return;

  body.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:32px; opacity:0.6;">Loading orders ledger...</td></tr>`;

  let orders = [];

  if (isBackendActive) {
    try {
      const token = localStorage.getItem('bhoomi_token');
      const response = await fetch(`${backendUrl}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to fetch admin orders');
      orders = result.data || [];
    } catch (err) {
      console.error("Backend admin orders fetch error, using local storage cache:", err);
      orders = JSON.parse(localStorage.getItem('bhoomi_all_mock_orders') || '[]');
    }
  } else if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      orders = data || [];
    } catch (err) {
      console.error("Database admin orders fetch error, using local storage cache:", err);
      orders = JSON.parse(localStorage.getItem('bhoomi_all_mock_orders') || '[]');
    }
  } else {
    orders = JSON.parse(localStorage.getItem('bhoomi_all_mock_orders') || '[]');
  }

  if (orders.length === 0) {
    body.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:32px; opacity:0.6;">No orders found in the system.</td></tr>`;
    return;
  }

  body.innerHTML = orders.map(order => {
    // Extract metadata from items array if it exists
    const meta = Array.isArray(order.items) ? order.items.find(i => i.isMetadata) : null;
    const email = meta ? meta.email : (order.user_email || order.user_id || 'Guest');
    const payMethod = meta ? meta.payment_method : (order.payment_method || 'N/A');
    const payDetails = meta ? meta.payment_details : (order.payment_details || 'N/A');
    
    // Filter out metadata item for listing
    const actualItems = Array.isArray(order.items) ? order.items.filter(i => !i.isMetadata) : [];
    const itemsList = actualItems.map(item => `${item.name} (${item.qty} ${item.unit || 'Bags'})`).join(', ');
      
    const dateStr = order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A';
    const orderId = order.id || 'MOCK-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const status = meta ? (meta.status || 'Pending') : 'Pending';
    const isDelivered = status === 'Delivered';

    return `
      <tr data-order-id="${orderId}">
        <td style="font-family: var(--font-mono); font-size: 0.8rem; padding: 12px; border-bottom: 1px solid var(--line);">
          <div>${orderId}</div>
          <div style="font-size: 0.75rem; opacity: 0.6; margin-top: 4px;">${dateStr}</div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid var(--line); font-weight: 500;">
          ${email}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid var(--line); max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${itemsList}">
          ${itemsList}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid var(--line); text-align: right; font-weight: 700; color: #6FD088;">
          ₹${order.subtotal}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid var(--line); font-size: 0.8rem; font-weight: 600;">
          <span style="background: rgba(111,208,136,0.15); color: #6FD088; padding: 2px 8px; border-radius: 4px;">
            ${(payMethod || 'N/A').toUpperCase()}
          </span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid var(--line); font-size: 0.8rem; font-family: var(--font-mono); opacity: 0.8;">
          ${payDetails || 'N/A'}
        </td>
        <td style="text-align: center; padding: 12px; border-bottom: 1px solid var(--line);">
          <input type="checkbox" 
                 class="status-checkbox" 
                 ${isDelivered ? 'checked' : ''} 
                 onchange="registerStatusChange('${orderId}', this.checked)"
                 style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--field);">
        </td>
      </tr>
    `;
  }).join("");

  loadedAdminOrders = orders;
  if (typeof renderAnalyticsCharts === 'function') {
    renderAnalyticsCharts(loadedAdminOrders, loadedAdminPredictions);
  }
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// Track pending changes in memory
let pendingStatusChanges = {};

function registerStatusChange(orderId, isChecked) {
  pendingStatusChanges[orderId] = isChecked;
}

// Persist all checked status changes
async function saveAllOrderStatusChanges() {
  const changeEntries = Object.entries(pendingStatusChanges);
  if (changeEntries.length === 0) {
    alert("No changes to save.");
    return;
  }

  const saveBtn = document.getElementById('save-status-btn');
  if (saveBtn) {
    saveBtn.innerHTML = `<i data-lucide="loader" class="spin" style="width:14px; height:14px; margin-right:6px; display:inline-block; animation: spin 1s linear infinite;"></i>Saving...`;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    saveBtn.disabled = true;
  }

  const promises = changeEntries.map(async ([orderId, isChecked]) => {
    const order = loadedAdminOrders.find(o => String(o.id) === String(orderId));
    if (!order) return;

    let items = Array.isArray(order.items) ? [...order.items] : [];
    let metaIdx = items.findIndex(i => i.isMetadata);
    const statusVal = isChecked ? 'Delivered' : 'Pending';

    if (metaIdx === -1) {
      items.push({
        isMetadata: true,
        email: order.user_email || 'Guest',
        payment_method: order.payment_method || 'COD',
        payment_details: order.payment_details || 'N/A',
        status: statusVal
      });
    } else {
      items[metaIdx] = {
        ...items[metaIdx],
        status: statusVal
      };
    }

    // Sync local state
    order.items = items;

    if (isBackendActive) {
      try {
        const token = localStorage.getItem('bhoomi_token');
        const response = await fetch(`${backendUrl}/orders/${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ items, subtotal: order.subtotal })
        });
        if (!response.ok) throw new Error(`Failed to update order ${orderId}`);
      } catch (err) {
        console.error("Backend status update failed, saving locally:", err);
        updateLocalMockOrderStatus(orderId, items);
      }
    } else {
      updateLocalMockOrderStatus(orderId, items);
    }
  });

  try {
    await Promise.all(promises);
    pendingStatusChanges = {};
    showSuccessPopup();
  } catch (err) {
    console.error(err);
    alert("Error saving some changes. Please check network connection.");
  } finally {
    if (saveBtn) {
      saveBtn.innerHTML = `<i data-lucide="save" style="width: 14px; height: 14px; margin-right: 6px; display: inline-block; vertical-align: -2px;"></i>Save Changes`;
      if (typeof lucide !== 'undefined') lucide.createIcons();
      saveBtn.disabled = false;
    }
    // Reload dashboard logs and recalculate KPIs
    await loadDashboardData();
  }
}

function updateLocalMockOrderStatus(orderId, items) {
  const allMockOrders = JSON.parse(localStorage.getItem('bhoomi_all_mock_orders') || '[]');
  const idx = allMockOrders.findIndex(o => String(o.id) === String(orderId));
  if (idx !== -1) {
    allMockOrders[idx].items = items;
    localStorage.setItem('bhoomi_all_mock_orders', JSON.stringify(allMockOrders));
  }
}

// Show right mark (success checkmark tick) popup overlay
function showSuccessPopup() {
  const overlay = document.getElementById('success-overlay');
  if (!overlay) return;

  const content = overlay.querySelector('.payment-status-content');
  if (content) {
    content.style.display = 'none';
  }

  overlay.style.display = 'flex';
  overlay.offsetHeight; // Force DOM reflow
  overlay.classList.add('open');

  // Delay the checkmark SVG loading slightly to trigger CSS animations cleanly
  setTimeout(() => {
    if (content) {
      content.style.display = 'flex';
      const wrapper = content.querySelector('.checkmark-wrapper');
      if (wrapper) {
        wrapper.innerHTML = `
          <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        `;
      }
    }
  }, 150);

  setTimeout(() => {
    overlay.classList.remove('open');
    overlay.style.display = 'none';
  }, 2400);
}

/* ============ USER FEEDBACK SYSTEM HANDLERS ============ */
let selectedFeedbackRating = 5;

// Highlight rating stars
function highlightStars(val) {
  const stars = document.querySelectorAll('.feedback-star');
  stars.forEach((star, idx) => {
    if (idx < val) {
      star.style.fill = 'var(--turmeric)';
      star.style.stroke = 'var(--turmeric)';
    } else {
      star.style.fill = 'none';
      star.style.stroke = 'currentColor';
    }
  });
}

// Reset stars color to selected rating
function resetStars() {
  highlightStars(selectedFeedbackRating);
}

// Set feedback rating
function setFeedbackRating(val) {
  selectedFeedbackRating = val;
  document.getElementById('feedback-rating-val').value = val;
  highlightStars(val);
}

// Initialize stars default on DOM content load
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector('.feedback-star')) {
    highlightStars(selectedFeedbackRating);
  }
});

// Submit user feedback to server
async function submitFeedback() {
  const rating = parseInt(document.getElementById('feedback-rating-val').value);
  const message = document.getElementById('feedback-message-val').value.trim();
  const email = currentUser ? currentUser.email : 'Guest';

  if (!message) return;

  const form = document.getElementById('feedback-form');
  const successMsg = document.getElementById('feedback-success-msg');

  const fbData = { rating, message, email };

  if (isBackendActive) {
    try {
      const response = await fetch(`${backendUrl}/feedbacks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fbData)
      });
      if (!response.ok) throw new Error('Feedback submission failed');
    } catch (err) {
      console.error("Backend feedback submit error, using local mock cache:", err);
      saveFeedbackLocally(fbData);
    }
  } else {
    saveFeedbackLocally(fbData);
  }

  // Hide form, show success message
  if (form) form.style.display = 'none';
  if (successMsg) {
    successMsg.style.display = 'block';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}

// Helper to save feedback locally (mock mode)
function saveFeedbackLocally(feedback) {
  const mockFeedbacks = JSON.parse(localStorage.getItem('bhoomi_all_mock_feedbacks') || '[]');
  mockFeedbacks.unshift({
    id: 'FB-MOCK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    email: feedback.email,
    rating: feedback.rating,
    message: feedback.message,
    created_at: new Date().toISOString()
  });
  localStorage.setItem('bhoomi_all_mock_feedbacks', JSON.stringify(mockFeedbacks));
}

// Load feedbacks ledger for admin dashboard
async function loadAdminFeedbacks() {
  const container = document.getElementById('admin-feedbacks-list');
  if (!container) return;

  container.innerHTML = `<div style="text-align: center; padding: 32px; opacity: 0.6;">Loading feedbacks ledger...</div>`;

  let feedbacks = [];

  if (isBackendActive) {
    try {
      const token = localStorage.getItem('bhoomi_token');
      const response = await fetch(`${backendUrl}/feedbacks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to fetch feedbacks');
      feedbacks = result.data || [];
    } catch (err) {
      console.error("Backend feedbacks load error, using local mock cache:", err);
      feedbacks = JSON.parse(localStorage.getItem('bhoomi_all_mock_feedbacks') || '[]');
    }
  } else {
    feedbacks = JSON.parse(localStorage.getItem('bhoomi_all_mock_feedbacks') || '[]');
  }

  if (feedbacks.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 32px; opacity: 0.6;">No feedbacks found in the system.</div>`;
    return;
  }

  container.innerHTML = feedbacks.map(fb => {
    const starsHtml = Array.from({ length: 5 }, (_, idx) => {
      const isFilled = idx < fb.rating;
      return `<i data-lucide="star" style="width: 16px; height: 16px; ${isFilled ? 'fill: var(--turmeric); stroke: var(--turmeric);' : 'fill: none; stroke: currentColor;'};"></i>`;
    }).join('');
    
    const dateStr = fb.created_at ? new Date(fb.created_at).toLocaleString() : 'N/A';
    
    return `
      <div class="feedback-item">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <div>
            <strong style="font-size: 0.95rem;">${fb.email}</strong>
            <div style="font-size: 0.75rem; opacity: 0.6; margin-top: 2px;">${dateStr}</div>
          </div>
          <div class="star-display" data-rating="${fb.rating}">
            ${starsHtml}
          </div>
        </div>
        <p style="font-size: 0.9rem; line-height: 1.5; margin: 0; opacity: 0.85;">
          ${fb.message}
        </p>
      </div>
    `;
  }).join("");

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/* ============ DUAL-PANEL ADMIN STATES & HELPERS ============ */
let loadedAdminOrders = [];
let loadedAdminPredictions = [];

// Load predictions ledger for admin dashboard
async function loadAdminPredictions() {
  const body = document.getElementById('admin-predictions-body');
  if (!body) return;

  body.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:32px; opacity:0.6;">Loading predictions ledger...</td></tr>`;

  let predictions = [];

  if (isBackendActive) {
    try {
      const token = localStorage.getItem('bhoomi_token');
      const response = await fetch(`${backendUrl}/predictions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to fetch predictions');
      predictions = result.data || [];
    } catch (err) {
      console.error("Backend predictions load error:", err);
      predictions = JSON.parse(localStorage.getItem('bhoomi_all_mock_predictions') || '[]');
    }
  } else {
    predictions = JSON.parse(localStorage.getItem('bhoomi_all_mock_predictions') || '[]');
  }

  loadedAdminPredictions = predictions;
  if (typeof renderAnalyticsCharts === 'function') {
    renderAnalyticsCharts(loadedAdminOrders, loadedAdminPredictions);
  }

  if (predictions.length === 0) {
    predictions = [
      {
        district: "Kalaburagi",
        user_email: "raju.farmer@gmail.com",
        crop: "crop-tur-dal",
        confidence: 92,
        season: "kharif",
        soil: "black-cotton",
        created_at: new Date(Date.now() - 3600000 * 1.5).toISOString()
      },
      {
        district: "Kolar",
        user_email: "kolar_tomato@yahoo.co.in",
        crop: "crop-tomato",
        confidence: 88,
        season: "rabi",
        soil: "red-loamy",
        created_at: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        district: "Belagavi",
        user_email: "belagavi.sugar@gmail.com",
        crop: "crop-sugarcane",
        confidence: 95,
        season: "kharif",
        soil: "black-cotton",
        created_at: new Date(Date.now() - 3600000 * 10).toISOString()
      },
      {
        district: "Mysuru",
        user_email: "mysuru_paddy@raita.org",
        crop: "crop-paddy",
        confidence: 85,
        season: "kharif",
        soil: "alluvial",
        created_at: new Date(Date.now() - 3600000 * 18).toISOString()
      },
      {
        district: "Bagalkote",
        user_email: "bagalkote_onion@rediffmail.com",
        crop: "crop-onion",
        confidence: 79,
        season: "summer",
        soil: "sandy-loam",
        created_at: new Date(Date.now() - 3600000 * 26).toISOString()
      }
    ];
    localStorage.setItem('bhoomi_all_mock_predictions', JSON.stringify(predictions));
    
    loadedAdminPredictions = predictions;
    if (typeof renderAnalyticsCharts === 'function') {
      renderAnalyticsCharts(loadedAdminOrders, loadedAdminPredictions);
    }
  }

  body.innerHTML = predictions.map(log => {
    const dateStr = log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A';
    const emailStr = log.user_email || log.user_id || 'User';
    return `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid var(--line); font-weight: 600;">
          ${log.district}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid var(--line); font-size: 0.85rem; opacity: 0.85;">
          ${emailStr}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid var(--line);">
          <span style="font-weight: 600; color: var(--field);">${t(log.crop)}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid var(--line); text-align: right; font-weight: 700; color: #6FD088;">
          ${log.confidence}% Match
        </td>
        <td style="padding: 12px; border-bottom: 1px solid var(--line); font-size: 0.8rem; opacity: 0.8;">
          ${t(log.season)} | ${t(log.soil)}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid var(--line); font-size: 0.75rem; font-family: var(--font-mono); opacity: 0.6;">
          ${dateStr}
        </td>
      </tr>
    `;
  }).join("");
}

// Render dynamic analytical charts
function renderAnalyticsCharts(orders, predictions) {
  const orderCropCounts = {};
  orders.forEach(o => {
    const items = Array.isArray(o.items) ? o.items.filter(i => !i.isMetadata) : [];
    items.forEach(item => {
      const crop = item.name;
      orderCropCounts[crop] = (orderCropCounts[crop] || 0) + item.qty;
    });
  });

  const predCropCounts = {};
  predictions.forEach(p => {
    const crop = t(p.crop);
    predCropCounts[crop] = (predCropCounts[crop] || 0) + 1;
  });

  // Render Order Popularity Chart
  const orderChart = document.getElementById('analytics-order-chart');
  if (orderChart) {
    const sortedOrders = Object.entries(orderCropCounts).sort((a, b) => b[1] - a[1]);
    const maxVal = sortedOrders.length > 0 ? sortedOrders[0][1] : 1;
    if (sortedOrders.length === 0) {
      orderChart.innerHTML = `<div style="text-align: center; padding: 24px; opacity: 0.6;">No sales data available. Place some orders first!</div>`;
    } else {
      orderChart.innerHTML = sortedOrders.slice(0, 5).map(([crop, qty]) => {
        const pct = Math.round((qty / maxVal) * 100);
        return `
          <div class="chart-bar-row">
            <div class="chart-bar-label">
              <span>${crop}</span>
              <span class="mono">${qty} Bags</span>
            </div>
            <div class="chart-bar-outer">
              <div class="chart-bar-inner" style="width: ${pct}%;"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Render Sowing Popularity Chart
  const predChart = document.getElementById('analytics-pred-chart');
  if (predChart) {
    const sortedPreds = Object.entries(predCropCounts).sort((a, b) => b[1] - a[1]);
    const maxVal = sortedPreds.length > 0 ? sortedPreds[0][1] : 1;
    if (sortedPreds.length === 0) {
      predChart.innerHTML = `<div style="text-align: center; padding: 24px; opacity: 0.6;">No sowing logs available. Run some suitability predictions first!</div>`;
    } else {
      predChart.innerHTML = sortedPreds.slice(0, 5).map(([crop, count]) => {
        const pct = Math.round((count / maxVal) * 100);
        return `
          <div class="chart-bar-row">
            <div class="chart-bar-label">
              <span>${crop}</span>
              <span class="mono">${count} checks</span>
            </div>
            <div class="chart-bar-outer">
              <div class="chart-bar-inner" style="width: ${pct}%;"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

// Simulate order from admin dashboard
async function simulateAdminOrder() {
  const districtsList = ['Kalaburagi', 'Belagavi', 'Mysuru', 'Chamarajanagara', 'Kolar', 'Bagalkote', 'Mandya'];
  const itemsPool = [
    { name: 'Red Gram (Tur Dal) Seeds', price: 4500, qty: 2, unit: 'Bags' },
    { name: 'Sugarcane Seedlings', price: 3000, qty: 1, unit: 'Bundle' },
    { name: 'Premium Paddy Seeds', price: 2800, qty: 3, unit: 'Bags' },
    { name: 'Byadagi Chili Seeds', price: 6000, qty: 1, unit: 'Packet' }
  ];

  const randomDist = districtsList[Math.floor(Math.random() * districtsList.length)];
  const randomItem = itemsPool[Math.floor(Math.random() * itemsPool.length)];
  const randomEmail = `farmer.${Math.floor(Math.random() * 9000 + 1000)}@example.com`;

  const payment_method = ['UPI', 'NETBANKING', 'COD'][Math.floor(Math.random() * 3)];
  const payment_details = payment_method === 'UPI' ? `simulated@upi` : (payment_method === 'COD' ? 'CASH_ON_DELIVERY' : 'SBI Netbanking');

  const itemsWithMeta = [
    randomItem,
    {
      isMetadata: true,
      email: randomEmail,
      payment_method,
      payment_details
    }
  ];

  const order = {
    items: itemsWithMeta,
    subtotal: randomItem.price * randomItem.qty
  };

  if (isBackendActive) {
    try {
      const token = localStorage.getItem('bhoomi_token');
      const response = await fetch(`${backendUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(order)
      });
      if (!response.ok) throw new Error('Simulation save failed');
    } catch (err) {
      console.error(err);
      saveMockOrder(order, randomEmail);
    }
  } else {
    saveMockOrder(order, randomEmail);
  }

  alert(`Successfully simulated order from ${randomEmail} (${randomItem.name})!`);
  if (typeof loadDashboardData === 'function') {
    loadDashboardData();
  }
}

function saveMockOrder(order, email) {
  const allMockOrders = JSON.parse(localStorage.getItem('bhoomi_all_mock_orders') || '[]');
  allMockOrders.unshift({ 
    id: 'MOCK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    items: order.items, 
    subtotal: order.subtotal,
    user_id: 'mock-uuid-' + Date.now(), 
    user_email: email, 
    created_at: new Date().toISOString() 
  });
  localStorage.setItem('bhoomi_all_mock_orders', JSON.stringify(allMockOrders));
}

// Simulate user feedback from admin dashboard
async function simulateAdminFeedback() {
  const reviews = [
    { rating: 5, message: "Excellent crop predictions! Got 92% match in Kolar and sowed Tomato successfully." },
    { rating: 4, message: "Interface is super fast and clean. Love the Kannada local language support!" },
    { rating: 5, message: "Best crop exchange portal in Karnataka. Mandi arbitrage tool saved me ₹8,000 this week." },
    { rating: 3, message: "Mandi prices are sometimes a few hours behind. Rest is excellent." },
    { rating: 2, message: "Seed delivery took 4 days to reach Raichur. Sowing was slightly delayed." }
  ];

  const randomReview = reviews[Math.floor(Math.random() * reviews.length)];
  const randomEmail = `user.${Math.floor(Math.random() * 9000 + 1000)}@raita.org`;
  const fbData = { rating: randomReview.rating, message: randomReview.message, email: randomEmail };

  if (isBackendActive) {
    try {
      const response = await fetch(`${backendUrl}/feedbacks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fbData)
      });
      if (!response.ok) throw new Error('Simulation submit failed');
    } catch (err) {
      console.error(err);
      saveFeedbackLocally(fbData);
    }
  } else {
    saveFeedbackLocally(fbData);
  }

  alert(`Successfully simulated feedback from ${randomEmail}!`);
  if (typeof loadDashboardData === 'function') {
    loadDashboardData();
  }
}
