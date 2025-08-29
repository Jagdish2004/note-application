import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.js';
import notesRouter from './routes/notes.js';

dotenv.config();

const app = express();

const allowedOriginsEnv = process.env.FRONTEND_ORIGIN || '';
const allowedOrigins = allowedOriginsEnv
  ? allowedOriginsEnv.split(',').map((s) => s.trim()).filter(Boolean)
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin/server-side or tools without origin
      if (!origin) return callback(null, true);
      // Allow configured origins
      if (allowedOrigins.length > 0 && allowedOrigins.includes(origin)) return callback(null, true);
      // Dev convenience
      if (origin.startsWith('http://localhost:5173') || origin.startsWith('http://127.0.0.1:5173')) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: false,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());
app.use(cookieParser());

// Safety remap: if clients call without /api prefix in production, remap to /api
app.use((req, _res, next) => {
  if (req.url.startsWith('/auth/') || req.url === '/auth' || req.url.startsWith('/notes/')) {
    req.url = `/api${req.url}`;
  }
  next();
});

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


