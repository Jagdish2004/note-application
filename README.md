# Note Application

A simple note-taking app where users can create, view, and delete notes after signing up or logging in.
Go Live : https://note-application-t3lr.vercel.app

## Features

- **User Authentication**: Sign up with email/OTP or Google account
- **Login**: Use email/OTP or Google to access your account
- **Notes Management**: Create and delete personal notes
- **Secure**: JWT-based authentication protects your data

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT tokens + Google OAuth

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Note-Application
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   # Add your .env file with database and Google OAuth credentials
   npm run dev
   ```

3. **Set up Frontend**
   ```bash
   cd frontend
   npm install
   # Add your .env file with API base URL
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4000

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
FRONTEND_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_BASE=http://localhost:4000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```


## Project Structure

```
Note-Application/
├── backend/          # Node.js API server
├── frontend/         # React TypeScript app
└── README.md         # This file
```
