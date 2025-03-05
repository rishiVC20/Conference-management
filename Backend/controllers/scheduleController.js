const ScheduleService = require('../services/scheduleService');

const generateSchedule = async (req, res) => {
    try {
        const result = await ScheduleService.generateAndSaveSchedule();
        res.status(200).json({ message: 'Schedule generated and saved successfully!', result });
    } catch (err) {
        console.error("Error generating schedule:", err);
        res.status(500).json({ message: 'Failed to generate schedule', error: err.message });
    }
};

const Schedule = require('../models/Schedule');

const fetchSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.find()
            .populate({
                path: 'paper',
                populate: { path: 'presentors', select: 'name email' }  // assuming User schema has name and email
            })
            .sort({ room: 1, slot: 1 });

        res.status(200).json(schedule);
    } catch (err) {
        console.error("Error fetching schedule:", err);
        res.status(500).json({ message: 'Failed to fetch schedule', error: err.message });
    }
};

module.exports = { generateSchedule, fetchSchedule};
