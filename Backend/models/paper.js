const mongoose = require('mongoose');
const Counter = require('./Counter');  // Import the new counter model

const paperSchema = new mongoose.Schema({
    paperId: {
        type: String,
        unique: true
    },
    domain: {
        type: String,
        required: true
    },
    paperName: {
        type: String,
        required: true
    },
    presentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    synopsis: {
        type: String,
        required: true
    },
    prefered_date: {  // make sure it's the correct field name in schema and Excel import
        type: Date,
    }
}, { timestamps: true });

// Use per-domain counter to generate unique paperId
paperSchema.pre('save', async function(next) {
    if (!this.paperId) {
        const counter = await Counter.findOneAndUpdate(
            { domain: this.domain },
            { $inc: { count: 1 } },
            { upsert: true, new: true }
        );
        this.paperId = `${this.domain.toUpperCase()}${String(counter.count).padStart(3, '0')}`;
    }
    next();
});

// ✅ Prevent OverwriteModelError
const Paper = mongoose.models.Paper || mongoose.model('Paper', paperSchema);

module.exports = Paper;
