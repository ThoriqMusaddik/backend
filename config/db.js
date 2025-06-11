const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('db_pdfkita', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
