// controllers/BeasiswaController.js
import Beasiswa from "../models/BeasiswaModel.js";

export const getBeasiswa = async (req, res) => {
  try {
    const response = await Beasiswa.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
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
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const createBeasiswa = async (req, res) => {
  try {
    // req.body akan langsung berisi poster_gambar, judul, deskripsi, dll.
    const newBeasiswa = await Beasiswa.create(req.body);
    res.status(201).json({ msg: "Beasiswa Created", data: newBeasiswa }); // Mengembalikan data yang baru dibuat
  } catch (error) {
    console.log(error.message);
    // Jika ada error validasi dari Sequelize (misal allowNull: false tidak terpenuhi), 400 lebih tepat
    res.status(400).json({ msg: error.message });
  }
};

export const updateBeasiswa = async (req, res) => {
  try {
    // Menggunakan findByPk lebih disarankan
    const beasiswa = await Beasiswa.findByPk(req.params.id);
    if (!beasiswa) {
      return res.status(404).json({ msg: "Beasiswa Not Found" });
    }

    // req.body akan langsung berisi poster_gambar, judul, deskripsi, dll.
    await Beasiswa.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Beasiswa Updated" });
  } catch (error) {
    console.log(error.message);
    // Jika ada error validasi dari Sequelize, 400 lebih tepat
    res.status(400).json({ msg: error.message });
  }
};

export const deleteBeasiswa = async (req, res) => {
  try {
    // Menggunakan findByPk lebih disarankan
    const beasiswa = await Beasiswa.findByPk(req.params.id);
    if (!beasiswa) {
      return res.status(404).json({ msg: "Beasiswa Not Found" });
    }

    await Beasiswa.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Beasiswa Deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" }); // Error saat delete lebih ke server
  }
};