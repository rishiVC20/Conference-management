const xlsx = require("xlsx");
const User = require("../models/paper");

const importPaperData = async (filePath) => {
    try {
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        let papers = [];

        for (const row of data) {
            console.log("Row data:", row);

            const domain = row.Domain ? row.Domain.trim() : "";
            const paperName = row.Name ? row.Name.trim() : "";
            const synopsis = row.synopsis ? row.synopsis.trim() : "";

            const preferredDate = row.preferedday ? new Date((row.preferedday - 25569) * 86400 * 1000) : null;

            // Extract presentor emails and trim them
            const presentorEmails = row.email.split(",").map(email => email.trim().toLowerCase());
            console.log("Extracted presentor emails:", presentorEmails);

            // Find presentors in MongoDB
            const presentorUsers = await User.find({ email: { $in: presentorEmails } });

            console.log(`Found ${presentorUsers.length} presentors for paper "${paperName}"`);

            // Ensure ALL presentors exist
            if (presentorUsers.length !== presentorEmails.length) {
                console.warn(`⚠️ Some presentors are missing for "${paperName}". Skipping insertion.`);
                continue;
            }

            // Convert presentors to ObjectIds
            const presentorIds = presentorUsers.map(user => user._id);

            papers.push({
                domain,
                paperName,
                presentors: presentorIds, // Ensuring ObjectId reference
                synopsis,
                preferredDate
            });
        }

        console.log("Final papers array before inserting:", JSON.stringify(papers, null, 2));

        // Insert only if papers exist
        if (papers.length > 0) {
            await Paper.insertMany(papers);
            console.log("✅ Papers successfully inserted!");
        } else {
            console.log("⚠️ No papers were inserted.");
        }

    } catch (error) {
        console.error("❌ Error importing paper data:", error);
    }
};

module.exports = importPaperData;
