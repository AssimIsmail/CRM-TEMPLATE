const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');  // Ensure the path is correct

const Document = sequelize.define('Document', {
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Assuming the name should not be empty
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false, // Assuming the type should not be empty
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false, // Assuming the URL should not be empty
    validate: {
      isUrl: true, // Validates that the string is a URL
    },
  },
  userId: { // New field for user reference
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Reference to the User model
      key: 'id',
    },
  }
}, {
  tableName: 'documents', // Table name in the database
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  createdAt: 'created_at', // Custom name for createdAt
  updatedAt: 'updated_at', // Custom name for updatedAt
});

// Export the model
module.exports = Document;
