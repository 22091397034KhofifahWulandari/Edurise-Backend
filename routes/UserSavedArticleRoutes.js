// routes/UserSavedArticleRoutes.js
import express from 'express';
import {
    getSavedArticlesByUser,
    saveArticleToProfile,
    removeSavedArticleFromProfile
} from '../controllers/UserSavedArticleController.js'; // Pastikan path ini benar
import { verifyUser } from '../middleware/AuthUser.js'; // Pastikan path ini benar

const router = express.Router();

// Rute untuk mendapatkan semua artikel yang disimpan oleh user yang sedang login
// Hanya user yang terautentikasi yang dapat melihat artikel yang disimpannya.
router.get('/users/saved-articles', verifyUser, getSavedArticlesByUser);

// Rute untuk user menyimpan artikel ke profilnya
// Body Request: { "articleId": "UUID_DARI_ARTIKEL" }
// Hanya user yang terautentikasi yang dapat menyimpan artikel.
router.post('/users/saved-articles', verifyUser, saveArticleToProfile);

// Rute untuk user menghapus artikel dari daftar simpanan di profilnya
// Parameter URL: /users/saved-articles/UUID_DARI_ARTIKEL
// Hanya user yang terautentikasi yang dapat menghapus artikel dari daftar simpanannya.
router.delete('/users/saved-articles/:articleId', verifyUser, removeSavedArticleFromProfile);

export default router;