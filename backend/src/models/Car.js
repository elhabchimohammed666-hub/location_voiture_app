import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: [true, 'La marque est obligatoire'],
      trim: true
    },
    model: {
      type: String,
      required: [true, 'Le modèle est obligatoire'],
      trim: true
    },
    year: {
      type: Number,
      required: [true, "L'année de fabrication est obligatoire"]
    },
    category: {
      type: String,
      required: [true, 'La catégorie est obligatoire'],
      enum: ['citadine', 'berline', 'suv', 'sport', 'luxe', 'electrique']
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Le tarif journalier est obligatoire'],
      min: [1, 'Le prix doit être positif']
    },
    images: {
      type: [String],
      required: [true, 'Au moins une image est requise'],
      validate: [val => val.length > 0, 'La galerie doit contenir au moins une image']
    },
    fuelType: {
      type: String,
      required: true,
      enum: ['essence', 'diesel', 'electrique', 'hybride']
    },
    transmission: {
      type: String,
      required: true,
      enum: ['automatique', 'manuelle']
    },
    seats: {
      type: Number,
      required: true,
      default: 5
    },
    doors: {
      type: Number,
      default: 4
    },
    horsePower: {
      type: Number,
      default: 300
    },
    acceleration: {
      type: String,
      default: '4.5s'
    },
    topSpeed: {
      type: String,
      default: '250 km/h'
    },
    features: {
      type: [String],
      default: [
        'Navigation GPS HD',
        'Système Audio Hi-Fi',
        'Sièges Chauffants & Ventilés',
        'Caméra 360°',
        'Apple CarPlay / Android Auto',
        'Régulateur Adaptatif'
      ]
    },
    description: {
      type: String,
      default: ''
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    location: {
      city: { type: String, default: 'Paris' },
      address: { type: String, default: 'Aéroport Charles de Gaulle / Agence Étoile' }
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 24
    }
  },
  {
    timestamps: true
  }
);

// Index textuel pour recherche rapide multi-critères
carSchema.index({ make: 'text', model: 'text', category: 'text' });
// Index pour les filtres combinés
carSchema.index({ category: 1, pricePerDay: 1, fuelType: 1, transmission: 1, seats: 1, isAvailable: 1 });

export const Car = mongoose.model('Car', carSchema);
