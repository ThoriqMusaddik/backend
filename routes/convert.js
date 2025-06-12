const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const PDFDocument = require('pdfkit');

const router = express.Router();

require('dotenv').config();
const CLOUDMERSIVE_API_KEY = process.env.CLOUDMERSIVE_API_KEY;

// ✅ Ambil BASE_URL dari env
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

// ✅ Direktori output konversi semua kita set sama
const outputDir = path.join(__dirname, '../downloads');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// ✅ WORD to PDF
router.post('/word-to-pdf', async (req, res) => {
  const { fileName } = req.body;
  const uploadsDir = path.join(__dirname, '../uploads');
  const filePath = path.join(uploadsDir, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File tidak ditemukan di server' });
  }

  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const response = await axios.post(
      'https://api.cloudmersive.com/convert/docx/to/pdf',
      form,
      {
        headers: {
          ...form.getHeaders(),
          'Apikey': CLOUDMERSIVE_API_KEY,
        },
        responseType: 'arraybuffer',
      }
    );

    const outputFileName = fileName.replace(/\.[^/.]+$/, '') + '.pdf';
    const outputPath = path.join(outputDir, outputFileName);
    fs.writeFileSync(outputPath, response.data);

    const fileUrl = `${BASE_URL}/downloads/${outputFileName}`;
    res.json({ fileUrl });
  } catch (err) {
    console.error('Error Cloudmersive:', err.message);
    res.status(500).json({ error: 'Konversi gagal' });
  }
});

// ✅ JPG to PDF
router.post('/jpg-to-pdf', async (req, res) => {
  const { fileName } = req.body;
  const uploadsDir = path.join(__dirname, '../uploads');
  const inputPath = path.join(uploadsDir, fileName);

  if (!fs.existsSync(inputPath)) {
    return res.status(404).json({ error: 'File tidak ditemukan di server' });
  }

  const outputFileName = fileName.replace(/\.(jpg|jpeg)$/i, '.pdf');
  const outputPath = path.join(outputDir, outputFileName);

  const doc = new PDFDocument();
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);
  doc.image(inputPath, {
    fit: [500, 700],
    align: 'center',
    valign: 'center',
  });
  doc.end();

  stream.on('finish', () => {
    const fileUrl = `${BASE_URL}/downloads/${outputFileName}`;
    res.json({ fileUrl });
  });

  stream.on('error', (err) => {
    console.error('Gagal membuat PDF:', err);
    res.status(500).json({ error: 'Gagal membuat PDF dari JPG' });
  });
});

// ✅ EXCEL to PDF
router.post('/excel-to-pdf', async (req, res) => {
  const { fileName } = req.body;
  const uploadsDir = path.join(__dirname, '../uploads');
  const filePath = path.join(uploadsDir, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File tidak ditemukan di server' });
  }

  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const response = await axios.post(
      'https://api.cloudmersive.com/convert/xlsx/to/pdf',
      form,
      {
        headers: {
          ...form.getHeaders(),
          'Apikey': CLOUDMERSIVE_API_KEY,
        },
        responseType: 'arraybuffer',
      }
    );

    const outputFileName = fileName.replace(/\.[^/.]+$/, '') + '.pdf';
    const outputPath = path.join(outputDir, outputFileName);
    fs.writeFileSync(outputPath, response.data);

    const fileUrl = `${BASE_URL}/downloads/${outputFileName}`;
    res.json({ fileUrl });
  } catch (err) {
    console.error('Error Cloudmersive Excel:', err.message);
    res.status(500).json({ error: 'Konversi Excel gagal' });
  }
});

module.exports = router;