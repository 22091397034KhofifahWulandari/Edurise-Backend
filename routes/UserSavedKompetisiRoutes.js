// routes/UserSavedKompetisiRoutes.js
import express from 'express';
import {
    saveKompetisi,
    unsaveKompetisi,
    getSavedKompetisisByUser
} from '../controllers/UserSavedKompetisiController.js';
import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

// Menyimpan kompetisi (user terautentikasi)
router.post('/kompetisi/save', verifyUser, saveKompetisi);
// Menghapus kompetisi yang disimpan (user terautentikasi)
router.delete('/kompetisi/unsave/:id', verifyUser, unsaveKompetisi);
// Mendapatkan daftar kompetisi yang disimpan oleh user (user terautentikasi)
router.get('/users/saved-kompetisi', verifyUser, getSavedKompetisisByUser);

export default router;