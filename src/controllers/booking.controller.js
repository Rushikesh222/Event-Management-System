// controllers/bookingController.js
const Booking = require("../models/bookings.model");
const Event = require("../models/events.model");
const queue = require("../jobs/queue.job");
const { sendBookingConfirmation } = require("../jobs/working.job");

const bookTickets = async (req, res) => {
  const { eventId, tickets } = req.body;

  if (!eventId || !tickets) {
    return res.status(400).send("Missing required fields");
  }

  const event = await Event.findById(eventId);
  if (event.availableTickets < tickets) {
    return res.status(400).send("Not enough tickets");
  }

  event.availableTickets -= tickets;
  await event.save();

  const booking = await Booking.create({
    user: req.user.id,
    event: eventId,
    tickets
  });

  // Background Job Trigger
  queue.add(() => sendBookingConfirmation(req.user.id), {
  retries: 3,
  delay: 500
});

  res.json(booking);
};

module.exports = { bookTickets };