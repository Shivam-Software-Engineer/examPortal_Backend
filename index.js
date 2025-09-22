const express = require('express');
const cors = require('cors');
const { website } = require('./App/Routes/website');
const { admin } = require('./App/Routes/admin');
require('dotenv').config();
const mongoose = require('mongoose');



const MONGO_URI = process.env.DB_CONNECTION

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Mongoose connected to MongoDB'))
.catch(err => console.error('❌ Mongoose connection error:', err));


const app = express();
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Allowed origins list — frontend ke liye
const allowedOrigins = [
  'http://localhost:5173',
  'https://gmat.maxiwiselearning.com',
   'http://192.168.89.125:8000', 
    'http://192.168.89.125:5173',
];

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Postman/curl ke liye
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS is not allowed for this origin: ' + origin));
    }
  },
  credentials: true, // cookies/session ke liye
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Preflight requests
app.options(/.*/, cors());


// JSON parsing middleware
// app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ status: 'success', message: 'Backend is running!' });
});

// Mount website routes
app.use('/website', website);

app.use('/admin', admin);

// Server config
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

//http://localhost:8000
