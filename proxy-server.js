import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

// Επιτρεπόμενα origins - και localhost ΚΑΙ production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5137', // Για Vite που τρέχει σε άλλο port
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5137',
  'http://62.217.127.153:5173'
];

// Dynamic CORS - δέχεται όλα τα localhost origins
app.use(cors({
  origin: function (origin, callback) {
    // Αν δεν υπάρχει origin (π.χ. curl) ή είναι στη λίστα
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Proxy endpoint - προωθεί στο external API
app.use('/api', async (req, res) => {
  // Προσθέτουμε /resources μπροστά από το path
  const apiUrl = `https://demos.isl.ics.forth.gr/semantyfish-api/resources${req.url}`;
  
  console.log(`[PROXY] ${req.method} ${apiUrl}`);

  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    console.log(`[PROXY] ✅ Success - Status: ${response.status}`);
    res.json(data);
    
  } catch (error) {
    console.error(`[PROXY] ❌ Error:`, error.message);
    res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message,
      url: apiUrl 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 CORS Proxy running on http://localhost:${PORT}`);
  console.log(`📡 Forwarding to: https://demos.isl.ics.forth.gr/semantyfish-api`);
  console.log(`✅ Allowed origins:`, allowedOrigins);
});