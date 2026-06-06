const mongoose = require('mongoose');

const doctorClaimSchema = new mongoose.Schema({
  doctorSlug: String,
  doctorName: { type: String, required: true },
  claimantName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  regNumber: String,            // Medical Registration Number
  message: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('DoctorClaim', doctorClaimSchema);
