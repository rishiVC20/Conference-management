const express = require('express');
const router = express.Router();
const Paper = require('../models/paper');
const User = require('../models/User');
const { processExcelData, generateRoomName, TIME_SLOTS } = require('../utils/excelImporter');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const XLSX = require('xlsx');
const PaperController = require('../controllers/paperController');
const { adminAddPaper } = require('../controllers/paperController');
const { protect, authorize } = require('../middleware/auth');
const SpecialSession = require('../models/SpecialSession');
const { createNotificationHelper } = require('../controllers/notificationController');

// Constants
const PAPERS_PER_ROOM = 12;
const MAX_ROOMS_PER_DOMAIN = 10;
const ALLOWED_DATES = [
  '2026-01-09',
  '2026-01-10',
  '2026-01-11'
];

const CONFERENCE_DAYS = 3;

const calculateRoomsPerDay = (paperCount) => {
  const papersPerDay = Math.ceil(paperCount / CONFERENCE_DAYS);
  const roomsNeeded = Math.ceil(papersPerDay / PAPERS_PER_ROOM);
  return Math.min(roomsNeeded, MAX_ROOMS_PER_DOMAIN);
};


router.post('/admin-add', protect, authorize('admin'), adminAddPaper);

router.post('/import', async (req, res) => {
  try {
    const excelPath = path.join(__dirname, '../data/data.xlsx');
    const result = await processExcelData(excelPath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const papers = await Paper.find();
    const papersByDomain = papers.reduce((acc, paper) => {
      if (!acc[paper.domain]) {
        acc[paper.domain] = [];
      }
      acc[paper.domain].push(paper);
      return acc;
    }, {});

    res.json({
      success: true,
      data: papersByDomain
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/available-slots', async (req, res) => {
  try {
    const { domain, date } = req.query;
    if (!domain || !date) {
      return res.status(400).json({ success: false, message: 'Domain and date are required' });
    }

    if (!ALLOWED_DATES.includes(date.split('T')[0])) {
      return res.status(400).json({ 
        success: false, 
        message: 'Selected date is not available. Please choose from January 9-11, 2026' 
      });
    }

    // Get special sessions for the date
    const specialSessions = await SpecialSession.find({
      date: new Date(date)
    });

    const totalPapers = await Paper.countDocuments({ domain });
    const roomsNeeded = calculateRoomsPerDay(totalPapers);

    const occupiedSlots = await Paper.find({
      domain,
      'selectedSlot.date': new Date(date),
      'selectedSlot.room': { $ne: '' },
      'selectedSlot.session': { $ne: '' }
    }).select('selectedSlot');

    const rooms = Array.from({ length: roomsNeeded }, (_, i) => 
      generateRoomName(domain, i + 1)
    );

    const availableSlots = rooms.map(room => {
      // Get occupied slots for this room
      const occupiedTimeSlotsForRoom = occupiedSlots
        .filter(paper => paper.selectedSlot.room === room)
        .map(paper => paper.selectedSlot.session);

      // Get special sessions for this room
      const roomSpecialSessions = specialSessions.filter(
        session => session.room === room
      );

      // Calculate available slots considering special sessions
      const availableTimeSlots = TIME_SLOTS.filter(slot => {
        // Check if slot is not occupied by regular presentations
        const isOccupied = occupiedTimeSlotsForRoom.includes(slot);
        
        // Check if slot overlaps with any special session
        const hasSpecialSession = roomSpecialSessions.some(specialSession => {
          const slotStart = new Date(`1970-01-01T${slot.split(' - ')[0]}`);
          const slotEnd = new Date(`1970-01-01T${slot.split(' - ')[1]}`);
          const specialStart = new Date(`1970-01-01T${specialSession.startTime}`);
          const specialEnd = new Date(`1970-01-01T${specialSession.endTime}`);
          
          return (slotStart >= specialStart && slotStart < specialEnd) ||
                 (slotEnd > specialStart && slotEnd <= specialEnd);
        });

        return !isOccupied && !hasSpecialSession;
      });

      return {
        room,
        timeSlots: availableTimeSlots
      };
    }).filter(slot => slot.timeSlots.length > 0);

    res.json({
      success: true,
      data: {
        totalPapers,
        roomsNeeded,
        availableSlots
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/by-date', async (req, res) => {
  try {
    const { date } = req.query;
    console.log('Received date query:', date);

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    // Validate date format
    const parsedDate = new Date(date);
    console.log('Parsed date:', parsedDate);

    if (isNaN(parsedDate.getTime())) {
      console.log('Invalid date format received');
      return res.status(400).json({ success: false, message: 'Invalid date format' });
    }

    // Check if date is in allowed range
    const formattedDate = parsedDate.toISOString().split('T')[0];
    console.log('Formatted date:', formattedDate);
    console.log('Allowed dates:', ALLOWED_DATES);

    if (!ALLOWED_DATES.includes(formattedDate)) {
      console.log('Date not in allowed range:', formattedDate);
      return res.status(400).json({ 
        success: false, 
        message: 'Selected date is not available. Please choose from January 9-11, 2026' 
      });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    console.log('Querying date range:', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });

    // Get regular presentations
    const papers = await Paper.find({
      'selectedSlot.date': {
        $gte: startDate,
        $lte: endDate
      },
      'selectedSlot.room': { $ne: '' },
      'selectedSlot.session': { $ne: '' }
    }).sort({
      'selectedSlot.session': 1,
      'selectedSlot.room': 1
    });

    console.log('Found papers:', papers.length);
    console.log('Paper query result:', JSON.stringify(papers, null, 2));

    // Get special sessions
    const specialSessions = await SpecialSession.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({
      startTime: 1
    });

    console.log('Found special sessions:', specialSessions.length);
    console.log('Special sessions query result:', JSON.stringify(specialSessions, null, 2));

    // Combine and sort all events
    const allEvents = [
      ...papers.map(paper => ({
        ...paper.toObject(),
        isSpecialSession: false,
        eventType: 'presentation',
        selectedSlot: {
          ...paper.selectedSlot,
          timeSlot: paper.selectedSlot?.session || ''
        }
      })),
      ...specialSessions.map(session => ({
        ...session.toObject(),
        isSpecialSession: true,
        eventType: 'special',
        _id: session._id,
        title: session.title,
        speaker: session.speaker,
        room: session.room,
        sessionType: session.sessionType,
        startTime: session.startTime || '',
        endTime: session.endTime || '',
        session: session.session || '',
        description: session.description,
        selectedSlot: {
          date: session.date || '',
          room: session.room || '',
          timeSlot: session.session || ''
        }
      }))
    ].sort((a, b) => {
      // Get time values with fallbacks
      const timeA = a.isSpecialSession ? (a.startTime || '') : (a.selectedSlot?.timeSlot || '');
      const timeB = b.isSpecialSession ? (b.startTime || '') : (b.selectedSlot?.timeSlot || '');
      
      // If both times are empty, sort by title
      if (!timeA && !timeB) {
        return a.title.localeCompare(b.title);
      }
      // If one time is empty, put it at the end
      if (!timeA) return 1;
      if (!timeB) return -1;
      
      return timeA.localeCompare(timeB);
    });

    console.log('Combined events:', allEvents.length);

    res.json({
      success: true,
      data: allEvents
    });
  } catch (error) {
    console.error('Detailed error in /by-date route:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching papers and special sessions',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.get('/presenter', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const papers = await Paper.find({
      'presenters.email': email
    });

    res.json({
      success: true,
      data: papers
    });
  } catch (error) {
    console.error('Error fetching presenter papers:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Updated to use atomic controller method
router.post('/select-slot', async (req, res) => {
  try {
    const { paperId, date, room, session, presenterEmail } = req.body;

    // Validate all required fields
    if (!paperId || !date || !room || !session || !presenterEmail) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const paper = await Paper.findById(paperId);
    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Update the paper with the selected slot
    const updated = await Paper.findByIdAndUpdate(
      paperId,
      {
        selectedSlot: {
          date,
          room,
          timeSlot: session,
          bookedBy: presenterEmail
        }
      },
      { new: true }
    );

    // Create notifications for all presenters
    for (const presenter of paper.presenters) {
      await createNotificationHelper({
        title: 'Presentation Slot Selected',
        message: `A slot has been selected for "${paper.title}": Room ${room}, ${session} on ${date}`,
        type: 'success',
        recipient: presenter.email,
        relatedTo: paper._id
      });
    }

    // Create notifications for all attendees
    try {
      const attendees = await User.find({ role: 'attendee' });
      console.log('Found attendees:', attendees.length);
      
      for (const attendee of attendees) {
        console.log('Creating notification for attendee:', attendee.email);
        await createNotificationHelper({
          title: 'New Presentation Scheduled',
          message: `A new presentation "${paper.title}" has been scheduled in Room ${room}, ${session} on ${date}`,
          type: 'info',
          recipient: attendee.email,
          relatedTo: paper._id
        });
      }
    } catch (notifError) {
      console.error('Error creating notifications for attendees:', notifError);
    }

    // Create notifications for all admins
    try {
      const admins = await User.find({ role: 'admin' });
      console.log('Found admins:', admins.length);
      
      for (const admin of admins) {
        console.log('Creating notification for admin:', admin.email);
        await createNotificationHelper({
          title: 'Presentation Slot Selected',
          message: `A slot has been selected for "${paper.title}": Room ${room}, ${session} on ${date}`,
          type: 'info',
          recipient: admin.email,
          relatedTo: paper._id
        });
      }
    } catch (notifError) {
      console.error('Error creating notifications for admins:', notifError);
    }

    res.json({
      success: true,
      message: 'Slot selected successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }
    res.json({ success: true, data: paper });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/cleanup-duplicates', async (req, res) => {
  try {
    const result = await cleanupExistingDuplicates();
    res.json(result);
  } catch (error) {
    console.error('Error during cleanup:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id/presentation-status', async (req, res) => {
  try {
    const { presentationStatus } = req.body;
    console.log('Updating presentation status:', { id: req.params.id, presentationStatus });
    
    if (!presentationStatus) {
      return res.status(400).json({ success: false, message: 'Presentation status is required' });
    }

    const paper = await Paper.findByIdAndUpdate(
      req.params.id,
      { presentationStatus },
      { new: true }
    );

    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }

    console.log('Paper found:', paper);

    // Create notifications for all presenters
    for (const presenter of paper.presenters) {
      console.log('Creating notification for presenter:', presenter.email);
      try {
        const notification = await createNotificationHelper({
          title: 'Presentation Status Updated',
          message: `Your paper "${paper.title}" has been marked as ${presentationStatus}`,
          type: presentationStatus === 'Presented' ? 'success' : 
                presentationStatus === 'In Progress' ? 'info' :
                presentationStatus === 'Cancelled' ? 'error' : 'warning',
          recipient: presenter.email,
          relatedTo: paper._id
        });
        console.log('Notification created:', notification);
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
      }
    }

    // Create notifications for all attendees
    try {
      const attendees = await User.find({ role: 'attendee' });
      console.log('Found attendees:', attendees.length);
      
      for (const attendee of attendees) {
        console.log('Creating notification for attendee:', attendee.email);
        const notification = await createNotificationHelper({
          title: 'Paper Status Update',
          message: `The paper "${paper.title}" in Room ${paper.selectedSlot?.room} has been marked as ${presentationStatus}`,
          type: presentationStatus === 'Presented' ? 'success' : 
                presentationStatus === 'In Progress' ? 'info' :
                presentationStatus === 'Cancelled' ? 'error' : 'warning',
          recipient: attendee.email,
          relatedTo: paper._id
        });
        console.log('Notification created for attendee:', notification);
      }
    } catch (notifError) {
      console.error('Error creating notifications for attendees:', notifError);
    }

    // Create notifications for all admins
    try {
      const admins = await User.find({ role: 'admin' });
      console.log('Found admins:', admins.length);
      
      for (const admin of admins) {
        console.log('Creating notification for admin:', admin.email);
        const notification = await createNotificationHelper({
          title: 'Paper Status Update',
          message: `Paper "${paper.title}" in Room ${paper.selectedSlot?.room} has been marked as ${presentationStatus}`,
          type: presentationStatus === 'Presented' ? 'success' : 
                presentationStatus === 'In Progress' ? 'info' :
                presentationStatus === 'Cancelled' ? 'error' : 'warning',
          recipient: admin.email,
          relatedTo: paper._id
        });
        console.log('Notification created for admin:', notification);
      }
    } catch (notifError) {
      console.error('Error creating notifications for admins:', notifError);
    }

    res.json({
      success: true,
      message: 'Presentation status updated successfully',
      data: paper
    });
  } catch (error) {
    console.error('Error in presentation status update:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
