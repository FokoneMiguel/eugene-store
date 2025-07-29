import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import User from '../models/User.js';

dotenv.config({ path: path.join(__dirname, '..', 'env.local') });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

const resetAdminPassword = async () => {
  try {
    await connectDB();

    console.log('🔧 Réinitialisation du mot de passe admin...');
    
    // Trouver l'admin
    const admin = await User.findOne({ email: 'admin@eugenestore.cm' });
    
    if (!admin) {
      console.log('❌ Utilisateur admin non trouvé !');
      console.log('🔄 Création de l\'utilisateur admin...');
      
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
      console.log('✅ Utilisateur admin créé avec succès !');
    } else {
      console.log('✅ Utilisateur admin trouvé !');
      console.log('🔄 Réinitialisation du mot de passe...');
      
      // Réinitialiser le mot de passe
      const newHashedPassword = await bcrypt.hash('password', 10);
      admin.password = newHashedPassword;
      await admin.save();
      
      console.log('✅ Mot de passe réinitialisé avec succès !');
    }

    console.log('\n📋 Informations de connexion mises à jour :');
    console.log('👤 Email: admin@eugenestore.cm');
    console.log('🔑 Mot de passe: password');
    console.log('🔐 Rôle: Administrateur');
    console.log('\n🎉 Vous pouvez maintenant vous connecter !');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

resetAdminPassword(); 