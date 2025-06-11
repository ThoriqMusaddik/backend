const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE,     // Nama database
  process.env.MYSQLUSER,         // Username
  process.env.MYSQLPASSWORD,     // Password
  {
    host: process.env.MYSQLHOST, // Host dari Railway
    dialect: 'mysql',
    port: process.env.MYSQLPORT || 3306, // Default 3306 jika tidak ada
    logging: false, // Boleh true untuk debugging query
  }
);

module.exports = sequelize;