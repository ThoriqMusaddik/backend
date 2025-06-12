require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/db');
const fileRoutes = require('./routes/file');
const userRoutes = require('./routes/user');
const convertRoutes = require('./routes/convert');
const downloadRoutes = require('./routes/download');
const Download = require('./models/downloads');

const app = express();

// Middleware CORS supaya bisa connect ke frontend Vercel
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(bodyParser.json());

// Static folder (pastikan path di server ada)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// Routing
app.use('/api/files', fileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/convert', convertRoutes);
app.use('/api/downloads', downloadRoutes);

// Sync model Download terlebih dahulu
Download.sync({ alter: true })
  .then(() => {
    console.log('✅ Tabel Download sudah disesuaikan dengan model.');
  })
  .catch((err) => {
    console.error('❌ Gagal sync tabel Download:', err);
  });

// Connect DB & Start Server
sequelize.sync()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server berjalan di PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Gagal koneksi ke database:', error);
  });