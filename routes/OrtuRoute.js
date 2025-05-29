import express from "express";
import {
  getOrtu,
  getOrtuById,
  createOrtu,
  updateOrtu,
  deleteOrtu
} from "../controllers/OrtuController.js";

const router = express.Router();

router.get('/ortu', getOrtu);
router.get('/ortu/:id', getOrtuById);
router.post('/ortu', createOrtu);
router.patch('/ortu/:id', updateOrtu);
router.delete('/ortu/:id', deleteOrtu);

export default router;
