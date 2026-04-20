const Meeting = require('../models/Meeting');
const Task = require('../models/Task');

exports.getMeetings = async (req, res) => {
  try {
    const query = { createdBy: req.user.id };
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { minutes: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    const meetings = await Meeting.find(query).sort({ date: -1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMeeting = async (req, res) => {
  try {
    const { title, date, participants, minutes, decisions, tasks } = req.body;
    const meeting = new Meeting({ 
      title, date, participants, minutes, decisions, createdBy: req.user.id 
    });
    await meeting.save();

    if (tasks && tasks.length > 0) {
      const taskDocs = tasks.map(t => ({
        meetingId: meeting._id,
        description: t.description,
        assignee: t.assignee,
        status: t.status || 'Pending'
      }));
      await Task.insertMany(taskDocs);
    }

    res.status(201).json(meeting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.cancelMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { status: 'Cancelled' },
      { new: true }
    );
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });

    // Optionally set tasks to Cancelled/Pending
    await Task.updateMany({ meetingId: meeting._id }, { status: 'Pending' });

    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
