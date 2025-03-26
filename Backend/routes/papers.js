const express = require('express');
const router = express.Router();
const Paper = require('../models/Paper');
const { processExcelData, generateRoomName, TIME_SLOTS } = require('../utils/excelImporter');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const XLSX = require('xlsx');
const PaperController = require('../controllers/paperController');
const { adminAddPaper } = require('../controllers/paperController');
const { protect, authorize } = require('../middleware/auth');

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

    const totalPapers = await Paper.countDocuments({ domain });
    const roomsNeeded = calculateRoomsPerDay(totalPapers);

    const occupiedSlots = await Paper.find({
      domain,
      'selectedSlot.date': new Date(date),
      'selectedSlot.room': { $ne: '' },
      'selectedSlot.timeSlot': { $ne: '' }
    }).select('selectedSlot');

    const rooms = Array.from({ length: roomsNeeded }, (_, i) => 
      generateRoomName(domain, i + 1)
    );

    const availableSlots = rooms.map(room => {
      const occupiedTimeSlotsForRoom = occupiedSlots
        .filter(paper => paper.selectedSlot.room === room)
        .map(paper => paper.selectedSlot.timeSlot);

      const availableTimeSlots = TIME_SLOTS.filter(
        slot => !occupiedTimeSlotsForRoom.includes(slot)
      );

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
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const papers = await Paper.find({
      'selectedSlot.date': {
        $gte: startDate,
        $lte: endDate
      },
      'selectedSlot.room': { $ne: '' },
      'selectedSlot.timeSlot': { $ne: '' }
    }).sort({
      'selectedSlot.timeSlot': 1,
      'selectedSlot.room': 1
    });

    const papersByTimeSlot = papers.reduce((acc, paper) => {
      const timeSlot = paper.selectedSlot.timeSlot;
      if (!acc[timeSlot]) {
        acc[timeSlot] = [];
      }
      acc[timeSlot].push(paper);
      return acc;
    }, {});

    res.json({
      success: true,
      data: papersByTimeSlot
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
router.post('/select-slot', PaperController.selectSlot);

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

    res.json({
      success: true,
      message: 'Presentation status updated successfully',
      data: paper
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
