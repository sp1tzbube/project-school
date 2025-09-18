const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const Profile = require('../models/Profile');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

// GET профіль
router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      // Створюємо дефолтний профіль
      profile = new Profile({
        name: 'Your Name',
        bio: 'Your bio here...',
        bioEn: 'Your bio here...',
        email: 'your@email.com',
        phone: '+1234567890'
      });
      await profile.save();
    } else if (!profile.bioEn) {
      // Migrate existing profile to include bioEn field
      profile.bioEn = profile.bio || 'Your bio here...';
      await profile.save();
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT оновлення профілю
router.put('/', async (req, res) => {
  try {
    console.log('Profile update request body:', req.body); // Debug log
    
    // Validate required fields with more flexible validation
    if (!req.body.name || !req.body.email || !req.body.phone) {
      return res.status(400).json({ 
        error: 'Required fields missing: name, email, phone' 
      });
    }
    
    // Set default values for bio fields if they're empty
    const updateData = {
      ...req.body,
      bio: req.body.bio || 'Your bio here...',
      bioEn: req.body.bioEn || 'Your bio here...'
    };

    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile(updateData);
    } else {
      Object.assign(profile, updateData);
      profile.updatedAt = new Date();
    }
    await profile.save();
    
    console.log('Profile updated successfully:', profile); // Debug log
    res.json(profile);
  } catch (error) {
    console.error('Profile update error:', error); // Debug log
    res.status(500).json({ error: error.message });
  }
});

// POST оновлення фото профілю
router.post('/photo', upload.single('photo'), async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Видаляємо старе фото з Cloudinary
    if (profile.photoPublicId) {
      await cloudinary.uploader.destroy(profile.photoPublicId);
    }
    
    profile.photo = req.file.path;
    profile.photoPublicId = req.file.filename;
    profile.updatedAt = new Date();
    await profile.save();
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;