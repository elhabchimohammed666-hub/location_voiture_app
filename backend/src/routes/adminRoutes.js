import express from 'express';
import {
  getAllBookings,
  updateBookingStatus,
  getDashboardStats,
  getAllUsers
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Toutes les routes admin nécessitent d'être connecté ET admin
router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/bookings', getAllBookings);
router.patch('/bookings/:id/status', updateBookingStatus);
router.get('/users', getAllUsers);

export default router;
