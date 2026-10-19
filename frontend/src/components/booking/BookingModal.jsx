import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  X,
  Calendar,
  Shield,
  Baby,
  UserCheck,
  CheckCircle,
  MapPin,
  CreditCard,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const BookingModal = ({ car, isOpen, onClose, onBookingSuccess }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Dates par défaut : demain et dans 4 jours
  const defaultStartDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const defaultEndDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  }, []);

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [pickupLocation, setPickupLocation] = useState(car?.location?.address || 'Agence Étoile - Paris');
  const [options, setOptions] = useState({
    insurance: true, // Recommandée
    babySeat: false,
    extraDriver: false,
    gps: true
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !car) return null;

  // Calcul du nombre de jours
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Calcul des coûts
  const baseRentalCost = (car.pricePerDay || 0) * totalDays;
  let dailyOptions = 0;
  if (options.insurance) dailyOptions += 30;
  if (options.babySeat) dailyOptions += 10;
  if (options.extraDriver) dailyOptions += 15;
  const optionsTotalCost = dailyOptions * totalDays;
  const grandTotal = baseRentalCost + optionsTotalCost;

  const handleSubmit = async (e) => {
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
        pickupLocation
      });

      if (res.data?.success) {
        showToast('Réservation confirmée avec succès ! Un récapitulatif a été généré.', 'success');
        if (onBookingSuccess) onBookingSuccess(res.data.booking);
        onClose();
        navigate('/my-bookings');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Erreur lors de la réservation';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/60 border border-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
          <img
            src={car.images?.[0]}
            alt={car.model}
            className="w-20 h-14 rounded-xl object-cover ring-2 ring-emerald-500/20"
          />
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">{car.make}</span>
            <h2 className="text-xl font-bold text-white leading-snug">{car.model}</h2>
            <p className="text-xs text-slate-400">
              Tarif : <span className="text-white font-bold">{car.pricePerDay}€</span> / jour
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sélection des Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Date de départ
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Date de retour
              </label>
              <input
                type="date"
                required
                min={startDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
              />
            </div>
          </div>

          {/* Agence de prise en charge */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Lieu de prise en charge & restitution
            </label>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
              placeholder="Aéroport CDG, Paris Centre, Cannes..."
            />
          </div>

          {/* Options de location */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Options VIP & Sérénité
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  options.insurance
                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <input
                    type="checkbox"
                    checked={options.insurance}
                    onChange={(e) => setOptions({ ...options, insurance: e.target.checked })}
                    className="accent-emerald-500"
                  />
                </div>
                <div className="mt-2">
                  <p className="text-xs font-bold text-white">Assurance Zéro</p>
                  <p className="text-[11px] text-slate-400">+30€ / jour</p>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  options.extraDriver
                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <UserCheck className="w-4 h-4 text-indigo-400" />
                  <input
                    type="checkbox"
                    checked={options.extraDriver}
                    onChange={(e) => setOptions({ ...options, extraDriver: e.target.checked })}
                    className="accent-emerald-500"
                  />
                </div>
                <div className="mt-2">
                  <p className="text-xs font-bold text-white">Conducteur +</p>
                  <p className="text-[11px] text-slate-400">+15€ / jour</p>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  options.babySeat
                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <Baby className="w-4 h-4 text-amber-400" />
                  <input
                    type="checkbox"
                    checked={options.babySeat}
                    onChange={(e) => setOptions({ ...options, babySeat: e.target.checked })}
                    className="accent-emerald-500"
                  />
                </div>
                <div className="mt-2">
                  <p className="text-xs font-bold text-white">Siège Enfant</p>
                  <p className="text-[11px] text-slate-400">+10€ / jour</p>
                </div>
              </label>
            </div>
          </div>

          {/* Récapitulatif Tarifaire */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Location véhicule ({totalDays} {totalDays > 1 ? 'jours' : 'jour'} x {car.pricePerDay}€)</span>
              <span className="font-semibold text-white">{baseRentalCost} €</span>
            </div>
            {optionsTotalCost > 0 && (
              <div className="flex justify-between text-slate-300">
                <span>Options sélectionnées ({dailyOptions}€ x {totalDays} j)</span>
                <span className="font-semibold text-emerald-400">+{optionsTotalCost} €</span>
              </div>
            )}
            <div className="h-px bg-white/10 my-2" />
            <div className="flex justify-between items-baseline text-sm">
              <span className="font-bold text-white">Montant Total TTC</span>
              <span className="text-2xl font-black text-emerald-400">{grandTotal} €</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white font-medium text-sm transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="glass-button-primary text-sm font-bold min-w-[180px]"
            >
              {submitting ? (
                <span>Validation en cours...</span>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Confirmer la réservation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
