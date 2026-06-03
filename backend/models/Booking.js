const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    disease: { type: String, required: true },
    status: { type: String, default: 'pending' },
    source: { type: String, default: 'surgery.doctar.in' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);