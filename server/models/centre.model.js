// models/Centre.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');  

const Centre = sequelize.define('Centre', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'centres',
  timestamps: true,
});

// Exporter le modèle avant de définir les relations
module.exports = Centre;
