const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');  // Ensure the path is correct

const Note = sequelize.define('Note', {
  thumb: {
    type: DataTypes.STRING,
    allowNull: true, // Nullable field for thumbnail
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false, // Title should not be empty
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true, // Nullable field for description
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false, // Date should not be empty
  },
  is_fav: {
    type: DataTypes.BOOLEAN,
    allowNull: true, // Nullable field for favorite status
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: true, // Nullable field for tag
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
  tableName: 'notes', // Table name in the database
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  createdAt: 'created_at', // Custom name for createdAt
  updatedAt: 'updated_at', // Custom name for updatedAt
});

// Export the model
module.exports = Note;
