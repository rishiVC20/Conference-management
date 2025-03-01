const mongoose = require('mongoose');
require('dotenv').config();
// MongoDB Connection Function

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    }
};

// Export Connection Function
module.exports = connectDB;
