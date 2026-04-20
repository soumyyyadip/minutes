const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const { getMeetings, getMeetingById, createMeeting, cancelMeeting } = require('../controllers/meetingController');

router.get('/', auth, getMeetings);
router.get('/:id', auth, getMeetingById);
router.post('/', auth, createMeeting);
router.put('/:id/cancel', auth, cancelMeeting);

module.exports = router;
