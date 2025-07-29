import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface ProductGridProps {
  onProductClick: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ onProductClick }) => {
  const { state } = useApp();

  const filteredProducts = useMemo(() => {
    let filtered = state.products;

    // Filter by category
    if (state.selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === state.selectedCategory);
    }

    // Filter by search query
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [state.products, state.selectedCategory, state.searchQuery]);

  if (state.isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Aucun produit trouvé
        </h3>
        <p className="text-gray-600 mb-6">
          {state.searchQuery 
            ? `Aucun résultat pour "${state.searchQuery}"`
            : 'Aucun produit dans cette catégorie'
          }
        </p>
        <button
          onClick={() => {
            if (state.searchQuery) {
              // Clear search
              const event = new CustomEvent('clearSearch');
              window.dispatchEvent(event);
            }
          }}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Voir tous les produits
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {state.selectedCategory === 'all' 
            ? 'Tous nos produits' 
            : state.categories.find(cat => cat.id === state.selectedCategory)?.name
          }
        </h2>
        <span className="text-gray-600">
          {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;