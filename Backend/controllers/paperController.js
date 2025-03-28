const Paper = require('../models/Paper');
const XLSX = require('xlsx');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { generateTeamId } = require('../utils/excelImporter');



const generatePaperId = (domain, count) => {
  const domainPrefix = domain.substring(0, 3).toUpperCase();
  const year = new Date().getFullYear();
  const sequence = String(count + 1).padStart(3, '0');
  return `${domainPrefix}${year}${sequence}`;
};

const importPapers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const workbook = XLSX.read(req.file.buffer);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const domainCounts = {};
    const existingPapers = await Paper.find({}, 'domain paperId');
    existingPapers.forEach(paper => {
      const domain = paper.domain;
      domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    });

    const papers = [];
    for (const row of data) {
      const domain = row.domain;
      domainCounts[domain] = domainCounts[domain] || 0;

      const paperId = generatePaperId(domain, domainCounts[domain]);
      domainCounts[domain]++;

      const paper = {
        title: row.title,
        domain: domain,
        synopsis: row.synopsis,
        paperId: paperId,
        presenters: row.presenters.split(';').map(presenterStr => {
          const [name, email, phone] = presenterStr.split(',').map(s => s.trim());
          return { name, email, phone };
        })
      };
      papers.push(paper);
    }

    await Paper.insertMany(papers);

    res.status(200).json({
      success: true,
      message: 'Papers imported successfully',
      count: papers.length
    });
  } catch (error) {
    console.error('Error importing papers:', error);
    res.status(500).json({
      success: false,
      message: 'Error importing papers',
      error: error.message
    });
  }
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// const sendSlotConfirmationEmail = async (paper) => {
//   const { presenters, title, domain, selectedSlot } = paper;
//   const { date, room, timeSlot } = selectedSlot;
//   const formattedDate = new Date(date).toLocaleDateString();

//   const mailOptions = {
//     from: process.env.MAIL_USER,
//     to: presenters.map(p => p.email),
//     subject: `Slot Confirmation for Paper: ${title}`,
//     text: `Dear Presenter(s),

// Your presentation slot has been confirmed for the following paper:

// Title: ${title}
// Domain: ${domain}
// Date: ${formattedDate}
// Room: ${room}
// Time Slot: ${timeSlot}

// Please be present at least 15 minutes before your scheduled time.

// This is an auto-generated message. Please do not reply.

// Regards,
// Conference Management Team`
//   };

//   // 🐞 Log before sending
//   console.log('Sending email to:', mailOptions.to);

//   // 🔍 Wrap in try-catch to log if failure occurs
//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email sent successfully:', info.response);
//   } catch (error) {
//     console.error('❌ Error sending email:', error);
//   }
// };


const sendSlotConfirmationEmail = async (paper) => {
  const { presenters, title, domain, selectedSlot } = paper;
  const { date, room, session } = selectedSlot; // session replaces timeSlot
  const formattedDate = new Date(date).toLocaleDateString();

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: presenters.map(p => p.email),
    subject: `Session Confirmation for Paper: ${title}`,
    text: `Dear Presenter(s),

Your presentation session has been confirmed for the following paper:

Title: ${title}
Domain: ${domain}
Date: ${formattedDate}
Room: ${room}
Session: ${session}

Please be present at least 15 minutes before your scheduled time.

This is an auto-generated message. Please do not reply.

Regards,  
Conference Management Team`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};


const selectSlot = async (req, res) => {
  try {
    const { paperId, date, room, session, presenterEmail } = req.body; // session replaces timeSlot

    const paper = await Paper.findById(paperId);
    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }
    console.log(":::::::::::::::::::::");
    // Ensure no more than 6 bookings per session in a room
    const sessionCount = await Paper.countDocuments({
      'selectedSlot.date': date,
      'selectedSlot.room': room,
      'selectedSlot.session': session
    });

    if (sessionCount >= 6) {
      return res.status(409).json({
        success: false,
        message: `Session ${session} in Room ${room} is already fully booked`
      });
    }

    // Update paper with session instead of time slot
    const updated = await Paper.findOneAndUpdate(
      { _id: paperId },
      {
        selectedSlot: {
          date,
          room,
          session, // Store "Session 1" or "Session 2"
          bookedBy: presenterEmail
        }
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(409).json({
        success: false,
        message: 'Session is no longer available. Please choose a different session.'
      });
    }

    await sendSlotConfirmationEmail(updated);

    res.status(200).json({
      success: true,
      message: 'Session selected and confirmation email sent.',
      data: updated
    });
  } catch (error) {
    console.error('Error selecting session:', error);
    res.status(500).json({
      success: false,
      message: 'Error selecting session',
      error: error.message
    });
  }
};



const adminAddPaper = async (req, res) => {
  try {
    const { title, domain, synopsis, presenters } = req.body;

    // Basic validation
    if (!title || !domain || !synopsis || !Array.isArray(presenters) || presenters.length === 0) {
      return res.status(400).json({ success: false, message: 'All fields are required including at least one presenter.' });
    }

    // Count existing papers in the domain to generate teamId
    const count = await Paper.countDocuments({ domain });
    const teamId = generateTeamId(domain, count);

    const newPaper = new Paper({
      title,
      domain,
      synopsis,
      paperId: teamId,
      teamId: teamId,
      presenters,
      selectedSlot: {
        date: null,
        room: '',
        timeSlot: '',
        bookedBy: '',
        isSlotAllocated: false
      },
      presentationStatus: 'Scheduled'
    });

    await newPaper.save();

    res.status(201).json({ success: true, message: 'Paper added successfully', data: newPaper });

  } catch (error) {
    console.error('Error adding paper:', error);
    res.status(500).json({ success: false, message: 'Error adding paper', error: error.message });
  }
};


module.exports = {
  importPapers,
  selectSlot,
  adminAddPaper
};
