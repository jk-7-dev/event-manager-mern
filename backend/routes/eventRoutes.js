import express from 'express';
import Event from '../models/Event.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Fetch all events
// @route   GET /api/events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Fetch single event
// @route   GET /api/events/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { title, description, date, location, price, image, totalTickets } = req.body;

  try {
    const event = new Event({
      title,
      description,
      date,
      location,
      price,
      image,
      totalTickets,
      availableTickets: totalTickets // Initially, available = total
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(400).json({ message: 'Invalid event data' });
  }
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      await event.deleteOne();
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;