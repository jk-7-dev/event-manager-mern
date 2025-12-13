import express from 'express';
import Event from '../models/Event.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

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
      availableTickets: totalTickets
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(400).json({ message: 'Invalid event data' });
  }
});


router.put('/:id', protect, admin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      event.title = req.body.title || event.title;
      event.description = req.body.description || event.description;
      event.date = req.body.date || event.date;
      event.location = req.body.location || event.location;
      event.price = req.body.price || event.price;
      event.totalTickets = req.body.totalTickets || event.totalTickets;
      event.availableTickets = req.body.totalTickets || event.availableTickets; 
      event.image = req.body.image || event.image;

      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

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