const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./user.model'); // Corrected the file name to match the actual file

const Message = sequelize.define('Message', {
  from_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  to_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'messages',
  timestamps: false, // Gérer les temps explicitement
});

// Exporter le modèle
module.exports = Message;
