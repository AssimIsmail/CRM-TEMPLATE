const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');  // Ensure the path is correct

const Reponse = sequelize.define('Reponse', {
  contenu: {
    type: DataTypes.TEXT,
    allowNull: false, // Assuming the content should not be empty
  },
  userId: { // New field for user reference
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', 
      key: 'id',
    },
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'questions', 
      key: 'id',
    },
  }
}, {
  tableName: 'reponses',
  timestamps: true, 
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Export the model
module.exports = Reponse;
