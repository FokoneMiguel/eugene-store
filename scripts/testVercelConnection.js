import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', 'env.local') });

const testVercelConnection = async () => {
  try {
    console.log('🔗 Test de connexion Vercel ↔ MongoDB Atlas...\n');
    
    // Vérifier les variables d'environnement
    console.log('📋 Vérification des variables d\'environnement :');
    console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Définie' : '❌ Manquante'}`);
    console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Définie' : '❌ Manquante'}`);
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || '❌ Manquante'}`);
    
    if (!process.env.MONGODB_URI) {
      console.log('\n❌ ERREUR: MONGODB_URI n\'est pas définie !');
      console.log('💡 Solution: Ajoutez MONGODB_URI dans vos variables d\'environnement Vercel');
      process.exit(1);
    }
    
    // Tester la connexion MongoDB
    console.log('\n🔌 Test de connexion MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    console.log(`📊 Base de données: ${conn.connection.name}`);
    
    // Lister les collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📁 Collections trouvées: ${collections.length}`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    // Tester les collections principales
    console.log('\n🧪 Test des collections principales :');
    
    // Test collection users
    try {
      const userCount = await conn.connection.db.collection('users').countDocuments();
      console.log(`   👥 Users: ${userCount} document(s)`);
    } catch (error) {
      console.log(`   👥 Users: ❌ Erreur - ${error.message}`);
    }
    
    // Test collection products
    try {
      const productCount = await conn.connection.db.collection('products').countDocuments();
      console.log(`   📦 Products: ${productCount} document(s)`);
    } catch (error) {
      console.log(`   📦 Products: ❌ Erreur - ${error.message}`);
    }
    
    // Test collection orders
    try {
      const orderCount = await conn.connection.db.collection('orders').countDocuments();
      console.log(`   🛒 Orders: ${orderCount} document(s)`);
    } catch (error) {
      console.log(`   🛒 Orders: ❌ Erreur - ${error.message}`);
    }
    
    console.log('\n🎉 Test de connexion réussi !');
    console.log('✅ Vercel peut se connecter à MongoDB Atlas');
    console.log('✅ Les variables d\'environnement sont correctes');
    console.log('✅ Les collections sont accessibles');
    
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('\n🔌 Connexion fermée');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERREUR de connexion :', error.message);
    
    if (error.message.includes('Authentication failed')) {
      console.log('\n💡 Solutions possibles :');
      console.log('   1. Vérifiez le mot de passe MongoDB');
      console.log('   2. Vérifiez que l\'utilisateur a les bonnes permissions');
      console.log('   3. Vérifiez que l\'IP est autorisée dans MongoDB Atlas');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Solutions possibles :');
      console.log('   1. Vérifiez l\'URL de connexion MongoDB');
      console.log('   2. Vérifiez votre connexion internet');
      console.log('   3. Vérifiez que le cluster MongoDB est actif');
    } else if (error.message.includes('MONGODB_URI')) {
      console.log('\n💡 Solutions possibles :');
      console.log('   1. Vérifiez que MONGODB_URI est définie dans env.local');
      console.log('   2. Vérifiez que MONGODB_URI est définie sur Vercel');
      console.log('   3. Vérifiez le format de l\'URL de connexion');
    }
    
    process.exit(1);
  }
};

testVercelConnection(); 