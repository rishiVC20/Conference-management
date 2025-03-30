const express = require('express');
const router = express.Router();
const {
  addSpecialSession,
  getSpecialSessions
} = require('../controllers/specialSessionController');
const { protect, authorize } = require('../middleware/auth');

// Admin adds a session
router.post('/add', protect, authorize('admin'), addSpecialSession);

// Anyone can view all special sessions
router.get('/', getSpecialSessions);

module.exports = router;
