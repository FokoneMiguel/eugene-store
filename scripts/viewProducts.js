import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Product from '../models/Product.js';

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

const viewProducts = async () => {
  try {
    await connectDB();

    console.log('📦 Récupération des produits...\n');
    
    // Récupérer tous les produits
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    if (products.length === 0) {
      console.log('❌ Aucun produit trouvé dans la base de données.');
      console.log('💡 Exécutez "npm run init-db" pour ajouter des produits d\'exemple.');
    } else {
      console.log(`✅ ${products.length} produit(s) trouvé(s) :\n`);
      
      products.forEach((product, index) => {
        console.log(`📦 Produit ${index + 1}:`);
        console.log(`   🏷️  Nom: ${product.name}`);
        console.log(`   💰 Prix: ${product.price} FCFA`);
        console.log(`   📊 Stock: ${product.stockQuantity} unités`);
        console.log(`   🏪 Catégorie: ${product.category}`);
        console.log(`   ⭐ Note: ${product.rating}/5 (${product.reviewCount} avis)`);
        console.log(`   🔥 Promo: ${product.isPromo ? 'Oui' : 'Non'}`);
        if (product.isPromo) {
          console.log(`   💸 Prix original: ${product.originalPrice} FCFA`);
          console.log(`   📉 Réduction: ${product.promoPercentage}%`);
        }
        console.log(`   🆕 Nouveau: ${product.isNew ? 'Oui' : 'Non'}`);
        console.log(`   🌟 En vedette: ${product.featured ? 'Oui' : 'Non'}`);
        console.log(`   📈 Ventes: ${product.salesCount}`);
        console.log(`   👁️  Vues: ${product.viewCount}`);
        
        if (product.options && product.options.colors && product.options.colors.length > 0) {
          console.log(`   🎨 Couleurs disponibles: ${product.options.colors.map(c => c.name).join(', ')}`);
        }
        
        if (product.options && product.options.sizes && product.options.sizes.length > 0) {
          console.log(`   📏 Tailles disponibles: ${product.options.sizes.join(', ')}`);
        }
        
        console.log(`   📅 Créé le: ${product.createdAt ? product.createdAt.toLocaleDateString('fr-FR') : 'Date inconnue'}`);
        console.log('   ' + '─'.repeat(50));
      });
      
      // Statistiques
      const totalValue = products.reduce((sum, p) => sum + p.price, 0);
      const avgPrice = totalValue / products.length;
      const promoCount = products.filter(p => p.isPromo).length;
      const newCount = products.filter(p => p.isNew).length;
      const featuredCount = products.filter(p => p.featured).length;
      
      console.log('\n📊 Statistiques :');
      console.log(`   💰 Valeur totale: ${totalValue.toLocaleString()} FCFA`);
      console.log(`   💵 Prix moyen: ${avgPrice.toLocaleString()} FCFA`);
      console.log(`   🔥 Produits en promo: ${promoCount}`);
      console.log(`   🆕 Nouveaux produits: ${newCount}`);
      console.log(`   🌟 Produits en vedette: ${featuredCount}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

viewProducts(); 