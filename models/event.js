const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  startDateTime: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: [],
    },
  ],
  eventId: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("event", eventSchema);
