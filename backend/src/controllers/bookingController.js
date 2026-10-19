import { Booking } from '../models/Booking.js';
import { Car } from '../models/Car.js';

// @desc    Créer une nouvelle réservation
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
  try {
    const { carId, startDate, endDate, options = {}, pickupLocation, dropoffLocation } = req.body;

    if (!carId || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Le véhicule et les dates de début/fin sont requis' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ success: false, message: 'Dates fournies invalides' });
    }

    if (start >= end) {
      return res.status(400).json({ success: false, message: 'La date de fin doit être postérieure à la date de début' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) {
      return res.status(400).json({ success: false, message: 'La date de début ne peut pas être dans le passé' });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Véhicule introuvable' });
    }

    if (!car.isAvailable) {
      return res.status(400).json({ success: false, message: 'Ce véhicule est actuellement hors service ou indisponible' });
    }

    // Vérification des chevauchements de dates avec d'autres réservations actives
    const conflictingBooking = await Booking.findOne({
      car: carId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        message: 'Ce véhicule est déjà réservé sur la période sélectionnée'
      });
    }

    // Calcul de la durée en jours
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    // Calcul du surcoût des options par jour
    let dailyOptionsCost = 0;
    if (options.insurance) dailyOptionsCost += 30; // Assurance tous risques
    if (options.babySeat) dailyOptionsCost += 10;  // Siège enfant
    if (options.extraDriver) dailyOptionsCost += 15; // 2ème conducteur

    const optionsPrice = dailyOptionsCost * totalDays;
    const baseRentalPrice = car.pricePerDay * totalDays;
    const totalPrice = baseRentalPrice + optionsPrice;

    const booking = await Booking.create({
      user: req.user._id,
      car: carId,
      startDate: start,
      endDate: end,
      totalDays,
      dailyRate: car.pricePerDay,
      optionsPrice,
      totalPrice,
      status: 'confirmed', // Confirmation automatique par défaut dans l'expérience fluide
      paymentStatus: 'paid', // Simulation paiement validé
      options: {
        insurance: !!options.insurance,
        babySeat: !!options.babySeat,
        extraDriver: !!options.extraDriver,
        gps: options.gps !== undefined ? !!options.gps : true
      },
      pickupLocation: pickupLocation || car.location.address || 'Agence Centrale',
      dropoffLocation: dropoffLocation || pickupLocation || car.location.address || 'Agence Centrale'
    });

    const populatedBooking = await Booking.findById(booking._id).populate('car').populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Réservation validée avec succès !',
      booking: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les réservations de l'utilisateur connecté
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('car')
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

// @desc    Obtenir les détails d'une réservation
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('car')
      .populate('user', 'name email phone avatar');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Réservation introuvable' });
    }

    // Autorisé uniquement pour le client concerné ou un admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès non autorisé à cette réservation' });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Annuler une réservation par le client
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Réservation introuvable' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Action non autorisée' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Cette réservation est déjà annulée' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'Annulation demandée par le client';
    booking.paymentStatus = 'refunded';
    await booking.save();

    res.json({
      success: true,
      message: 'Réservation annulée avec succès',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les dates déjà réservées pour un véhicule (pour désactiver dans le calendrier)
// @route   GET /api/bookings/car/:carId/booked-dates
// @access  Public
export const getCarBookedDates = async (req, res, next) => {
  try {
    const { carId } = req.params;
    const bookings = await Booking.find({
      car: carId,
      status: { $in: ['pending', 'confirmed'] },
      endDate: { $gte: new Date() }
    }).select('startDate endDate');

    res.json({
      success: true,
      bookedDates: bookings
    });
  } catch (error) {
    next(error);
  }
};
