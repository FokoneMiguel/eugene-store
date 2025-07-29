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
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['phones', 'electronics', 'fashion', 'home', 'beauty', 'sports']
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculer automatiquement isPromo et promoPercentage
productSchema.pre('save', function(next) {
  if (this.originalPrice && this.originalPrice > this.price) {
    this.isPromo = true;
    this.promoPercentage = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  } else {
    this.isPromo = false;
    this.promoPercentage = 0;
  }
  
  // Mettre à jour inStock basé sur stockQuantity
  this.inStock = this.stockQuantity > 0;
  
  next();
});

export default mongoose.model('Product', productSchema); 