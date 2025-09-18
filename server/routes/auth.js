const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    
    // Get the admin password from environment variables
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin2024'; // Fallback for development
    
    // For now, we'll use simple comparison, but in production you should use bcrypt
    // const isValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    const isValid = password === adminPassword;
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { role: 'admin', timestamp: Date.now() },
      process.env.JWT_SECRET || 'your-fallback-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({ 
      success: true, 
      token,
      message: 'Authentication successful' 
    });
    
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Server error during authentication' });
  }
});

// Verify token middleware (for protecting other routes)
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-fallback-secret-key');
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Verify token endpoint
router.post('/verify', verifyToken, (req, res) => {
  res.json({ valid: true, admin: req.admin });
});

module.exports = router;
