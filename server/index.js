require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const User = require('./models/User');

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI; 

mongoose.connect(uri)
  .then(() => console.log('✅ Connected to the Vault (MongoDB)'))
  .catch(err => console.error('❌ Database connection failed:', err));

// --- REGISTRATION ENDPOINT ---
app.post('/api/register', async (req, res) => {
  try {
   
    const { email, gridString } = req.body;

    // Surface-level validation
    if (!email || !gridString) {
      // 400 means "Bad Request" - the user forgot a required field
      return res.status(400).json({ error: 'Email and grid password are required.' });
    }

    // Check for duplicates
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // Construct the User
    // Notice how the code is passing the raw 'gridString' into the 'gridHash' field.
    // Because of the 'pre-save' hook i wrote in User.js, Mongoose will intercept 
    // this raw string, hash it, and swap it out before it ever hits the database. 
    // so like, dont worry
    const newUser = new User({
      email: email,
      gridHash: gridString 
    });

    // Commit to the database
    await newUser.save();

    // 201 means "Created"
    res.status(201).json({ message: 'Account secured and created successfully!' });

  } catch (error) {
    // 500 means "Internal Server Error" - the server broke down
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// --- THE LOGIN ENDPOINT ---
app.post('/api/login', async (req, res) => {
  try {
    const { email, gridString } = req.body;

    if (!email || !gridString) {
      return res.status(400).json({ error: 'Email and grid password are required.' });
    }

    // Find user
    const user = await User.findOne({ email });
    
    // Security mechanism: We give a generic error for both wrong email and wrong password. 
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or crafting key.' });
    }

    // Verification 
    const isMatch = await user.compareGrid(gridString);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or crafting key.' });
    }

    // YAYYYY
    // Where i intend togenerate a JWT (JSON Web Token) here.
    res.status(200).json({ message: 'Authentication successful! Access granted.' });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});