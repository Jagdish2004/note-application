# Backend API

This is the backend server for the Note Application. It handles user authentication, notes management, and database operations.

## What it does

- **User Management**: Sign up, login, and Google OAuth
- **Notes API**: Create, read, update, and delete notes
- **Security**: JWT authentication and password hashing
- **Database**: MongoDB connection and data storage

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables**
   Create a `.env` file in the backend folder:
   ```
   MONGODB_URI=mongodb://localhost:27017/note_app
   JWT_SECRET=your_secret_key_here
   GOOGLE_CLIENT_ID=your_google_client_id
   FRONTEND_ORIGIN=http://localhost:5173
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Server runs on http://localhost:4000

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/check-user/:email` - Check if user exists

### Notes
- `GET /api/notes` - Get user's notes
- `POST /api/notes` - Create new note
- `DELETE /api/notes/:id` - Delete note

## Deployment on Vercel

1. **Connect your GitHub repository** to Vercel
2. **Set project root** to the `backend` folder
3. **Add environment variables**:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string
   - `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
   - `FRONTEND_ORIGIN` - Your frontend URL (e.g., `https://note-application-t3lr.vercel.app`)
4. **Deploy** - Vercel will automatically build and deploy

## Database

- Uses MongoDB with Mongoose ODM
- Collections: `users`, `notes`
- Automatic connection management for serverless deployment

## Scripts

- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm run vercel-build` - Build for Vercel deployment
