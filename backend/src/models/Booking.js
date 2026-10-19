import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true
    },
    startDate: {
      type: Date,
      required: [true, 'La date de départ est obligatoire']
    },
    endDate: {
      type: Date,
      required: [true, 'La date de retour est obligatoire']
    },
    totalDays: {
      type: Number,
      required: true,
      min: 1
    },
    dailyRate: {
      type: Number,
      required: true
    },
    optionsPrice: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      required: [true, 'Le montant total est requis']
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    },
    options: {
      insurance: { type: Boolean, default: false }, // Assurance Premium (+30€/jour)
      babySeat: { type: Boolean, default: false },   // Siège bébé (+10€/jour)
      extraDriver: { type: Boolean, default: false }, // Conducteur additionnel (+15€/jour)
      gps: { type: Boolean, default: true }
    },
    pickupLocation: {
      type: String,
      default: 'Agence Étoile - Paris'
    },
    dropoffLocation: {
      type: String,
      default: 'Agence Étoile - Paris'
    },
    cancellationReason: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Index composé pour vérifier rapidement les conflits de dates sur un même véhicule
bookingSchema.index({ car: 1, startDate: 1, endDate: 1, status: 1 });

export const Booking = mongoose.model('Booking', bookingSchema);
