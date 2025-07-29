import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config({ path: path.join(__dirname, '..', 'env.local') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté pour initialisation');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

const initDatabase = async () => {
  try {
    // Vider les collections existantes
    await Product.deleteMany({});
    await User.deleteMany({});
    
    console.log('🗑️ Collections vidées');

    // Créer l'utilisateur admin
    const adminPassword = await bcrypt.hash('password', 10);
    const adminUser = new User({
      email: 'admin@eugenestore.cm',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Eugene Store',
      role: 'admin'
    });
    await adminUser.save();
    console.log('👤 Utilisateur admin créé');

    // Créer des produits de test
    const sampleProducts = [
      {
        name: 'iPhone 15 Pro Max',
        description: 'Le dernier iPhone avec puce A17 Pro, caméra 48MP et écran Super Retina XDR de 6.7 pouces.',
        price: 850000,
        originalPrice: 950000,
        image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
        category: 'phones',
        brand: 'Apple',
        rating: 4.8,
        reviewCount: 245,
        stockQuantity: 15,
        specifications: {
          'Écran': '6.7" Super Retina XDR',
          'Processeur': 'A17 Pro',
          'Stockage': '256GB',
          'Caméra': '48MP + 12MP + 12MP',
          'Batterie': '4422 mAh',
          'OS': 'iOS 17'
        },
        tags: ['smartphone', 'apple', 'premium']
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Smartphone premium avec S Pen intégré, écran Dynamic AMOLED 6.8" et caméra 200MP.',
        price: 780000,
        image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
        category: 'phones',
        brand: 'Samsung',
        rating: 4.7,
        reviewCount: 189,
        stockQuantity: 8,
        specifications: {
          'Écran': '6.8" Dynamic AMOLED',
          'Processeur': 'Snapdragon 8 Gen 3',
          'Stockage': '512GB',
          'Caméra': '200MP + 50MP + 12MP + 10MP',
          'Batterie': '5000 mAh',
          'OS': 'Android 14'
        },
        tags: ['smartphone', 'samsung', 'premium', 's-pen']
      },
      {
        name: 'MacBook Pro 14" M3',
        description: 'Ordinateur portable professionnel avec puce M3, écran Liquid Retina XDR et performances exceptionnelles.',
        price: 1200000,
        originalPrice: 1350000,
        image: 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg',
        category: 'electronics',
        brand: 'Apple',
        rating: 4.9,
        reviewCount: 156,
        stockQuantity: 5,
        specifications: {
          'Écran': '14" Liquid Retina XDR',
          'Processeur': 'M3 Pro',
          'RAM': '16GB',
          'Stockage': '512GB SSD',
          'OS': 'macOS Sonoma'
        },
        tags: ['laptop', 'apple', 'macbook', 'professional']
      }
    ];

    for (const productData of sampleProducts) {
      const product = new Product(productData);
      await product.save();
    }
    
    console.log('📦 Produits de test créés');
    console.log('✅ Base de données initialisée avec succès !');
    
    // Afficher les informations de connexion
    console.log('\n🔑 Informations de connexion :');
    console.log('Email: admin@eugenestore.cm');
    console.log('Mot de passe: password');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
    process.exit(0);
  }
};

// Exécuter l'initialisation
connectDB().then(initDatabase); 