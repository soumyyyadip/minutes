const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  participants: [{
    type: String,
  }],
  minutes: {
    type: String,
  },
  decisions: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['Scheduled', 'Cancelled'],
    default: 'Scheduled'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);
