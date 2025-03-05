const express = require("express");
const Schedule = require("../models/schedule");

const router = express.Router();

// Existing routes...
const { generateAndSaveSchedule } = require("../services/scheduleService");

// Generate Schedule (POST)
router.post("/generate", async (req, res) => {
    try {
        const result = await generateAndSaveSchedule();
        res.json({
            message: "Schedule generated successfully",
            totalSessions: result.length
        });
    } catch (error) {
        console.error("❌ Error generating schedule:", error);
        res.status(500).json({ error: "Failed to generate schedule" });
    }
});

// Fetch Full Schedule (GET)
router.get("/", async (req, res) => {
    try {
        const schedule = await Schedule.find().populate({
            path: "paper",
            populate: { path: "presentors" }
        });

        res.json(groupScheduleData(schedule));
    } catch (error) {
        console.error("❌ Error fetching schedule:", error);
        res.status(500).json({ error: "Failed to fetch schedule" });
    }
});

// ✅ New: Search Schedule (GET)
router.get("/search", async (req, res) => {
    const { term, type } = req.query;

    try {
        const schedule = await Schedule.find().populate({
            path: "paper",
            populate: { path: "presentors" }
        });

        // If searching by teamID, convert term to uppercase (since paperId is saved in uppercase)
        const adjustedTerm = (type === "teamID") ? term.toUpperCase() : term.toLowerCase();

        const filtered = schedule.filter(entry => {
            const { paper } = entry;

            if (type === "teamID") {
                return paper.paperId.includes(adjustedTerm);  // Compare in uppercase
            } else if (type === "presenter") {
                return paper.presentors.some(p => p.name.toLowerCase().includes(adjustedTerm));
            } else if (type === "paperTitle") {
                return paper.paperName.toLowerCase().includes(adjustedTerm);
            } else {
                return true;  // Default: return all if type is not specified
            }
        });

        res.json(groupScheduleData(filtered));
    } catch (error) {
        console.error("❌ Error searching schedule:", error);
        res.status(500).json({ error: "Failed to search schedule" });
    }
});

// Helper to group data in { domain -> { room -> [sessions] } }
function groupScheduleData(schedule) {
    const groupedData = {};

    schedule.forEach(entry => {
        const domain = entry.paper.domain;
        const room = entry.room;

        if (!groupedData[domain]) groupedData[domain] = {};
        if (!groupedData[domain][room]) groupedData[domain][room] = [];

        groupedData[domain][room].push({
            time: entry.slot,
            day: entry.day,
            teamID: entry.paper.paperId,
            paperTitle: entry.paper.paperName,
            synopsis: entry.paper.synopsis,
            domain: entry.paper.domain,
            presenter: entry.paper.presentors.map(p => p.name).join(", "),
            presentorDetails: entry.paper.presentors.map(p => ({
                name: p.name,
                email: p.email,
                phoneNumber: p.phoneNumber
            }))
        });
    });

    return groupedData;
}

module.exports = router;
