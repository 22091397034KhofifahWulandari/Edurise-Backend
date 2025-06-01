// routes/ForumRoutes.js
import express from 'express';
import {
    getForums,
    getForumById,
    createForum,
    updateForum,
    deleteForum
} from '../controllers/ForumController.js';
import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

// Publicly accessible for viewing
router.get('/forums',  getForums);
router.get('/forums/:id', getForumById);
router.post('/forums', verifyUser, createForum);
router.patch('/forums/:id', verifyUser, updateForum);
router.delete('/forums/:id', verifyUser, deleteForum);

export default router;