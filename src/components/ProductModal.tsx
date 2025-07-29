import React, { useState } from 'react';
import { X, Star, ShoppingCart, Heart, Share2, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const { dispatch } = useApp();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: 'ADD_TO_CART', payload: product });
    }
    onClose();
  };

  const images = product.images || [product.image];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose}></div>

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Détails du produit</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg';
                  }}
                />
              </div>
              
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex gap-2">
                {product.isNew && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    Nouveau
                  </span>
                )}
                {product.isPromo && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                    Promotion -{product.promoPercentage}%
                  </span>
                )}
                {product.inStock ? (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    En stock ({product.stockQuantity})
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                    Rupture de stock
                  </span>
                )}
              </div>

              {/* Brand */}
              {product.brand && (
                <p className="text-sm text-gray-600 uppercase tracking-wide">
                  {product.brand}
                </p>
              )}

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} avis)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed">{product.description}</p>

              {/* Specifications */}
              {product.specifications && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Spécifications</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-medium text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-900">Quantité:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all ${
                      product.inStock
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {product.inStock ? 'Ajouter au panier' : 'Indisponible'}
                  </button>

                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>

                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;