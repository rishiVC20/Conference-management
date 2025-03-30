const SpecialSession = require('../models/SpecialSession');

// Add a special session (Admin only)
exports.addSpecialSession = async (req, res) => {
  try {
    const { type, title, speaker, description, date, timeSlot, room } = req.body;

    if (!type || !title || !date || !timeSlot || !room) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const existingSession = await SpecialSession.findOne({
      date,
      timeSlot,
      room
    });

    if (existingSession) {
      return res.status(409).json({
        success: false,
        message: 'A session already exists at this time and room'
      });
    }

    const newSession = await SpecialSession.create({
      type,
      title,
      speaker,
      description,
      date,
      timeSlot,
      room
    });

    res.status(201).json({
      success: true,
      message: 'Special session added successfully',
      data: newSession
    });
  } catch (error) {
    console.error('Error adding special session:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all special sessions
exports.getSpecialSessions = async (req, res) => {
  try {
    const sessions = await SpecialSession.find().sort({ date: 1, timeSlot: 1 });
    res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    console.error('Error fetching special sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
