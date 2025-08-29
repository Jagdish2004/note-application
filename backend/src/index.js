import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.js';
import notesRouter from './routes/notes.js';

dotenv.config();

const app = express();

const allowedOrigin = process.env.FRONTEND_ORIGIN || '*';//for now allowing all origins
app.use(cors({ origin: allowedOrigin, credentials: false }));
app.use(express.json());
app.use(cookieParser());

const mongoUri = process.env.MONGODB_URI;
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);

// Export app for serverless environments (e.g., Vercel)
export default app;

// Start local server only when not running in serverless
if (!process.env.VERCEL) {
  const port = Number(process.env.PORT) || 4000;
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}


