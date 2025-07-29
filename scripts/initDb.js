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

const initDatabase = async () => {
  try {
    console.log('🗑️  Suppression des données existantes...');
    await Product.deleteMany({});
    await User.deleteMany({});

    console.log('👤 Création de l\'utilisateur administrateur...');
    const hashedPassword = await bcrypt.hash('password', 10);
    const adminUser = new User({
      email: 'admin@eugenestore.cm',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Eugene',
      phone: '+237 123456789',
      role: 'admin'
    });
    await adminUser.save();
    console.log('✅ Utilisateur admin créé');

    console.log('📦 Création des produits de démonstration...');
    const sampleProducts = [
      {
        name: 'iPhone 15 Pro Max',
        description: 'Le dernier iPhone avec des fonctionnalités avancées et une caméra professionnelle.',
        price: 850000,
        originalPrice: 950000,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
        category: 'Téléphones',
        brand: 'Apple',
        stockQuantity: 15,
        stockStatus: 'in_stock',
        rating: 4.8,
        reviewCount: 125,
        isNew: true,
        options: {
          colors: [
            {
              name: 'Titanium Naturel',
              images: [
                'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
                'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'
              ],
              stockQuantity: 8
            },
            {
              name: 'Titanium Bleu',
              images: [
                'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
                'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'
              ],
              stockQuantity: 7
            }
          ],
          sizes: ['128GB', '256GB', '512GB', '1TB'],
          materials: ['Titanium']
        },
        specifications: {
          'Écran': '6.7 pouces Super Retina XDR',
          'Processeur': 'A17 Pro',
          'Caméra': 'Triple caméra 48MP',
          'Batterie': 'Jusqu\'à 29h d\'autonomie'
        },
        tags: ['iPhone', 'Apple', 'Premium', '5G'],
        featured: true,
        salesCount: 45,
        viewCount: 1200
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Le flagship Samsung avec S Pen intégré et IA avancée.',
        price: 750000,
        originalPrice: 0,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
        category: 'Téléphones',
        brand: 'Samsung',
        stockQuantity: 8,
        stockStatus: 'low_stock',
        rating: 4.7,
        reviewCount: 89,
        isNew: true,
        options: {
          colors: [
            {
              name: 'Noir Titanium',
              images: [
                'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500'
              ],
              stockQuantity: 5
            },
            {
              name: 'Violet Titanium',
              images: [
                'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500'
              ],
              stockQuantity: 3
            }
          ],
          sizes: ['256GB', '512GB', '1TB'],
          materials: ['Titanium']
        },
        specifications: {
          'Écran': '6.8 pouces Dynamic AMOLED 2X',
          'Processeur': 'Snapdragon 8 Gen 3',
          'Caméra': 'Quad caméra 200MP',
          'S Pen': 'Intégré'
        },
        tags: ['Samsung', 'Galaxy', 'S Pen', '5G'],
        featured: true,
        salesCount: 32,
        viewCount: 890
      },
      {
        name: 'MacBook Pro 16" M3 Max',
        description: 'Ordinateur portable professionnel avec puce M3 Max pour des performances exceptionnelles.',
        price: 2500000,
        originalPrice: 2800000,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        category: 'Ordinateurs',
        brand: 'Apple',
        stockQuantity: 5,
        stockStatus: 'low_stock',
        rating: 4.9,
        reviewCount: 67,
        isNew: true,
        options: {
          colors: [
            {
              name: 'Gris Sidéral',
              images: [
                'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'
              ],
              stockQuantity: 3
            },
            {
              name: 'Argent',
              images: [
                'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'
              ],
              stockQuantity: 2
            }
          ],
          sizes: ['1TB', '2TB', '4TB', '8TB'],
          materials: ['Aluminium']
        },
        specifications: {
          'Écran': '16 pouces Liquid Retina XDR',
          'Processeur': 'M3 Max',
          'Mémoire': 'Jusqu\'à 128GB unifiée',
          'Batterie': 'Jusqu\'à 22h d\'autonomie'
        },
        tags: ['MacBook', 'Apple', 'Professionnel', 'M3'],
        featured: true,
        salesCount: 18,
        viewCount: 450
      },
      {
        name: 'Nike Air Jordan 1 Retro High',
        description: 'Sneakers iconiques avec design rétro et confort moderne.',
        price: 85000,
        originalPrice: 95000,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
        category: 'Chaussures',
        brand: 'Nike',
        stockQuantity: 25,
        stockStatus: 'in_stock',
        rating: 4.6,
        reviewCount: 234,
        isNew: false,
        options: {
          colors: [
            {
              name: 'Blanc/Rouge',
              images: [
                'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'
              ],
              stockQuantity: 12
            },
            {
              name: 'Noir/Rouge',
              images: [
                'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'
              ],
              stockQuantity: 8
            },
            {
              name: 'Blanc/Noir',
              images: [
                'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'
              ],
              stockQuantity: 5
            }
          ],
          sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
          materials: ['Cuir', 'Toile']
        },
        specifications: {
          'Type': 'Basketball',
          'Matériau': 'Cuir premium',
          'Semelle': 'Caoutchouc',
          'Technologie': 'Air-Sole'
        },
        tags: ['Nike', 'Jordan', 'Basketball', 'Rétro'],
        featured: false,
        salesCount: 156,
        viewCount: 2100
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Casque sans fil avec réduction de bruit exceptionnelle et qualité audio premium.',
        price: 180000,
        originalPrice: 0,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        category: 'Audio',
        brand: 'Sony',
        stockQuantity: 0,
        stockStatus: 'out_of_stock',
        rating: 4.8,
        reviewCount: 189,
        isNew: false,
        options: {
          colors: [
            {
              name: 'Noir',
              images: [
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
              ],
              stockQuantity: 0
            },
            {
              name: 'Argent',
              images: [
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
              ],
              stockQuantity: 0
            }
          ],
          sizes: ['One Size'],
          materials: ['Plastique', 'Mousse']
        },
        specifications: {
          'Type': 'Over-ear sans fil',
          'Réduction de bruit': 'Active',
          'Autonomie': 'Jusqu\'à 30h',
          'Connectivité': 'Bluetooth 5.2'
        },
        tags: ['Sony', 'Audio', 'Sans fil', 'Réduction de bruit'],
        featured: false,
        salesCount: 89,
        viewCount: 1200
      }
    ];

    await Product.insertMany(sampleProducts);
    console.log(`✅ ${sampleProducts.length} produits créés`);

    console.log('🎉 Base de données initialisée avec succès !');
    console.log('\n📋 Informations de connexion :');
    console.log('👤 Email: admin@eugenestore.cm');
    console.log('🔑 Mot de passe: password');
    console.log('🔐 Rôle: Administrateur');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
};

connectDB().then(initDatabase); 