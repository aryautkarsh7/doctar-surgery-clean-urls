import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  name: string;
  phone: string;
  disease: string;
  email?: string;
  patientEmail?: string;
  doctorSlug?: string;
  doctorName?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  hospital?: string;
  location?: string;
  status?: string;
  source?: string;
  createdAt?: Date;
}

const bookingSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    disease: { type: String, required: true },
    email: { type: String },
    patientEmail: { type: String },
    doctorSlug: { type: String },
    doctorName: { type: String, default: 'Not specified' },
    appointmentDate: { type: String, default: '' },
    appointmentTime: { type: String, default: '' },
    hospital: { type: String, default: 'Not specified' },
    location: { type: String, default: 'Not specified' },
    status: { type: String, default: 'pending' },
    source: { type: String, default: 'surgery.doctar.in' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IBooking>('Booking', bookingSchema);
