const jwt = require('jsonwebtoken');
const Appointment = require('../models/appointmentModel');
const db = require("../config/db"); 
const JWT_SECRET = '7124';

// Book an Appointment 
const bookAppointment = (req, res) => {
    const { chargingType, batteryCapacity, carModel, carNumber, ownerName, phoneNumber, location } = req.body;
    
    // Optional Token Check (Remove if not needed)
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(403).json({ message: 'Token missing' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });

        let cost = chargingType === 'normal' ? (batteryCapacity * 12) * 1.1 : (batteryCapacity * 20) * 1.1;
        Appointment.create({
            userId: decoded.user_id, chargingType, batteryCapacity, carModel, carNumber, ownerName, phoneNumber, location, cost
        }, (err, result) => {
            if (err) return res.status(500).json({ message: 'Error booking appointment' });
            res.status(201).json({ message: 'Appointment booked successfully', appointmentId: result.insertId });
        });
    });
};

// Fetch All Appointments (No Authentication Required)
const getAppointments = (req, res) => {
    Appointment.getAll((err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching appointments' });
        res.status(200).json(results);
    });
};

// Update payment status to 'Paid'
const updatePaymentStatus = (req, res) => {
    const { appointmentId, paymentMethod } = req.body;

    if (!appointmentId || !paymentMethod) {
        return res.status(400).json({ message: "Appointment ID and payment method are required." });
    }

    const query = 'UPDATE appointments SET paymentStatus = "Paid", paymentMethod = ? WHERE id = ?';

    db.query(query, [paymentMethod, appointmentId], (err, result) => {
        if (err) {
            console.error("Error updating payment status:", err);
            return res.status(500).json({ message: "Error updating payment status" });
        }
        res.status(200).json({ message: "Payment status updated successfully" });
    });
};

// Update status to 'Completed'
const completeChargingSession = (req, res) => {
    const { appointmentId } = req.body;

    if (!appointmentId) {
        return res.status(400).json({ message: "Appointment ID is required" });
    }

    const query = 'UPDATE appointments SET status = "Completed" WHERE id = ?';

    db.query(query, [appointmentId], (err, result) => {
        if (err) {
            console.error("Error updating appointment status:", err);
            return res.status(500).json({ message: "Error ending charging session" });
        }
        res.status(200).json({ message: "Charging session completed successfully" });
    });
};

// Update status to 'Ongoing' (No authentication required)
const startAppointment = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`Attempting to start appointment ID: ${id}, Request body:`, JSON.stringify(req.body)); // Debug

    if (!id || !status || status !== 'Ongoing') {
        console.log(`Invalid request: ID=${id}, Status=${status}`); // Debug
        return res.status(400).json({ message: "Appointment ID and status 'Ongoing' are required" });
    }

    Appointment.updateStatus(id, status, (err, result) => {
        if (err) {
            console.error("Database error updating appointment status:", err);
            return res.status(500).json({ message: "Error starting appointment", error: err.message });
        }
        if (result.affectedRows === 0) {
            console.log(`No appointment found with ID: ${id}`); // Debug
            return res.status(404).json({ message: "Appointment not found" });
        }
        console.log(`Appointment ID: ${id} updated, affected rows: ${result.affectedRows}, Status sent: ${status}`); // Debug
        // Verify the update directly
        db.query('SELECT id, status FROM appointments WHERE id = ?', [id], (err, rows) => {
            if (err) {
                console.error("Error verifying updated appointment:", err);
                return res.status(500).json({ message: "Error verifying updated appointment" });
            }
            if (rows.length === 0) {
                console.log(`Verification failed: No appointment found with ID: ${id}`); // Debug
                return res.status(404).json({ message: "Appointment not found after update" });
            }
            console.log(`Verified: Appointment ID: ${id}, Status: ${rows[0].status || 'NULL'}`); // Debug
            res.status(200).json({ 
                message: "Appointment started successfully", 
                appointment: { id: rows[0].id, status: rows[0].status || 'Unknown' }
            });
        });
    });
};

module.exports = { bookAppointment, getAppointments, updatePaymentStatus, completeChargingSession, startAppointment };