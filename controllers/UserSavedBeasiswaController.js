// controllers/UserSavedBeasiswaController.js
import UserSavedBeasiswa from "../models/UserSavedBeasiswaModel.js";
import Beasiswa from "../models/BeasiswaModel.js";

export const getSavedBeasiswaByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const savedBeasiswaEntries = await UserSavedBeasiswa.findAll({
            where: { userId: userId },
            include: [{
                model: Beasiswa,
                as: 'savedBeasiswa', // Gunakan alias yang sama dengan di `models/Relasi.js`
                attributes: ['id', 'img', 'title', 'description', 'detail', 'kategori', 'jenjang', 'lokasi', 'deadline']
            }]
        });

        const beasiswaData = savedBeasiswaEntries
            .filter(saved => saved.savedBeasiswa !== null) // Akses data beasiswa melalui alias
            .map(saved => saved.savedBeasiswa);

        if (beasiswaData.length === 0) {
            return res.status(404).json({ msg: "No saved beasiswa found for this user." });
        }

        res.status(200).json(beasiswaData);
    } catch (error) {
        console.error("Error fetching saved beasiswa for user:", error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

export const saveBeasiswaForUser = async (req, res) => {
    const { userId, beasiswaId } = req.body;

    if (!userId || !beasiswaId) {
        return res.status(400).json({ msg: "User ID and Beasiswa ID are required." });
    }

    try {
        const existingEntry = await UserSavedBeasiswa.findOne({
            where: {
                userId: userId,
                beasiswaId: beasiswaId,
            },
        });

        if (existingEntry) {
            return res.status(409).json({ msg: "Beasiswa already saved by this user." });
        }

        const newSavedEntry = await UserSavedBeasiswa.create({
            userId: userId,
            beasiswaId: beasiswaId,
        });
        res.status(201).json({ msg: "Beasiswa saved successfully", data: newSavedEntry });
    } catch (error) {
        console.error("Error saving beasiswa for user:", error.message);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ msg: "Beasiswa already saved by this user (duplicate entry)." });
        }
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ msg: error.errors.map(e => e.message).join(', ') });
        }
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

export const deleteSavedBeasiswaForUser = async (req, res) => {
    try {
        const { userId, beasiswaId } = req.params;

        const result = await UserSavedBeasiswa.destroy({
            where: {
                userId: userId,
                beasiswaId: beasiswaId,
            },
        });

        if (result === 0) {
            return res.status(404).json({ msg: "Saved beasiswa entry not found for this user and beasiswa." });
        }

        res.status(200).json({ msg: "Saved beasiswa deleted successfully" });
    } catch (error) {
        console.error("Error deleting saved beasiswa for user:", error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};