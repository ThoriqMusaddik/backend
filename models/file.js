const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const File = sequelize.define('File', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER, // Ukuran file dalam byte
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING, // MIME type file
    allowNull: false,
  },
  path: {
    type: DataTypes.TEXT, // Lokasi penyimpanan file
    allowNull: false,
  },
  uploadedBy: {
    type: DataTypes.INTEGER, // ID pengguna yang mengunggah file
    allowNull: true,
  },
});

module.exports = File;
