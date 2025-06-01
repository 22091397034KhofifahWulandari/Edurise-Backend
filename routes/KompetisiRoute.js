// routes/KompetisiRoute.js
import express from 'express';
import {
    createKompetisi,
    getKompetisis,
    getKompetisiById,
    updateKompetisi,
    deleteKompetisi,
    getKompetisiRegistrations,
    updateKompetisiRegistrationStatus,
    getAllRegistrations
} from '../controllers/KompetisiController.js';
import { verifyUser, adminOnly } from '../middleware/AuthUser.js';

const router = express.Router();

// --- Rute untuk Admin (CRUD Kompetisi) ---
router.post('/kompetisi', verifyUser, adminOnly, createKompetisi);
router.patch('/kompetisi/:id', verifyUser, adminOnly, updateKompetisi);
router.delete('/kompetisi/:id', verifyUser, adminOnly, deleteKompetisi);

// --- Rute untuk Admin (Melihat dan Mengelola Pendaftar Kompetisi) ---
router.get('/kompetisi/:id/registrations', verifyUser, adminOnly, getKompetisiRegistrations);
router.patch('/kompetisi/:id/registration-status', verifyUser, adminOnly, updateKompetisiRegistrationStatus);
router.get('/kompetisi/all-registrations', verifyUser, adminOnly, getAllRegistrations);

// --- Rute untuk User (Melihat Kompetisi) ---
router.get('/kompetisi', getKompetisis);
router.get('/kompetisi/:id', getKompetisiById);

export default router;