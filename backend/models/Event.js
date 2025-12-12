import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // URL for the event image
  totalTickets: { type: Number, required: true },
  availableTickets: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);