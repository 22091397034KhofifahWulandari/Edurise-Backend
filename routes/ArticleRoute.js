// routes/ArticleRoutes.js (Pastikan ini sesuai)
import express from "express";
import {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
} from "../controllers/ArticleController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/articles', verifyUser, getArticles);
router.get('/articles/:id', verifyUser, getArticleById);
router.post('/articles', verifyUser, adminOnly, createArticle);
router.patch('/articles/:id', verifyUser, adminOnly, updateArticle);
router.delete('/articles/:id', verifyUser, adminOnly, deleteArticle);

export default router;