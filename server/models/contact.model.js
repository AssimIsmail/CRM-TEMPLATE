const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./user.model'); // Corrected the file name to match the actual file

const Contact = sequelize.define('Contact', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  contact_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  last_message_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  last_message_preview: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending', // Default status for new contacts
  },
}, {
  tableName: 'contacts',
  timestamps: false, // Pas nécessaire ici, sauf si vous voulez suivre des modifications
});

// Exporter le modèle
module.exports = Contact;
