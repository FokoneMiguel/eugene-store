// API Routes pour Vercel Serverless Functions
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'eugene-store-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (pour la démo)
let products = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description: 'Le dernier iPhone avec puce A17 Pro, caméra 48MP et écran Super Retina XDR de 6.7 pouces.',
    price: 850000,
    originalPrice: 950000,
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    category: 'phones',
    brand: 'Apple',
    rating: 4.8,
    reviewCount: 245,
    inStock: true,
    stockQuantity: 15,
    isNew: true,
    isPromo: true,
    promoPercentage: 11,
    specifications: {
      'Écran': '6.7" Super Retina XDR',
      'Processeur': 'A17 Pro',
      'Stockage': '256GB',
      'Caméra': '48MP + 12MP + 12MP',
      'Batterie': '4422 mAh',
      'OS': 'iOS 17'
    },
    tags: ['smartphone', 'apple', 'premium'],
    createdAt: '2024-01-15T10:00:00Z'
  }
];

let users = [
  {
    id: 'admin-1',
    email: 'admin@eugenestore.cm',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    firstName: 'Admin',
    lastName: 'Eugene Store',
    role: 'admin',
    createdAt: new Date().toISOString()
  }
];

let orders = [];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/products', authenticateToken, requireAdmin, (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      brand,
      stockQuantity,
      specifications,
      tags
    } = req.body;

    const newProduct = {
      id: `product-${Date.now()}`,
      name,
      description,
      price: parseInt(price),
      originalPrice: originalPrice ? parseInt(originalPrice) : undefined,
      image: req.body.image || 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg',
      category,
      brand,
      rating: 0,
      reviewCount: 0,
      inStock: true,
      stockQuantity: parseInt(stockQuantity),
      isNew: true,
      isPromo: originalPrice && originalPrice > price,
      promoPercentage: originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
      specifications: specifications || {},
      tags: tags || [],
      createdAt: new Date().toISOString()
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const {
      name,
      description,
      price,
      originalPrice,
      category,
      brand,
      stockQuantity,
      specifications,
      tags
    } = req.body;

    const updatedProduct = {
      ...products[productIndex],
      name: name || products[productIndex].name,
      description: description || products[productIndex].description,
      price: price ? parseInt(price) : products[productIndex].price,
      originalPrice: originalPrice ? parseInt(originalPrice) : products[productIndex].originalPrice,
      image: req.body.image || products[productIndex].image,
      category: category || products[productIndex].category,
      brand: brand || products[productIndex].brand,
      stockQuantity: stockQuantity ? parseInt(stockQuantity) : products[productIndex].stockQuantity,
      specifications: specifications || products[productIndex].specifications,
      tags: tags || products[productIndex].tags,
      updatedAt: new Date().toISOString()
    };

    products[productIndex] = updatedProduct;
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products.splice(productIndex, 1);
  res.status(204).send();
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Payment routes
app.post('/api/payments/mtn', authenticateToken, (req, res) => {
  try {
    const { phoneNumber, amount, orderId } = req.body;
    
    if (!phoneNumber || !amount || !orderId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const paymentId = `mtn-${Date.now()}`;
    
    res.json({
      success: true,
      paymentId,
      message: 'Paiement MTN Mobile Money initié. Vous recevrez un SMS de confirmation.',
      status: 'pending'
    });
  } catch (error) {
    res.status(500).json({ error: 'Payment processing error' });
  }
});

app.post('/api/payments/orange', authenticateToken, (req, res) => {
  try {
    const { phoneNumber, amount, orderId } = req.body;
    
    if (!phoneNumber || !amount || !orderId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const paymentId = `orange-${Date.now()}`;
    
    res.json({
      success: true,
      paymentId,
      message: 'Paiement Orange Money initié. Vous recevrez un SMS de confirmation.',
      status: 'pending'
    });
  } catch (error) {
    res.status(500).json({ error: 'Payment processing error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Export pour Vercel
export default app; 