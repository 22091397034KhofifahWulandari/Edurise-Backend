// routes/UserSavedBeasiswaRoute.js
import express from "express";
import {
    getSavedBeasiswaByUserId,
    saveBeasiswaForUser,
    deleteSavedBeasiswaForUser
} from "../controllers/UserSavedBeasiswaController.js";

const router = express.Router();

router.get('/users/:userId/saved-beasiswa', getSavedBeasiswaByUserId);
router.post('/saved-beasiswa', saveBeasiswaForUser);
router.delete('/users/:userId/saved-beasiswa/:beasiswaId', deleteSavedBeasiswaForUser);

export default router;