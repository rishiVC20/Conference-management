const Paper = require('../models/Paper');
const Schedule = require('../models/Schedule');

const startTime = 9 * 60; // 9:00 AM
const presentationDuration = 30; // 30 minutes per session
const maxSlotsPerRoom = 12;

const breaks = [
    { start: 11 * 60, duration: 20, label: "Short Break" },
    { start: 13 * 60 + 20, duration: 40, label: "Lunch Break" }
];

const generateAndSaveSchedule = async () => {
    const papersByDomain = await Paper.find().populate('presentors');

    const domainGroups = papersByDomain.reduce((acc, paper) => {
        if (!acc[paper.domain]) acc[paper.domain] = [];
        acc[paper.domain].push(paper);
        return acc;
    }, {});

    const roomMapping = generateRoomMapping(domainGroups);

    const schedule = scheduleTimetable(domainGroups, roomMapping);

    // Clear existing schedule (optional, depends on your use case)
    await Schedule.deleteMany();

    // Save new schedule
    const savedSchedule = [];
    for (const domain of Object.keys(schedule)) {
        for (const roomSchedule of schedule[domain]) {
            for (const session of roomSchedule.schedule) {
                if (session.paperId) {
                    const scheduleEntry = new Schedule({
                        paper: session.paperId,
                        room: roomSchedule.room,
                        day: 1, // Adjust if multi-day
                        slot: session.time
                    });
                    savedSchedule.push(await scheduleEntry.save());
                }
            }
        }
    }

    return savedSchedule;
};

function generateRoomMapping(domainGroups) {
    const mapping = {};
    let roomCounter = 1;

    for (const domain in domainGroups) {
        const papers = domainGroups[domain];
        mapping[domain] = [];

        let currentRoomPapers = [];
        for (const paper of papers) {
            if (currentRoomPapers.length === maxSlotsPerRoom) {
                mapping[domain].push(`Room ${roomCounter}`);
                roomCounter++;
                currentRoomPapers = [];
            }
            currentRoomPapers.push(paper);
        }

        if (currentRoomPapers.length > 0) {
            mapping[domain].push(`Room ${roomCounter}`);
            roomCounter++;
        }
    }
    return mapping;
}

function scheduleTimetable(domainGroups, roomMapping) {
    const timetable = {};

    for (const domain in domainGroups) {
        const papers = domainGroups[domain];
        timetable[domain] = [];

        let currentRoomPapers = [];
        let currentRoomStart = startTime;
        let roomIndex = 0;

        for (const paper of papers) {
            if (currentRoomPapers.length === maxSlotsPerRoom) {
                timetable[domain].push({
                    room: roomMapping[domain][roomIndex],
                    schedule: createRoomSchedule(currentRoomPapers, currentRoomStart)
                });
                roomIndex++;
                currentRoomPapers = [];
                currentRoomStart = startTime;
            }
            currentRoomPapers.push(paper);
        }

        if (currentRoomPapers.length > 0) {
            timetable[domain].push({
                room: roomMapping[domain][roomIndex],
                schedule: createRoomSchedule(currentRoomPapers, currentRoomStart)
            });
        }
    }
    return timetable;
}

function createRoomSchedule(papers, start) {
    const roomSchedule = [];
    let currentTime = start;

    for (const paper of papers) {
        breaks.forEach(b => {
            if (currentTime >= b.start && currentTime < b.start + b.duration) {
                roomSchedule.push({
                    time: `${formatTime(b.start)} - ${formatTime(b.start + b.duration)}`,
                    paperId: null,
                    paperTitle: b.label,
                    synopsis: "Break Time"
                });
                currentTime = b.start + b.duration;
            }
        });

        if (currentTime > 13 * 60 + 20 && currentTime < 14 * 60) {
            currentTime = 14 * 60;
        }

        const finishTime = currentTime + presentationDuration;
        roomSchedule.push({
            time: `${formatTime(currentTime)} - ${formatTime(finishTime)}`,
            paperId: paper._id,
            paperTitle: paper.paperName,
            synopsis: paper.synopsis,
            startTime: currentTime,
            finishTime: finishTime
        });

        currentTime = finishTime;
    }

    return roomSchedule;
}

function formatTime(minutes) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

module.exports = { generateAndSaveSchedule };
