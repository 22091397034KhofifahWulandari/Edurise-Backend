// controllers/UserProfileController.js
import { UserModel } from "../models/index.js"; // Import dari index.js
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper untuk menghapus file lama
const deleteFile = (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

// Mendapatkan data profil user yang sedang login
export const getUserProfile = async (req, res) => {
    try {
        const user = await UserModel.findOne({
            attributes: { exclude: ['password'] }, // Jangan tampilkan password
            where: {
                uuid: req.session.userId // Menggunakan uuid dari sesi
            }
        });
        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Memperbarui informasi profil utama user
export const updateProfileInfo = async (req, res) => {
    const { name, bio, ttl, jenis_kelamin, alamat, no_telp, nama_institusi, prodi, fakultas, semester, ipk, minat_bidang, rencana, motivator_karir } = req.body;
    try {
        await UserModel.update({
            name, bio, ttl, jenis_kelamin, alamat, no_telp,
            nama_institusi, prodi, fakultas, semester, ipk,
            minat_bidang, rencana, motivator_karir
        }, {
            where: {
                uuid: req.session.userId
            }
        });
        res.status(200).json({ msg: "Profil berhasil diperbarui" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// Mengunggah dan memperbarui foto profil
export const uploadProfilePicture = async (req, res) => {
    const user = await UserModel.findOne({
        where: { uuid: req.session.userId }
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ msg: "Tidak ada file yang diunggah" });
    }

    const file = req.files.file; // 'file' adalah nama field di form-data
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get('host')}/profiles/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Tipe file tidak valid" });
    }
    if (fileSize > 5000000) { // 5MB
        return res.status(422).json({ msg: "Ukuran gambar harus kurang dari 5MB" });
    }

    // Hapus foto profil lama jika ada
    if (user.foto_profile) {
        deleteFile(user.foto_profile);
    }

    const filePath = path.join(__dirname, '../public/profiles', fileName);

    file.mv(filePath, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
            await UserModel.update({
                foto_profile: filePath, // Simpan path lokal
                url_foto_profile: url // Simpan URL publik
            }, {
                where: { uuid: req.session.userId }
            });
            res.status(200).json({ msg: "Foto profil berhasil diperbarui", url_foto_profile: url });
        } catch (error) {
            deleteFile(filePath); // Hapus file jika update DB gagal
            res.status(500).json({ msg: error.message });
        }
    });
};

// Mengunggah dan memperbarui foto sampul
export const uploadCoverPicture = async (req, res) => {
    const user = await UserModel.findOne({
        where: { uuid: req.session.userId }
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ msg: "Tidak ada file yang diunggah" });
    }

    const file = req.files.file; // 'file' adalah nama field di form-data
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get('host')}/profiles/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Tipe file tidak valid" });
    }
    if (fileSize > 5000000) { // 5MB
        return res.status(422).json({ msg: "Ukuran gambar harus kurang dari 5MB" });
    }

    // Hapus foto sampul lama jika ada
    if (user.foto_sampul) {
        deleteFile(user.foto_sampul);
    }

    const filePath = path.join(__dirname, '../public/profiles', fileName);

    file.mv(filePath, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
            await UserModel.update({
                foto_sampul: filePath, // Simpan path lokal
                url_foto_sampul: url // Simpan URL publik
            }, {
                where: { uuid: req.session.userId }
            });
            res.status(200).json({ msg: "Foto sampul berhasil diperbarui", url_foto_sampul: url });
        } catch (error) {
            deleteFile(filePath); // Hapus file jika update DB gagal
            res.status(500).json({ msg: error.message });
        }
    });
};