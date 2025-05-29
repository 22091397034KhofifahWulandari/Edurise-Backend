// routes/UserSavedForumRoute.js
import express from "express";
import {
    saveForum,
    unsaveForum,
    getSavedForumsByUserId
} from "../controllers/UserSavedForumController.js";

const router = express.Router();

router.post('/user-saved-forums', saveForum); // Menyimpan (bookmark) forum
router.delete('/user-saved-forums/:userId/:forumId', unsaveForum); // Menghapus (unbookmark) forum
router.get('/users/:userId/saved-forums', getSavedForumsByUserId); // Mendapatkan semua forum yang disimpan oleh user

export default router;