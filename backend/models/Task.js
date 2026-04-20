const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  meetingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  assignee: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
