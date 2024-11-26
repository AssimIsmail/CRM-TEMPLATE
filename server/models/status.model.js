const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');  

const Status = sequelize.define('Status', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'statuses', // Nom de la table dans la base de données
  timestamps: true, // Ajoute les colonnes createdAt et updatedAt
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Exporter le modèle
module.exports = Status;
