A smart, bilingual agricultural portal for crop recommendation, interactive district-level mandi pricing, and direct-benefit government scheme matching across Karnataka's 31 districts.

Bhoomi (ಭೂಮಿ) is a modern, premium full-stack web application designed to empower farmers, seed dealers, and agricultural organizations across Karnataka. It acts as a single-point ledger to help users read the agricultural season before sowing a single seed. By combining real-time crop recommendations, interactive district maps, mandi commodity pricing, and a personalized government subsidy matcher, Bhoomi makes agricultural data transparent and highly accessible.

Built with a responsive, glassmorphic UI, it operates in a dual-backend setup: it connects to a Node.js/Express service integrated with Supabase PostgreSQL, while gracefully falling back to local mock data if the backend is offline.

 Key Features
🗺️ Interactive Karnataka District Map: An interactive SVG-based map of Karnataka's 31 districts in 

karnataka-map.js
. Hovering over a district highlights its boundary, and clicking it displays signature crops, live APMC mandi price indices, and localized agricultural statistics.
🌱 Smart Crop Recommendation Engine: A parameter-driven suitability model that takes soil properties (NPK values, moisture), seasonal timing, and rainfall forecasts to predict the best crops to sow with matching confidence metrics.
🏛️ Raita Portal & Schemes Matcher: A custom query tool in 

news.html
 that matches farmers with eligible central and state government schemes, subsidies, and machinery benefits based on their farm size, category, and district.
📈 Live Mandi Price Tracking & Agro Stocks: Real-time tracking of wholesale crop rates across major APMCs and a live price index of leading agricultural seeds corporations trading on local exchanges.
🛒 E-Commerce Crop Marketplace: An integrated digital cart system enabling farmers and dealers to order signature seeds and crops directly, with yield estimation tools.
📊 Premium Analytics & Forecasting Playground:
Soil Nutrient Analysis: Dynamic visualization of NPK profiles compared to optimal crop ranges.
ML-based Mandi Price Forecast: A timeline-slider tool predicting future commodity prices using past harvest data, rain estimates, and trade trends.
🗣️ Full Multilingual Support: High-fidelity localization supporting seamless toggle between English and Kannada (ಕನ್ನಡ).
🌗 Premium Dark & Light Modes: Sleek, glassmorphism-based responsive styles optimized for mobile and desktop screens.
💾 Robust Sowing Logs & Auth: Secure user authentication using Supabase Auth with history logging to save user crop recommendation lookups and marketplace orders.
4. Technical Stack
Frontend: HTML5 (Semantic Structure), CSS3 (Custom Variables, CSS Transitions, Glassmorphic styling), JavaScript (ES6 Modules, LocalStorage, Supabase Client), and Lucide Icons.
Backend: Node.js, Express.js, CORS, Morgan logging, and Supabase JS SDK.
Database: Supabase (PostgreSQL) for storing user profiles, sowing/prediction logs, and order history.
