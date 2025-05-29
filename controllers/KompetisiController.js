// controllers/KompetisiController.js
import Kompetisi from "../models/KompetisiModel.js";

export const getKompetisi = async (req, res) => {
  try {
    const response = await Kompetisi.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getKompetisiById = async (req, res) => {
  try {
    const response = await Kompetisi.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!response) {
      return res.status(404).json({ msg: "Kompetisi Not Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const createKompetisi = async (req, res) => {
  try {
    await Kompetisi.create(req.body);
    res.status(201).json({ msg: "Kompetisi Created" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: error.message });
  }
};

export const updateKompetisi = async (req, res) => {
  try {
    const kompetisi = await Kompetisi.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!kompetisi) {
      return res.status(404).json({ msg: "Kompetisi Not Found" });
    }

    await Kompetisi.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Kompetisi Updated" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: error.message });
  }
};

export const deleteKompetisi = async (req, res) => {
  try {
    const kompetisi = await Kompetisi.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!kompetisi) {
      return res.status(404).json({ msg: "Kompetisi Not Found" });
    }

    await Kompetisi.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Kompetisi Deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};