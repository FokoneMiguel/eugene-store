import connectDB from '../../config/database.js';
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';

// Middleware pour vérifier le token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    req.user = decoded;
    next();
  });
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Vérifier le token
    authenticateToken(req, res, async () => {
      try {
        // Récupérer les informations utilisateur
        const user = await User.findById(req.user.userId).select('-password');
        
        if (!user) {
          return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const userData = {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone
        };

        res.status(200).json({
          success: true,
          user: userData,
          message: 'Token valide'
        });
      } catch (error) {
        console.error('Erreur lors de la récupération utilisateur:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
      }
    });
  } catch (error) {
    console.error('Erreur de vérification:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
} 