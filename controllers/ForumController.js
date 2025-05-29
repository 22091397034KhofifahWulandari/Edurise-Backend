// controllers/ForumController.js
import Forum from "../models/ForumModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

// Helper function untuk memproses data forum (untuk single atau bulk creation)
const processForumData = async (forumInput) => {
    // Menggunakan 'konten' seperti permintaan awal
    const { userId, judul, konten, kategori, anggota_di_forum } = forumInput;

    // Validasi dasar
    if (!userId || !judul || !konten || !kategori) { // Validasi konten
        throw new Error("Missing required fields: userId, judul, konten, and kategori.");
    }

    // Validasi userId dan ambil nama pembuat forum
    const user = await User.findByPk(userId, { attributes: ['nama'] });
    if (!user) {
        throw new Error(`User with ID ${userId} not found.`);
    }

    // Siapkan objek data untuk dibuat/diupdate
    return {
        userId,
        judul,
        konten, // Menggunakan konten
        nama_pembuat_forum: user.nama, // Diambil dari User model
        anggota_di_forum: anggota_di_forum || '', // Default string kosong jika tidak ada
        kategori
    };
};

// Membuat Forum Baru (Mendukung single atau bulk creation)
export const createForum = async (req, res) => {
    try {
        let createdForums;
        const isBulk = Array.isArray(req.body);

        if (isBulk) {
            // Proses setiap objek dalam array untuk bulk create
            const processedData = await Promise.all(
                req.body.map(data => processForumData(data))
            );
            createdForums = await Forum.bulkCreate(processedData, {
                validate: true // Menjalankan validasi Sequelize untuk setiap objek
            });
            res.status(201).json({ msg: `${createdForums.length} Forums created successfully`, forums: createdForums });
        } else {
            // Proses satu objek untuk single create
            const processedData = await processForumData(req.body);
            createdForums = await Forum.create(processedData);
            res.status(201).json({ msg: "Forum created successfully", forum: createdForums });
        }
    } catch (error) {
        console.error("Error creating forum:", error.message);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ msg: error.errors.map(e => e.message).join(', ') });
        }
        res.status(400).json({ msg: error.message });
    }
};

// Mendapatkan Semua Forum
export const getAllForums = async (req, res) => {
    try {
        const forums = await Forum.findAll({
            include: [{
                model: User,
                as: 'creator',
                attributes: ['id', 'nama']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(forums);
    } catch (error) {
        console.error("Error fetching all forums:", error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Mendapatkan Forum Berdasarkan ID
export const getForumById = async (req, res) => {
    try {
        const forum = await Forum.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'creator',
                attributes: ['id', 'nama']
            }]
        });
        if (!forum) {
            return res.status(404).json({ msg: "Forum not found" });
        }
        res.status(200).json(forum);
    } catch (error) {
        console.error("Error fetching forum by ID:", error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Mengupdate Forum
export const updateForum = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId: requestingUserId, judul, konten, nama_pembuat_forum, anggota_di_forum, kategori } = req.body; // Menggunakan konten

        const forum = await Forum.findByPk(id);
        if (!forum) {
            return res.status(404).json({ msg: "Forum not found" });
        }

        if (forum.userId !== requestingUserId) {
            return res.status(403).json({ msg: "Unauthorized: You are not the creator of this forum" });
        }

        const updateData = {};
        if (judul !== undefined) updateData.judul = judul;
        if (konten !== undefined) updateData.konten = konten; // Menggunakan konten
        if (anggota_di_forum !== undefined) updateData.anggota_di_forum = anggota_di_forum;
        if (kategori !== undefined) updateData.kategori = kategori;

        await forum.update(updateData);
        res.status(200).json({ msg: "Forum updated successfully", forum: forum });
    } catch (error) {
        console.error("Error updating forum:", error.message);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ msg: error.errors.map(e => e.message).join(', ') });
        }
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Menghapus Forum
export const deleteForum = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId: requestingUserId } = req.body;

        const forum = await Forum.findByPk(id);
        if (!forum) {
            return res.status(404).json({ msg: "Forum not found" });
        }

        if (forum.userId !== requestingUserId) {
            return res.status(403).json({ msg: "Unauthorized: You are not the creator of this forum" });
        }

        await forum.destroy();
        res.status(200).json({ msg: "Forum deleted successfully" });
    } catch (error) {
        console.error("Error deleting forum:", error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};