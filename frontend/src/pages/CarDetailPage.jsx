import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Star,
  Zap,
  Gauge,
  Fuel,
  Users,
  DoorClosed,
  MapPin,
  ShieldCheck,
  Check,
  Calendar,
  CreditCard,
  ArrowLeft,
  Share2,
  Heart
} from 'lucide-react';

export const CarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Formulaire de réservation inline
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const inThreeDays = new Date();
  inThreeDays.setDate(inThreeDays.getDate() + 4);

  const [startDate, setStartDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(inThreeDays.toISOString().split('T')[0]);
  const [options, setOptions] = useState({
    insurance: true,
    extraDriver: false,
    babySeat: false,
    gps: true
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await api.get(`/cars/${id}`);
        if (res.data?.success) {
          setCar(res.data.car);
        }
      } catch (err) {
        showToast('Impossible de charger ce véhicule', 'error');
        navigate('/catalog');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id, navigate, showToast]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-8">
        <div className="h-8 bg-slate-800 rounded w-1/4" />
        <div className="h-[450px] bg-slate-800 rounded-3xl" />
      </div>
    );
  }

  if (!car) return null;

  // Calcul du coût
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const baseRentalCost = car.pricePerDay * totalDays;
  let dailyOptions = 0;
  if (options.insurance) dailyOptions += 30;
  if (options.babySeat) dailyOptions += 10;
  if (options.extraDriver) dailyOptions += 15;
  const optionsTotalCost = dailyOptions * totalDays;
  const grandTotal = baseRentalCost + optionsTotalCost;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Veuillez vous connecter pour réserver ce véhicule', 'warning');
      navigate('/login');
      return;
    }

    if (start >= end) {
      showToast('La date de retour doit être postérieure à la date de départ', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/bookings', {
        carId: car._id,
        startDate,
        endDate,
        options,
        pickupLocation: car.location?.address || 'Agence Centrale'
      });

      if (res.data?.success) {
        showToast('Félicitations ! Votre réservation est confirmée.', 'success');
        navigate('/my-bookings');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors de la réservation';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au catalogue</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              showToast('Lien copié dans le presse-papier !', 'info');
            }}
            className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-white"
            title="Partager"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery & Specs vs Sticky Booking Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Column (2 cols): Gallery, Specs, Description */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Showcase Image */}
          <div className="relative rounded-3xl overflow-hidden glass-panel h-[360px] sm:h-[480px] bg-slate-950">
            <img
              src={car.images?.[activeImageIndex] || car.images?.[0]}
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-white/10">
                {car.category}
              </span>
              <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-950/80 backdrop-blur-md text-white border border-white/10">
                Année {car.year}
              </span>
            </div>
          </div>

          {/* Thumbnails Row */}
          {car.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {car.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-28 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-emerald-500 scale-95 shadow-lg shadow-emerald-500/20'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Aperçu" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Title and Rating */}
          <div className="space-y-2">
            <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest">{car.make}</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{car.model}</h1>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-white">{car.rating?.toFixed(1) || '4.9'}</span>
              </div>
              <span>•</span>
              <span className="text-slate-400">{car.numReviews || 24} avis certifiés</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-400" /> {car.location?.city || 'Paris'}, {car.location?.address}
              </span>
            </div>
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl glass-card">
              <Zap className="w-5 h-5 text-amber-400 mb-2" />
              <p className="text-[11px] text-slate-400 uppercase">Puissance</p>
              <p className="text-base font-bold text-white">{car.horsePower || 450} ch</p>
            </div>

            <div className="p-4 rounded-2xl glass-card">
              <Gauge className="w-5 h-5 text-emerald-400 mb-2" />
              <p className="text-[11px] text-slate-400 uppercase">0 à 100 km/h</p>
              <p className="text-base font-bold text-white">{car.acceleration || '3.5s'}</p>
            </div>

            <div className="p-4 rounded-2xl glass-card">
              <Fuel className="w-5 h-5 text-cyan-400 mb-2" />
              <p className="text-[11px] text-slate-400 uppercase">Énergie</p>
              <p className="text-base font-bold text-white capitalize">{car.fuelType}</p>
            </div>

            <div className="p-4 rounded-2xl glass-card">
              <Users className="w-5 h-5 text-indigo-400 mb-2" />
              <p className="text-[11px] text-slate-400 uppercase">Places</p>
              <p className="text-base font-bold text-white">{car.seats} Personnes</p>
            </div>
          </div>

          {/* Description */}
          {car.description && (
            <div className="space-y-3 p-6 rounded-3xl glass-card">
              <h3 className="text-lg font-bold text-white">Présentation du véhicule</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{car.description}</p>
            </div>
          )}

          {/* Features / Équipements */}
          {car.features?.length > 0 && (
            <div className="space-y-4 p-6 rounded-3xl glass-card">
              <h3 className="text-lg font-bold text-white">Équipements & Options Inclus</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {car.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-200">
                    <div className="w-5 h-5 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 col): Sticky Booking Tunnel Card */}
        <div className="lg:col-span-1 sticky top-28">
          <div className="rounded-3xl glass-panel p-6 space-y-6 shadow-2xl border-white/10">
            <div className="flex items-baseline justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-3xl font-black text-white">{car.pricePerDay} €</span>
                <span className="text-xs text-slate-400 ml-1">/ jour</span>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                Disponible
              </span>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-5">
              {/* Dates */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Date de départ
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Date de retour
                  </label>
                  <input
                    type="date"
                    required
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
                  Options Additionnelles
                </span>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-white/5 cursor-pointer text-xs">
                  <span className="text-slate-200">Assurance Tous Risques (+30€/j)</span>
                  <input
                    type="checkbox"
                    checked={options.insurance}
                    onChange={(e) => setOptions({ ...options, insurance: e.target.checked })}
                    className="accent-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-white/5 cursor-pointer text-xs">
                  <span className="text-slate-200">2ème Conducteur (+15€/j)</span>
                  <input
                    type="checkbox"
                    checked={options.extraDriver}
                    onChange={(e) => setOptions({ ...options, extraDriver: e.target.checked })}
                    className="accent-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-white/5 cursor-pointer text-xs">
                  <span className="text-slate-200">Siège Bébé Isofix (+10€/j)</span>
                  <input
                    type="checkbox"
                    checked={options.babySeat}
                    onChange={(e) => setOptions({ ...options, babySeat: e.target.checked })}
                    className="accent-emerald-500"
                  />
                </label>
              </div>

              {/* Price Calculation breakdown */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>{car.pricePerDay}€ x {totalDays} {totalDays > 1 ? 'jours' : 'jour'}</span>
                  <span className="text-white font-semibold">{baseRentalCost} €</span>
                </div>
                {optionsTotalCost > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Options supplémentaires</span>
                    <span className="text-emerald-400 font-semibold">+{optionsTotalCost} €</span>
                  </div>
                )}
                <div className="h-px bg-white/10 my-1" />
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Total Estimé TTC</span>
                  <span className="text-2xl font-black text-emerald-400">{grandTotal} €</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full glass-button-primary py-3.5 text-sm font-bold shadow-glow"
              >
                {submitting ? 'Réservation en cours...' : 'Réserver ce véhicule'}
              </button>

              <p className="text-[10px] text-center text-slate-400">
                Paiement sécurisé et confirmation instantanée.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailPage;
