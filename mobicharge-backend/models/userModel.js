const db = require('../config/db');

const User = {
  findByEmail: (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], callback);
  },
  
  create: (userData, callback) => {
    const { fullName, address, phone, email, password, role } = userData;
    const query = 'INSERT INTO users (fullName, address, phone, email, password, role) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [fullName, address, phone, email, password, role || 'user'], callback);
  },

  findById: (userId, callback) => {
    const query = 'SELECT * FROM users WHERE user_id = ?';
    db.query(query, [userId], callback);
  },

  updateById: (userId, updatedData, callback) => {
    const { fullName, phone, address, email } = updatedData;
    const query = 'UPDATE users SET fullName = ?, phone = ?, address = ?, email = ? WHERE user_id = ?';
    console.log('SQL Query:', query);
    console.log('Values:', [fullName, phone, address, email, userId]); // Check if email is being passed
    db.query(query, [fullName, phone, address, email, userId], callback);
  },
  
  
};

module.exports = User;
