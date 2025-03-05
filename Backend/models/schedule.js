const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  paper: { type: mongoose.Schema.Types.ObjectId, ref: "Paper", required: true },
  room: { type: String, required: true },
  day: { type: Number, required: true }, // Day 1, Day 2, etc.
  slot: { type: String, required: true } // e.g., "10:30 AM - 11:00 AM"
}, { timestamps: true });

const Schedule = mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;
