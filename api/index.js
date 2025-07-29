// API Routes pour Vercel Serverless Functions
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectDB from '../config/database.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'eugene-store-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Connecter à MongoDB
connectDB();

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
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
  }
});

app.post('/api/products', authenticateToken, requireAdmin, async (req, res) => {
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

    const newProduct = new Product({
      name,
      description,
      price: parseInt(price),
      originalPrice: originalPrice ? parseInt(originalPrice) : undefined,
      image: req.body.image || 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg',
      category,
      brand,
      stockQuantity: parseInt(stockQuantity),
      specifications: specifications || {},
      tags: tags || []
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du produit' });
  }
});

app.put('/api/products/:id', authenticateToken, requireAdmin, async (req, res) => {
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

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price: price ? parseInt(price) : undefined,
        originalPrice: originalPrice ? parseInt(originalPrice) : undefined,
        image: req.body.image,
        category,
        brand,
        stockQuantity: stockQuantity ? parseInt(stockQuantity) : undefined,
        specifications,
        tags
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du produit' });
  }
});

app.delete('/api/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
  }
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
      phone
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email, role: savedUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = savedUser.toObject();
    res.status(201).json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
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