import connectDB from '../config/database.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    console.log('🔍 Test de la base de données...');
    
    // Connexion à MongoDB
    await connectDB();
    console.log('✅ MongoDB connecté');

    // Vérifier si l'admin existe
    const admin = await User.findOne({ email: 'admin@eugenestore.cm' });
    
    if (!admin) {
      console.log('❌ Admin non trouvé, création...');
      
      // Créer l'utilisateur admin
      const hashedPassword = await bcrypt.hash('password', 10);
      const newAdmin = new User({
        email: 'admin@eugenestore.cm',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'Eugene',
        phone: '+237 123456789',
        role: 'admin'
      });
      await newAdmin.save();
      
      console.log('✅ Admin créé avec succès');
      
      res.status(200).json({
        success: true,
        message: 'Admin créé avec succès',
        admin: {
          email: 'admin@eugenestore.cm',
          password: 'password'
        }
      });
    } else {
      console.log('✅ Admin existe déjà');
      
      res.status(200).json({
        success: true,
        message: 'Admin existe déjà',
        admin: {
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role
        }
      });
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Erreur lors du test de la base de données'
    });
  }
} 