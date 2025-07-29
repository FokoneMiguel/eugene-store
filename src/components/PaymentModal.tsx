import React, { useState } from 'react';
import { X, CreditCard, Lock } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, total }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mtn' | 'orange'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      let response;
      
      if (paymentMethod === 'card') {
        // Simuler un traitement de paiement par carte
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('Paiement par carte traité avec succès ! Votre commande a été confirmée.');
      } else if (paymentMethod === 'mtn') {
        // Appel API pour MTN Mobile Money
        response = await fetch('/api/payments/mtn', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            phoneNumber,
            amount: total,
            orderId: `order-${Date.now()}` // En production, utiliser l'ID de commande réel
          })
        });
        
        const result = await response.json();
        if (result.success) {
          alert(result.message);
        } else {
          alert('Erreur lors du paiement MTN Mobile Money');
        }
      } else if (paymentMethod === 'orange') {
        // Appel API pour Orange Money
        response = await fetch('/api/payments/orange', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            phoneNumber,
            amount: total,
            orderId: `order-${Date.now()}` // En production, utiliser l'ID de commande réel
          })
        });
        
        const result = await response.json();
        if (result.success) {
          alert(result.message);
        } else {
          alert('Erreur lors du paiement Orange Money');
        }
      }
      
      setIsProcessing(false);
      onClose();
    } catch (error) {
      console.error('Erreur de paiement:', error);
      alert('Erreur lors du traitement du paiement. Veuillez réessayer.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Paiement</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total à payer:</span>
              <span className="text-2xl font-bold text-green-600">
                {total.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
            <div className="text-sm text-gray-500">
              <Lock size={16} className="inline mr-1" />
              Paiement sécurisé par SSL
            </div>
          </div>

          <div className="mb-6">
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-300 text-gray-600'
                }`}
              >
                <CreditCard size={16} className="inline mr-2" />
                Carte bancaire
              </button>
              <button
                onClick={() => setPaymentMethod('mtn')}
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  paymentMethod === 'mtn'
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-600'
                    : 'border-gray-300 text-gray-600'
                }`}
              >
                🟡 MTN Mobile Money
              </button>
              <button
                onClick={() => setPaymentMethod('orange')}
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  paymentMethod === 'orange'
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : 'border-gray-300 text-gray-600'
                }`}
              >
                🟠 Orange Money
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {paymentMethod === 'card' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={19}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date d'expiration
                    </label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      placeholder="MM/AA"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du titulaire
                  </label>
                  <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="Nom et prénom"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de téléphone {paymentMethod === 'mtn' ? 'MTN' : 'Orange'}
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={paymentMethod === 'mtn' ? '6XX XXX XXX' : '6XX XXX XXX'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {paymentMethod === 'mtn' ? (
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="font-medium text-yellow-800">MTN Mobile Money</p>
                      <p className="text-yellow-700">Vous recevrez un SMS pour confirmer le paiement via MTN Mobile Money</p>
                    </div>
                  ) : (
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="font-medium text-orange-800">Orange Money</p>
                      <p className="text-orange-700">Vous recevrez un SMS pour confirmer le paiement via Orange Money</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Traitement en cours...' : 'Payer maintenant'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 