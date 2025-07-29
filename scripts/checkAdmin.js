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

const checkAdmin = async () => {
  try {
    await connectDB();

    console.log('🔍 Vérification de l\'utilisateur admin...');
    
    // Vérifier si l'admin existe
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
      console.log(`👤 Nom: ${admin.firstName} ${admin.lastName}`);
      console.log(`📧 Email: ${admin.email}`);
      console.log(`🔐 Rôle: ${admin.role}`);
    }

    // Tester la connexion
    console.log('\n🔐 Test de connexion...');
    const testPassword = 'password';
    const isPasswordValid = await bcrypt.compare(testPassword, admin.password);
    
    if (isPasswordValid) {
      console.log('✅ Mot de passe correct !');
    } else {
      console.log('❌ Mot de passe incorrect !');
    }

    console.log('\n📋 Informations de connexion :');
    console.log('👤 Email: admin@eugenestore.cm');
    console.log('🔑 Mot de passe: password');
    console.log('🔐 Rôle: Administrateur');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

checkAdmin(); 