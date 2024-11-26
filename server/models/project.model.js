const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');  // Assurez-vous que le chemin est correct

const Project = sequelize.define('Project', {
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  centreId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'centres',
      key: 'id',
    },
  },
}, {
  tableName: 'projects',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Exporter le modèle
module.exports = Project;
