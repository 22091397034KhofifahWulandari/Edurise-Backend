// controllers/UserSavedArticleController.js
import UserModel from "../models/UserModel.js";
import ArticleModel from "../models/ArticleModel.js";
import UserSavedArticleModel from "../models/UserSavedArticleModel.js";

// Mendapatkan semua artikel yang disimpan oleh user yang sedang login
export const getSavedArticlesByUser = async (req, res) => {
    const userId = req.userId; // Dapatkan ID user dari middleware autentikasi (verifyUser)

    try {
        const user = await UserModel.findOne({
            where: { id: userId },
            attributes: ['uuid', 'name', 'email'],
            include: [{
                model: ArticleModel,
                as: 'savedArticles', // Sesuai dengan alias di relasi Many-to-Many di app.js
                through: { attributes: [] }, // Jangan sertakan kolom dari tabel perantara di respons
                attributes: ['uuid', 'judul', 'deskripsi', 'gambar', 'link', 'penulis', 'kategori']
            }]
        });

        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan." });
        }

        res.status(200).json(user.savedArticles);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Menyimpan artikel ke profil user
export const saveArticleToProfile = async (req, res) => {
    const userId = req.userId;
    const { articleId } = req.body; // Menerima UUID artikel dari frontend

    if (!articleId) {
        return res.status(400).json({ msg: "ID Artikel diperlukan." });
    }

    try {
        const user = await UserModel.findOne({ where: { id: userId } });
        const article = await ArticleModel.findOne({ where: { uuid: articleId } });

        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan." });
        }
        if (!article) {
            return res.status(404).json({ msg: "Artikel tidak ditemukan." });
        }

        // Cek apakah artikel sudah disimpan oleh user ini
        const existingSave = await UserSavedArticleModel.findOne({
            where: {
                userId: user.id,
                articleId: article.id
            }
        });

        if (existingSave) {
            return res.status(409).json({ msg: "Artikel ini sudah tersimpan di profil Anda." });
        }

        // Buat entri baru di tabel perantara
        await UserSavedArticleModel.create({
            userId: user.id,
            articleId: article.id
        });

        res.status(201).json({ msg: "Artikel berhasil disimpan di profil Anda." });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Menghapus artikel dari profil user
export const removeSavedArticleFromProfile = async (req, res) => {
    const userId = req.userId;
    const { articleId } = req.params; // Menerima UUID artikel dari URL params

    try {
        const user = await UserModel.findOne({ where: { id: userId } });
        const article = await ArticleModel.findOne({ where: { uuid: articleId } });

        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan." });
        }
        if (!article) {
            return res.status(404).json({ msg: "Artikel tidak ditemukan." });
        }

        const deletedRows = await UserSavedArticleModel.destroy({
            where: {
                userId: user.id,
                articleId: article.id
            }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ msg: "Artikel tidak ditemukan di daftar simpanan Anda." });
        }

        res.status(200).json({ msg: "Artikel berhasil dihapus dari profil Anda." });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};