const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');  // Ensure the path is correct

const Tache = sequelize.define('Tache', {
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
  priority: {
    type: DataTypes.STRING(50),
    allowNull: true, // Nullable field for priority
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: true, // Nullable field for status
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: true, // Nullable field for tag
  },
  path: {
    type: DataTypes.STRING,
    allowNull: true, // Nullable field for path
  },
  assignee: {
    type: DataTypes.STRING,
    allowNull: true, // Nullable field for assignee
  },
  trashed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Default value for trashed is FALSE
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
  tableName: 'taches', // Table name in the database
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  createdAt: 'created_at', // Custom name for createdAt
  updatedAt: 'updated_at', // Custom name for updatedAt
});

// Export the model
module.exports = Tache;
