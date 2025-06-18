require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'https://swizk-2.onrender.com',
  credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.get('/', (req, res) => {
  res.send('Couples Feeling-Based App API');
});

// Routes
app.use('/api/diary', require('./routes/diary'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/love-nudge', require('./routes/loveNudge'));
app.use('/api/mood', require('./routes/mood'));
app.use('/api/checklist', require('./routes/checklist'));
app.use('/api/goal', require('./routes/goal'));
app.use('/api/chat', require('./routes/chat'));
// TODO: Add routes for goals, reminders, chat

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
