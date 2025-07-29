import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  originalPrice: { 
    type: Number, 
    min: 0, 
    default: 0 
  },
  image: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true, 
    trim: true 
  },
  brand: { 
    type: String, 
    trim: true 
  },
  rating: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 5 
  },
  reviewCount: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  inStock: { 
    type: Boolean, 
    default: true 
  },
  stockQuantity: { 
    type: Number, 
    required: true, 
    min: 0, 
    default: 0 
  },
  stockStatus: {
    type: String,
    enum: ['in_stock', 'low_stock', 'out_of_stock'],
    default: 'in_stock'
  },
  isNew: { 
    type: Boolean, 
    default: true 
  },
  isPromo: { 
    type: Boolean, 
    default: false 
  },
  promoPercentage: { 
    type: Number, 
    min: 0, 
    max: 100, 
    default: 0 
  },
  specifications: { 
    type: Map, 
    of: String, 
    default: {} 
  },
  tags: [{ 
    type: String, 
    trim: true 
  }],
  options: {
    colors: [{
      name: { type: String, required: true },
      images: [{ type: String }],
      stockQuantity: { type: Number, default: 0, min: 0 }
    }],
    sizes: [{ type: String, trim: true }],
    materials: [{ type: String, trim: true }]
  },
  variants: [{
    color: { type: String },
    size: { type: String },
    material: { type: String },
    price: { type: Number, min: 0 },
    stockQuantity: { type: Number, default: 0, min: 0 },
    images: [{ type: String }],
    sku: { type: String, unique: true, sparse: true }
  }],
  salesCount: {
    type: Number,
    default: 0,
    min: 0
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

// Middleware pour calculer automatiquement les propriétés
productSchema.pre('save', function(next) {
  // Calculer isPromo basé sur originalPrice
  if (this.originalPrice > 0 && this.originalPrice > this.price) {
    this.isPromo = true;
    this.promoPercentage = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  } else {
    this.isPromo = false;
    this.promoPercentage = 0;
  }

  // Mettre à jour stockStatus basé sur stockQuantity
  if (this.stockQuantity === 0) {
    this.stockStatus = 'out_of_stock';
    this.inStock = false;
  } else if (this.stockQuantity <= 5) {
    this.stockStatus = 'low_stock';
    this.inStock = true;
  } else {
    this.stockStatus = 'in_stock';
    this.inStock = true;
  }

  // Calculer le stock total des variantes si elles existent
  if (this.variants && this.variants.length > 0) {
    const totalVariantStock = this.variants.reduce((sum, variant) => sum + (variant.stockQuantity || 0), 0);
    this.stockQuantity = totalVariantStock;
    
    if (totalVariantStock === 0) {
      this.stockStatus = 'out_of_stock';
      this.inStock = false;
    } else if (totalVariantStock <= 5) {
      this.stockStatus = 'low_stock';
      this.inStock = true;
    } else {
      this.stockStatus = 'in_stock';
      this.inStock = true;
    }
  }

  next();
});

// Méthodes statiques
productSchema.statics.findByCategory = function(category) {
  return this.find({ category, active: true });
};

productSchema.statics.findInStock = function() {
  return this.find({ inStock: true, active: true });
};

productSchema.statics.findOnSale = function() {
  return this.find({ isPromo: true, active: true });
};

productSchema.statics.findFeatured = function() {
  return this.find({ featured: true, active: true });
};

// Méthodes d'instance
productSchema.methods.updateStock = function(quantity) {
  this.stockQuantity = Math.max(0, this.stockQuantity - quantity);
  return this.save();
};

productSchema.methods.addVariant = function(variant) {
  this.variants.push(variant);
  return this.save();
};

productSchema.methods.updateVariantStock = function(variantId, quantity) {
  const variant = this.variants.id(variantId);
  if (variant) {
    variant.stockQuantity = Math.max(0, variant.stockQuantity - quantity);
    return this.save();
  }
  throw new Error('Variant not found');
};

// Index pour améliorer les performances
productSchema.index({ category: 1, active: 1 });
productSchema.index({ inStock: 1, active: 1 });
productSchema.index({ isPromo: 1, active: 1 });
productSchema.index({ featured: 1, active: 1 });
productSchema.index({ 'options.colors.name': 1 });
productSchema.index({ 'options.sizes': 1 });
productSchema.index({ 'options.materials': 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ salesCount: -1 });
productSchema.index({ viewCount: -1 });

export default mongoose.model('Product', productSchema); 