import express from "express";
import {
  getPortofolio,
  getPortofolioById,
  createPortofolio,
  updatePortofolio,
  deletePortofolio
} from "../controllers/PortofolioController.js";

const router = express.Router();

router.get('/portofolio', getPortofolio);
router.get('/portofolio/:id', getPortofolioById);
router.post('/portofolio', createPortofolio);
router.patch('/portofolio/:id', updatePortofolio);
router.delete('/portofolio/:id', deletePortofolio);

export default router;
