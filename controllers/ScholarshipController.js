import {
  getAllScholarships,
  getScholarshipById,
  insertScholarship,
  updateScholarship,
  deleteScholarship,
} from "../models/ScholarshipModel.js";

// GET all
export const listScholarships = (req, res) => {
  getAllScholarships((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// GET by ID
export const getScholarship = (req, res) => {
  const { id } = req.params;
  getScholarshipById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0)
      return res.status(404).json({ message: "Scholarship not found" });
    res.json(result[0]);
  });
};

// POST
export const createScholarship = (req, res) => {
  const data = req.body;
  insertScholarship(data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res
      .status(201)
      .json({ message: "Scholarship created", id: result.insertId });
  });
};

// PUT
export const editScholarship = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  updateScholarship(id, data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Scholarship updated" });
  });
};

// DELETE
export const removeScholarship = (req, res) => {
  const { id } = req.params;
  deleteScholarship(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Scholarship deleted" });
  });
};
