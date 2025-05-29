import Ortu from "../models/OrtuModel.js";

export const getOrtu = async (req, res) => {
  try {
    const response = await Ortu.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getOrtuById = async (req, res) => {
  try {
    const response = await Ortu.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const createOrtu = async (req, res) => {
  try {
    await Ortu.create(req.body);
    res.status(201).json({ msg: "Data Orang Tua Created" });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateOrtu = async (req, res) => {
  try {
    await Ortu.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Data Orang Tua Updated" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteOrtu = async (req, res) => {
  try {
    await Ortu.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Data Orang Tua Deleted" });
  } catch (error) {
    console.log(error.message);
  }
};