import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Users, DollarSign, ShoppingCart, Upload, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, Order } from '../types';

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
    category: 'electronics',
    brand: '',
    stockQuantity: 0,
    specifications: {} as { [key: string]: string },
    tags: [] as string[]
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
      category: 'electronics',
      brand: '',
      stockQuantity: 0,
      specifications: {},
      tags: []
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord administrateur</h1>
          <p className="text-gray-600 mt-2">Gérez votre boutique EUGENE STORE</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'products', name: 'Produits', icon: Package },
              { id: 'orders', name: 'Commandes', icon: ShoppingCart },
              { id: 'stats', name: 'Statistiques', icon: DollarSign }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Produits</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Commandes</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenus</p>
                  <p className="text-2xl font-semibold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Clients</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalCustomers}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Gestion des produits</h2>
              <button
                onClick={() => setIsAddingProduct(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Ajouter un produit</span>
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {state.products.map((product) => (
                  <li key={product.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-16 w-16 object-cover rounded-lg"
                        />
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-500">{product.category}</p>
                          <p className="text-lg font-semibold text-red-600">{formatPrice(product.price)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inStock ? `En stock (${product.stockQuantity})` : 'Rupture'}
                        </span>
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Gestion des commandes</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {state.orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune commande pour le moment</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {state.orders.map((order) => (
                    <li key={order.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Commande #{order.id.slice(-8)}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-lg font-semibold text-green-600">{formatPrice(order.total)}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 text-sm rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
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

        {/* Add Product Modal */}
        {isAddingProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsAddingProduct(false)}></div>
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Ajouter un nouveau produit</h3>
                  <button onClick={() => setIsAddingProduct(false)}>
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="phones">Téléphones</option>
                      <option value="electronics">Électronique</option>
                      <option value="fashion">Mode</option>
                      <option value="home">Maison</option>
                      <option value="beauty">Beauté</option>
                      <option value="sports">Sports</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA)</label>
                    <input
                      type="number"
                      min={0}
                      value={newProduct.price === 0 ? '' : newProduct.price}
                      onChange={e => {
                        const value = Math.max(0, Number(e.target.value));
                        setNewProduct({ ...newProduct, price: value });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix de promotion (FCFA)</label>
                    <input
                      type="number"
                      min={0}
                      value={newProduct.originalPrice === 0 ? '' : newProduct.originalPrice}
                      onChange={e => {
                        const value = Math.max(0, Number(e.target.value));
                        setNewProduct({ ...newProduct, originalPrice: value });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      placeholder="Laisser vide si pas de promo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      value={newProduct.stockQuantity}
                      onChange={(e) => setNewProduct({...newProduct, stockQuantity: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image du produit</label>
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setNewProduct({...newProduct, image: event.target?.result as string});
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="url"
                          value={newProduct.image}
                          onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                          placeholder="Ou URL de l'image"
                        />
                      </div>
                    </div>
                    {newProduct.image && (
                      <div className="mt-2">
                        <img 
                          src={newProduct.image} 
                          alt="Aperçu" 
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setIsAddingProduct(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAddProduct}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Ajouter le produit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setEditingProduct(null)}></div>
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Modifier le produit</h3>
                  <button onClick={() => setEditingProduct(null)}>
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <select
                      value={editingProduct.category}
                      onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="phones">Téléphones</option>
                      <option value="electronics">Électronique</option>
                      <option value="fashion">Mode</option>
                      <option value="home">Maison</option>
                      <option value="beauty">Beauté</option>
                      <option value="sports">Sports</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA)</label>
                    <input
                      type="number"
                      min={0}
                      value={editingProduct.price === 0 ? '' : editingProduct.price}
                      onChange={e => {
                        const value = Math.max(0, Number(e.target.value));
                        setEditingProduct({ ...editingProduct, price: value });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix de promotion (FCFA)</label>
                    <input
                      type="number"
                      min={0}
                      value={editingProduct.originalPrice === 0 ? '' : editingProduct.originalPrice}
                      onChange={e => {
                        const value = Math.max(0, Number(e.target.value));
                        setEditingProduct({ ...editingProduct, originalPrice: value });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Laisser vide si pas de promo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      value={editingProduct.stockQuantity}
                      onChange={e => setEditingProduct({ ...editingProduct, stockQuantity: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image du produit</label>
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = event => {
                                setEditingProduct({ ...editingProduct, image: event.target?.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="url"
                          value={editingProduct.image}
                          onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Ou URL de l'image"
                        />
                      </div>
                    </div>
                    {editingProduct.image && (
                      <div className="mt-2">
                        <img
                          src={editingProduct.image}
                          alt="Aperçu"
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editingProduct.description}
                      onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      // Mise à jour du produit dans le state (et API si besoin)
                      dispatch({
                        type: 'SET_PRODUCTS',
                        payload: state.products.map(p =>
                          p.id === editingProduct.id ? { ...editingProduct } : p
                        )
                      });
                      setEditingProduct(null);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;