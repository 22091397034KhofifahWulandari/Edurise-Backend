// routes/BeasiswaRoute.js
import express from "express";
import {
    getBeasiswa,
    getBeasiswaById,
    createBeasiswa,
    updateBeasiswa,
    deleteBeasiswa
} from "../controllers/BeasiswaController.js";

const router = express.Router();

router.get('/beasiswa', getBeasiswa);
router.get('/beasiswa/:id', getBeasiswaById);
router.post('/beasiswa', createBeasiswa);
router.patch('/beasiswa/:id', updateBeasiswa);
router.delete('/beasiswa/:id', deleteBeasiswa);

export default router;