import express from 'express';
import {
  getCars,
  getCarById,
  getCarBrands,
  createCar,
  updateCar,
  deleteCar
} from '../controllers/carController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getCars);
router.get('/brands', getCarBrands);
router.get('/:id', getCarById);

// Routes protégées Admin
router.post('/', protect, adminOnly, createCar);
router.put('/:id', protect, adminOnly, updateCar);
router.delete('/:id', protect, adminOnly, deleteCar);

export default router;
