// routes/WebinarRoute.js
import express from "express";
import {
    createWebinar,
    getAllWebinars,
    getWebinarById,
    updateWebinar,
    deleteWebinar
} from "../controllers/WebinarController.js";

const router = express.Router();

router.post('/webinar', createWebinar); // Untuk membuat 1 atau banyak webinar
router.get('/webinar', getAllWebinars);
router.get('/webinar/:id', getWebinarById);
router.put('/webinar/:id', updateWebinar);
router.delete('/webinar/:id', deleteWebinar);

export default router;