// controllers/KompetisiRegistrasiController.js
import KompetisiModel from "../models/KompetisiModel.js";
import KompetisiRegistrasiModel from "../models/KompetisiRegistrasiModel.js";
import UserModel from "../models/UserModel.js";

// Mendaftar kompetisi (USER ONLY)
export const registerKompetisi = async (req, res) => {
    const userId = req.userId; // ID internal user dari middleware
    const {
        kompetisiUuid,
        nama_lengkap,
        jenjang_pendidikan,
        instansi_pendidikan,
        jurusan,
        no_telp,
        email,
        alasan_mengikuti
    } = req.body;

    try {
        const user = await UserModel.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan." });
        }

        const kompetisi = await KompetisiModel.findOne({ where: { uuid: kompetisiUuid } });
        if (!kompetisi) {
            return res.status(404).json({ msg: "Kompetisi tidak ditemukan." });
        }

        const existingRegistration = await KompetisiRegistrasiModel.findOne({
            where: {
                userId: user.id,
                kompetisiId: kompetisi.id
            }
        });

        if (existingRegistration) {
            return res.status(409).json({ msg: "Anda sudah mendaftar kompetisi ini." });
        }

        await KompetisiRegistrasiModel.create({
            userId: user.id,
            kompetisiId: kompetisi.id,
            nama_lengkap,
            jenjang_pendidikan,
            instansi_pendidikan,
            jurusan,
            no_telp,
            email,
            alasan_mengikuti,
            status_pendaftaran: 'diproses'
        });

        res.status(201).json({ msg: "Pendaftaran kompetisi berhasil!" });

    } catch (error) {
        console.error("Error in registerKompetisi:", error);
        res.status(500).json({ msg: error.message });
    }
};

// Melihat status pendaftaran user untuk semua kompetisi yang diikuti (USER ONLY)
export const getUserKompetisiRegistrations = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await UserModel.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan." });
        }

        const registrations = await KompetisiRegistrasiModel.findAll({
            where: { userId: user.id },
            attributes: [
                'status_pendaftaran',
                'tanggal_pendaftaran',
                'nama_lengkap',
                'no_telp',
                'email'
            ],
            include: [{
                model: KompetisiModel,
                attributes: ['uuid', 'judul', 'poster_gambar', 'tanggal']
            }]
        });
        res.status(200).json(registrations);
    } catch (error) {
        console.error("Error in getUserKompetisiRegistrations:", error);
        res.status(500).json({ msg: error.message });
    }
};

// Melihat detail pendaftaran user untuk kompetisi tertentu (USER ONLY)
export const getUserKompetisiRegistrationById = async (req, res) => {
    const userId = req.userId;
    const kompetisiUuid = req.params.id;

    try {
        const user = await UserModel.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan." });
        }

        const kompetisi = await KompetisiModel.findOne({ where: { uuid: kompetisiUuid } });
        if (!kompetisi) {
            return res.status(404).json({ msg: "Kompetisi tidak ditemukan." });
        }

        const registration = await KompetisiRegistrasiModel.findOne({
            where: {
                userId: user.id,
                kompetisiId: kompetisi.id
            },
            include: [{
                model: KompetisiModel,
                attributes: ['uuid', 'judul', 'poster_gambar', 'tanggal', 'biaya', 'url_pendaftaran']
            }]
        });

        if (!registration) {
            return res.status(404).json({ msg: "Anda belum mendaftar kompetisi ini." });
        }

        res.status(200).json(registration);
    } catch (error) {
        console.error("Error in getUserKompetisiRegistrationById:", error);
        res.status(500).json({ msg: error.message });
    }
};

