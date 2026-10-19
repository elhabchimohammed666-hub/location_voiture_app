import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import CarCard from '../components/cars/CarCard';
import CarFilters from '../components/cars/CarFilters';
import SkeletonCard from '../components/common/SkeletonCard';
import BookingModal from '../components/booking/BookingModal';
import { SlidersHorizontal, ArrowUpDown, X, Car, AlertCircle } from 'lucide-react';

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initial state derived from URL query parameters
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    make: searchParams.get('make') || '',
    fuelType: searchParams.get('fuelType') || '',
    transmission: searchParams.get('transmission') || '',
    seats: searchParams.get('seats') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
  });

  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedCarForBooking, setSelectedCarForBooking] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Charger les marques pour les filtres
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await api.get('/cars/brands');
        if (res.data?.success) {
          setBrands(res.data.brands);
        }
      } catch (err) {
        console.error('Erreur chargement marques', err);
      }
    };
    fetchBrands();
  }, []);

  // Synchronisation avec l'API
  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.make) params.append('make', filters.make);
      if (filters.fuelType) params.append('fuelType', filters.fuelType);
      if (filters.transmission) params.append('transmission', filters.transmission);
      if (filters.seats) params.append('seats', filters.seats);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sort) params.append('sort', filters.sort);
      params.append('page', filters.page);
      params.append('limit', 9);

      // Mettre à jour l'URL sans recharger
      setSearchParams(params);

      const res = await api.get(`/cars?${params.toString()}`);
      if (res.data?.success) {
        setCars(res.data.cars);
        setTotalCount(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Erreur récupération véhicules', err);
    } finally {
      setLoading(false);
    }
  }, [filters, setSearchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCars();
    }, 250); // Léger debounce sur la frappe
    return () => clearTimeout(timer);
  }, [fetchCars]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      make: '',
      fuelType: '',
      transmission: '',
      seats: '',
      maxPrice: '',
      sort: 'newest',
      page: 1,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Parc Automobile</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            Catalogue des Véhicules
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Découvrez nos {totalCount} modèles de prestige disponibles immédiatement.
          </p>
        </div>

        {/* Mobile Filter Toggle & Sort Select */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden glass-button-secondary text-xs px-4 py-2.5 flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span>Filtres</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-900/60 border border-white/10 px-3 py-1.5 rounded-xl">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={filters.sort}
              onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value, page: 1 }))}
              className="bg-transparent text-xs text-white outline-none cursor-pointer"
            >
              <option value="newest" className="bg-slate-900">Plus récents</option>
              <option value="price_asc" className="bg-slate-900">Prix : Croissant</option>
              <option value="price_desc" className="bg-slate-900">Prix : Décroissant</option>
              <option value="rating_desc" className="bg-slate-900">Mieux notés</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-28">
          <CarFilters
            filters={filters}
            setFilters={setFilters}
            brands={brands}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filters Drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-sm h-full glass-panel p-6 overflow-y-auto space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="font-bold text-white text-lg">Filtres</span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <CarFilters
                filters={filters}
                setFilters={setFilters}
                brands={brands}
                onReset={handleResetFilters}
              />
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 rounded-xl bg-emerald-500 font-bold text-slate-950 text-sm"
              >
                Afficher {totalCount} véhicule(s)
              </button>
            </div>
          </div>
        )}

        {/* Cars List / Cards */}
        <div className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : cars.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <CarCard
                    key={car._id}
                    car={car}
                    onBookNow={(selected) => setSelectedCarForBooking(selected)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8">
                  <button
                    disabled={filters.page <= 1}
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                    className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    Précédent
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const p = i + 1;
                      return (
                        <button
                          key={p}
                          onClick={() => setFilters(prev => ({ ...prev, page: p }))}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                            filters.page === p
                              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                              : 'bg-slate-900/60 text-slate-400 hover:text-white'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={filters.page >= totalPages}
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                    className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="p-12 rounded-3xl glass-panel text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/60 text-slate-400 flex items-center justify-center mx-auto">
                <Car className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Aucun véhicule ne correspond à vos critères</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Essayez d'élargir votre budget maximal ou de réinitialiser vos filtres de motorisation et de marque.
              </p>
              <button
                onClick={handleResetFilters}
                className="glass-button-primary text-xs mx-auto mt-2"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedCarForBooking && (
        <BookingModal
          car={selectedCarForBooking}
          isOpen={!!selectedCarForBooking}
          onClose={() => setSelectedCarForBooking(null)}
        />
      )}
    </div>
  );
};

export default CatalogPage;
