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

// Middleware CORS supaya bisa connect ke frontend Vercel
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Pastikan folder uploads & downloads ada
const uploadPath = path.join(__dirname, 'uploads');
const downloadPath = path.join(__dirname, 'downloads');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

if (!fs.existsSync(downloadPath)) {
  fs.mkdirSync(downloadPath);
}

// Static folder (pastikan path di server ada)
app.use('/uploads', express.static(uploadPath));
app.use('/downloads', express.static(downloadPath));

// Test route root
app.get('/', (req, res) => {
  res.send('✅ Backend PDF Kita is running!');
});

// Routing
app.use('/api/files', fileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/convert', convertRoutes);
app.use('/api/downloads', downloadRoutes);

// Test koneksi database + sync
sequelize.authenticate()
  .then(() => {
    console.log('✅ BERHASIL: Database terkoneksi!');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Database sync berhasil.');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server berjalan di PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Gagal koneksi ke database:', err);
  });