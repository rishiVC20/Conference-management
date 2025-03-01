const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const Paper = require('./models/paper'); 
const importUserData=require('./controllers/saveuser');
const importPaperData=require('./controllers/saveppr');
const User = require('./models/user'); 
const insertData=require('./controllers/savedata');
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
//app.use('/api/presenters', require('./routes/presenterRoutes'));

app.get('/', (req, res) => {
    res.send('server running on port 5000');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


/*const importData = async () => {
    try {
        console.log("Starting data import...");

        // Ensure users are imported first
        await importUserData(filePath);
        console.log("Presentor data imported successfully!");

        // Only after users are imported, import paper data
        await importPaperData(filePath);
        console.log("Paper data successfully imported!");
        
    } catch (error) {
        console.error("Error importing data:", error);
    }
};*/

User.find().then(users => console.log(users));

insertData();
//importPaperData(filePath);

// Run the import process
//importData();


