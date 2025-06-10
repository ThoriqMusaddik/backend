const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const fs = require('fs');
const libre = require('libreoffice-convert'); // Tambahan untuk konversi PDF

// Konfigurasi storage multer agar nama file asli dipakai
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Simpan dengan nama asli
  }
});
const upload = multer({ storage: storage });

// Ambil semua file
router.get('/', async (req, res) => {
  try {
    const data = await File.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data file' });
  }
});

// Tambah metadata file ke database
router.post('/', async (req, res) => {
  const { name, size, type, path, uploadedBy } = req.body;

  try {
    const data = await File.create({ name, size, type, path, uploadedBy });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menyimpan file' });
  }
});

// Endpoint upload file
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
    const data = await File.create({
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      path: req.file.originalname, // Nama file yang disimpan
      uploadedBy: 1,
    });
    res.json({
      message: 'File uploaded',
      filename: req.file.originalname,
      originalname: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      dbId: data.id,
    });
  } catch (error) {
    res.status(500).json({ error: 'Gagal upload file ke server' });
  }
});

// Endpoint hapus file berdasarkan nama
router.delete('/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const file = await File.findOne({ where: { name } });
    if (!file) {
      return res.status(404).json({ error: 'File tidak ditemukan' });
    }

    const filePath = path.join(__dirname, '../uploads', file.name);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await File.destroy({ where: { name } });
    res.json({ message: 'File berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus file' });
  }
});

// ✅ Endpoint konversi Word → PDF
router.post('/convert', async (req, res) => {
  const { fileName } = req.body;
  const filePath = path.join(__dirname, '../uploads', fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File tidak ditemukan' });
  }

  const fileBuffer = fs.readFileSync(filePath);

  libre.convert(fileBuffer, '.pdf', undefined, (err, done) => {
    if (err) {
      console.error('Error konversi:', err);
      return res.status(500).json({ error: 'Konversi gagal' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName.replace(/\.(docx|doc)$/i, '.pdf')}"`);
    res.send(done);
  });
});

module.exports = router;