import express from "express";
import {
  listScholarships,
  getScholarship,
  createScholarship,
  editScholarship,
  removeScholarship,
} from "../controllers/ScholarshipController.js";

const router = express.Router();

router.get("/scholarships", listScholarships); // GET all
router.get("/scholarships/:id", getScholarship); // GET by ID
router.post("/scholarships", createScholarship); // POST
router.put("/scholarships/:id", editScholarship); // PUT
router.delete("/scholarships/:id", removeScholarship); // DELETE

export default router;
