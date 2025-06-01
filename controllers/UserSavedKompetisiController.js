// controllers/UserSavedKompetisiController.js
import UserSavedKompetisiModel from "../models/UserSavedKompetisiModel.js";
import KompetisiModel from "../models/KompetisiModel.js";
import UserModel from "../models/UserModel.js";

// Menyimpan kompetisi
export const saveKompetisi = async (req, res) => {
    const userInternalId = req.userId;
    const { kompetisiUuid } = req.body;

    try {
        const user = await UserModel.findOne({ where: { id: userInternalId } });
        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan." });
        }

        const kompetisi = await KompetisiModel.findOne({ where: { uuid: kompetisiUuid } });
        if (!kompetisi) {
            return res.status(404).json({ msg: "Kompetisi tidak ditemukan." });
        }

        const existingSavedKompetisi = await UserSavedKompetisiModel.findOne({
            where: {
                userId: user.id,
                kompetisiId: kompetisi.id
            }
        });

        if (existingSavedKompetisi) {
            return res.status(409).json({ msg: "Kompetisi ini sudah Anda simpan." });
        }

        await UserSavedKompetisiModel.create({
            userId: user.id,
            kompetisiId: kompetisi.id
        });

        res.status(201).json({ msg: "Kompetisi berhasil disimpan." });

    } catch (error) {
        console.error("Error saving kompetisi:", error);
        res.status(500).json({ msg: error.message });
    }
};

// Menghapus kompetisi yang disimpan
export const unsaveKompetisi = async (req, res) => {
    const userInternalId = req.userId;
    const kompetisiUuid = req.params.id;

    try {
        const user = await UserModel.findOne({ where: { id: userInternalId } });
        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan." });
        }

        const kompetisi = await KompetisiModel.findOne({ where: { uuid: kompetisiUuid } });
        if (!kompetisi) {
            return res.status(404).json({ msg: "Kompetisi tidak ditemukan." });
        }

        const deletedRows = await UserSavedKompetisiModel.destroy({
            where: {
                userId: user.id,
                kompetisiId: kompetisi.id
            }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ msg: "Kompetisi ini tidak ditemukan dalam daftar tersimpan Anda." });
        }

        res.status(200).json({ msg: "Kompetisi berhasil dihapus dari daftar tersimpan." });

    } catch (error) {
        console.error("Error unsaving kompetisi:", error);
        res.status(500).json({ msg: error.message });
    }
};


// Mendapatkan semua kompetisi yang disimpan oleh user
export const getSavedKompetisisByUser = async (req, res) => {
    const userInternalId = req.userId;

    try {
        const user = await UserModel.findOne({ where: { id: userInternalId } });
        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan." });
        }

        const savedKompetisis = await UserSavedKompetisiModel.findAll({
            where: { userId: user.id },
            include: [{
                model: KompetisiModel,
                attributes: ['uuid', 'poster_gambar', 'judul', 'tanggal', 'biaya', 'tingkat_kompetisi']
            }]
        });

        const responseData = savedKompetisis.map(item => item.kompetisi); 

        res.status(200).json(responseData);

    } catch (error) {
        console.error("Error fetching saved kompetisis:", error);
        res.status(500).json({ msg: error.message });
    }
};