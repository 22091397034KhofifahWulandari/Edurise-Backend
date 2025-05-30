// controllers/BeasiswaController.js
import Beasiswa from "../models/BeasiswaModel.js";
// import { Op } from "sequelize"; // Anda bisa uncomment ini jika butuh operator Sequelize di query

export const getBeasiswa = async (req, res) => {
    try {
        const response = await Beasiswa.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching all beasiswa:", error.message); // Gunakan console.error untuk error
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

export const getBeasiswaById = async (req, res) => {
    try {
        // Menggunakan findByPk lebih disarankan untuk mencari berdasarkan primary key
        const response = await Beasiswa.findByPk(req.params.id);
        if (!response) {
            return res.status(404).json({ msg: "Beasiswa Not Found" });
        }
        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching beasiswa by ID:", error.message); // Gunakan console.error
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

export const createBeasiswa = async (req, res) => {
    // Destrukturisasi semua kolom baru yang sesuai dengan model
    const { img, title, description, detail, kategori, jenjang, lokasi, deadline } = req.body;

    // Optional: Validasi sederhana untuk kolom yang mungkin Anda anggap harus ada.
    // Berdasarkan skema SQL dan model, banyak kolom allowNull: true.
    // Jika Anda ingin 'title' atau 'description' wajib, Anda harus mengubah 'allowNull' di model menjadi 'false'
    // dan bisa tambahkan validasi di sini jika diperlukan, contoh:
    /*
    if (!title || !description) {
        return res.status(400).json({ msg: "Title and Description are required fields." });
    }
    */

    try {
        const newBeasiswa = await Beasiswa.create({
            img,
            title,
            description,
            detail,
            kategori,
            jenjang,
            lokasi,
            deadline
        });
        res.status(201).json({ msg: "Beasiswa created successfully", data: newBeasiswa }); // Mengembalikan data yang baru dibuat
    } catch (error) {
        console.error("Error creating beasiswa:", error.message); // Gunakan console.error
        // Jika ada error validasi dari Sequelize (misal allowNull: false tidak terpenuhi), 400 lebih tepat
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ msg: error.errors.map(e => e.message).join(', ') });
        }
        res.status(400).json({ msg: error.message });
    }
};

export const updateBeasiswa = async (req, res) => {
    const { id } = req.params;
    // Destrukturisasi semua kolom yang bisa di-update
    const { img, title, description, detail, kategori, jenjang, lokasi, deadline } = req.body;

    try {
        // Menggunakan findByPk untuk mencari beasiswa yang akan diupdate
        const beasiswa = await Beasiswa.findByPk(id);
        if (!beasiswa) {
            return res.status(404).json({ msg: "Beasiswa Not Found" });
        }

        // Buat objek `updateData` hanya dengan kolom yang ada di `req.body`
        // Ini menghindari pengiriman `undefined` ke database untuk kolom yang tidak diubah
        const updateData = {};
        if (img !== undefined) updateData.img = img;
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (detail !== undefined) updateData.detail = detail;
        if (kategori !== undefined) updateData.kategori = kategori;
        if (jenjang !== undefined) updateData.jenjang = jenjang;
        if (lokasi !== undefined) updateData.lokasi = lokasi;
        if (deadline !== undefined) updateData.deadline = deadline;

        // Lakukan update pada instance beasiswa yang ditemukan
        await beasiswa.update(updateData);
        
        res.status(200).json({ msg: "Beasiswa updated successfully", data: beasiswa }); // Mengembalikan data yang sudah diupdate
    } catch (error) {
        console.error("Error updating beasiswa:", error.message); // Gunakan console.error
        // Jika ada error validasi dari Sequelize, 400 lebih tepat
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ msg: error.errors.map(e => e.message).join(', ') });
        }
        res.status(400).json({ msg: error.message });
    }
};

export const deleteBeasiswa = async (req, res) => {
    try {
        const { id } = req.params; // Destrukturisasi ID untuk kejelasan

        // Menggunakan findByPk untuk mencari beasiswa yang akan dihapus
        const beasiswa = await Beasiswa.findByPk(id);
        if (!beasiswa) {
            return res.status(404).json({ msg: "Beasiswa Not Found" });
        }

        // Hapus instance beasiswa yang ditemukan
        await beasiswa.destroy();
        
        res.status(200).json({ msg: "Beasiswa deleted successfully" });
    } catch (error) {
        console.error("Error deleting beasiswa:", error.message); // Gunakan console.error
        res.status(500).json({ msg: "Internal Server Error" }); // Error saat delete lebih ke server
    }
};