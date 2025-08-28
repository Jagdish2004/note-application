import express from 'express';
import Joi from 'joi';
import Note from '../models/Note.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const noteSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  content: Joi.string().allow('').max(5000).default(''),
});

router.use(requireAuth);

router.get('/', async (req, res) => {
  const notes = await Note.find({ userId: req.user.userId }).sort({ createdAt: -1 });
  res.json({ notes });
});

router.post('/', async (req, res) => {
  const { error, value } = noteSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const note = await Note.create({ userId: req.user.userId, ...value });
  res.status(201).json({ note });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deleted = await Note.findOneAndDelete({ _id: id, userId: req.user.userId });
  if (!deleted) return res.status(404).json({ error: 'Note not found' });
  res.json({ success: true });
});

export default router;


