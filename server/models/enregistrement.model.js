const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');  // Ensure the path is correct

const Enregistrement = sequelize.define('Enregistrement', {
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
  },
  offreId: { // New field for offre reference
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'offres', // Reference to the Offre model
      key: 'id',
    },
  }
}, {
  tableName: 'enregistrements', // Table name in the database
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  createdAt: 'created_at', 
  updatedAt: 'updated_at', // Custom name for updatedAt
});

// Export the model
module.exports = Enregistrement;
