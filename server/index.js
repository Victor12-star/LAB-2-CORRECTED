// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // <-- laddar .env från roten

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/employees', require('./routes/employees'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/projectassignments', require('./routes/projectAssignments'));

// Debug
console.log("🔑 URI from env:", process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));
