import Portofolio from "../models/PortofolioModel.js";

export const getPortofolio = async (req, res) => {
  try {
    const response = await Portofolio.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getPortofolioById = async (req, res) => {
  try {
    const response = await Portofolio.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const createPortofolio = async (req, res) => {
  try {
    await Portofolio.create(req.body);
    res.status(201).json({ msg: "Portofolio Created" });
  } catch (error) {
    console.log(error.message);
  }
};

export const updatePortofolio = async (req, res) => {
  try {
    await Portofolio.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Portofolio Updated" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deletePortofolio = async (req, res) => {
  try {
    await Portofolio.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Portofolio Deleted" });
  } catch (error) {
    console.log(error.message);
  }
};