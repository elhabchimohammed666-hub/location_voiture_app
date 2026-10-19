import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import InvoiceModal from '../../components/booking/InvoiceModal';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  FileText,
  User,
  Car,
  MapPin
} from 'lucide-react';

export const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { showToast } = useToast();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/bookings?status=${statusFilter}`);
      if (res.data?.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Erreur chargement réservations admin', err);
      showToast('Impossible de charger les réservations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.patch(`/admin/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data?.success) {
        showToast(`Statut mis à jour : ${newStatus}`, 'success');
        fetchBookings();
      }
    } catch (err) {
      showToast('Erreur mise à jour statut', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Retour au tableau de bord
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Gestion Globale des Réservations
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Validez, confirmez ou annulez les demandes de location client de l'ensemble de la flotte.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-white/5 overflow-x-auto">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'pending', label: 'En attente' },
            { id: 'confirmed', label: 'Confirmées' },
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

      {/* Bookings Table */}
      <div className="rounded-3xl glass-panel p-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase border-b border-white/5">
              <tr>
                <th className="py-3 px-3">Client</th>
                <th className="py-3 px-3">Véhicule</th>
                <th className="py-3 px-3">Période & Lieu</th>
                <th className="py-3 px-3">Montant TTC</th>
                <th className="py-3 px-3">Statut</th>
                <th className="py-3 px-3 text-right">Actions de Validation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Chargement des réservations...
                  </td>
                </tr>
              ) : bookings.length > 0 ? (
                bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-white/[0.02] transition-colors">
                    {/* User */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={b.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                          alt={b.user?.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white">{b.user?.name}</p>
                          <p className="text-[11px] text-slate-400">{b.user?.email}</p>
                          {b.user?.phone && <p className="text-[10px] text-slate-500">{b.user.phone}</p>}
                        </div>
                      </div>
                    </td>

                    {/* Car */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={b.car?.images?.[0]}
                          alt={b.car?.model}
                          className="w-10 h-7 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-white">{b.car?.make} {b.car?.model}</p>
                          <p className="text-[10px] text-slate-400">{b.car?.pricePerDay}€ / jour</p>
                        </div>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-3">
                      <p className="text-slate-200">
                        {new Date(b.startDate).toLocaleDateString('fr-FR')} ➔ {new Date(b.endDate).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-[10px] text-slate-400">{b.totalDays} jour(s) • {b.pickupLocation}</p>
                    </td>

                    {/* Total Price */}
                    <td className="py-3.5 px-3">
                      <span className="text-sm font-black text-white">{b.totalPrice} €</span>
                      <p className="text-[10px] text-emerald-400/80">{b.paymentStatus === 'paid' ? 'Payé' : b.paymentStatus}</p>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : b.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300'
                          : b.status === 'completed'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {b.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedInvoice(b)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Voir la facture"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        {b.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'confirmed')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[11px] hover:bg-emerald-400 transition-colors"
                          >
                            Accepter
                          </button>
                        )}

                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'completed')}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-[11px] font-bold transition-colors"
                          >
                            Terminer
                          </button>
                        )}

                        {b.status !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'cancelled')}
                            className="px-2 py-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[11px] font-semibold transition-colors"
                          >
                            Refuser
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Aucune réservation trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          booking={selectedInvoice}
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default AdminBookingsPage;
