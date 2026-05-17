const express = require('express');

const eventsRouter = express.Router();

const { getEvents, createEvent, updateEvent } = require('../controllers/event.controller');
const { authMiddleware, userRoles } = require('../middlewares/auth.middleware');

// Get all events
eventsRouter.get('/',authMiddleware, getEvents);

// Create new event (only for organizers)
eventsRouter.post('/', authMiddleware, userRoles('organizer'), createEvent);
eventsRouter.put("/event/:id", authMiddleware, userRoles('organizer'), updateEvent);

module.exports = eventsRouter;



