const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const JWT_SECRET = '7124';

const getUserProfile = (req, res) => {
  const userId = req.user.user_id;

  User.findById(userId, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ profile: results[0] });
  });
};

const updateUserProfile = (req, res) => {
  const userId = req.user.user_id;
  const { fullName, phone, address, email } = req.body; // Make sure email is included

  if (!fullName || !phone || !address || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  User.updateById(userId, { fullName, phone, address, email }, (err, result) => {
    if (err) {
      console.error('Error updating user profile:', err);
      return res.status(500).json({ message: 'Failed to update profile' });
    }
    return res.status(200).json({ message: 'Profile updated successfully' });
  });
};

module.exports = { getUserProfile, updateUserProfile };
