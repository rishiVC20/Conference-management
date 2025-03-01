const mongoose = require('mongoose');
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
    prefered_date : {
        type: Date,
    }
}, { timestamps: true });

paperSchema.index({ paperName: 1, domain: 1, presentors: 1 }, { unique: true });

paperSchema.pre('save', async function(next) {
    if (!this.paperId) {
        const count = await mongoose.model('Paper').countDocuments({ domain: this.domain }) + 1;
        this.paperId = `${this.domain.toUpperCase()}${String(count).padStart(3, '0')}`;
    }
    next();
});


const Paper = mongoose.model('Paper', paperSchema);
module.exports = Paper;
