const Event = require("../models/events.model");
const queue = require("../jobs/queue.job");
const { notifyEventUpdate } = require("../jobs/working.job");

const createEvent = async (req, res) => {
  const{title, description, date, totalTickets, availableTickets} = req.body;
  if (!title || !date || !totalTickets || !availableTickets) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
  const event = await Event.create({
    title,
    description,
    date,
    totalTickets,
    organizer: req.user.id,
    availableTickets: totalTickets
  });
  res.json(event);
} catch (error) {
  res.status(500).json({ message: 'Error creating event' });
}
};

const updateEvent = async (req, res) => {

  console.log("Update Event Request Body:", req.body);
try {
  const event = await Event.findById(req.params.id);

if (!event) return res.status(404).send("Event not found");

Object.assign(event, req.body);

await event.save();

  // Background Job Trigger
  queue.add(() => notifyEventUpdate(event._id), {
  retries: 2
});

  res.json(event);
} catch (error) {
  res.status(500).json({ message: 'Error updating event' ,error: error.message});
}
};

const getEvents = async (req, res) => {
  try {
  const events = await Event.find();
  res.json(events);
} catch (error) {
  res.status(500).json({ message: 'Error fetching events' });
}
};

module.exports = { getEvents, createEvent, updateEvent };