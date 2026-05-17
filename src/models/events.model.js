const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  date: { type: Date, default: Date.now, required: true ,format: 'YYYY-MM-DD'},
  totalTickets: { type: Number, required: true },
  availableTickets: { type: Number, required: true },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Event", eventSchema);