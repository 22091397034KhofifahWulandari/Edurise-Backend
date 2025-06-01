// routes/UserProfileRoutes.js
import express from "express";
import { getUserProfile, updateProfileInfo, uploadProfilePicture, uploadCoverPicture } from "../controllers/UserProfileController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/profile', verifyUser, getUserProfile);
router.patch('/profile/info', verifyUser, updateProfileInfo);
router.patch('/profile/foto-profil', verifyUser, uploadProfilePicture);
router.patch('/profile/foto-sampul', verifyUser, uploadCoverPicture);

export default router;