import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Middleware pour protéger les routes authentifiées
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'luxedrive_super_secure_jwt_token_secret_key_2026_xyz!');

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Utilisateur introuvable avec ce token' });
      }

      next();
    } catch (error) {
      console.error('Erreur vérification JWT :', error.message);
      return res.status(401).json({ success: false, message: 'Session invalide ou expirée, veuillez vous reconnecter' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Accès refusé, aucun token fourni' });
  }
};

// Middleware pour restreindre l'accès aux administrateurs
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Accès réservé aux administrateurs' });
  }
};
