import connectDB from '../config/database.js';
import Product from '../models/Product.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { category, search, sort, limit } = req.query;

    let query = { active: true };

    // Filtre par catégorie
    if (category && category !== 'all') {
      query.category = category;
    }

    // Recherche par nom ou description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    let productsQuery = Product.find(query);

    // Tri
    if (sort) {
      switch (sort) {
        case 'price-asc':
          productsQuery = productsQuery.sort({ price: 1 });
          break;
        case 'price-desc':
          productsQuery = productsQuery.sort({ price: -1 });
          break;
        case 'newest':
          productsQuery = productsQuery.sort({ createdAt: -1 });
          break;
        case 'rating':
          productsQuery = productsQuery.sort({ rating: -1 });
          break;
        case 'popular':
          productsQuery = productsQuery.sort({ salesCount: -1 });
          break;
        default:
          productsQuery = productsQuery.sort({ createdAt: -1 });
      }
    } else {
      productsQuery = productsQuery.sort({ createdAt: -1 });
    }

    // Limite
    if (limit) {
      productsQuery = productsQuery.limit(parseInt(limit));
    }

    const products = await productsQuery.exec();

    res.status(200).json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
  }
} 