const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['available', 'rented', 'sold'], default: 'available' },
  type: { type: String, enum: ['rent', 'sale'], required: true },
  images: [{ url: String, publicId: String }],
  location: { type: String },
  rooms: { type: Number },
  area: { type: Number },
  floor: { type: Number },
  builtYear: { type: Number },
  features: [{ type: String }], // e.g. ['sauna', 'autopark', 'balcony']
  deposit: { type: Number },
  utilities: { type: Number },
  availableFrom: { type: Date },
  contact: {
    name: String,
    phone: String,
    email: String,
    whatsapp: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Apartment', apartmentSchema);