const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');  // Ensure the path is correct

const Event = sequelize.define('Event', {
  title: {
    type: DataTypes.STRING,
    allowNull: false, // Assuming the title should not be empty
  },
  start: {
    type: DataTypes.DATE,
    allowNull: false, // Assuming the start date should not be empty
  },
  end: {
    type: DataTypes.DATE,
    allowNull: false, // Assuming the end date should not be empty
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true, // Description can be nullable
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false, // Assuming the type should not be empty
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
  tableName: 'events', // Table name in the database
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  createdAt: 'created_at', // Custom name for createdAt
  updatedAt: 'updated_at', // Custom name for updatedAt
});

// Export the model
module.exports = Event;
