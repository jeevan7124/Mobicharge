const db = require('../config/db');

const Appointment = {
  create: (appointmentData, callback) => {
    const { userId, chargingType, batteryCapacity, carModel, carNumber, ownerName, phoneNumber, location, cost } = appointmentData;

    // Validate required fields
    if (!userId || !chargingType || !batteryCapacity || !carModel || !carNumber || !ownerName || !phoneNumber || !location) {
      return callback(new Error('All required fields must be provided'), null);
    }

    const query = 'INSERT INTO appointments (user_id, chargingType, batteryCapacity, carModel, carNumber, ownerName, phoneNumber, location, cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [userId, chargingType, batteryCapacity, carModel, carNumber, ownerName, phoneNumber, location, cost], (err, result) => {
      if (err) {
        console.error('Database error in Appointment.create:', err);
        return callback(err, null);
      }
      callback(null, result);
    });
  },

  getAll: (callback) => {
    const query = 'SELECT id, user_id AS userId, chargingType, batteryCapacity, carModel, carNumber, ownerName, phoneNumber, location, cost, status, paymentStatus FROM appointments';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database error in Appointment.getAll:', err);
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  updatePaymentStatus: (appointmentId, paymentMethod, callback) => {
    const query = 'UPDATE appointments SET paymentStatus = ?, paymentMethod = ? WHERE id = ?';
    db.query(query, ['Paid', paymentMethod, appointmentId], (err, result) => {
      if (err) {
        console.error('Database error in Appointment.updatePaymentStatus:', err);
        return callback(err, null);
      }
      callback(null, result);
    });
  },

  endChargingSession: (appointmentId, callback) => {
    const query = 'UPDATE appointments SET status = "Completed" WHERE id = ?';
    db.query(query, [appointmentId], (err, result) => {
      if (err) {
        console.error('Database error in Appointment.endChargingSession:', err);
        return callback(err, null);
      }
      callback(null, result);
    });
  },

  updateStatus: (id, status, callback) => {
    const query = 'UPDATE appointments SET status = ? WHERE id = ?';
    db.query(query, [status, id], (err, result) => {
      if (err) {
        console.error('Database error in Appointment.updateStatus:', err);
        return callback(err, null);
      }
      callback(null, result);
    });
  }
};

module.exports = Appointment;