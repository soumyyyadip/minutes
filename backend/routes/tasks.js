const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const { getTasks, updateTaskStatus } = require('../controllers/taskController');

router.get('/', auth, getTasks);
router.put('/:id', auth, updateTaskStatus);

module.exports = router;
