const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');  

const User = sequelize.define('User', {
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('SUPER_ADMIN', 'ADMIN', 'SOUS_ADMIN', 'PARTENAIRE', 'VENDEUR', 'PROSPECTEUR', 'USER'),
    allowNull: false,
  },
  profile: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  centreId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Centres',
      key: 'id',
    },
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Exporter le modèle avant de définir les relations
module.exports = User;
