const express = require('express');

const BookingsRouter = express.Router();

const { bookTickets } = require('../controllers/booking.controller');
const { authMiddleware, userRoles } = require('../middlewares/auth.middleware');
// Book tickets for an event (only for attendees)

BookingsRouter.post('/', authMiddleware, userRoles('customer'), bookTickets);

module.exports = BookingsRouter;