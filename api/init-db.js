import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return conn;
  } catch (error) {
    throw new Error(`Erreur de connexion MongoDB: ${error.message}`);
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    console.log('🔄 Initialisation de la base de données...');
    
    // Connexion à MongoDB
    const conn = await connectDB();
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);

    // Créer l'utilisateur admin
    const hashedPassword = await bcrypt.hash('password', 10);
    
    // Supprimer l'admin existant s'il existe
    await conn.connection.db.collection('users').deleteOne({ email: 'admin@eugenestore.cm' });
    
    // Créer le nouvel admin
    await conn.connection.db.collection('users').insertOne({
      email: 'admin@eugenestore.cm',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Eugene',
      phone: '+237 123456789',
      role: 'admin',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ Utilisateur admin créé');

    // Fermer la connexion
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');

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