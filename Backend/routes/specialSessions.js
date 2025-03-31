const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  addSpecialSession,
  getSpecialSessionsByDate,
  getAllSpecialSessions
} = require('../controllers/specialSessionController');
const SpecialSession = require('../models/SpecialSession');

// Add a new special session (Admin only)
router.post('/add', protect, authorize('admin'), addSpecialSession);

// Get special sessions by date
router.get('/by-date', getSpecialSessionsByDate);

// Get all special sessions (Admin only)
router.get('/all', protect, authorize('admin'), getAllSpecialSessions);

// Update special session status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status is required' 
      });
    }

    const session = await SpecialSession.findByIdAndUpdate(
      id,
      { presentationStatus: status },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ 
        success: false, 
        message: 'Special session not found' 
      });
    }

    res.json({
      success: true,
      message: 'Special session status updated successfully',
      data: session
    });
  } catch (error) {
    console.error('Error updating special session status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating special session status',
      error: error.message 
    });
  }
});

module.exports = router; 