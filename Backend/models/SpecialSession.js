const mongoose = require('mongoose');

const specialSessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  speaker: {
    type: String,
    default: '' // Optional, in case of cultural/inauguration sessions
  },
  date: {
    type: Date,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['keynote', 'guest', 'cultural', 'inauguration', 'other'],
    required: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SpecialSession', specialSessionSchema);
