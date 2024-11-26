const Event = require('../models/event.model'); 

const getAllEvents = async () => {
  return await Event.findAll();
};

const getEventById = async (id) => {
  return await Event.findByPk(id);
};

const getEventsByUserId = async (userId) => {
  return await Event.findAll({ where: { userId } });
};

const createEvent = async (eventData) => {
  return await Event.create(eventData);
};

const updateEvent = async (id, eventData) => {
  const event = await Event.findByPk(id);
  if (event) {
    return await event.update(eventData);
  }
  return null;
};

const deleteEvent = async (id) => {
  const event = await Event.findByPk(id);
  if (event) {
    await event.destroy();
    return true;
  }
  return false;
};

module.exports = {
  getAllEvents,
  getEventById,
  getEventsByUserId,
  createEvent,
  updateEvent,
  deleteEvent,
};
