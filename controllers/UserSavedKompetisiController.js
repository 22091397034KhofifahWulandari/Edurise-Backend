// controllers/UserSavedKompetisiController.js
import UserSavedKompetisi from "../models/UserSavedKompetisiModel.js";
import Kompetisi from "../models/KompetisiModel.js"; // Diperlukan untuk detail kompetisi

export const getSavedKompetisiByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const savedKompetisiEntries = await UserSavedKompetisi.findAll({
      where: { userId: userId },
      include: [{
        model: Kompetisi,
        as: 'savedKompetisiDetails', // Gunakan alias yang sama dengan di `UserSavedKompetisi.belongsTo(Kompetisi, { as: 'savedKompetisiDetails' })`
        attributes: ['id', 'poster_gambar', 'judul', 'tanggal', 'biaya', 'tingkat_kompetisi', 'tentang_kompetisi', 'syarat', 'ketentuan_kompetisi', 'benefit']
      }]
    });

    const kompetisiData = savedKompetisiEntries
      .filter(saved => saved.savedKompetisiDetails !== null)
      .map(saved => saved.savedKompetisiDetails);

    res.status(200).json(kompetisiData);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const saveKompetisiForUser = async (req, res) => {
  try {
    const { userId, kompetisiId } = req.body;

    const existingEntry = await UserSavedKompetisi.findOne({
      where: {
        userId: userId,
        kompetisiId: kompetisiId,
      },
    });

    if (existingEntry) {
      return res.status(409).json({ msg: "Kompetisi already saved by this user" });
    }

    await UserSavedKompetisi.create({
      userId: userId,
      kompetisiId: kompetisiId,
    });
    res.status(201).json({ msg: "Kompetisi saved successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: error.message });
  }
};

export const deleteSavedKompetisiForUser = async (req, res) => {
  try {
    const { userId, kompetisiId } = req.params;

    const result = await UserSavedKompetisi.destroy({
      where: {
        userId: userId,
        kompetisiId: kompetisiId,
      },
    });

    if (result === 0) {
      return res.status(404).json({ msg: "Saved kompetisi not found" });
    }

    res.status(200).json({ msg: "Saved kompetisi deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};