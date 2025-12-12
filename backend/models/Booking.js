import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  ticketId: { type: String, required: true, unique: true },
  count: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now }
});

export default mongoose.model('Booking', bookingSchema);