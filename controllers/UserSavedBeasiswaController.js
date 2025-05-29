// controllers/UserSavedBeasiswaController.js
import UserSavedBeasiswa from "../models/UserSavedBeasiswaModel.js";
import Beasiswa from "../models/BeasiswaModel.js"; // Diperlukan untuk mengambil detail beasiswa

export const getSavedBeasiswaByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const savedBeasiswaEntries = await UserSavedBeasiswa.findAll({
      where: { userId: userId },
      include: [{
        model: Beasiswa,
        as: 'savedBeasiswaDetails', // PENTING: Gunakan alias yang sama dengan di `UserSavedBeasiswa.belongsTo(Beasiswa, { as: 'savedBeasiswaDetails' })`
        attributes: ['id', 'judul', 'deskripsi', 'persyaratan', 'manfaat', 'timeline', 'cara_daftar']
      }]
    });

    const beasiswaData = savedBeasiswaEntries
      .filter(saved => saved.savedBeasiswaDetails !== null)
      .map(saved => saved.savedBeasiswaDetails);

    res.status(200).json(beasiswaData);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const saveBeasiswaForUser = async (req, res) => {
  try {
    const { userId, beasiswaId } = req.body;

    const existingEntry = await UserSavedBeasiswa.findOne({
      where: {
        userId: userId,
        beasiswaId: beasiswaId,
      },
    });

    if (existingEntry) {
      return res.status(409).json({ msg: "Beasiswa already saved by this user" });
    }

    await UserSavedBeasiswa.create({
      userId: userId,
      beasiswaId: beasiswaId,
    });
    res.status(201).json({ msg: "Beasiswa saved successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: error.message });
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
      return res.status(404).json({ msg: "Saved beasiswa not found" });
    }

    res.status(200).json({ msg: "Saved beasiswa deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};