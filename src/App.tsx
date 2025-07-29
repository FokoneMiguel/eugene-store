import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import ProductModal from './components/ProductModal';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import PaymentModal from './components/PaymentModal';
import Footer from './components/Footer';
import { Product } from './types';

const AppContent: React.FC = () => {
  const { dispatch } = useApp();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    // Enregistrer le service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Charger les produits depuis l'API
    fetchProducts();
    
    // Vérifier l'authentification
    const token = localStorage.getItem('token');
    if (token) {
      // Vérifier la validité du token et récupérer les infos utilisateur
      verifyToken(token);
    }
  }, [dispatch]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const products = await response.json();
        dispatch({ type: 'SET_PRODUCTS', payload: products });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      // Fallback vers les données mock si l'API n'est pas disponible
      const { mockProducts } = await import('./data/mockData');
      dispatch({ type: 'SET_PRODUCTS', payload: mockProducts });
    }
  };

  const verifyToken = async (token: string) => {
    try {
      // Vérifier le token avec l'API
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        dispatch({ type: 'SET_USER', payload: userData.user });
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      localStorage.removeItem('token');
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCheckout = () => {
    const { state } = useApp();
    const subtotal = state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const shipping = subtotal > 50000 ? 0 : 2500;
    const total = subtotal + shipping;
    
    setCartTotal(total);
    setIsCartOpen(false);
    setIsPaymentModalOpen(true);
  };

  const { state } = useApp();

  // Afficher le dashboard admin si l'utilisateur est admin
  if (showAdmin && state.user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          onCartClick={() => setIsCartOpen(true)}
          onAuthClick={() => setIsAuthModalOpen(true)}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => setShowAdmin(false)}
            className="mb-4 text-red-600 hover:text-red-700 font-medium"
          >
            ← Retour à la boutique
          </button>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthModalOpen(true)}
      />
      
      {/* Bouton admin pour les administrateurs */}
      {state.user?.role === 'admin' && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <button
              onClick={() => setShowAdmin(true)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              🔧 Accéder au tableau de bord administrateur
            </button>
          </div>
        </div>
      )}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CategoryFilter />
        <ProductGrid onProductClick={handleProductClick} />
      </main>

      <Footer />
      <PWAInstallPrompt />

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        total={cartTotal}
      />

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;