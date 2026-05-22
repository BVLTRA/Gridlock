require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const auth = require('./middleware/auth');

// JWT library
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI; 

mongoose.connect(uri)
  .then(() => console.log('✅ Connected to the Vault (MongoDB)'))
  .catch(err => console.error('❌ Database connection failed:', err));

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, gridString } = req.body;

    if (!name || !email || !gridString) {
      return res.status(400).json({ error: 'Name, email, and grid password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const newUser = new User({ name, email, gridHash: gridString });
    await newUser.save();

    // Generate the Token
    // Sign the user's unique database ID and set the token to expire in 7 days
    const token = jwt.sign(
      { userId: newUser._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      message: 'Account secured and created successfully!',
      user: { name: newUser.name, email: newUser.email },
      token: token // Sending token back
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, gridString } = req.body;

    if (!email || !gridString) {
      return res.status(400).json({ error: 'Email and grid password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or crafting key.' });
    }

    const isMatch = await user.compareGrid(gridString);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or crafting key.' });
    }

    // Generate the Token for returning users
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      message: 'Authentication successful! Access granted.',
      user: { name: user.name, email: user.email },
      token: token // Sending the real token back
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// --- PROTECTED NOTEBOOK ROUTES ---

// GET: Fetch the user's saved notes
app.get('/api/notes', auth, async (req, res) => {
  try {
    // req.user.userId comes directly from our JWT middleware
    const user = await User.findById(req.user.userId);
    res.status(200).json({ notes: user.notes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes.' });
  }
});

// PUT: Update the user's notes
app.put('/api/notes', auth, async (req, res) => {
  try {
    const { notes } = req.body;
    
    // Find the user and update their notes field 
    await User.findByIdAndUpdate(req.user.userId, { notes: notes });
    
    res.status(200).json({ message: 'Notes saved.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save notes.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});