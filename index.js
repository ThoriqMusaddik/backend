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

// Middleware - harus sebelum routing
app.use(cors());
app.use(bodyParser.json());

// Static folder
app.use('/uploads', express.static(path.join(__dirname, 'backend/uploads')));
app.use('/downloads', express.static(path.join(__dirname, 'public/downloads')));

// Routing
app.use('/api/files', fileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/convert', convertRoutes); // <== Pindahkan ke sini, setelah middleware
app.use('/api/downloads', downloadRoutes);

// Start server & connect DB
sequelize.sync()
  .then(() => {
    app.listen(5000, () => {
      console.log('✅ Server berjalan di http://localhost:5000');
    });
  })
  .catch((error) => {
    console.error('❌ Gagal koneksi ke database:', error);
  });

// Tambahkan ini sebelum app.listen
Download.sync({ alter: true }) // alter: true akan menyesuaikan tabel dengan model
  .then(() => {
    console.log('Tabel Download sudah disesuaikan dengan model.');
  })
  .catch((err) => {
    console.error('Gagal sync tabel Download:', err);
  });