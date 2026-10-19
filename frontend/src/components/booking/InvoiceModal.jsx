import React from 'react';
import { X, Printer, Download, Car, CheckCircle } from 'lucide-react';

export const InvoiceModal = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  const invoiceNumber = `FAC-${booking._id.substring(booking._id.length - 8).toUpperCase()}`;
  const invoiceDate = new Date(booking.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const startDateFormatted = new Date(booking.startDate).toLocaleDateString('fr-FR');
  const endDateFormatted = new Date(booking.endDate).toLocaleDateString('fr-FR');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-white/10 p-8 shadow-2xl my-8 text-slate-100 print:bg-white print:text-black print:border-none print:shadow-none print:m-0 print:p-0">
        {/* Actions bar (hidden in print) */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" /> Facture Validée & Payée
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="glass-button-secondary text-xs px-3.5 py-2 flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 border border-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Content */}
        <div className="pt-6 space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                  <Car className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white print:text-black">
                  Luxe<span className="text-emerald-400 print:text-emerald-600">Drive</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 print:text-gray-600">LuxeDrive Technologies SAS</p>
              <p className="text-xs text-slate-400 print:text-gray-600">12 Place Vendôme, 75001 Paris, France</p>
              <p className="text-xs text-slate-400 print:text-gray-600">SIRET : 894 123 456 00018 • TVA : FR 32 894123456</p>
            </div>

            <div className="text-right">
              <h2 className="text-2xl font-black text-white print:text-black tracking-tight">FACTURE</h2>
              <p className="text-sm font-semibold text-emerald-400 print:text-emerald-600">{invoiceNumber}</p>
              <p className="text-xs text-slate-400 print:text-gray-600 mt-1">Date : {invoiceDate}</p>
            </div>
          </div>

          {/* Client & Booking details */}
          <div className="grid grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-950/60 border border-white/5 print:bg-gray-50 print:border-gray-200 text-xs">
            <div>
              <p className="uppercase tracking-wider font-semibold text-slate-400 print:text-gray-500 mb-1">Facturé à :</p>
              <p className="text-sm font-bold text-white print:text-black">{booking.user?.name || 'Client LuxeDrive'}</p>
              <p className="text-slate-300 print:text-gray-700">{booking.user?.email}</p>
              {booking.user?.phone && <p className="text-slate-400 print:text-gray-600">{booking.user.phone}</p>}
            </div>

            <div className="text-right">
              <p className="uppercase tracking-wider font-semibold text-slate-400 print:text-gray-500 mb-1">Détails de la réservation :</p>
              <p className="text-sm font-bold text-white print:text-black">{booking.car?.make} {booking.car?.model}</p>
              <p className="text-slate-300 print:text-gray-700">Du {startDateFormatted} au {endDateFormatted}</p>
              <p className="text-slate-400 print:text-gray-600">Durée : {booking.totalDays} jour(s)</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 print:border-gray-300 text-slate-400 print:text-gray-600 uppercase">
                <tr>
                  <th className="py-3 px-2">Description</th>
                  <th className="py-3 px-2 text-center">Quantité</th>
                  <th className="py-3 px-2 text-right">Tarif Unitaire</th>
                  <th className="py-3 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-gray-200 text-slate-200 print:text-black">
                <tr>
                  <td className="py-3 px-2 font-medium">
                    Location {booking.car?.make} {booking.car?.model} ({booking.car?.year})
                    <span className="block text-[11px] text-slate-400 print:text-gray-500">Kilométrage illimité, Assistance 24/7 incluse</span>
                  </td>
                  <td className="py-3 px-2 text-center">{booking.totalDays} j</td>
                  <td className="py-3 px-2 text-right">{booking.dailyRate} €</td>
                  <td className="py-3 px-2 text-right font-semibold">{(booking.dailyRate * booking.totalDays)} €</td>
                </tr>

                {booking.options?.insurance && (
                  <tr>
                    <td className="py-3 px-2">Pack Assurance Sérénité Tous Risques (0€ franchise)</td>
                    <td className="py-3 px-2 text-center">{booking.totalDays} j</td>
                    <td className="py-3 px-2 text-right">30 €</td>
                    <td className="py-3 px-2 text-right font-semibold">{(30 * booking.totalDays)} €</td>
                  </tr>
                )}

                {booking.options?.extraDriver && (
                  <tr>
                    <td className="py-3 px-2">Option Conducteur Additionnel certifié</td>
                    <td className="py-3 px-2 text-center">{booking.totalDays} j</td>
                    <td className="py-3 px-2 text-right">15 €</td>
                    <td className="py-3 px-2 text-right font-semibold">{(15 * booking.totalDays)} €</td>
                  </tr>
                )}

                {booking.options?.babySeat && (
                  <tr>
                    <td className="py-3 px-2">Siège auto enfant homologué Isofix</td>
                    <td className="py-3 px-2 text-center">{booking.totalDays} j</td>
                    <td className="py-3 px-2 text-right">10 €</td>
                    <td className="py-3 px-2 text-right font-semibold">{(10 * booking.totalDays)} €</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end pt-4 border-t border-white/10 print:border-gray-300">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400 print:text-gray-600">
                <span>Sous-total HT</span>
                <span>{(booking.totalPrice * 0.8).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-slate-400 print:text-gray-600">
                <span>TVA (20%)</span>
                <span>{(booking.totalPrice * 0.2).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-white/10 print:border-gray-300">
                <span className="text-sm font-bold text-white print:text-black">Total TTC Payé</span>
                <span className="text-xl font-black text-emerald-400 print:text-emerald-700">{booking.totalPrice} €</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-6 border-t border-white/5 print:border-gray-200 text-center text-[10px] text-slate-500 print:text-gray-500">
            <p>Merci pour votre confiance. En cas de question concernant cette facture, contactez billing@luxedrive.fr</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
