# Frontend App

This is the React frontend for the Note Application. It provides a user interface for authentication and notes management.

## What it does

- **User Interface**: Clean, responsive design for the note app
- **Authentication**: Sign up, login, and Google OAuth forms
- **Notes Management**: Create, view, and delete notes
- **User Experience**: Smooth navigation and error handling

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables**
   Create a `.env` file in the frontend folder:
   ```
   VITE_API_BASE=http://localhost:4000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   App runs on http://localhost:5173

## Pages

- **Signup Page**: User registration with name, email, and date of birth
- **Login Page**: User login with email and OTP
- **Welcome Page**: User dashboard with notes management
- **OTP Verification**: Simple OTP display for development for production needs to buy the service

## Features

- **React Router**: Navigation between pages
- **TypeScript**: Type-safe development
- **Axios**: API communication with backend
- **Google OAuth**: Sign in with Google account
- **Local Storage**: User session management
- **Responsive Design**: Works on desktop and mobile

## Deployment on Vercel

1. **Connect your GitHub repository** to Vercel
2. **Set project root** to the `frontend` folder
3. **Add environment variables**:
   - `VITE_API_BASE` - backend API URL (eg: https://note-application-plum.vercel.app/api)
   - `VITE_GOOGLE_CLIENT_ID` - Your Google OAuth client ID
4. **Deploy** - Vercel will automatically build and deploy

## Build

- **Development**: `npm run dev` - Hot reload development server
- **Production**: `npm run build` - Build for production
- **Vercel**: `npm run vercel-build` - Build for Vercel deployment

## Dependencies

- React 18 with TypeScript
- Vite for fast development
- React Router for navigation
- Axios for API calls
- Google OAuth integration
