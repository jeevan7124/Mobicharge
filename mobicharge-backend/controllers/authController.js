const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = '7124';

const register = (req, res) => {
  const { fullName, address, phone, email, password, role } = req.body;
  if (!fullName || !address || !phone || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  User.findByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length > 0) return res.status(400).json({ message: 'Email already exists' });

    User.create({ fullName, address, phone, email, password, role }, (err, result) => {
      if (err) return res.status(500).json({ message: 'Error registering user' });

      const userId = result.insertId;
      const token = jwt.sign({ user_id: userId, email, role: role || 'user' }, JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ message: 'User registered successfully', token });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Please fill in all fields' });

  User.findByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0 || password !== results[0].password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = results[0];
    const token = jwt.sign({ user_id: user.user_id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token, role: user.role });
  });
};
const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    // Verify Google ID Token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture } = decodedToken;

    // Check if user exists in DB, if not, create new user
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name,
        profilePic: picture,
        role: "user", // Default role
      });

      await user.save();
    }

    // Generate JWT token for session
    const token = jwt.sign({ id: user._id, role: user.role }, "7124", { expiresIn: "7d" });

    res.json({ token, user });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: "Invalid Google login" });
  }
};


module.exports = { register, login, googleLogin };
