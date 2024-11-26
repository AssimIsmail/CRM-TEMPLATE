const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); 

const Question = sequelize.define('Question', {
  titre: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  contenu: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'questions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Question;
