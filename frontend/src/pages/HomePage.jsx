import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import CarCard from '../components/cars/CarCard';
import SkeletonCard from '../components/common/SkeletonCard';
import BookingModal from '../components/booking/BookingModal';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  KeyRound,
  Search,
  CheckCircle2,
  ChevronRight,
  Car
} from 'lucide-react';

export const HomePage = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCarForBooking, setSelectedCarForBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/cars?featured=true&limit=6');
        if (res.data?.success) {
          setFeaturedCars(res.data.cars);
        }
      } catch (error) {
        console.error('Erreur chargement featured cars', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/catalog');
    }
  };

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Glow backdrop effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide shadow-glow">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>La Référence de la Location de Prestige en France</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              L'Excellence Automobile <br />
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-200 bg-clip-text text-transparent">
                À Portée de Main.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Prenez le volant des supercars et berlines les plus convoitées au monde.
              Réservation instantanée, livraison sur-mesure et service conciergerie 24/7.
            </p>

            {/* Quick Search Floating Bar */}
            <form
              onSubmit={handleHeroSearch}
              className="mt-8 p-2 rounded-2xl glass-panel max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2 shadow-2xl border-white/10"
            >
              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher une Porsche, Ferrari, Tesla..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <span>Explorer la Flotte</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Micro Guarantees */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Annulation Gratuite
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Assurance 0€ Franchise
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Aucun Frais Caché
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Fleet Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Collection Exclusive</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">
              Véhicules à la Une
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Une sélection des modèles les plus plébiscités par nos membres et conducteurs exigeants.
            </p>
          </div>

          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors group"
          >
            <span>Voir l'ensemble du catalogue</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          ) : featuredCars.length > 0 ? (
            featuredCars.map((car) => (
              <CarCard
                key={car._id}
                car={car}
                onBookNow={(selected) => setSelectedCarForBooking(selected)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-400">
              Aucun véhicule en vedette pour le moment.
            </div>
          )}
        </div>
      </section>

      {/* Category Pills Quick Access */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/catalog?category=sport"
            className="p-6 rounded-3xl glass-card text-center group hover:border-emerald-500/40"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300">Supercars & Sport</h3>
            <p className="text-xs text-slate-400 mt-1">Porsche, Ferrari, BMW M</p>
          </Link>

          <Link
            to="/catalog?category=electrique"
            className="p-6 rounded-3xl glass-card text-center group hover:border-cyan-500/40"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-300">100% Électriques</h3>
            <p className="text-xs text-slate-400 mt-1">Tesla Plaid, Porsche Taycan</p>
          </Link>

          <Link
            to="/catalog?category=suv"
            className="p-6 rounded-3xl glass-card text-center group hover:border-amber-500/40"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300">SUV Prestige</h3>
            <p className="text-xs text-slate-400 mt-1">Mercedes G63, Defender</p>
          </Link>

          <Link
            to="/catalog?category=luxe"
            className="p-6 rounded-3xl glass-card text-center group hover:border-indigo-500/40"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300">Limousines VIP</h3>
            <p className="text-xs text-slate-400 mt-1">Range Rover SV, Classe S</p>
          </Link>
        </div>
      </section>

      {/* Why LuxeDrive (Experience VIP) */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl glass-panel relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Le Standard LuxeDrive</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Une Expérience de Conduite Conçue Sans le Moindre Compromis.
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Chez LuxeDrive, la location automobile ne se résume pas à remettre des clés. Nous créons un moment d'évasion privilégié où chaque détail technique et esthétique est soigneusement préparé par nos techniciens accrédités.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Livraison VIP sur Lieu Choisi</h4>
                    <p className="text-xs text-slate-400">À la descente de votre vol, devant votre hôtel ou villa privée.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Contrat 100% Numérique & Instantané</h4>
                    <p className="text-xs text-slate-400">Validation en moins de 3 minutes sans paperasse administrative.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Flotte Récente Garantie</h4>
                    <p className="text-xs text-slate-400">Moins de 10 000 km au compteur et configurations toutes options.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80"
                alt="Luxury experience"
                className="rounded-3xl shadow-2xl object-cover h-96 w-full ring-1 ring-white/10"
              />
              <div className="absolute -bottom-4 -left-4 p-5 rounded-2xl glass-panel border border-white/15 shadow-2xl max-w-xs">
                <p className="text-2xl font-black text-emerald-400">4.96 / 5</p>
                <p className="text-xs font-semibold text-white mt-0.5">Score de satisfaction clients</p>
                <p className="text-[10px] text-slate-400">Sur plus de 1 200 locations VIP effectuées cette année.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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

export default HomePage;
