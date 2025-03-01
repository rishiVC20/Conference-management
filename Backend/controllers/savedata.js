const xlsx = require("xlsx");
const mongoose=require("mongoose");
const User = require("../models/user");
const Paper=require("../models/paper");
const path = require("path");
const filePath = path.join(__dirname, "../excel/Book1.xlsx");


const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

async function insertData() {
  try {
    const userMap = {}; // Store existing users to avoid duplicate entries
    const papersToInsert = [];

    for (const row of data) {
      const { Domain, Name, Presentors, contact, email, synopsis, preferedday } = row;

      const emails = email.split(",").map((e) => e.trim());
      const names = Presentors.split(",").map((n) => n.trim());
      //const phones = contact.split(",").map((p) => p.trim());
      const phones = String(contact || "").split(",").map((p) => p.trim());


      let presentorIDs = [];

      for (let i = 0; i < emails.length; i++) {
        const userEmail = emails[i];
        const userName = names[i] || "Unknown";
        const userPhone = phones[i] || "N/A";

        // Check if user exists
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
        presentors: { $all: presentorIDs, $size: presentorIDs.length },
      });

      if (existingPaper) {
        console.log(`⚠️ Paper "${Name}" already exists. Skipping insertion.`);
        continue;
      }

      try {
        const newPaper = await Paper.create({
          paperName: Name,
          domain: Domain,
          synopsis: synopsis,
          preferredDay: new Date(preferedday),
          presentors: presentorIDs,
        });

        console.log(`✅ Paper "${Name}" added successfully.`);
      } catch (paperError) {
        if (paperError.code === 11000) {
          console.log(`⚠️ Duplicate paper detected: ${Name}. Skipping.`);
        } else {
          console.error(`❌ Error inserting paper "${Name}":`, paperError);
        }
      }
    }
  } catch (error) {
    console.error("❌ Unexpected Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

      /*papersToInsert.push({
        paperName: Name,
        domain: Domain,
        synopsis: synopsis,
        preferredDay: new Date(preferedday),
        presentors: presentorIDs,
      });

      console.log("Presenter IDs for paper:", Name, presentorIDs);
    }

    console.log("📌 Papers to Insert:", JSON.stringify(papersToInsert, null, 2)); 
    const insertedPapers = await Paper.create(papersToInsert);
    console.log("Inserted Papers:", JSON.stringify(insertedPapers, null, 2));

  } catch (error) {
    console.error("Error:", error);
    mongoose.connection.close();
  }
}*/

module.exports=insertData;