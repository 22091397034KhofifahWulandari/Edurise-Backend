// routes/UserSavedKompetisiRoute.js
import express from "express";
import {
    getSavedKompetisiByUserId,
    saveKompetisiForUser,
    deleteSavedKompetisiForUser
} from "../controllers/UserSavedKompetisiController.js";

const router = express.Router();

router.get('/users/:userId/saved-kompetisi', getSavedKompetisiByUserId);
router.post('/saved-kompetisi', saveKompetisiForUser);
router.delete('/users/:userId/saved-kompetisi/:kompetisiId', deleteSavedKompetisiForUser);

export default router;