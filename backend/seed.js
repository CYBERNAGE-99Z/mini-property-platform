require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('./models/Property');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/propertydb';

const sample = [
  { title: '2BHK Apartment in Noida', price: 2500000, location: 'Sector 62, Noida', image: 'https://media.istockphoto.com/id/474917902/photo/modern-architecture-design-100-for-house-bungalow.jpg?s=612x612&w=0&k=20&c=w5sBVyE-1ZmGmLdtK0F808826hMOyeVOiGYN2H17bOg=', description: 'Spacious 2BHK with parking and security.' },
  { title: '1RK Studio in Delhi', price: 1200000, location: 'Laxmi Nagar, Delhi', image: 'https://plus.unsplash.com/premium_photo-1661883982941-50af7720a6ff?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWFuJTIwaG91c2V8ZW58MHx8MHx8fDA%3D', description: 'Well connected & affordable studio.' }
];

mongoose.connect(MONGODB_URI).then(async () => {
  await Property.deleteMany({});
  await Property.insertMany(sample);
  console.log('Seed completed');
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
