import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Car } from '../models/Car.js';
import { Booking } from '../models/Booking.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Nettoyage des anciennes données...');
    await Booking.deleteMany({});
    await Car.deleteMany({});
    await User.deleteMany({});

    console.log('👤 Création des utilisateurs de test...');
    const adminUser = await User.create({
      name: 'Alexandre Dumas',
      email: 'admin@luxedrive.com',
      password: 'admin123',
      role: 'admin',
      phone: '+33 6 12 34 56 78',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      driverLicenseNumber: 'FRA-987654321'
    });

    const clientUser = await User.create({
      name: 'Sophie Laurent',
      email: 'client@luxedrive.com',
      password: 'client123',
      role: 'client',
      phone: '+33 6 98 76 54 32',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      driverLicenseNumber: 'FRA-123456789'
    });

    console.log('🏎️ Insertion du catalogue de véhicules haut de gamme...');
    const carsData = [
      {
        make: 'Porsche',
        model: '911 Carrera 4S',
        year: 2024,
        category: 'sport',
        pricePerDay: 480,
        fuelType: 'essence',
        transmission: 'automatique',
        seats: 4,
        doors: 2,
        horsePower: 450,
        acceleration: '3.4s',
        topSpeed: '306 km/h',
        rating: 4.96,
        numReviews: 38,
        featured: true,
        isAvailable: true,
        location: { city: 'Paris', address: 'Place Vendôme, 75001 Paris' },
        description: 'La référence intemporelle de la sportive allemande. Puissance biturbo de 450 chevaux, transmission intégrale ultra-précise et sonorité envoûtante.',
        features: ['Pack Sport Chrono', 'Échappement Sport', 'Système audio Burmester', 'Toit ouvrant panoramique', 'Suspension PASM'],
        images: [
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
        ]
      },
      {
        make: 'Tesla',
        model: 'Model S Plaid',
        year: 2024,
        category: 'electrique',
        pricePerDay: 390,
        fuelType: 'electrique',
        transmission: 'automatique',
        seats: 5,
        doors: 4,
        horsePower: 1020,
        acceleration: '2.1s',
        topSpeed: '322 km/h',
        rating: 4.92,
        numReviews: 44,
        featured: true,
        isAvailable: true,
        location: { city: 'Paris', address: 'Aéroport Paris-Charles de Gaulle' },
        description: 'Trois moteurs électriques développant plus de 1000 chevaux. Une accélération fulgurante avec un habitacle futuriste doté de l\'écran cinématique 17 pouces.',
        features: ['Autopilot Amélioré', 'Écran cinématique 17"', 'Climatisation Tri-zone', 'Connectivité Premium illimitée', 'Charge ultra-rapide V3'],
        images: [
          'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80'
        ]
      },
      {
        make: 'Mercedes-Benz',
        model: 'G-Class G63 AMG',
        year: 2024,
        category: 'suv',
        pricePerDay: 620,
        fuelType: 'essence',
        transmission: 'automatique',
        seats: 5,
        doors: 5,
        horsePower: 585,
        acceleration: '4.5s',
        topSpeed: '240 km/h',
        rating: 4.98,
        numReviews: 52,
        featured: true,
        isAvailable: true,
        location: { city: 'Cannes', address: 'Boulevard de la Croisette, 06400 Cannes' },
        description: 'L\'icône absolue du tout-terrain de prestige. Moteur V8 BiTurbo AMG au rugissement inimitable, intérieur cuir Nappa matelassé et prestance incomparable.',
        features: ['Intérieur Cuir Nappa', 'Système Son Burmester 3D', 'Pack Nuit AMG', 'Éclairage d\'ambiance 64 couleurs', 'Étriers de freins rouges'],
        images: [
          'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
        ]
      },
      {
        make: 'BMW',
        model: 'M4 Competition xDrive',
        year: 2024,
        category: 'sport',
        pricePerDay: 420,
        fuelType: 'essence',
        transmission: 'automatique',
        seats: 4,
        doors: 2,
        horsePower: 510,
        acceleration: '3.5s',
        topSpeed: '290 km/h',
        rating: 4.88,
        numReviews: 29,
        featured: false,
        isAvailable: true,
        location: { city: 'Nice', address: 'Promenade des Anglais, 06000 Nice' },
        description: 'Coupé haute performance à la calandre agressive et au châssis affûté pour des sensations pures sur route comme sur circuit.',
        features: ['Sièges baquets M Carbon', 'Différentiel M Sport Actif', 'Affichage tête haute HUD', 'Harman Kardon Surround'],
        images: [
          'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&w=1200&q=80'
        ]
      },
      {
        make: 'Audi',
        model: 'RS6 Avant Performance',
        year: 2024,
        category: 'berline',
        pricePerDay: 510,
        fuelType: 'hybride',
        transmission: 'automatique',
        seats: 5,
        doors: 5,
        horsePower: 630,
        acceleration: '3.4s',
        topSpeed: '305 km/h',
        rating: 4.95,
        numReviews: 31,
        featured: true,
        isAvailable: true,
        location: { city: 'Paris', address: 'Avenue Montaigne, 75008 Paris' },
        description: 'Le break de chasse par excellence combinant un espace généreux avec la rage d\'un V8 bi-turbo de 630 chevaux.',
        features: ['Transmission Quattro intégrale', 'Feux Matrix LED Laser', 'Suspension pneumatique adaptative', 'Bang & Olufsen 3D'],
        images: [
          'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
        ]
      },
      {
        make: 'Range Rover',
        model: 'SV Autobiography LWB',
        year: 2024,
        category: 'luxe',
        pricePerDay: 690,
        fuelType: 'hybride',
        transmission: 'automatique',
        seats: 5,
        doors: 5,
        horsePower: 530,
        acceleration: '4.6s',
        topSpeed: '261 km/h',
        rating: 4.99,
        numReviews: 19,
        featured: false,
        isAvailable: true,
        location: { city: 'Monaco', address: 'Port Hercule, Monte-Carlo' },
        description: 'Le summum du luxe britannique. Sièges première classe inclinables avec massage aux pierres chaudes et silence cathédrale.',
        features: ['Sièges Executive Class Confort', 'Réfrigérateur de bord', 'Écrans individuels 11.4"', 'Fermeture assistée des portes Soft-Close'],
        images: [
          'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1200&q=80'
        ]
      },
      {
        make: 'Ferrari',
        model: '296 GTB Hybrid',
        year: 2024,
        category: 'sport',
        pricePerDay: 1100,
        fuelType: 'hybride',
        transmission: 'automatique',
        seats: 2,
        doors: 2,
        horsePower: 830,
        acceleration: '2.9s',
        topSpeed: '330 km/h',
        rating: 5.0,
        numReviews: 15,
        featured: true,
        isAvailable: true,
        location: { city: 'Cannes', address: 'Hôtel Martinez, Cannes' },
        description: 'La nouvelle ère du cheval cabré. Moteur V6 biturbo hybride rechargeable développant 830 chevaux dans un design sensuel et aérodynamique.',
        features: ['Pack Assetto Fiorano', 'Cockpit entièrement digital', 'Échappement Inconel', 'Freins Carbone Céramique'],
        images: [
          'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80'
        ]
      },
      {
        make: 'Peugeot',
        model: '308 GT Hybrid',
        year: 2024,
        category: 'citadine',
        pricePerDay: 110,
        fuelType: 'hybride',
        transmission: 'automatique',
        seats: 5,
        doors: 5,
        horsePower: 225,
        acceleration: '7.5s',
        topSpeed: '225 km/h',
        rating: 4.82,
        numReviews: 67,
        featured: false,
        isAvailable: true,
        location: { city: 'Paris', address: 'Gare de Lyon, Paris' },
        description: 'La compacte moderne et polyvalente par excellence. Idéale pour sillonner les boulevards parisiens avec une faible consommation et un style affirmé.',
        features: ['i-Cockpit 3D', 'Caméra 360°', 'Écran tactile 10"', 'Modes Sport et Éco'],
        images: [
          'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
        ]
      }
    ];

    const insertedCars = await Car.insertMany(carsData);
    console.log(`✨ ${insertedCars.length} véhicules insérés.`);

    console.log('📅 Création des réservations de démonstration...');
    const now = new Date();
    
    // Réservation 1 : active / confirmée pour Sophie Laurent
    const start1 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const end1 = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    const days1 = 3;
    const car1 = insertedCars[0]; // Porsche 911
    const total1 = (car1.pricePerDay * days1) + (30 * days1); // avec assurance

    await Booking.create({
      user: clientUser._id,
      car: car1._id,
      startDate: start1,
      endDate: end1,
      totalDays: days1,
      dailyRate: car1.pricePerDay,
      optionsPrice: 30 * days1,
      totalPrice: total1,
      status: 'confirmed',
      paymentStatus: 'paid',
      options: { insurance: true, gps: true, babySeat: false, extraDriver: false },
      pickupLocation: 'Place Vendôme, Paris',
      dropoffLocation: 'Place Vendôme, Paris'
    });

    // Réservation 2 : terminée pour Sophie Laurent
    const start2 = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    const end2 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const days2 = 3;
    const car2 = insertedCars[1]; // Tesla Model S
    const total2 = (car2.pricePerDay * days2);

    await Booking.create({
      user: clientUser._id,
      car: car2._id,
      startDate: start2,
      endDate: end2,
      totalDays: days2,
      dailyRate: car2.pricePerDay,
      optionsPrice: 0,
      totalPrice: total2,
      status: 'completed',
      paymentStatus: 'paid',
      options: { insurance: false, gps: true, babySeat: false, extraDriver: false },
      pickupLocation: 'Aéroport CDG, Paris',
      dropoffLocation: 'Aéroport CDG, Paris'
    });

    // Réservation 3 : En attente (pending) pour démonstration de validation admin
    const start3 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const end3 = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
    const days3 = 3;
    const car3 = insertedCars[2]; // Mercedes G63
    const total3 = (car3.pricePerDay * days3) + (45 * days3); // assurance + conducteur

    await Booking.create({
      user: clientUser._id,
      car: car3._id,
      startDate: start3,
      endDate: end3,
      totalDays: days3,
      dailyRate: car3.pricePerDay,
      optionsPrice: 45 * days3,
      totalPrice: total3,
      status: 'pending',
      paymentStatus: 'paid',
      options: { insurance: true, gps: true, babySeat: false, extraDriver: true },
      pickupLocation: 'Boulevard de la Croisette, Cannes',
      dropoffLocation: 'Boulevard de la Croisette, Cannes'
    });

    console.log('✅ Base de données initialisée avec succès !');
    console.log('\n--- COMPTES DE TEST CRÉÉS ---');
    console.log('👑 Admin  : admin@luxedrive.com | MDP: admin123');
    console.log('🚗 Client : client@luxedrive.com | MDP: client123');
    console.log('-------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seeding :', error);
    process.exit(1);
  }
};

seedData();
