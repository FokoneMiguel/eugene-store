import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Users, DollarSign, ShoppingCart, Upload, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, Order } from '../types';
import ProductForm from './ProductForm';

const AdminDashboard: React.FC = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'stats'>('products');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    image: '',
    category: '',
    brand: '',
    stockQuantity: 0,
    stockStatus: 'in_stock' as 'in_stock' | 'out_of_stock' | 'low_stock',
    specifications: {} as { [key: string]: string },
    tags: [] as string[],
    options: {
      colors: [] as { name: string; images: string[] }[],
      sizes: [] as string[],
      materials: [] as string[]
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const handleAddProduct = () => {
    const product: Product = {
      id: `product-${Date.now()}`,
      ...newProduct,
      rating: 4.5,
      reviewCount: 0,
      inStock: newProduct.stockQuantity > 0,
      isNew: true,
      createdAt: new Date().toISOString()
    };

    dispatch({ type: 'SET_PRODUCTS', payload: [...state.products, product] });
    setIsAddingProduct(false);
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      image: '',
      category: '',
      brand: '',
      stockQuantity: 0,
      stockStatus: 'in_stock',
      specifications: {},
      tags: [],
      options: {
        colors: [],
        sizes: [],
        materials: []
      }
    });
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      dispatch({ 
        type: 'SET_PRODUCTS', 
        payload: state.products.filter(p => p.id !== productId) 
      });
    }
  };

  const stats = {
    totalProducts: state.products.length,
    totalOrders: state.orders.length,
    totalRevenue: state.orders.reduce((sum, order) => sum + order.total, 0),
    totalCustomers: new Set(state.orders.map(order => order.userId)).size
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tableau de bord administrateur</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Gérez votre boutique EUGENE STORE</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'products', name: 'Produits', icon: Package },
              { id: 'orders', name: 'Commandes', icon: ShoppingCart },
              { id: 'stats', name: 'Statistiques', icon: DollarSign }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600 dark:text-red-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Gestion des produits</h2>
              <button
                onClick={() => setIsAddingProduct(true)}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Ajouter un produit</span>
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              {state.products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Aucun produit pour le moment</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {state.products.map((product) => (
                    <li key={product.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{product.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                            <p className="text-lg font-semibold text-red-600 dark:text-red-400">{formatPrice(product.price)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Gestion des commandes</h2>
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              {state.orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Aucune commande pour le moment</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {state.orders.map((order) => (
                    <li key={order.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Commande #{order.id.slice(-8)}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-lg font-semibold text-green-600 dark:text-green-400">{formatPrice(order.total)}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 text-sm rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}>
                            {order.status === 'pending' ? 'En attente' :
                             order.status === 'confirmed' ? 'Confirmée' :
                             order.status === 'processing' ? 'En traitement' :
                             order.status === 'shipped' ? 'Expédiée' :
                             order.status === 'delivered' ? 'Livrée' : 'Annulée'}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Statistiques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-red-600 dark:text-red-400" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Produits</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalProducts}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <ShoppingCart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Commandes</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalOrders}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenus Totaux</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatPrice(stats.totalRevenue)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Clients</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalCustomers}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {isAddingProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 py-8">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsAddingProduct(false)}></div>
              <div className="relative w-full max-w-4xl max-h-screen overflow-y-auto">
                <ProductForm
                  product={newProduct}
                  setProduct={setNewProduct}
                  onSubmit={handleAddProduct}
                  onCancel={() => setIsAddingProduct(false)}
                  isEditing={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 py-8">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setEditingProduct(null)}></div>
              <div className="relative w-full max-w-4xl max-h-screen overflow-y-auto">
                <ProductForm
                  product={editingProduct}
                  setProduct={setEditingProduct}
                  onSubmit={() => {
                    dispatch({
                      type: 'SET_PRODUCTS',
                      payload: state.products.map(p =>
                        p.id === editingProduct.id ? { ...editingProduct } : p
                      )
                    });
                    setEditingProduct(null);
                  }}
                  onCancel={() => setEditingProduct(null)}
                  isEditing={true}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;