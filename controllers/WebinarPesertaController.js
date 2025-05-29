// controllers/WebinarPesertaController.js
import WebinarPeserta from "../models/WebinarPesertaModel.js";
import Webinar from "../models/WebinarModel.js"; // Untuk validasi webinarId
import User from "../models/UserModel.js"; // Untuk mendapatkan detail user jika userId diberikan

// Mendaftarkan Peserta untuk Webinar
export const registerForWebinar = async (req, res) => {
    try {
        const { webinarId, userId, nama, jenjang_pendidikan, instansi_pendidikan, jurusan, email, alasan_mengikuti_webinar } = req.body;

        // Validasi WebinarId
        const webinarExists = await Webinar.findByPk(webinarId);
        if (!webinarExists) {
            return res.status(404).json({ msg: "Webinar not found." });
        }

        // Validasi userId jika ada (opsional)
        if (userId) {
            const userExists = await User.findByPk(userId);
            if (!userExists) {
                return res.status(404).json({ msg: "User not found." });
            }
        }

        // Cek apakah email sudah terdaftar untuk webinar ini (karena ada unique index)
        const existingRegistration = await WebinarPeserta.findOne({
            where: { webinarId, email }
        });
        if (existingRegistration) {
            return res.status(409).json({ msg: "Email already registered for this webinar." });
        }

        const newRegistration = await WebinarPeserta.create({
            webinarId,
            userId: userId || null, // Jika userId tidak ada, set null
            nama,
            jenjang_pendidikan,
            instansi_pendidikan,
            jurusan,
            email,
            alasan_mengikuti_webinar
        });

        res.status(201).json({ msg: "Registration successful", registration: newRegistration });
    } catch (error) {
        console.error("Error registering for webinar:", error.message);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ msg: error.errors.map(e => e.message).join(', ') });
        }
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Mendapatkan Daftar Pendaftar untuk Webinar Tertentu (Admin View)
export const getRegistrationsByWebinarId = async (req, res) => {
    try {
        const { webinarId } = req.params;

        const webinar = await Webinar.findByPk(webinarId);
        if (!webinar) {
            return res.status(404).json({ msg: "Webinar not found." });
        }

        const registrations = await WebinarPeserta.findAll({
            where: { webinarId: webinarId },
            include: [{ // Opsional: Sertakan detail user jika ada userId
                model: User,
                as: 'registrantUser', // Alias dari Relasi.js
                attributes: ['id', 'nama', 'email'] // Ambil data user yang relevan
            }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ webinar: webinar.judul, registrations: registrations });
    } catch (error) {
        console.error("Error fetching registrations by webinar ID:", error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Mendapatkan Daftar Webinar yang Didaftar oleh User Tertentu (User View)
export const getRegistrationsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }

        const registrations = await WebinarPeserta.findAll({
            where: { userId: userId },
            include: [{ // Sertakan detail webinar yang didaftar
                model: Webinar,
                as: 'registeredWebinar', // Alias dari Relasi.js
                attributes: ['id', 'judul', 'tanggal', 'jam_pelaksanaan', 'narasumber', 'penyedia_acara']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ user: user.nama, registeredWebinars: registrations });
    } catch (error) {
        console.error("Error fetching registrations by user ID:", error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Menghapus Pendaftaran Peserta (opsional)
export const deleteWebinarRegistration = async (req, res) => {
    try {
        const { id } = req.params; // ID dari entry WebinarPeserta

        const registration = await WebinarPeserta.findByPk(id);
        if (!registration) {
            return res.status(404).json({ msg: "Webinar registration not found." });
        }

        await registration.destroy();
        res.status(200).json({ msg: "Webinar registration deleted successfully." });
    } catch (error) {
        console.error("Error deleting webinar registration:", error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};