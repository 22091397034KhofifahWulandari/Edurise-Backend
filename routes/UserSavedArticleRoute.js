import express from "express";
import {
    getSavedArticlesByUserId,
    saveArticleForUser,
    deleteSavedArticleForUser
} from "../controllers/UserSavedArticleController.js";

const router = express.Router();

// Mengambil semua artikel yang disimpan oleh user tertentu
// Contoh: GET /users/1/saved-articles
router.get('/users/:userId/saved-articles', getSavedArticlesByUserId);

// Menyimpan artikel untuk user
// Contoh: POST /saved-articles (dengan userId dan articleId di body request)
router.post('/saved-articles', saveArticleForUser);

// Menghapus artikel yang tersimpan untuk user
// Contoh: DELETE /users/1/saved-articles/5
router.delete('/users/:userId/saved-articles/:articleId', deleteSavedArticleForUser);

export default router;