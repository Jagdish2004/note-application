# Backend Environment Variables

Create a `.env` file in `backend/` with the following variables:

PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/note_app
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id_here

Notes:
- GOOGLE_CLIENT_ID is required for Google login. Create OAuth 2.0 Client ID (Web) and add your front-end origin and authorized JS origins.
- Email OTP is now handled by EmailJS on the frontend.
