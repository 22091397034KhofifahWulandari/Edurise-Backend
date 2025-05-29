// controllers/UserSavedForumController.js
import UserSavedForum from "../models/UserSavedForumModel.js";
import Forum from "../models/ForumModel.js";
import User from "../models/UserModel.js"; // Untuk validasi user/creator

// Menyimpan (Bookmark) Forum
export const saveForum = async (req, res) => {
    try {
        const { userId, forumId } = req.body;

        // Validasi keberadaan User dan Forum
        const userExists = await User.findByPk(userId);
        const forumExists = await Forum.findByPk(forumId);

        if (!userExists || !forumExists) {
            return res.status(404).json({ msg: "User or Forum not found" });
        }

        // Cek apakah sudah disimpan sebelumnya
        const existingSave = await UserSavedForum.findOne({
            where: { userId, forumId }
        });

        if (existingSave) {
            return res.status(409).json({ msg: "Forum already saved by this user" });
        }

        await UserSavedForum.create({ userId, forumId });
        res.status(201).json({ msg: "Forum saved successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: error.message });
    }
};

// Menghapus (Unbookmark) Forum yang Disimpan
export const unsaveForum = async (req, res) => {
    try {
        const { userId, forumId } = req.params; // Atau dari body, tergantung bagaimana Anda mengirimnya

        const result = await UserSavedForum.destroy({
            where: { userId, forumId }
        });

        if (result === 0) {
            return res.status(404).json({ msg: "Saved forum not found" });
        }
        res.status(200).json({ msg: "Forum unsaved successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Mendapatkan Semua Forum yang Disimpan oleh User tertentu
export const getSavedForumsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const savedForums = await UserSavedForum.findAll({
            where: { userId: userId },
            include: [{
                model: Forum,
                as: 'savedForumDetails', // Alias dari Relasi.js
                attributes: ['id', 'judul', 'konten', 'kategori', 'createdAt'], // Ambil detail forum
                include: [{
                    model: User,
                    as: 'creator', // Alias untuk creator forum
                    attributes: ['id', 'nama'] // Ambil nama creator forum
                }]
            }],
            order: [['createdAt', 'DESC']] // Urutkan dari yang terbaru disimpan
        });

        if (savedForums.length === 0) {
            return res.status(404).json({ msg: "No saved forums found for this user." });
        }

        // Mengirimkan hanya detail forum yang disimpan
        const forumData = savedForums.map(saved => saved.savedForumDetails);
        res.status(200).json(forumData);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};