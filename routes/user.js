const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Registrasi
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Cek email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }
    // Simpan user baru
    const newUser = await User.create({ username, email, password });
    res.status(201).json({ message: 'Registrasi berhasil!', user: newUser });
  } catch (error) {
    console.error('Error saat registrasi:', error);
    res.status(500).json({ error: 'Gagal registrasi pengguna' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email, password } });
    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }
    res.json({ token: 'dummy-token', user: { username: user.username } });
  } catch (error) {
    res.status(500).json({ error: 'Gagal login' });
  }
});

// Get user by username
router.get('/by-username/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ where: { username } });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data pengguna' });
  }
});

module.exports = router;