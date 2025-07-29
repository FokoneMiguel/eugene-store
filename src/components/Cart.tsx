import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, onCheckout }) => {
  const { state, dispatch } = useApp();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const applyPromoCode = () => {
    const promo = state.promoCodes.find(p => p.code === promoCode && p.isActive);
    if (promo) {
      setAppliedPromo(promoCode);
      setPromoCode('');
    } else {
      alert('Code promo invalide ou expiré');
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  const subtotal = state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  
  let discount = 0;
  if (appliedPromo) {
    const promo = state.promoCodes.find(p => p.code === appliedPromo);
    if (promo) {
      if (promo.type === 'percentage') {
        discount = Math.min((subtotal * promo.discount) / 100, promo.maxDiscount || Infinity);
      } else {
        discount = promo.discount;
      }
    }
  }

  const shipping = subtotal > 50000 ? 0 : 2500;
  const total = subtotal - discount + shipping;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Panier ({state.cart.reduce((total, item) => total + item.quantity, 0)})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {state.cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Votre panier est vide</p>
                <button
                  onClick={onClose}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Continuer les achats
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {state.cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 p-3 border rounded-lg">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg';
                      }}
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                        {item.product.name}
                      </h3>
                      <p className="text-red-600 font-semibold text-sm">
                        {formatPrice(item.product.price)}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Promo Code */}
                <div className="border-t pt-4">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Code promo"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                    >
                      Appliquer
                    </button>
                  </div>
                  
                  {appliedPromo && (
                    <div className="flex items-center justify-between bg-green-50 p-2 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700 text-sm">
                        <Tag className="h-4 w-4" />
                        <span>Code {appliedPromo} appliqué</span>
                      </div>
                      <button
                        onClick={removePromoCode}
                        className="text-green-700 hover:text-green-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {state.cart.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Sous-total:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Réduction:</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Livraison:</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'Gratuite' : formatPrice(shipping)}
                  </span>
                </div>
                
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Procéder au paiement
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;