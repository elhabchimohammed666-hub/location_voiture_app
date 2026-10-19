import React from 'react';
import { Search, RotateCcw, SlidersHorizontal, Check } from 'lucide-react';

export const CarFilters = ({
  filters,
  setFilters,
  brands = [],
  onReset
}) => {
  const categories = [
    { id: '', label: 'Toutes' },
    { id: 'sport', label: 'Sport & Supercar' },
    { id: 'electrique', label: 'Électrique' },
    { id: 'suv', label: 'SUV Prestige' },
    { id: 'berline', label: 'Berline' },
    { id: 'luxe', label: 'Ultra Luxe' },
    { id: 'citadine', label: 'Citadine' },
  ];

  const fuelTypes = [
    { id: '', label: 'Tous' },
    { id: 'essence', label: 'Essence' },
    { id: 'electrique', label: '100% Élec' },
    { id: 'hybride', label: 'Hybride' },
    { id: 'diesel', label: 'Diesel' },
  ];

  const transmissions = [
    { id: '', label: 'Toutes' },
    { id: 'automatique', label: 'Automatique' },
    { id: 'manuelle', label: 'Manuelle' },
  ];

  const seatOptions = [
    { count: '', label: 'Tous' },
    { count: 2, label: '2+' },
    { count: 4, label: '4+' },
    { count: 5, label: '5+' },
  ];

  const handleChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1 // Réinitialiser pagination lors du changement de filtre
    }));
  };

  return (
    <div className="glass-panel rounded-3xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-white font-bold">
          <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
          <span>Filtres de Recherche</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          title="Réinitialiser les filtres"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Effacer</span>
        </button>
      </div>

      {/* Barre de recherche temps réel */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
          Recherche par mot-clé
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Porsche, Model S, Cannes, V8..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>
      </div>

      {/* Catégories */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
          Catégorie
        </label>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleChange('category', cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filters.category === cat.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Marque */}
      {brands.length > 0 && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Marque
          </label>
          <select
            value={filters.make || ''}
            onChange={(e) => handleChange('make', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-slate-950 text-white cursor-pointer"
          >
            <option value="">Toutes les marques ({brands.length})</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      )}

      {/* Plage de Prix par Jour */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Budget max / jour
          </label>
          <span className="text-sm font-bold text-emerald-400">
            {filters.maxPrice ? `${filters.maxPrice} €` : 'Illimité'}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="1500"
          step="50"
          value={filters.maxPrice || 1500}
          onChange={(e) => handleChange('maxPrice', e.target.value)}
          className="w-full accent-emerald-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>100 €</span>
          <span>750 €</span>
          <span>1500 €+</span>
        </div>
      </div>

      {/* Motorisation / Carburant */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
          Motorisation
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {fuelTypes.map((fuel) => (
            <button
              key={fuel.id}
              onClick={() => handleChange('fuelType', fuel.id)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filters.fuelType === fuel.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 border border-white/5'
              }`}
            >
              {fuel.label}
            </button>
          ))}
        </div>
      </div>

      {/* Boîte de Vitesses */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
          Boîte de Vitesses
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {transmissions.map((trans) => (
            <button
              key={trans.id}
              onClick={() => handleChange('transmission', trans.id)}
              className={`px-2 py-1.5 rounded-xl text-xs font-medium text-center transition-all ${
                filters.transmission === trans.id
                  ? 'bg-indigo-500 text-white font-bold'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 border border-white/5'
              }`}
            >
              {trans.label}
            </button>
          ))}
        </div>
      </div>

      {/* Nombre de Places */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
          Places assises min.
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {seatOptions.map((s) => (
            <button
              key={s.label}
              onClick={() => handleChange('seats', s.count)}
              className={`py-1.5 rounded-xl text-xs font-medium text-center transition-all ${
                String(filters.seats || '') === String(s.count)
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 border border-white/5'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarFilters;
