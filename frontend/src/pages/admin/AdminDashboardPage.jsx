import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  TrendingUp,
  Calendar,
  Car,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      if (res.data?.success) {
        setStats(res.data.stats);
        setRecentBookings(res.data.recentBookings);
      }
    } catch (err) {
      console.error('Erreur chargement dashboard stats', err);
      showToast('Erreur chargement des métriques administrateur', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.patch(`/admin/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data?.success) {
        showToast(`Réservation ${newStatus === 'confirmed' ? 'validée' : 'mise à jour'} avec succès`, 'success');
        fetchStats();
      }
    } catch (err) {
      showToast('Impossible de modifier le statut', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
        <div className="h-8 bg-slate-800 rounded w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-slate-800 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Espace Direction & Gestion
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-2">
            Tableau de Bord Administrateur
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Supervisez les performances financières, l'état de la flotte et les réservations en temps réel.
          </p>
        </div>

        {/* Quick Nav Links to admin sub-pages */}
        <div className="flex items-center gap-2">
          <Link
            to="/admin/cars"
            className="glass-button-secondary text-xs px-4 py-2.5 flex items-center gap-2"
          >
            <Car className="w-4 h-4 text-emerald-400" />
            <span>Gérer les Véhicules</span>
          </Link>

          <Link
            to="/admin/bookings"
            className="glass-button-primary text-xs px-4 py-2.5 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Toutes les Réservations</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="p-6 rounded-3xl glass-panel relative overflow-hidden border border-emerald-500/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Chiffre d'Affaires</p>
              <h3 className="text-3xl font-black text-white mt-2">
                {stats?.totalRevenue?.toLocaleString('fr-FR')} €
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-emerald-400 font-medium mt-3 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Locations confirmées & terminées
          </p>
        </div>

        {/* Total Bookings */}
        <div className="p-6 rounded-3xl glass-panel relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Réservations Totales</p>
              <h3 className="text-3xl font-black text-white mt-2">
                {stats?.totalBookings || 0}
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-cyan-400 font-medium mt-3">
            {stats?.activeBookings || 0} location(s) active(s) en cours
          </p>
        </div>

        {/* Total Cars & Occupancy */}
        <div className="p-6 rounded-3xl glass-panel relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Flotte Automobile</p>
              <h3 className="text-3xl font-black text-white mt-2">
                {stats?.totalCars || 0}
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
              <Car className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-amber-400 font-medium mt-3">
            {stats?.availableCars || 0} disponibles à la réservation
          </p>
        </div>

        {/* Total Users */}
        <div className="p-6 rounded-3xl glass-panel relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Clients Actifs</p>
              <h3 className="text-3xl font-black text-white mt-2">
                {stats?.totalUsers || 0}
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-indigo-400 font-medium mt-3">
            Comptes vérifiés avec permis
          </p>
        </div>
      </div>

      {/* Recent Bookings Quick Table */}
      <div className="rounded-3xl glass-panel p-6 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white">Dernières Réservations Enregistrées</h3>
            <p className="text-xs text-slate-400">Validez ou refusez les demandes récentes en un clic</p>
          </div>

          <Link
            to="/admin/bookings"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            <span>Voir tout l'historique</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase border-b border-white/5">
              <tr>
                <th className="py-3 px-3">Client</th>
                <th className="py-3 px-3">Véhicule</th>
                <th className="py-3 px-3">Dates</th>
                <th className="py-3 px-3">Montant</th>
                <th className="py-3 px-3">Statut</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {recentBookings?.length > 0 ? (
                recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={b.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                          alt={b.user?.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-white">{b.user?.name}</p>
                          <p className="text-[11px] text-slate-400">{b.user?.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-white">{b.car?.make} {b.car?.model}</p>
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="text-slate-200">
                        {new Date(b.startDate).toLocaleDateString('fr-FR')} ➔ {new Date(b.endDate).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-[10px] text-slate-400">{b.totalDays} jour(s)</p>
                    </td>

                    <td className="py-3.5 px-3 font-bold text-white text-sm">
                      {b.totalPrice} €
                    </td>

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

                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'confirmed')}
                            className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors"
                            title="Valider la réservation"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'cancelled')}
                            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors"
                            title="Refuser ou annuler"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Aucune réservation récente
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
