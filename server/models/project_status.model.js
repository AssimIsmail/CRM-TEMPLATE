const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');  // Ensure the path is correct

const ProjectStatus = sequelize.define('ProjectStatus', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'projects', // Reference to the Project model
      key: 'id',
    },
  },
  statusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'statuses', // Reference to the Status model
      key: 'id',
    },
  }
}, {
  tableName: 'project_status', // Table name in the database
  timestamps: false, // No timestamps for junction table
});

// Export the model
module.exports = ProjectStatus;
