// routes/KompetisiRegistrasiRoute.js
import express from "express";
import {
    registerForKompetisi,
    getKompetisiRegistrationStatus,
    updateKompetisiRegistrationStatus,
    getAllRegistrationsForKompetisi,
    deleteKompetisiRegistration,
    getRegisteredKompetisiByUserId // Import fungsi BARU
} from "../controllers/KompetisiRegistrasiController.js";

const router = express.Router();

router.post('/kompetisi-register', registerForKompetisi);

// User melihat status pendaftaran untuk kompetisi tertentu
router.get('/users/:userId/kompetisi-register/:kompetisiId/status', getKompetisiRegistrationStatus);

// Rute BARU: User melihat semua kompetisi yang didaftarnya
router.get('/users/:userId/registered-kompetisi', getRegisteredKompetisiByUserId);


router.patch('/kompetisi-register/:userId/:kompetisiId/status', updateKompetisiRegistrationStatus);

router.get('/kompetisi/:kompetisiId/registrations', getAllRegistrationsForKompetisi);

router.delete('/users/:userId/kompetisi-register/:kompetisiId', deleteKompetisiRegistration);

export default router;