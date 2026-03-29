import express from 'express';
import { getAllPatients, addPatient, approveAppointment, getAppointments, bookAppointment } from '../controllers/patient.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public route for booking appointments outside dashboard
router.post('/public/appointments', bookAppointment);

// Apply auth middleware to all OTHER patient routes
router.use(authMiddleware);

router.route('/')
    .get(getAllPatients)
    .post(addPatient);

router.route('/appointments')
    .get(getAppointments)
    .post(bookAppointment);

router.route('/appointments/:appointmentId/approve')
    .post(approveAppointment);

export default router;
