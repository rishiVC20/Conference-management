const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    domain: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

module.exports = Counter;
