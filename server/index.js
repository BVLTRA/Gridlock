// Mystery copy paste file from some other file... basically a placeholder

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Allows React app to talk to this server
app.use(express.json()); // Tells Express how to read incoming JSON data

// Database Connection
const uri = process.env.MONGO_URI; 

mongoose.connect(uri)
  .then(() => console.log('✅ Connected to the Vault (MongoDB)'))
  .catch(err => console.error('❌ Database connection failed:', err));

// Test Route 
app.get('/', (req, res) => {
  res.send('Gridlock Server is running.');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});