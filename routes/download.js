const express = require('express');
const router = express.Router();
const Download = require('../models/downloads');
const path = require('path');

const API_URL = process.env.REACT_APP_API_URL;

// Endpoint untuk mencatat download
router.post('/', async (req, res) => {
  console.log('POST /api/downloads', req.body); // Tambahkan log ini
  const { fileName, userName, size } = req.body;
  try {
    const data = await Download.create({ fileName, userName, size });
    res.json({ message: 'Download tercatat', data });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mencatat download' });
  }
});

// Endpoint untuk melihat semua data download (opsional)
router.get('/', async (req, res) => {
  try {
    const data = await Download.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data download' });
  }
});

// Menyajikan file statis dari direktori 'public/downloads'
router.use(express.static(path.join(__dirname, '../public/downloads')));

module.exports = router;