const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const Gallery = require('../models/Gallery');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gallery',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

// GET всі фото галереї
router.get('/', async (req, res) => {
  try {
    const photos = await Gallery.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST нове фото
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const newPhoto = new Gallery({
      imageUrl: req.file.path,
      publicId: req.file.filename,
      description: req.body.description || ''
    });
    await newPhoto.save();
    res.json(newPhoto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT оновлення опису фото
router.put('/:id', async (req, res) => {
  try {
    const updated = await Gallery.findByIdAndUpdate(
      req.params.id, 
      { description: req.body.description },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE фото
router.delete('/:id', async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    if (photo) {
      // Видаляємо з Cloudinary
      await cloudinary.uploader.destroy(photo.publicId);
      // Видаляємо з бази даних
      await Gallery.findByIdAndDelete(req.params.id);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;