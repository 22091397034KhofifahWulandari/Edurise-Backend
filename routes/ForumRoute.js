// routes/ForumRoute.js
import express from "express";
import {
    createForum,
    getAllForums,
    getForumById,
    updateForum,
    deleteForum
} from "../controllers/ForumController.js";

const router = express.Router();

router.post('/forums', createForum); // Membuat forum baru
router.get('/forums', getAllForums); // Mendapatkan semua forum
router.get('/forums/:id', getForumById); // Mendapatkan forum berdasarkan ID
router.patch('/forums/:id', updateForum); // Mengupdate forum
router.delete('/forums/:id', deleteForum); // Menghapus forum

export default router;