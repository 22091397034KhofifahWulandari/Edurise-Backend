// controllers/ForumController.js
import ForumModel from "../models/ForumModel.js";
import UserModel from "../models/UserModel.js"; // Untuk mengambil nama pembuat
import { Op } from "sequelize";

// Mendapatkan semua forum (akses publik)
export const getForums = async (req, res) => {
    try {
        const response = await ForumModel.findAll({
            attributes: ['uuid', 'judul', 'konten', 'kategori', 'createdAt'],
            include: [{
                model: UserModel,
                as: 'creator', // Alias dari relasi di app.js
                attributes: ['uuid', 'name'] // Hanya ambil uuid dan nama pembuat
            }]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Mendapatkan forum berdasarkan UUID (akses publik)
export const getForumById = async (req, res) => {
    try {
        const forum = await ForumModel.findOne({
            where: {
                uuid: req.params.id
            },
            attributes: ['uuid', 'judul', 'konten', 'kategori', 'createdAt'],
            include: [{
                model: UserModel,
                as: 'creator',
                attributes: ['uuid', 'name']
            }]
        });
        if (!forum) {
            return res.status(404).json({ msg: "Forum tidak ditemukan." });
        }
        res.status(200).json(forum);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Membuat forum baru (akses user terautentikasi)
export const createForum = async (req, res) => {
    const { judul, konten, kategori } = req.body;
    const userId = req.userId; // Dari middleware verifyUser

    try {
        await ForumModel.create({
            userId: userId,
            judul: judul,
            konten: konten,
            kategori: kategori
        });
        res.status(201).json({ msg: "Forum berhasil dibuat." });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Memperbarui forum (akses hanya pembuat forum)
export const updateForum = async (req, res) => {
    const forum = await ForumModel.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!forum) {
        return res.status(404).json({ msg: "Forum tidak ditemukan." });
    }

    // Pastikan user yang login adalah pembuat forum
    if (req.userId !== forum.userId) {
        return res.status(403).json({ msg: "Anda tidak berhak memperbarui forum ini." });
    }

    const { judul, konten, kategori } = req.body;
    try {
        await ForumModel.update({
            judul: judul,
            konten: konten,
            kategori: kategori
        }, {
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "Forum berhasil diperbarui." });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Menghapus forum (akses hanya pembuat forum)
export const deleteForum = async (req, res) => {
    const forum = await ForumModel.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!forum) {
        return res.status(404).json({ msg: "Forum tidak ditemukan." });
    }

    // Pastikan user yang login adalah pembuat forum
    if (req.userId !== forum.userId) {
        return res.status(403).json({ msg: "Anda tidak berhak menghapus forum ini." });
    }

    try {
        await ForumModel.destroy({
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "Forum berhasil dihapus." });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};