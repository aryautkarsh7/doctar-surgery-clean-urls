import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type EmergencyBookingReason = 'Accident' | 'Cardiac' | 'Breathing' | 'Stroke' | 'Other';
export type EmergencyBookingStatus = 'pending' | 'confirmed' | 'dispatched' | 'completed' | 'cancelled';

export interface IEmergencyBooking {
  patientName: string;
  phone: string;
  pickupLocation: string;
  reason: EmergencyBookingReason;
  notes: string;
  ambulance?: Types.ObjectId | null;
  confirmationCode?: string;
  status: EmergencyBookingStatus;
  source: string;
  createdAt: Date;
}

export interface EmergencyBookingDoc extends IEmergencyBooking, Document {}

const emergencyBookingSchema = new Schema({
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  pickupLocation: { type: String, default: '' },
  reason: {
    type: String,
    enum: ['Accident', 'Cardiac', 'Breathing', 'Stroke', 'Other'],
    default: 'Other',
  },
  notes: { type: String, default: '' },
  ambulance: { type: Schema.Types.ObjectId, ref: 'Ambulance' },
  confirmationCode: { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'dispatched', 'completed', 'cancelled'],
    default: 'pending',
  },
  source: { type: String, default: 'emergency.doctar.in' },
  createdAt: { type: Date, default: Date.now },
});

// Own, dedicated collection — a genuinely separate concept from SurgeryBooking.
const EmergencyBooking: Model<EmergencyBookingDoc> =
  mongoose.model<EmergencyBookingDoc>('EmergencyBooking', emergencyBookingSchema, 'emergencybookings');
export default EmergencyBooking;
