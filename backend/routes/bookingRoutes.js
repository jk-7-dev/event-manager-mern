import express from 'express';
import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Logged in users only)
router.post('/', protect, async (req, res) => {
  const { eventId, count } = req.body;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.availableTickets < count) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    // Generate a simple unique Ticket ID
    const ticketId = `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const totalCost = event.price * count;

    // 1. Create the Booking
    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      ticketId,
      count,
      totalCost
    });

    // 2. Reduce the Available Tickets
    event.availableTickets -= count;
    await event.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/mybookings
// @access  Private
router.get('/mybookings', protect, async (req, res) => {
  try {
    // Find bookings for this user AND get the Event details (title, date, etc.)
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'title date location image')
      .sort({ bookingDate: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/', protect, admin, async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('event', 'title date');
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});
router.get('/verify/:ticketId', async (req, res) => {
  try {
    const booking = await Booking.findOne({ ticketId: req.params.ticketId })
      .populate('event', 'title location date image')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Ticket Not Found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});
export default router;