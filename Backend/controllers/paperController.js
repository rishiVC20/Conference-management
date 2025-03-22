const Paper = require('../models/Paper');
const XLSX = require('xlsx');
const nodemailer = require('nodemailer');
require('dotenv').config();


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

const sendSlotConfirmationEmail = async (paper) => {
  const { presenters, title, domain, selectedSlot } = paper;
  const { date, room, timeSlot } = selectedSlot;
  const formattedDate = new Date(date).toLocaleDateString();

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: presenters.map(p => p.email),
    subject: `Slot Confirmation for Paper: ${title}`,
    text: `Dear Presenter(s),

Your presentation slot has been confirmed for the following paper:

Title: ${title}
Domain: ${domain}
Date: ${formattedDate}
Room: ${room}
Time Slot: ${timeSlot}

Please be present at least 15 minutes before your scheduled time.

This is an auto-generated message. Please do not reply.

Regards,
Conference Management Team`
  };

  // 🐞 Log before sending
  console.log('Sending email to:', mailOptions.to);

  // 🔍 Wrap in try-catch to log if failure occurs
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};


const selectSlot = async (req, res) => {
  try {
    const { paperId, date, room, timeSlot, presenterEmail } = req.body;

    const paper = await Paper.findById(paperId);
    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }

    const existingBooking = await Paper.findOne({
      _id: { $ne: paperId },
      'selectedSlot.date': date,
      'selectedSlot.room': room,
      'selectedSlot.timeSlot': timeSlot
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: 'Slot already booked by another presenter'
      });
    }

    const updated = await Paper.findOneAndUpdate(
      {
        _id: paperId,
        $or: [
          { 'selectedSlot.bookedBy': presenterEmail },
          { 'selectedSlot': { $exists: false } },
          {
            'selectedSlot.date': { $ne: date },
            'selectedSlot.room': { $ne: room },
            'selectedSlot.timeSlot': { $ne: timeSlot }
          }
        ]
      },
      {
        selectedSlot: {
          date,
          room,
          timeSlot,
          bookedBy: presenterEmail
        }
      },
      {
        new: true
      }
    );

    if (!updated) {
      return res.status(409).json({
        success: false,
        message: 'Slot is no longer available. Please choose a different slot.'
      });
    }

    await sendSlotConfirmationEmail(updated);

    res.status(200).json({
      success: true,
      message: 'Slot selected and confirmation email sent.',
      data: updated
    });
  } catch (error) {
    console.error('Error selecting slot:', error);
    res.status(500).json({
      success: false,
      message: 'Error selecting slot',
      error: error.message
    });
  }
};

module.exports = {
  importPapers,
  selectSlot
};
