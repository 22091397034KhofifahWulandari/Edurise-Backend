// routes/KompetisiRoute.js
import express from "express";
import {
    getKompetisi,
    getKompetisiById,
    createKompetisi,
    updateKompetisi,
    deleteKompetisi
} from "../controllers/KompetisiController.js";

const router = express.Router();

router.get('/kompetisi', getKompetisi);
router.get('/kompetisi/:id', getKompetisiById);
router.post('/kompetisi', createKompetisi);
router.patch('/kompetisi/:id', updateKompetisi);
router.delete('/kompetisi/:id', deleteKompetisi);

export default router;