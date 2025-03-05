const xlsx = require("xlsx");
const mongoose = require("mongoose");
const User = require("../models/user");
const Paper = require("../models/paper");
const path = require("path");

const filePath = path.join(__dirname, "../excel/Book1.xlsx");

const insertData = async () => {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for (const row of data) {
        const { Domain, Name, Presentors, contact, email, synopsis, preferedday } = row;

        const emails = email.split(",").map(e => e.trim().toLowerCase());
        const names = Presentors.split(",").map(n => n.trim());
        const phones = String(contact || "").split(",").map(p => p.trim());

        let presentorIDs = [];

        for (let i = 0; i < emails.length; i++) {
            const userEmail = emails[i];
            const userName = names[i] || `Unknown ${i + 1}`;
            const userPhone = phones[i] || "N/A";

            let user = await User.findOne({ email: userEmail });

            if (!user) {
                user = await User.create({
                    name: userName,
                    email: userEmail,
                    phoneNumber: userPhone,
                    role: "presentor",
                });
            }

            presentorIDs.push(user._id);
        }

        const existingPaper = await Paper.findOne({
            paperName: Name,
            domain: Domain,
            presentors: { $all: presentorIDs }
        }).lean();

        if (existingPaper && existingPaper.presentors.length === presentorIDs.length) {
            console.log(`⚠️ Paper "${Name}" with exact same presenters already exists. Skipping insertion.`);
            continue;
        }

        try {
            const newPaper = await Paper.create({
                paperName: Name,
                domain: Domain,
                synopsis: synopsis,
                prefered_date: new Date(preferedday),  // Make sure date format is correct in Excel
                presentors: presentorIDs,
            });

            console.log(`✅ Paper "${Name}" added successfully.`);
        } catch (paperError) {
            if (paperError.code === 11000) {
                console.log(`Duplicate paper detected: ${Name}. Skipping.`);
            } else {
                console.error(`❌ Error inserting paper "${Name}":`, paperError);
            }
        }
    }
};

module.exports = { insertData };
