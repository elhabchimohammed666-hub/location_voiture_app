import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Sparkles, ShieldCheck, Clock, Headphones, Award, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-2xl mt-24">
      {/* Guarantees bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl glass-card">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Assurance Tous Risques</h4>
              <p className="text-xs text-slate-400">Couverture complète zéro franchise</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl glass-card">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Livraison 24h/7j</h4>
              <p className="text-xs text-slate-400">En gare, aéroport ou à domicile</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl glass-card">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Flotte Récente</h4>
              <p className="text-xs text-slate-400">Véhicules révisés de moins de 18 mois</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl glass-card">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Conciergerie Dédiée</h4>
              <p className="text-xs text-slate-400">Assistance prioritaire 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Car className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                Luxe<span className="text-emerald-400">Drive</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              La plateforme leader de location de supercars, berlines de luxe et véhicules d'exception. Vivez une expérience de conduite inoubliable sans contraintes.
            </p>
            <div className="text-xs text-slate-500 space-y-1">
              <p>📍 Siège social : 12 Place Vendôme, 75001 Paris</p>
              <p>📞 Conciergerie : +33 (0)1 42 68 00 00</p>
              <p>✉️ Contact : contact@luxedrive.fr</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/catalog" className="hover:text-emerald-400 transition-colors">Tous les véhicules</Link></li>
              <li><Link to="/catalog?category=sport" className="hover:text-emerald-400 transition-colors">Supercars & Sportives</Link></li>
              <li><Link to="/catalog?category=electrique" className="hover:text-emerald-400 transition-colors">Électriques Haute Performance</Link></li>
              <li><Link to="/catalog?category=suv" className="hover:text-emerald-400 transition-colors">SUV & 4x4 Prestige</Link></li>
              <li><Link to="/catalog?category=luxe" className="hover:text-emerald-400 transition-colors">Limousines & Berlines</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Informations</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#about" className="hover:text-emerald-400 transition-colors">Qui sommes-nous</a></li>
              <li><a href="#terms" className="hover:text-emerald-400 transition-colors">Conditions Générales</a></li>
              <li><a href="#privacy" className="hover:text-emerald-400 transition-colors">Politique de Confidentialité</a></li>
              <li><a href="#faq" className="hover:text-emerald-400 transition-colors">Foire aux questions (FAQ)</a></li>
              <li><a href="#press" className="hover:text-emerald-400 transition-colors">Espace Presse</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Newsletter VIP</h4>
            <p className="text-xs text-slate-400 mb-3">Recevez nos offres exclusives et invitations aux essais privés.</p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Votre email professionnel"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
              />
              <button className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors">
                Rejoindre le Club
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LuxeDrive Technologies Inc. Tous droits réservés.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Conçu avec passion et précision <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" /> pour les passionnés d'automobile.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
