import connectDB from '../config/database.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    console.log('🔄 Initialisation de la base de données...');
    
    // Connexion à MongoDB
    await connectDB();
    console.log('✅ MongoDB connecté');

    // Créer l'utilisateur admin
    const hashedPassword = await bcrypt.hash('password', 10);
    
    // Supprimer l'admin existant s'il existe
    await User.deleteOne({ email: 'admin@eugenestore.cm' });
    
    // Créer le nouvel admin
    const admin = new User({
      email: 'admin@eugenestore.cm',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Eugene',
      phone: '+237 123456789',
      role: 'admin'
    });
    await admin.save();
    
    console.log('✅ Utilisateur admin créé');

    console.log('✅ Admin créé avec succès');

    res.status(200).json({
      success: true,
      message: 'Admin créé avec succès',
      admin: {
        email: 'admin@eugenestore.cm',
        password: 'password'
      }
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Erreur lors de l\'initialisation'
    });
  }
} 