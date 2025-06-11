const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Jika pakai DATABASE_URL (Railway style)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false, // <-- kunci penting biar self-signed certificate diterima
      },
    },
  });
} else {
  // Jika pakai variabel lama
  sequelize = new Sequelize(
    process.env.MYSQLDATABASE,
    process.env.MYSQLUSER,
    process.env.MYSQLPASSWORD,
    {
      host: process.env.MYSQLHOST,
      port: process.env.MYSQLPORT,
      dialect: 'mysql',
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }
  );
}

module.exports = sequelize;