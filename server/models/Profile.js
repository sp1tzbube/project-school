const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  bioEn: { type: String, required: true },
  photo: { type: String, default: '' },
  photoPublicId: { type: String, default: '' },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', profileSchema);