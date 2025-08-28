import express from 'express';
import Joi from 'joi';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { signJwtForUser } from '../middleware/auth.js';

const router = express.Router();

const client = new OAuth2Client();

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(50).required(),
  dateOfBirth: Joi.date().max('now').required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Simple signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const { email, name, dateOfBirth } = value;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists. Please login instead.' });
    }

    // Create user
    const user = await User.create({
      email,
      name,
      dateOfBirth: new Date(dateOfBirth),
    });

    const token = signJwtForUser(user);
    return res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name,
        dateOfBirth: user.dateOfBirth 
      } 
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Signup failed' });
  }
});

// Simple login endpoint
router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const { email } = value;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found. Please signup first.' });
    }

    const token = signJwtForUser(user);
    return res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name,
        dateOfBirth: user.dateOfBirth 
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// Check if user exists (for login validation)
router.get('/check-user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ exists: true });
  } catch (err) {
    console.error('Check user error:', err);
    res.status(500).json({ error: 'Failed to check user' });
  }
});

// Google OAuth
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      console.error('Google OAuth: Missing idToken in request body');
      return res.status(400).json({ error: 'Missing idToken' });
    }
    
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      console.error('Google OAuth: GOOGLE_CLIENT_ID environment variable not set');
      return res.status(500).json({ error: 'Google OAuth not configured' });
    }
    
    console.log('Google OAuth: Attempting to verify token with client ID:', googleClientId);
    
    const ticket = await client.verifyIdToken({ 
      idToken, 
      audience: googleClientId 
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const googleId = payload.sub;
    const name = payload.name || payload.email.split('@')[0];

    console.log('Google OAuth: Token verified successfully for email:', email);

    let user = await User.findOne({ $or: [{ googleId }, { email }] });
    if (!user) {
      // For Google signup, set a default DOB (user can update later)
      const defaultDOB = new Date('1990-01-01');
      user = await User.create({ 
        email, 
        googleId, 
        name, 
        dateOfBirth: defaultDOB 
      });
      console.log('Google OAuth: Created new user:', user.email);
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
      console.log('Google OAuth: Updated existing user with Google ID:', user.email);
    } else {
      console.log('Google OAuth: User already exists:', user.email);
    }

    const token = signJwtForUser(user);
    console.log('Google OAuth: Successfully generated token for user:', user.email);
    
    return res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name,
        dateOfBirth: user.dateOfBirth 
      } 
    });
  } catch (err) {
    console.error('Google OAuth error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    if (err.message.includes('Invalid token')) {
      return res.status(400).json({ error: 'Invalid Google token' });
    } else if (err.message.includes('Token used too late')) {
      return res.status(400).json({ error: 'Google token expired' });
    } else if (err.message.includes('Wrong number of segments')) {
      return res.status(400).json({ error: 'Invalid token format' });
    }
    
    return res.status(400).json({ error: 'Google authentication failed: ' + err.message });
  }
});

export default router;
