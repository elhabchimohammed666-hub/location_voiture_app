import { Car } from '../models/Car.js';

// @desc    Obtenir la liste des voitures avec filtres avancés, recherche et tri
// @route   GET /api/cars
// @access  Public
export const getCars = async (req, res, next) => {
  try {
    const {
      search,
      make,
      category,
      fuelType,
      transmission,
      seats,
      minPrice,
      maxPrice,
      sort,
      isAvailable,
      featured,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Recherche par mot-clé (marque, modèle ou catégorie)
    if (search) {
      query.$or = [
        { make: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtres spécifiques
    if (make) query.make = { $regex: new RegExp(`^${make}$`, 'i') };
    if (category) query.category = category;
    if (fuelType) query.fuelType = fuelType;
    if (transmission) query.transmission = transmission;
    if (seats) query.seats = { $gte: Number(seats) };
    if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';
    if (featured !== undefined) query.featured = featured === 'true';

    // Filtre de prix
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    // Tri
    let sortBy = { createdAt: -1 };
    if (sort === 'price_asc') sortBy = { pricePerDay: 1 };
    if (sort === 'price_desc') sortBy = { pricePerDay: -1 };
    if (sort === 'rating_desc') sortBy = { rating: -1 };
    if (sort === 'year_desc') sortBy = { year: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Car.countDocuments(query);
    const cars = await Car.find(query).sort(sortBy).skip(skip).limit(Number(limit));

    res.json({
      success: true,
      count: cars.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      cars
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les détails d'une voiture par son ID
// @route   GET /api/cars/:id
// @access  Public
export const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Véhicule introuvable' });
    }
    res.json({
      success: true,
      car
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les marques disponibles pour les filtres
// @route   GET /api/cars/brands
// @access  Public
export const getCarBrands = async (req, res, next) => {
  try {
    const brands = await Car.distinct('make');
    res.json({
      success: true,
      brands: brands.sort()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer un nouveau véhicule (Admin)
// @route   POST /api/cars
// @access  Private/Admin
export const createCar = async (req, res, next) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Véhicule ajouté avec succès au catalogue',
      car
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un véhicule (Admin)
// @route   PUT /api/cars/:id
// @access  Private/Admin
export const updateCar = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!car) {
      return res.status(404).json({ success: false, message: 'Véhicule introuvable' });
    }

    res.json({
      success: true,
      message: 'Véhicule mis à jour avec succès',
      car
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un véhicule (Admin)
// @route   DELETE /api/cars/:id
// @access  Private/Admin
export const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({ success: false, message: 'Véhicule introuvable' });
    }

    res.json({
      success: true,
      message: 'Véhicule supprimé du catalogue avec succès'
    });
  } catch (error) {
    next(error);
  }
};
