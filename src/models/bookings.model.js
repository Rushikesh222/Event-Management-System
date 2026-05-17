// models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  },
  tickets: { type: Number, required: true }
});

module.exports = mongoose.model("Booking", bookingSchema);