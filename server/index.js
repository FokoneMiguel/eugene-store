import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'eugene-store-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// In-memory database (replace with real database in production)
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
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Smartphone premium avec S Pen intégré, écran Dynamic AMOLED 6.8" et caméra 200MP.',
    price: 780000,
    image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
    category: 'phones',
    brand: 'Samsung',
    rating: 4.7,
    reviewCount: 189,
    inStock: true,
    stockQuantity: 8,
    specifications: {
      'Écran': '6.8" Dynamic AMOLED',
      'Processeur': 'Snapdragon 8 Gen 3',
      'Stockage': '512GB',
      'Caméra': '200MP + 50MP + 12MP + 10MP',
      'Batterie': '5000 mAh',
      'OS': 'Android 14'
    },
    tags: ['smartphone', 'samsung', 'premium', 's-pen'],
    createdAt: '2024-01-10T14:30:00Z'
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

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: 'customer',
      addresses: [],
      orders: [],
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Product routes
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

app.post('/api/products', authenticateToken, requireAdmin, upload.single('image'), (req, res) => {
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
      image: req.file ? `/uploads/${req.file.filename}` : 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg',
      category,
      brand,
      rating: 0,
      reviewCount: 0,
      inStock: true,
      stockQuantity: parseInt(stockQuantity),
      isNew: true,
      isPromo: originalPrice && originalPrice > price,
      promoPercentage: originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
      specifications: specifications ? JSON.parse(specifications) : {},
      tags: tags ? JSON.parse(tags) : [],
      createdAt: new Date().toISOString()
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/products/:id', authenticateToken, requireAdmin, upload.single('image'), (req, res) => {
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
      image: req.file ? `/uploads/${req.file.filename}` : products[productIndex].image,
      category: category || products[productIndex].category,
      brand: brand || products[productIndex].brand,
      stockQuantity: stockQuantity ? parseInt(stockQuantity) : products[productIndex].stockQuantity,
      specifications: specifications ? JSON.parse(specifications) : products[productIndex].specifications,
      tags: tags ? JSON.parse(tags) : products[productIndex].tags,
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

// Order routes
app.get('/api/orders', authenticateToken, (req, res) => {
  if (req.user.role === 'admin') {
    res.json(orders);
  } else {
    const userOrders = orders.filter(order => order.userId === req.user.id);
    res.json(userOrders);
  }
});

app.post('/api/orders', authenticateToken, (req, res) => {
  try {
    const {
      items,
      total,
      subtotal,
      shipping,
      discount,
      paymentMethod,
      shippingAddress
    } = req.body;

    const newOrder = {
      id: `order-${Date.now()}`,
      userId: req.user.id,
      items,
      total,
      subtotal,
      shipping,
      tax: 0,
      discount: discount || 0,
      status: 'pending',
      paymentMethod,
      paymentStatus: 'pending',
      shippingAddress,
      trackingNumber: `TN${Date.now()}`,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.push(newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/orders/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const orderIndex = orders.findIndex(o => o.id === req.params.id);
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updatedOrder = {
      ...orders[orderIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    orders[orderIndex] = updatedOrder;
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Payment routes for MTN and Orange Money
app.post('/api/payments/mtn', authenticateToken, (req, res) => {
  try {
    const { phoneNumber, amount, orderId } = req.body;
    
    // Validation
    if (!phoneNumber || !amount || !orderId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Simuler l'intégration avec l'API MTN Mobile Money
    const paymentId = `mtn-${Date.now()}`;
    
    // Simuler le traitement du paiement
    setTimeout(() => {
      // Mettre à jour le statut de la commande
      const orderIndex = orders.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        orders[orderIndex].paymentStatus = 'completed';
        orders[orderIndex].status = 'confirmed';
        orders[orderIndex].updatedAt = new Date().toISOString();
      }
    }, 2000);

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
    
    // Validation
    if (!phoneNumber || !amount || !orderId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Simuler l'intégration avec l'API Orange Money
    const paymentId = `orange-${Date.now()}`;
    
    // Simuler le traitement du paiement
    setTimeout(() => {
      // Mettre à jour le statut de la commande
      const orderIndex = orders.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        orders[orderIndex].paymentStatus = 'completed';
        orders[orderIndex].status = 'confirmed';
        orders[orderIndex].updatedAt = new Date().toISOString();
      }
    }, 2000);

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

// Stats route for admin dashboard
app.get('/api/stats', authenticateToken, requireAdmin, (req, res) => {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalCustomers = users.filter(u => u.role === 'customer').length;
  const totalProducts = products.length;

  res.json({
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Eugene Store Backend running on port ${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}/api`);
});