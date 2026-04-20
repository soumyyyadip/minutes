const Task = require('../models/Task');
const Meeting = require('../models/Meeting');

exports.getTasks = async (req, res) => {
  try {
    const userMeetings = await Meeting.find({ createdBy: req.user.id }).select('_id');
    const filter = { meetingId: { $in: userMeetings } };
    
    if (req.query.meetingId) {
      filter.meetingId = req.query.meetingId;
    }
    const tasks = await Task.find(filter).populate('meetingId', 'title date').sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let task = await Task.findById(req.params.id).populate('meetingId');
    if (!task || String(task.meetingId.createdBy) !== String(req.user.id)) {
      return res.status(404).json({ error: 'Task not found or access denied' });
    }
    task.status = status;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
