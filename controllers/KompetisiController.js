// controllers/KompetisiController.js
import KompetisiModel from "../models/KompetisiModel.js";
import KompetisiRegistrasiModel from "../models/KompetisiRegistrasiModel.js";
import UserModel from "../models/UserModel.js";

// --- ADMIN ONLY ---
export const createKompetisi = async (req, res) => {
    const { poster_gambar, judul, tanggal, biaya, tingkat_kompetisi, tentang_kompetisi, syarat, ketentuan_kompetisi, benefit, url_pendaftaran } = req.body;
    try {
        await KompetisiModel.create({
            poster_gambar,
            judul,
            tanggal,
            biaya,
            tingkat_kompetisi,
            tentang_kompetisi,
            syarat,
            ketentuan_kompetisi,
            benefit,
            url_pendaftaran
        });
        res.status(201).json({ msg: "Kompetisi berhasil ditambahkan." });
    } catch (error) {
        console.error("Error in createKompetisi:", error);
        res.status(500).json({ msg: error.message });
    }
};

export const updateKompetisi = async (req, res) => {
    const kompetisi = await KompetisiModel.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!kompetisi) {
        return res.status(404).json({ msg: "Kompetisi tidak ditemukan." });
    }

    const { poster_gambar, judul, tanggal, biaya, tingkat_kompetisi, tentang_kompetisi, syarat, ketentuan_kompetisi, benefit, url_pendaftaran } = req.body;
    try {
        await KompetisiModel.update({
            poster_gambar,
            judul,
            tanggal,
            biaya,
            tingkat_kompetisi,
            tentang_kompetisi,
            syarat,
            ketentuan_kompetisi,
            benefit,
            url_pendaftaran
        }, {
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "Kompetisi berhasil diperbarui." });
    } catch (error) {
        console.error("Error in updateKompetisi:", error);
        res.status(500).json({ msg: error.message });
    }
};

export const deleteKompetisi = async (req, res) => {
    const kompetisi = await KompetisiModel.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!kompetisi) {
        return res.status(404).json({ msg: "Kompetisi tidak ditemukan." });
    }
    try {
        await KompetisiModel.destroy({
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "Kompetisi berhasil dihapus." });
    } catch (error) {
        console.error("Error in deleteKompetisi:", error);
        res.status(500).json({ msg: error.message });
    }
};

// Mendapatkan semua pendaftar untuk suatu kompetisi (ADMIN ONLY)
export const getKompetisiRegistrations = async (req, res) => {
    try {
        const kompetisi = await KompetisiModel.findOne({
            where: { uuid: req.params.id }
        });

        if (!kompetisi) {
            return res.status(404).json({ msg: "Kompetisi tidak ditemukan." });
        }

        const registrations = await KompetisiRegistrasiModel.findAll({
            where: { kompetisiId: kompetisi.id },
            include: [{
                model: UserModel,
                attributes: ['uuid', 'name', 'email']
            }]
        });
        res.status(200).json(registrations);
    } catch (error) {
        console.error("Error in getKompetisiRegistrations:", error);
        res.status(500).json({ msg: error.message });
    }
};

// Mengubah status pendaftaran (ADMIN ONLY)
export const updateKompetisiRegistrationStatus = async (req, res) => {
    const { userId, status_pendaftaran } = req.body;
    const kompetisiUuid = req.params.id;

    try {
        const kompetisi = await KompetisiModel.findOne({ where: { uuid: kompetisiUuid } });
        if (!kompetisi) return res.status(404).json({ msg: "Kompetisi tidak ditemukan." });

        const user = await UserModel.findOne({ where: { uuid: userId } });
        if (!user) return res.status(404).json({ msg: "User pendaftar tidak ditemukan." });

        const validStatuses = ['diproses', 'seleksi berkas', 'diterima', 'ditolak'];
        if (!validStatuses.includes(status_pendaftaran)) {
            return res.status(400).json({ msg: "Status pendaftaran tidak valid." });
        }

        const [updatedRows] = await KompetisiRegistrasiModel.update({
            status_pendaftaran: status_pendaftaran
        }, {
            where: {
                userId: user.id,
                kompetisiId: kompetisi.id
            }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ msg: "Pendaftaran tidak ditemukan untuk user dan kompetisi ini." });
        }

        res.status(200).json({ msg: "Status pendaftaran berhasil diperbarui." });

    } catch (error) {
        console.error("Error in updateKompetisiRegistrationStatus:", error);
        res.status(500).json({ msg: error.message });
    }
};


// --- PUBLIC / USER ACCESS ---
export const getKompetisis = async (req, res) => {
    try {
        const response = await KompetisiModel.findAll({
            attributes: ['uuid', 'poster_gambar', 'judul', 'tanggal', 'biaya', 'tingkat_kompetisi']
        });
        res.status(200).json(response);
    } catch (error) {
        console.error("Error in getKompetisis:", error);
        res.status(500).json({ msg: error.message });
    }
};

export const getKompetisiById = async (req, res) => {
    try {
        const kompetisi = await KompetisiModel.findOne({
            where: {
                uuid: req.params.id
            },
            attributes: [
                'uuid', 'poster_gambar', 'judul', 'tanggal', 'biaya', 'tingkat_kompetisi',
                'tentang_kompetisi', 'syarat', 'ketentuan_kompetisi', 'benefit', 'url_pendaftaran'
            ]
        });
        if (!kompetisi) {
            return res.status(404).json({ msg: "Kompetisi tidak ditemukan." });
        }
        res.status(200).json(kompetisi);
    } catch (error) {
        console.error("Error in getKompetisiById:", error);
        res.status(500).json({ msg: error.message });
    }
};

// Mendapatkan semua pendaftaran dari SEMUA kompetisi (ADMIN ONLY)
export const getAllRegistrations = async (req, res) => {
    try {
        const allRegistrations = await KompetisiRegistrasiModel.findAll({
            attributes: ['status_pendaftaran', 'tanggal_pendaftaran', 'nama_lengkap', 'no_telp', 'email', 'jenjang_pendidikan', 'instansi_pendidikan', 'jurusan', 'alasan_mengikuti'],
            include: [
                {
                    model: UserModel,
                    attributes: ['uuid', 'name', 'email'] // Ambil data user dari UserModel juga
                },
                {
                    model: KompetisiModel,
                    attributes: ['uuid', 'judul', 'tanggal'] // Ambil data kompetisi dari KompetisiModel
                }
            ],
            order: [['tanggal_pendaftaran', 'DESC']] // Urutkan berdasarkan tanggal terbaru
        });
        res.status(200).json(allRegistrations);
    } catch (error) {
        console.error("Error in getAllRegistrations:", error);
        res.status(500).json({ msg: error.message });
    }
};