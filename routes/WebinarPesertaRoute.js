// routes/WebinarPesertaRoute.js
import express from "express";
import {
    registerForWebinar,
    getRegistrationsByWebinarId,
    getRegistrationsByUserId,
    deleteWebinarRegistration
} from "../controllers/WebinarPesertaController.js";

const router = express.Router();

router.post('/webinar-register', registerForWebinar); // Endpoint untuk pendaftaran peserta
router.get('/webinar/:webinarId/registrations', getRegistrationsByWebinarId); // Mendapatkan pendaftar per webinar
router.get('/user/:userId/webinar-registrations', getRegistrationsByUserId); // Mendapatkan webinar yang didaftar oleh user
router.delete('/webinar-registration/:id', deleteWebinarRegistration); // Menghapus pendaftaran

export default router;