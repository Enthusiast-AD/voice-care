import express from 'express';
import { getAllPatients, addPatient, approveAppointment, getAppointments } from '../controllers/patient.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all patient routes
router.use(authMiddleware);

router.route('/')
    .get(getAllPatients)
    .post(addPatient);

router.route('/appointments')
    .get(getAppointments);

router.route('/appointments/:appointmentId/approve')
    .post(approveAppointment);

export default router;
