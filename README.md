# Note Application (React + Node + MongoDB)

Full-stack notes app with OTP/Google auth, JWT-secured notes, React (TypeScript) frontend, Node.js backend, and MongoDB.

## Structure
- `frontend/` React + Vite (TypeScript)
- `backend/` Express + Mongoose + JWT

## Prerequisites
- Node 18+
- MongoDB (Atlas or local)

## Environment
- Backend: see `backend/ENVIRONMENT.md`
- Frontend: see `frontend/ENVIRONMENT.md`

## Local Development
```bash
# Backend
cd backend
npm install
cp .env.example .env  # create and fill values if you have an example, else see ENVIRONMENT.md
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```
- Frontend runs on http://localhost:5173
- Backend runs on http://localhost:4000

## Production (Vercel)
Both `frontend/` and `backend/` are configured for Vercel deployments.

### Backend on Vercel
- Project root: `backend/`
- Build Command: `npm run vercel-build`
- Output: N/A (Serverless)
- Root `vercel.json` inside `backend/` routes all to `server.js`
- Set Environment Variables in Vercel:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `GOOGLE_CLIENT_ID`
  - `FRONTEND_ORIGIN` (e.g., `https://your-frontend.vercel.app`)

### Frontend on Vercel
- Project root: `frontend/`
- Build Command: `npm run vercel-build`
- Output Directory: `dist`
- Environment Variables:
  - `VITE_API_BASE` = `https://your-backend.vercel.app/api`
  - `VITE_GOOGLE_CLIENT_ID`

## Notes
- CORS is restricted in production to `FRONTEND_ORIGIN`.
- OTP is shown on screen for development simplicity.

## Testing
- Build frontend: `cd frontend && npm run build`
- Build backend: no build required. Run `npm start` locally.
