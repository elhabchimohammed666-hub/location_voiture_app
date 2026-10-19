import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import InvoiceModal from '../components/booking/InvoiceModal';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  XCircle,
  AlertCircle,
  CheckCircle2,
  Shield,
  Car,
  ChevronRight
} from 'lucide-react';

export const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState(null);

  const { showToast } = useToast();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/my');
      if (res.data?.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Erreur chargement réservations', err);
      showToast('Impossible de récupérer vos réservations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }

    try {
      const res = await api.patch(`/bookings/${bookingId}/cancel`, {
        reason: 'Annulation demandée par le client'
      });
      if (res.data?.success) {
        showToast('Réservation annulée avec succès', 'info');
        fetchBookings();
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur lors de l'annulation";
      showToast(msg, 'error');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'all') return true;
    return b.status === statusFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmée
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> En attente de validation
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Terminée
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" /> Annulée
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Espace Personnel</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Mes Réservations & Factures
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Consultez vos locations en cours, téléchargez vos factures ou modifiez votre planning.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-white/5 overflow-x-auto">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'confirmed', label: 'Confirmées' },
            { id: 'pending', label: 'En attente' },
            { id: 'completed', label: 'Terminées' },
            { id: 'cancelled', label: 'Annulées' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 rounded-3xl glass-card animate-pulse" />
          ))}
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="glass-card rounded-3xl p-6 border border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Car & Booking Details */}
              <div className="flex items-center gap-5">
                <img
                  src={b.car?.images?.[0] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80'}
                  alt={b.car?.model}
                  className="w-28 h-20 rounded-2xl object-cover shrink-0 ring-1 ring-white/10"
                />

                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{b.car?.make}</span>
                    <h3 className="text-lg font-bold text-white">{b.car?.model}</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      {new Date(b.startDate).toLocaleDateString('fr-FR')} ➔ {new Date(b.endDate).toLocaleDateString('fr-FR')}
                    </span>
                    <span>•</span>
                    <span>Durée : <strong className="text-white">{b.totalDays} jour(s)</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" /> {b.pickupLocation}
                    </span>
                  </div>

                  {/* Options tags */}
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                    {b.options?.insurance && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-emerald-400" /> Assurance 0€
                      </span>
                    )}
                    {b.options?.extraDriver && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                        2nd Conducteur
                      </span>
                    )}
                    {b.options?.babySeat && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                        Siège Enfant
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status, Price & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5">
                <div className="text-left sm:text-right">
                  <div className="flex sm:justify-end mb-1">
                    {getStatusBadge(b.status)}
                  </div>
                  <p className="text-2xl font-black text-white">{b.totalPrice} €</p>
                  <p className="text-[10px] text-slate-400">TTC • Facture acquittée</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBookingForInvoice(b)}
                    className="glass-button-secondary text-xs px-4 py-2.5 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Facture</span>
                  </button>

                  {(b.status === 'confirmed' || b.status === 'pending') && (
                    <button
                      onClick={() => handleCancelBooking(b._id)}
                      className="px-3.5 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
                      title="Annuler ma réservation"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl glass-panel text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/60 text-slate-400 flex items-center justify-center mx-auto">
            <Car className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Aucune réservation trouvée</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Vous n'avez pas encore de réservation dans cette catégorie. Découvrez nos supercars prêtes pour un départ immédiat.
          </p>
          <Link to="/catalog" className="glass-button-primary text-xs mx-auto inline-flex items-center gap-2">
            <span>Explorer le catalogue</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedBookingForInvoice && (
        <InvoiceModal
          booking={selectedBookingForInvoice}
          isOpen={!!selectedBookingForInvoice}
          onClose={() => setSelectedBookingForInvoice(null)}
        />
      )}
    </div>
  );
};

export default MyBookingsPage;
