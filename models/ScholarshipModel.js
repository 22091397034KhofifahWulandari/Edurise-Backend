import db from "../config/Database.js";

export const getAllScholarships = (callback) => {
  db.query("SELECT * FROM scholarships", callback);
};

export const insertScholarship = (data, callback) => {
  const sql = "INSERT INTO scholarships SET ?";
  db.query(sql, data, callback);
};
// Get by ID
export const getScholarshipById = (id, callback) => {
  db.query("SELECT * FROM scholarships WHERE id = ?", [id], callback);
};

// Update
export const updateScholarship = (id, data, callback) => {
  db.query("UPDATE scholarships SET ? WHERE id = ?", [data, id], callback);
};

// Delete
export const deleteScholarship = (id, callback) => {
  db.query("DELETE FROM scholarships WHERE id = ?", [id], callback);
};
