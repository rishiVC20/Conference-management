const express = require("express");
const { generateAndSaveSchedule } = require("../services/scheduleService");
const Schedule = require("../models/schedule");

const router = express.Router();

// ✅ API to Generate and Save the Schedule
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

// ✅ API to Fetch the Saved Schedule (For Display)
router.get("/", async (req, res) => {
    try {
        const schedule = await Schedule.find().populate({
            path: "paper",
            populate: { path: "presentors" }
        });

        const groupedData = {};

        schedule.forEach(entry => {
            const domain = entry.paper.domain;
            const room = entry.room;

            if (!groupedData[domain]) groupedData[domain] = {};
            if (!groupedData[domain][room]) groupedData[domain][room] = [];

            groupedData[domain][room].push({
                time: entry.slot,
                teamID: entry.paper.paperId,
                presenter: entry.paper.presentors.map(p => p.name).join(", "),
                paperTitle: entry.paper.paperName,
                synopsis: entry.paper.synopsis
            });
        });

        res.json(groupedData);
    } catch (error) {
        console.error("❌ Error fetching schedule:", error);
        res.status(500).json({ error: "Failed to fetch schedule" });
    }
});

module.exports = router;
