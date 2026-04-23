const Meeting = require('../models/Meeting');

// Helper: parse stored date ("YYYY-MM-DD") + time ("2:30 PM") into a JS Date
function isMeetingPast(meeting) {
  const dateStr = meeting.date; // "YYYY-MM-DD"
  const timeStr = (meeting.time || '').trim();
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match) {
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    const pad = n => String(n).padStart(2, '0');
    const dt = new Date(`${dateStr}T${pad(h)}:${pad(m)}:00`);
    return dt < new Date();
  }
  // No parseable time — treat end-of-day as the cutoff
  return new Date(`${dateStr}T23:59:59`) < new Date();
}

// GET /api/meetings
exports.getMeetings = async (req, res) => {
  try {
    const query = { createdBy: req.user.id };
    if (req.query.search) {
      const re = { $regex: req.query.search, $options: 'i' };
      query.$or = [
        { title: re },
        { minutes: re },
        { decisions: re },
        { 'actionItems.text': re },
        { 'participants.name': re },
      ];
    }
    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }

    let meetings = await Meeting.find(query).sort({ date: -1 });

    // Auto-correct stale 'upcoming' meetings whose datetime has already passed
    const staleIds = meetings
      .filter(m => m.status === 'upcoming' && isMeetingPast(m))
      .map(m => m._id);

    if (staleIds.length > 0) {
      await Meeting.updateMany(
        { _id: { $in: staleIds } },
        { $set: { status: 'completed' } }
      );
      meetings = meetings.map(m =>
        staleIds.some(id => id.equals(m._id))
          ? Object.assign(m.toObject(), { status: 'completed' })
          : m
      );
    }

    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET /api/meetings/:id
exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/meetings
exports.createMeeting = async (req, res) => {
  try {
    const { title, date, time, status, participants, minutes, notes, decisions, actionItems } = req.body;
    const meeting = new Meeting({
      title, date,
      time: time || '10:00 AM',
      status: status || 'upcoming',
      participants: participants || [],
      minutes: minutes || '',
      notes: notes || '',
      decisions: decisions || [],
      actionItems: actionItems || [],
      createdBy: req.user.id
    });
    await meeting.save();
    res.status(201).json(meeting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PATCH /api/meetings/:id  — update any fields (minutes, decisions, actionItems, status, etc.)
exports.updateMeeting = async (req, res) => {
  try {
    const allowedFields = ['title', 'date', 'time', 'status', 'participants', 'minutes', 'notes', 'decisions', 'actionItems'];
    const updates = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const meeting = await Meeting.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
    res.json(meeting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/meetings/:id
exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
    res.json({ message: 'Meeting deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
