import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Fuel,
  Gauge,
  Users,
  Zap,
  Star,
  ArrowRight,
  Heart,
  Sparkles
} from 'lucide-react';

export const CarCard = ({ car, onBookNow }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';

  const categoryTranslations = {
    sport: 'Supercar',
    electrique: 'Électrique',
    suv: 'SUV Prestige',
    berline: 'Berline Luxe',
    luxe: 'Ultra Luxe',
    citadine: 'Compacte'
  };

  return (
    <div className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col group relative">
      {/* Image Container with Badges */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-900">
        <img
          src={imgError ? fallbackImage : (car.images?.[0] || fallbackImage)}
          alt={`${car.make} ${car.model}`}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="pointer-events-auto px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-950/70 backdrop-blur-md border border-white/10 text-emerald-400">
              {categoryTranslations[car.category] || car.category}
            </span>
            {car.featured && (
              <span className="pointer-events-auto flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300">
                <Sparkles className="w-3 h-3" /> VIP
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md border transition-all duration-200 ${
              isFavorite
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                : 'bg-slate-950/60 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Rating and Year on Bottom of Image */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-bold text-white">{car.rating?.toFixed(1) || '4.9'}</span>
            <span className="text-slate-400">({car.numReviews || 18})</span>
          </div>
          <span className="text-slate-400 font-medium bg-slate-950/60 backdrop-blur-md px-2 py-0.5 rounded-md">
            Année {car.year}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="mb-1">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">{car.make}</span>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
              {car.model}
            </h3>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-3 gap-2 my-4 py-3 border-y border-white/5 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-950/40 p-2 rounded-xl border border-white/5">
              <Fuel className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="capitalize truncate">{car.fuelType}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950/40 p-2 rounded-xl border border-white/5">
              <Gauge className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="capitalize truncate">{car.transmission === 'automatique' ? 'Auto' : 'Manuelle'}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950/40 p-2 rounded-xl border border-white/5">
              <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{car.seats} Places</span>
            </div>
          </div>

          {/* Horsepower & Accel tag */}
          <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <strong className="text-white">{car.horsePower || 400}</strong> ch
            </span>
            <span>•</span>
            <span>0 à 100 : <strong className="text-white">{car.acceleration || '3.5s'}</strong></span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white tracking-tight">{car.pricePerDay}€</span>
              <span className="text-xs text-slate-400 font-medium">/ jour</span>
            </div>
            <p className="text-[10px] text-emerald-400/80 font-medium">Kilométrage illimité</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/cars/${car._id}`}
              className="p-2.5 rounded-xl border border-white/10 hover:border-white/30 text-slate-300 hover:text-white transition-all bg-slate-950/40"
              title="Voir la fiche détaillée"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => onBookNow ? onBookNow(car) : null}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all duration-200"
            >
              Réserver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
