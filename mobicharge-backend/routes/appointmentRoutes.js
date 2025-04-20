const express = require('express');
const {
  bookAppointment,
  getAppointments,
  updatePaymentStatus,
  completeChargingSession,
  startAppointment // 👈 include it here
} = require('../controllers/appointmentController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();
const db = require("../config/db");

// Book appointment
router.post('/book', authenticateToken, bookAppointment);

// Get all appointments
router.get('/getAppointments', getAppointments);

// Update payment status
router.post('/updatePaymentStatus', updatePaymentStatus);

// Complete charging session
router.post('/completeChargingSession', completeChargingSession);

// Cancel appointment
router.put('/cancel/:id', async (req, res) => {
  const appointmentId = req.params.id;
  try {
    const [result] = await db.promise().query(
      'UPDATE appointments SET status = ? WHERE id = ?',
      ['Cancelled', appointmentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ ADD THIS: Update status to 'Ongoing'
router.patch('/updateStatus/:id', startAppointment);

module.exports = router;
