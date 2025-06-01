// routes/KompetisiRegistrasiRoutes.js
import express from 'express';
import {
    registerKompetisi,
    getUserKompetisiRegistrations,
    getUserKompetisiRegistrationById
} from '../controllers/KompetisiRegistrasiController.js';
import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

// --- Rute untuk User (Pendaftaran dan Status) ---
router.post('/kompetisi-register', verifyUser, registerKompetisi);
router.get('/users/kompetisi-registrations', verifyUser, getUserKompetisiRegistrations);
router.get('/users/kompetisi-registrations/:id', verifyUser, getUserKompetisiRegistrationById);

export default router;