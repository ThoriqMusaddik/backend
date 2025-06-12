require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const sequelize = require('./config/db');
const fileRoutes = require('./routes/file');
const userRoutes = require('./routes/user');
const convertRoutes = require('./routes/convert');
const downloadRoutes = require('./routes/download');

const app = express();

/**
 * ✅ Konfigurasi CORS fix:
 * Menghindari error origin mismatch (CORS strict)
 */
const allowedOrigins = [
  'https://frontend-theta-beryl-55.vercel.app', // frontend vercel kamu
  'http://localhost:3000'  // biar aman kalau testing local dev
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS Not Allowed: ' + origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

/**
 * ✅ Pastikan folder uploads & downloads ada (untuk penyimpanan file lokal di Railway)
 */
const uploadPath = path.join(__dirname, 'uploads');
const downloadPath = path.join(__dirname, 'downloads');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

if (!fs.existsSync(downloadPath)) {
  fs.mkdirSync(downloadPath);
}

// Static file serving
app.use('/uploads', express.static(uploadPath));
app.use('/downloads', express.static(downloadPath));

// Test route root (biar gampang cek Railway online)
app.get('/', (req, res) => {
  res.send('✅ Backend PDF Kita is running!');
});

// Routing utama API
app.use('/api/files', fileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/convert', convertRoutes);
app.use('/api/downloads', downloadRoutes);

// Koneksi database & sync
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database terkoneksi!');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Database sync sukses!');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server berjalan di PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Gagal koneksi ke database:', err);
  });