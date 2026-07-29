const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all requests (important for frontend communication)
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Serve static frontend files from parent directory
app.use(express.static(path.join(__dirname, '../')));

const fs = require('fs');

// Initialize Supabase Client (Optional - Standalone local fallback if not configured)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
let supabase = null;

if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('YOUR_SUPABASE')) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log("Connected to Supabase Database.");
  } catch (err) {
    console.warn("Supabase init warning, running in Local Mode:", err.message);
  }
} else {
  console.log("Supabase credentials not configured. Running in Standalone Local + Google Sheets Mode.");
}

// Local JSON File Helper Utilities
const USERS_FILE = path.join(__dirname, 'users.json');
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const PREDICTIONS_FILE = path.join(__dirname, 'predictions.json');

function readJsonFile(filePath, defaultData = []) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
      return defaultData;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content || '[]');
  } catch (e) {
    return defaultData;
  }
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error(`Error writing file ${filePath}:`, e.message);
  }
}

// ================= AUTH MIDDLEWARE =================
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];

    if (supabase) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        req.user = user;
        return next();
      }
    }

    // Local Auth Fallback
    const users = readJsonFile(USERS_FILE);
    const user = users.find(u => u.token === token || u.id === token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata || { full_name: user.name, role: user.role }
    };
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// ================= HEALTH CHECK =================
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bhoomi Backend is running smoothly.' });
});

// ================= AUTHENTICATION ENDPOINTS =================

// Sign Up
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name || '',
            role: role || 'farmer'
          }
        }
      });

      if (!error && data?.user) {
        return res.status(201).json({ data });
      }
    }

    // Local Storage Mode
    const users = readJsonFile(USERS_FILE);
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: 'User already registered' });
    }

    const userId = 'usr_' + Math.random().toString(36).substr(2, 9);
    const token = 'token_' + Math.random().toString(36).substr(2, 12);
    const userRole = (email.toLowerCase().includes('admin')) ? 'admin' : (role || 'farmer');
    
    const newUser = {
      id: userId,
      email,
      password,
      token,
      name: name || '',
      role: userRole,
      user_metadata: { full_name: name || '', role: userRole }
    };

    users.push(newUser);
    writeJsonFile(USERS_FILE, users);

    const responseData = {
      user: {
        id: userId,
        email,
        user_metadata: { full_name: name || '', role: userRole }
      },
      session: { access_token: token }
    };

    res.status(201).json({ data: responseData });
  } catch (err) {
    console.error("Sign up error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (!error && data?.session) {
        return res.json({ data });
      }
    }

    // Local Auth Mode
    const users = readJsonFile(USERS_FILE);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const responseData = {
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata || { full_name: user.name, role: user.role }
      },
      session: { access_token: user.token }
    };

    res.json({ data: responseData });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// Logout
app.post('/api/auth/logout', async (req, res) => {
  try {
    if (supabase) {
      await supabase.auth.signOut().catch(() => {});
    }
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ================= PREDICTIONS ENDPOINTS =================

// Save Prediction suitability log
app.post('/api/predictions', requireAuth, async (req, res) => {
  const { district, season, soil, rain, crop, confidence } = req.body;
  
  if (!district || !season || !soil || !rain || !crop || confidence === undefined) {
    return res.status(400).json({ error: 'Missing required prediction fields' });
  }

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('predictions')
        .insert([{ district, season, soil, rain, crop, confidence, user_id: req.user.id }])
        .select();

      if (!error && data?.[0]) {
        return res.status(201).json({ data: data[0] });
      }
    }

    // Local Storage Mode
    const predictions = readJsonFile(PREDICTIONS_FILE);
    const newPred = {
      id: 'pred_' + Math.random().toString(36).substr(2, 9),
      user_id: req.user.id,
      district, season, soil, rain, crop, confidence,
      created_at: new Date().toISOString()
    };
    predictions.unshift(newPred);
    writeJsonFile(PREDICTIONS_FILE, predictions);

    res.status(201).json({ data: newPred });
  } catch (err) {
    console.error("Save prediction error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// Get User Prediction History (or all predictions if admin)
app.get('/api/predictions', requireAuth, async (req, res) => {
  try {
    const email = req.user.email || '';
    const role = (email.toLowerCase().includes('admin')) ? 'admin' : (req.user.user_metadata?.role || 'farmer');

    if (supabase) {
      let query = supabase.from('predictions').select('*');
      if (role !== 'admin') {
        query = query.eq('user_id', req.user.id);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && data) {
        return res.json({ data });
      }
    }

    // Local Storage Mode
    const predictions = readJsonFile(PREDICTIONS_FILE);
    const filtered = role === 'admin' ? predictions : predictions.filter(p => p.user_id === req.user.id);
    res.json({ data: filtered });
  } catch (err) {
    console.error("Fetch predictions error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// ================= ORDERS ENDPOINTS =================

// Helper to sync order events to Google Sheets Webhook asynchronously
async function syncToGoogleSheets(action, orderData) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    const items = Array.isArray(orderData.items) ? orderData.items : [];
    const meta = items.find(i => i.isMetadata) || {};
    const cropItems = items.filter(i => !i.isMetadata).map(i => `${i.name} (x${i.qty || 1})`).join(', ');

    const payload = {
      action: action,
      orderId: orderData.id,
      date: orderData.created_at ? new Date(orderData.created_at).toLocaleString('en-IN') : new Date().toLocaleString('en-IN'),
      userEmail: meta.email || orderData.user_email || 'N/A',
      items: cropItems || 'N/A',
      subtotal: orderData.subtotal || 0,
      paymentMethod: meta.payment_method || 'N/A',
      paymentDetails: meta.payment_details || 'N/A',
      status: meta.status || 'Pending'
    };

    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.error("Google Sheets Sync Warning:", err.message));
  } catch (err) {
    console.error("Google Sheets Helper Error:", err.message);
  }
}

// Optional Auth Middleware for Order Creation (supports both logged-in users & guest buyers)
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token && token !== 'null' && token !== 'undefined') {
        if (supabase) {
          const { data: { user }, error } = await supabase.auth.getUser(token);
          if (!error && user) {
            req.user = user;
            return next();
          }
        }
        const users = readJsonFile(USERS_FILE);
        const user = users.find(u => u.token === token || u.id === token);
        if (user) {
          req.user = {
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata || { full_name: user.name, role: user.role }
          };
          return next();
        }
      }
    }
  } catch (err) {}

  // Fallback to guest user
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const meta = items.find(i => i.isMetadata) || {};
  req.user = {
    id: 'guest_' + Math.random().toString(36).substr(2, 9),
    email: meta.email || 'Guest'
  };
  next();
}

// Save Marketplace Order
app.post('/api/orders', optionalAuth, async (req, res) => {
  const { items, subtotal } = req.body;

  if (!items || subtotal === undefined) {
    return res.status(400).json({ error: 'Missing required order fields' });
  }

  try {
    let savedOrder = null;

    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .insert([{ items, subtotal, user_id: req.user.id }])
        .select();

      if (!error && data?.[0]) {
        savedOrder = data[0];
      }
    }

    if (!savedOrder) {
      // Local Storage Mode
      const orders = readJsonFile(ORDERS_FILE);
      savedOrder = {
        id: 'ord_' + Math.random().toString(36).substr(2, 9),
        user_id: req.user.id,
        items,
        subtotal: Number(subtotal),
        created_at: new Date().toISOString()
      };
      orders.unshift(savedOrder);
      writeJsonFile(ORDERS_FILE, orders);
    }

    // Sync to Google Sheets
    syncToGoogleSheets('create', { ...savedOrder, user_email: req.user.email });

    res.status(201).json({ data: savedOrder });
  } catch (err) {
    console.error("Save order error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// Update Order Status (Admin only)
app.put('/api/orders/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { items, subtotal } = req.body;

  try {
    const email = req.user.email || '';
    const role = (email.toLowerCase().includes('admin')) ? 'admin' : (req.user.user_metadata?.role || 'farmer');

    if (role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    let updatedOrder = null;

    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .update({ items, subtotal })
        .eq('id', id)
        .select();

      if (!error && data?.[0]) {
        updatedOrder = data[0];
      }
    }

    if (!updatedOrder) {
      // Local Storage Mode
      const orders = readJsonFile(ORDERS_FILE);
      const idx = orders.findIndex(o => String(o.id) === String(id));
      if (idx !== -1) {
        orders[idx].items = items;
        orders[idx].subtotal = Number(subtotal);
        updatedOrder = orders[idx];
        writeJsonFile(ORDERS_FILE, orders);
      } else {
        updatedOrder = { id, items, subtotal };
      }
    }

    // Sync status update to Google Sheets
    const meta = Array.isArray(items) ? items.find(i => i.isMetadata) : null;
    syncToGoogleSheets('update', { id, items, subtotal, status: meta ? meta.status : 'Pending' });

    res.json({ data: updatedOrder });
  } catch (err) {
    console.error("Update order error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// Get User Orders History (or all orders if admin)
app.get('/api/orders', requireAuth, async (req, res) => {
  try {
    const email = req.user.email || '';
    const role = (email.toLowerCase().includes('admin')) ? 'admin' : (req.user.user_metadata?.role || 'farmer');

    if (supabase) {
      let query = supabase.from('orders').select('*');
      if (role !== 'admin') {
        query = query.eq('user_id', req.user.id);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && data) {
        return res.json({ data });
      }
    }

    // Local Storage Mode
    const orders = readJsonFile(ORDERS_FILE);
    const filtered = role === 'admin' ? orders : orders.filter(o => o.user_id === req.user.id);
    res.json({ data: filtered });
  } catch (err) {
    console.error("Fetch orders error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// ================= FEEDBACKS ENDPOINTS =================
const FEEDBACKS_FILE = path.join(__dirname, 'feedbacks.json');

function readFeedbacks() {
  try {
    if (!fs.existsSync(FEEDBACKS_FILE)) {
      const demoFeedbacks = [
        {
          id: "FB-DEMO-1",
          email: "mallesh.bg@gmail.com",
          rating: 5,
          message: "The Kharif paddy recommendation for Belagavi was spot-on! The soil moisture matches perfectly.",
          created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: "FB-DEMO-2",
          email: "kavitha_raju@karnataka.gov.in",
          rating: 4,
          message: "Excellent APMC mandi price forecasting. This helps us plan transport logistics much better.",
          created_at: new Date(Date.now() - 3600000 * 5).toISOString()
        },
        {
          id: "FB-DEMO-3",
          email: "sidda_farming@raita.org",
          rating: 5,
          message: "Arbitrage calculator saved me ₹6,000 on Tur Dal seeds by comparing prices across Bidar and Kalaburagi markets.",
          created_at: new Date(Date.now() - 3600000 * 12).toISOString()
        },
        {
          id: "FB-DEMO-4",
          email: "devaraj_mysore@yahoo.com",
          rating: 3,
          message: "Stocks price updates are very fast, but could you also add weather details inside the news tab?",
          created_at: new Date(Date.now() - 3600000 * 24).toISOString()
        }
      ];
      fs.writeFileSync(FEEDBACKS_FILE, JSON.stringify(demoFeedbacks, null, 2), 'utf8');
      return demoFeedbacks;
    }
    const data = fs.readFileSync(FEEDBACKS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error("Error reading feedbacks file:", err);
    return [];
  }
}

function writeFeedbacks(feedbacks) {
  try {
    fs.writeFileSync(FEEDBACKS_FILE, JSON.stringify(feedbacks, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing feedbacks file:", err);
  }
}

// Submit Feedback (Anonymous or Authenticated)
app.post('/api/feedbacks', async (req, res) => {
  const { rating, message, email } = req.body;
  if (rating === undefined || !message) {
    return res.status(400).json({ error: 'Rating and message are required' });
  }

  try {
    const feedbacks = readFeedbacks();
    const newFeedback = {
      id: 'FB-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      email: email || 'Anonymous',
      rating: Number(rating),
      message,
      created_at: new Date().toISOString()
    };
    feedbacks.unshift(newFeedback);
    writeFeedbacks(feedbacks);

    res.status(201).json({ status: 'OK', data: newFeedback });
  } catch (err) {
    console.error("Save feedback error:", err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get All Feedbacks (Admin Only)
app.get('/api/feedbacks', requireAuth, async (req, res) => {
  try {
    const email = req.user.email || '';
    const role = (email.toLowerCase().includes('admin')) ? 'admin' : (req.user.user_metadata?.role || 'farmer');
    
    if (role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const feedbacks = readFeedbacks();
    res.json({ data: feedbacks });
  } catch (err) {
    console.error("Fetch feedbacks error:", err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ================= CHATBOT PROXY ENDPOINT =================
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

app.post('/api/chat', (req, res) => {
  const { message, lang } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const query = message.toLowerCase();
  const currentLang = lang || 'en';
  const replies = currentLang === 'kn' ? botRepliesKn : botRepliesEn;

  let reply = replies.default;
  if (query.includes('paddy') || query.includes('rice') || query.includes('ಭತ್ತ') || query.includes('ಅಕ್ಕಿ')) {
    reply = replies.paddy;
  } else if (query.includes('tomato') || query.includes('pest') || query.includes('disease') || query.includes('ಟೊಮೆಟೊ') || query.includes('ಕೀಟ')) {
    reply = replies.tomato;
  } else if (query.includes('soil') || query.includes('black') || query.includes('ಮಣ್ಣು') || query.includes('ಕಪ್ಪು')) {
    reply = replies.soil;
  } else if (query.includes('mandi') || query.includes('rate') || query.includes('price') || query.includes('ಮಾರುಕಟ್ಟೆ') || query.includes('ದರ')) {
    reply = replies.mandi;
  }

  res.json({ reply });
});

// Export Express app for Vercel serverless functions
module.exports = app;

// Start listening if executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Bhoomi backend server listening on http://localhost:${PORT}`);
  });
}
