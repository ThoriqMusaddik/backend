const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Download = sequelize.define('Download', {
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: true, // Boleh null jika user tidak login
  },
  size: {
    type: DataTypes.INTEGER, // Ukuran file dalam byte
    allowNull: true,
  },
  downloadedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Download;