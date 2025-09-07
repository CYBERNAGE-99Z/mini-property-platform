require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const Property = require('./models/Property');

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/propertydb';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@test.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// connect to Mongo
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Public endpoints
app.get('/api/properties', async (req, res) => {
  const props = await Property.find().sort({ createdAt: -1 });
  res.json(props);
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop) return res.status(404).json({ message: 'Not found' });
    res.json(prop);
  } catch (err) {
    res.status(400).json({ message: 'Invalid id' });
  }
});

// Admin endpoints require JWT
function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Missing token' });
  const token = auth.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded;
    if (req.user.email !== (process.env.ADMIN_EMAIL || ADMIN_EMAIL)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  });
}

app.post('/api/properties', verifyToken, async (req, res) => {
  try {
    const { title, price, location, image, description } = req.body;
    if (!title || !price || !location) return res.status(400).json({ message: 'Missing required fields' });
    const property = new Property({ title, price, location, image, description });
    await property.save();
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Simple login route — compares with the hardcoded admin (or .env)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD || ADMIN_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET || JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
