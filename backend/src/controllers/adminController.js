import { Booking } from '../models/Booking.js';
import { Car } from '../models/Car.js';
import { User } from '../models/User.js';

// @desc    Obtenir toutes les réservations de la plateforme (Admin)
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res, next) => {
  try {
    const { status, sort = 'newest' } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate('car')
      .populate('user', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour le statut d'une réservation (Admin: Valider / Refuser / Terminer)
// @route   PATCH /api/admin/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus, cancellationReason } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Réservation introuvable' });
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    if (cancellationReason) booking.cancellationReason = cancellationReason;

    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate('car')
      .populate('user', 'name email phone');

    res.json({
      success: true,
      message: `Statut de la réservation mis à jour : ${status}`,
      booking: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Statistiques globales pour le tableau de bord Admin
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Total Chiffre d'Affaires (hors réservations annulées)
    const revenueAgg = await Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    // 2. Nombre total de réservations
    const totalBookings = await Booking.countDocuments();

    // 3. Réservations actives (confirmées avec retour dans le futur)
    const activeBookings = await Booking.countDocuments({
      status: 'confirmed',
      endDate: { $gte: new Date() }
    });

    // 4. Flotte de véhicules
    const totalCars = await Car.countDocuments();
    const availableCars = await Car.countDocuments({ isAvailable: true });

    // 5. Utilisateurs clients
    const totalUsers = await User.countDocuments({ role: 'client' });

    // 6. Les 5 dernières réservations récentes
    const recentBookings = await Booking.find()
      .populate('car', 'make model pricePerDay images')
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalBookings,
        activeBookings,
        totalCars,
        availableCars,
        totalUsers,
        occupancyRate: totalCars > 0 ? Math.round((activeBookings / totalCars) * 100) : 0
      },
      recentBookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Liste des utilisateurs inscrits (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'client' }).select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};
