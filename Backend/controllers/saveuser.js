const xlsx = require("xlsx");
const User = require("../models/user");

const importUserData = async (filePath) => {
    try {
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        let usersToInsert = [];

        for (const row of data) {
            const presentors = row.Presentors.split(",").map(p => p.trim());
            const contacts = row.contact.split(",").map(c => c.trim());
            const emails = row.email.split(",").map(e => e.trim());

            if (presentors.length !== contacts.length || presentors.length !== emails.length) {
                console.warn("⚠️ Skipping row due to mismatch in Presentors, Contacts, and Emails.");
                continue;
            }

            for (let i = 0; i < presentors.length; i++) {
                usersToInsert.push({
                    name: presentors[i],
                    phoneNumber: contacts[i],
                    email: emails[i],
                    username: emails[i].split("@")[0],
                    password: "defaultPassword123",
                    role: "presentor"
                });
            }
        }

        // **Insert only new users, ignoring duplicates automatically**
        await User.insertMany(usersToInsert, { ordered: false, lean: true })
            .then(() => console.log(`✅ Successfully inserted users!`))
            .catch(err => console.warn("⚠️ Some users already exist. Ignoring duplicates."));

    } catch (error) {
        console.error("❌ Error importing presentor data:", error);
    }
};

module.exports = importUserData;
