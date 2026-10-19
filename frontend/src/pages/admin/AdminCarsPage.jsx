import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Car,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Sparkles,
  ArrowLeft,
  X,
  Save,
  Search,
  Fuel,
  Gauge
} from 'lucide-react';

export const AdminCarsPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const { showToast } = useToast();

  const initialForm = {
    make: '',
    model: '',
    year: 2024,
    category: 'sport',
    pricePerDay: 350,
    fuelType: 'essence',
    transmission: 'automatique',
    seats: 4,
    doors: 2,
    horsePower: 400,
    acceleration: '3.6s',
    topSpeed: '290 km/h',
    description: '',
    featuresText: 'GPS, Bluetooth, Sièges chauffants, Caméra 360°',
    imagesText: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    city: 'Paris',
    address: 'Place Vendôme, Paris',
    isAvailable: true,
    featured: false
  };

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cars?limit=100');
      if (res.data?.success) {
        setCars(res.data.cars);
      }
    } catch (err) {
      console.error('Erreur chargement flotte', err);
      showToast('Impossible de charger les véhicules', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleOpenAddModal = () => {
    setEditingCar(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const handleOpenEditModal = (car) => {
    setEditingCar(car);
    setForm({
      make: car.make,
      model: car.model,
      year: car.year,
      category: car.category,
      pricePerDay: car.pricePerDay,
      fuelType: car.fuelType,
      transmission: car.transmission,
      seats: car.seats,
      doors: car.doors,
      horsePower: car.horsePower || 300,
      acceleration: car.acceleration || '4.0s',
      topSpeed: car.topSpeed || '250 km/h',
      description: car.description || '',
      featuresText: car.features?.join(', ') || '',
      imagesText: car.images?.join('\n') || '',
      city: car.location?.city || 'Paris',
      address: car.location?.address || 'Paris Centre',
      isAvailable: car.isAvailable,
      featured: car.featured || false
    });
    setModalOpen(true);
  };

  const handleDeleteCar = async (carId) => {
    if (!window.confirm('Confirmez-vous la suppression de ce véhicule ?')) return;

    try {
      const res = await api.delete(`/cars/${carId}`);
      if (res.data?.success) {
        showToast('Véhicule supprimé avec succès', 'info');
        fetchCars();
      }
    } catch (err) {
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  const handleToggleAvailable = async (car) => {
    try {
      const res = await api.put(`/cars/${car._id}`, { isAvailable: !car.isAvailable });
      if (res.data?.success) {
        showToast(`Disponibilité mise à jour pour ${car.model}`, 'success');
        fetchCars();
      }
    } catch (err) {
      showToast('Erreur mise à jour', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const images = form.imagesText
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const features = form.featuresText
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const payload = {
      make: form.make,
      model: form.model,
      year: Number(form.year),
      category: form.category,
      pricePerDay: Number(form.pricePerDay),
      fuelType: form.fuelType,
      transmission: form.transmission,
      seats: Number(form.seats),
      doors: Number(form.doors),
      horsePower: Number(form.horsePower),
      acceleration: form.acceleration,
      topSpeed: form.topSpeed,
      description: form.description,
      features,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'],
      location: { city: form.city, address: form.address },
      isAvailable: form.isAvailable,
      featured: form.featured
    };

    try {
      if (editingCar) {
        await api.put(`/cars/${editingCar._id}`, payload);
        showToast('Véhicule mis à jour avec succès', 'success');
      } else {
        await api.post('/cars', payload);
        showToast('Nouveau véhicule ajouté à la flotte', 'success');
      }
      setModalOpen(false);
      fetchCars();
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur lors de l'enregistrement";
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCars = cars.filter(c =>
    `${c.make} ${c.model} ${c.category}`.toLowerCase().includes(search.toLowerCase())
  );

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
            Gestion de la Flotte de Véhicules
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Ajoutez, modifiez ou retirez des véhicules du catalogue public en temps réel.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="glass-button-primary text-xs px-4 py-2.5 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un véhicule</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher marque ou modèle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs text-white"
          />
        </div>

        <p className="text-xs text-slate-400">
          Total : <strong className="text-white">{filteredCars.length}</strong> véhicule(s) affiché(s)
        </p>
      </div>

      {/* Fleet Table */}
      <div className="rounded-3xl glass-panel p-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase border-b border-white/5">
              <tr>
                <th className="py-3 px-3">Véhicule</th>
                <th className="py-3 px-3">Catégorie</th>
                <th className="py-3 px-3">Tarif / jour</th>
                <th className="py-3 px-3">Spécifications</th>
                <th className="py-3 px-3 text-center">Disponible</th>
                <th className="py-3 px-3 text-center">VIP / Vedette</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Chargement de la flotte...
                  </td>
                </tr>
              ) : filteredCars.length > 0 ? (
                filteredCars.map((car) => (
                  <tr key={car._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={car.images?.[0]}
                          alt={car.model}
                          className="w-14 h-10 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white">{car.make} {car.model}</p>
                          <p className="text-[11px] text-slate-400">Année {car.year} • {car.location?.city}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="capitalize px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-medium">
                        {car.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="text-sm font-black text-emerald-400">{car.pricePerDay} €</span>
                    </td>

                    <td className="py-3.5 px-3 text-[11px] text-slate-400">
                      <span>{car.fuelType} • {car.transmission === 'automatique' ? 'Auto' : 'Man'} • {car.horsePower} ch</span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => handleToggleAvailable(car)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          car.isAvailable
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {car.isAvailable ? 'En service' : 'Indisponible'}
                      </button>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      {car.featured ? (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
                          <Sparkles className="w-3.5 h-3.5" /> Oui
                        </span>
                      ) : (
                        <span className="text-slate-500">Non</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(car)}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCar(car._id)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Aucun véhicule trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Car Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl glass-panel p-8 border border-white/10 shadow-2xl my-8">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-emerald-400" />
                <span>{editingCar ? 'Modifier le véhicule' : 'Ajouter un véhicule à la flotte'}</span>
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Marque</label>
                  <input
                    type="text"
                    required
                    placeholder="Porsche, Ferrari..."
                    value={form.make}
                    onChange={(e) => setForm({ ...form, make: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Modèle</label>
                  <input
                    type="text"
                    required
                    placeholder="911 Carrera, Model S..."
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Année</label>
                  <input
                    type="number"
                    required
                    min={2018}
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Catégorie</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-slate-950 text-white"
                  >
                    <option value="sport">Sport</option>
                    <option value="electrique">Électrique</option>
                    <option value="suv">SUV</option>
                    <option value="berline">Berline</option>
                    <option value="luxe">Luxe</option>
                    <option value="citadine">Citadine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tarif (€ / jour)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.pricePerDay}
                    onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Carburant</label>
                  <select
                    value={form.fuelType}
                    onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-slate-950 text-white"
                  >
                    <option value="essence">Essence</option>
                    <option value="electrique">Électrique</option>
                    <option value="hybride">Hybride</option>
                    <option value="diesel">Diesel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Transmission</label>
                  <select
                    value={form.transmission}
                    onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-slate-950 text-white"
                  >
                    <option value="automatique">Automatique</option>
                    <option value="manuelle">Manuelle</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Puissance (ch)</label>
                  <input
                    type="number"
                    value={form.horsePower}
                    onChange={(e) => setForm({ ...form, horsePower: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">0 à 100 km/h</label>
                  <input
                    type="text"
                    value={form.acceleration}
                    onChange={(e) => setForm({ ...form, acceleration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Places</label>
                  <input
                    type="number"
                    value={form.seats}
                    onChange={(e) => setForm({ ...form, seats: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Portes</label>
                  <input
                    type="number"
                    value={form.doors}
                    onChange={(e) => setForm({ ...form, doors: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="Présentation des performances..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Équipements (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={form.featuresText}
                  onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white"
                  placeholder="GPS, Toit panoramique, Burmester 3D..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  URLs des Images (1 par ligne)
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.imagesText}
                  onChange={(e) => setForm({ ...form, imagesText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white font-mono"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                  <input
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                    className="accent-emerald-500"
                  />
                  <span>Disponible à la réservation</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span>Mettre en vedette (Accueil VIP)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="glass-button-primary text-xs font-bold"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Enregistrement...' : 'Sauvegarder le véhicule'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCarsPage;
