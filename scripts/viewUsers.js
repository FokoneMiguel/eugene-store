import mongoose from 'mongoose';
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

const viewUsers = async () => {
  try {
    await connectDB();

    console.log('👥 Récupération des utilisateurs...\n');
    
    // Récupérer tous les utilisateurs (sans le mot de passe)
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé dans la base de données.');
      console.log('💡 Exécutez "npm run init-db" pour ajouter l\'utilisateur admin.');
    } else {
      console.log(`✅ ${users.length} utilisateur(s) trouvé(s) :\n`);
      
      users.forEach((user, index) => {
        console.log(`👤 Utilisateur ${index + 1}:`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   👨‍💼 Nom: ${user.firstName} ${user.lastName}`);
        console.log(`   📱 Téléphone: ${user.phone || 'Non renseigné'}`);
        console.log(`   🔐 Rôle: ${user.role}`);
        console.log(`   ✅ Vérifié: ${user.isVerified ? 'Oui' : 'Non'}`);
        console.log(`   📅 Créé le: ${user.createdAt.toLocaleDateString('fr-FR')}`);
        console.log(`   🔄 Modifié le: ${user.updatedAt.toLocaleDateString('fr-FR')}`);
        console.log('   ' + '─'.repeat(50));
      });
      
      // Statistiques
      const adminCount = users.filter(u => u.role === 'admin').length;
      const userCount = users.filter(u => u.role === 'user').length;
      const verifiedCount = users.filter(u => u.isVerified).length;
      
      console.log('\n📊 Statistiques :');
      console.log(`   👨‍💼 Administrateurs: ${adminCount}`);
      console.log(`   👤 Utilisateurs: ${userCount}`);
      console.log(`   ✅ Comptes vérifiés: ${verifiedCount}`);
      console.log(`   📧 Comptes non vérifiés: ${users.length - verifiedCount}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

viewUsers(); 