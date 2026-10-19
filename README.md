# 🏎️ LuxeDrive - Application Web MERN de Location de Voitures de Prestige

Application web moderne, performante et intuitive de location de véhicules haut de gamme conçue avec la stack **MERN (MongoDB, Express.js, React, Node.js)**, stylisée avec **Tailwind CSS** selon une esthétique **Clean Minimalist & Glassmorphism**, et enrichie d'icônes **Lucide React**.

---

## 🌟 Points Clés & Fonctionnalités Réalisées

### 1. Backend & Architecture MVC
- **Serveur Express & Node.js** modulaire avec gestion rigoureuse des erreurs et codes HTTP.
- **Base de données MongoDB** connectée via **Mongoose** avec schémas typés et indexation haute performance (`$text`, filtres composés).
- **Authentification JWT & Sécurité** :
  - Tokens JWT injectés automatiquement via intercepteurs Axios.
  - Hachage sécurisé des mots de passe avec **bcryptjs** (salt 10).
  - Contrôle d'accès par rôle (**Client** vs **Administrateur**).
- **Moteur de Réservation & Disponibilité** :
  - Détection automatique et blocage des conflits de dates sur un même véhicule.
  - Calcul dynamique du prix total (taux journalier + options souscrites).

### 2. Frontend React (Vite & Tailwind CSS)
- **Design Glassmorphism & Clean Minimaliste** inspiré de plateformes de luxe (Tesla, Airbnb) :
  - Arrière-plans sombres ardoise (`#070b12`) avec halos lumineux d'ambiance.
  - Cartes et panneaux à transparence avec flou d'arrière-plan (`backdrop-blur-xl`).
  - Palette avec accents **Émeraude Électrique** (`#10B981`) pour les boutons d'action (CTA) et **Cyan**.
- **Composants Clés & Expérience Utilisateur** :
  - **Squelettes de chargement (Skeletons)** animés pendant les requêtes réseau.
  - **Système de notifications Toast** intégré pour un retour immédiat (succès, avertissement, erreur).
  - **Barre de recherche en temps réel** et **tiroir de filtres avancés** (marque, budget max, motorisation, boîte de vitesses, places assises).
  - **Fiche détaillée du véhicule** avec galerie photos, spécifications techniques complètes (0-100 km/h, puissance, vitesse de pointe) et widget de réservation sticky.
  - **Tunnel de réservation instantané** avec sélection d'options (Assurance zéro franchise, 2nd conducteur, siège bébé).
  - **Factures simulées imprimables / exportables** aux normes professionnelles.
  - **Tableau de bord Client** : suivi des réservations par statut (Confirmée, En attente, Terminée, Annulée) et gestion du profil.
  - **Tableau de bord Administrateur** :
    - KPIs financiers (CA total, nombre de réservations, taux d'occupation, flotte disponible).
    - CRUD complet des véhicules (ajout, édition, suppression, statut de disponibilité, mise en vedette VIP).
    - Gestion et validation/refus des réservations en un clic.

---

## 🚀 Démarrage Rapide

### 1. Prérequis
- Node.js (v18+) & npm
- MongoDB actif en local (`mongodb://127.0.0.1:27017`) ou MongoDB Atlas.

### 2. Installation
Depuis la racine du projet :
```bash
# Installer toutes les dépendances (racine, backend et frontend)
npm run install:all
```

### 3. Initialisation des Données (Seeder)
Injectez les supercars de démonstration, les réservations et les comptes tests :
```bash
npm run seed
```

### 4. Lancement de l'Application
```bash
# Démarrer le Backend (:5000) et le Frontend (:5173) en simultané :
npm run dev
```

- **Frontend Client & Admin** : [http://localhost:5173](http://localhost:5173)
- **API REST Backend** : [http://localhost:5000/api](http://localhost:5000/api)
- **Santé de l'API** : [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Comptes de Démonstration (Connexion en 1 Clic)

Sur la page de connexion ([http://localhost:5173/login](http://localhost:5173/login)), des boutons d'autocomplétion rapide sont disponibles :

| Rôle | Email | Mot de passe | Accès |
| :--- | :--- | :--- | :--- |
| 👑 **Administrateur** | `admin@luxedrive.com` | `admin123` | Dashboard Admin, Gestion de la Flotte, Validation Réservations |
| 🚗 **Client** | `client@luxedrive.com` | `client123` | Catalogue, Réservations, Factures, Espace Profil |

---

## 📁 Arborescence Complète du Projet

```text
voiture_location_antigravity/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Connexion Mongoose MongoDB
│   │   ├── controllers/
│   │   │   ├── authController.js     # Inscription, connexion, profil
│   │   │   ├── carController.js      # CRUD catalogue, filtres, recherche
│   │   │   ├── bookingController.js  # Réservations, calculs, disponibilité
│   │   │   └── adminController.js    # KPIs, validation statut, analytics
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js     # Vérification JWT et rôle admin
│   │   │   └── errorMiddleware.js    # Gestionnaire centralisé d'erreurs
│   │   ├── models/
│   │   │   ├── User.js               # Modèle Utilisateur & hash bcrypt
│   │   │   ├── Car.js                # Modèle Véhicule avec indexation
│   │   │   └── Booking.js            # Modèle Réservation & options
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── carRoutes.js
│   │   │   ├── bookingRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── utils/
│   │   │   └── seed.js               # Données de test & comptes initiaux
│   │   └── server.js                 # Entrée Express API
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx        # Navigation responsive & menu utilisateur
│   │   │   │   ├── Footer.jsx        # Pied de page & garanties VIP
│   │   │   │   ├── SkeletonCard.jsx  # Placeholders de chargement animé
│   │   │   │   └── ToastContainer.jsx# Notifications toast flottantes
│   │   │   ├── cars/
│   │   │   │   ├── CarCard.jsx       # Carte véhicule avec micro-interactions
│   │   │   │   └── CarFilters.jsx    # Filtres temps réel et curseur de budget
│   │   │   └── booking/
│   │   │       ├── BookingModal.jsx  # Tunnel de réservation interactif
│   │   │       └── InvoiceModal.jsx  # Facture imprimable aux normes
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Gestion d'état d'authentification
│   │   │   └── ToastContext.jsx      # Contexte d'alertes & feedback
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Landing page de prestige
│   │   │   ├── CatalogPage.jsx       # Catalogue avec filtres et pagination
│   │   │   ├── CarDetailPage.jsx     # Fiche détaillée & réservation sticky
│   │   │   ├── LoginPage.jsx         # Connexion avec boutons 1-clic
│   │   │   ├── RegisterPage.jsx      # Inscription avec numéro de permis
│   │   │   ├── MyBookingsPage.jsx    # Espace client & historique factures
│   │   │   ├── ProfilePage.jsx       # Paramètres du profil
│   │   │   └── admin/
│   │   │       ├── AdminDashboardPage.jsx # Tableau de bord KPIs
│   │   │       ├── AdminCarsPage.jsx      # Gestion flotte (CRUD)
│   │   │       └── AdminBookingsPage.jsx  # Gestion des réservations
│   │   ├── services/
│   │   │   └── api.js                # Instance Axios + JWT Interceptor
│   │   ├── App.jsx                   # Configuration React Router v6 & Guards
│   │   ├── index.css                 # Directives Tailwind & styles Glassmorphism
│   │   └── main.jsx                  # Montage React
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── package.json                      # Orchestration globale
└── README.md
```

---

## 🛡️ Endpoints de l'API REST

| Méthode | Route | Description | Accès |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Vérification de l'état de l'API | Public |
| `POST` | `/api/auth/register` | Inscription d'un nouveau client | Public |
| `POST` | `/api/auth/login` | Connexion et émission du Token JWT | Public |
| `GET` | `/api/auth/me` | Récupération du profil connecté | Connecté |
| `PUT` | `/api/auth/profile` | Mise à jour des informations personnelles | Connecté |
| `GET` | `/api/cars` | Recherche, filtrage et pagination des véhicules | Public |
| `GET` | `/api/cars/brands` | Liste des marques disponibles | Public |
| `GET` | `/api/cars/:id` | Fiche détaillée d'un véhicule | Public |
| `POST` | `/api/cars` | Ajout d'un véhicule | **Admin** |
| `PUT` | `/api/cars/:id` | Modification d'un véhicule | **Admin** |
| `DELETE` | `/api/cars/:id` | Retrait d'un véhicule | **Admin** |
| `POST` | `/api/bookings` | Création d'une réservation avec options | Connecté |
| `GET` | `/api/bookings/my` | Liste des réservations du client | Connecté |
| `PATCH` | `/api/bookings/:id/cancel` | Annulation par le client | Connecté |
| `GET` | `/api/admin/stats` | Métriques & KPIs d'activité | **Admin** |
| `GET` | `/api/admin/bookings` | Historique de toutes les réservations | **Admin** |
| `PATCH` | `/api/admin/bookings/:id/status` | Validation ou refus d'une réservation | **Admin** |
