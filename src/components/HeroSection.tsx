import React from 'react';
import { ShoppingBag, Star, Truck, Shield, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../data/translations';

const HeroSection: React.FC = () => {
  const { language } = useTheme();
  const t = translations[language];

  const features = [
    {
      icon: Truck,
      title: language === 'fr' ? 'Livraison rapide' : 'Fast Delivery',
      description: language === 'fr' ? 'Livraison gratuite dès 50.000 FCFA' : 'Free delivery from 50,000 FCFA'
    },
    {
      icon: Shield,
      title: language === 'fr' ? 'Paiement sécurisé' : 'Secure Payment',
      description: language === 'fr' ? 'MTN Money, Orange Money, Carte' : 'MTN Money, Orange Money, Card'
    },
    {
      icon: Star,
      title: language === 'fr' ? 'Qualité garantie' : 'Quality Guaranteed',
      description: language === 'fr' ? 'Produits authentiques et de qualité' : 'Authentic and quality products'
    },
    {
      icon: Zap,
      title: language === 'fr' ? 'Service client' : 'Customer Service',
      description: language === 'fr' ? 'Support 24/7 disponible' : '24/7 support available'
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-sm font-medium mb-6">
              <ShoppingBag className="h-4 w-4 mr-2" />
              {language === 'fr' ? 'Boutique en ligne' : 'Online Store'}
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              <span className="text-red-600 dark:text-red-400">
                {language === 'fr' ? 'EUGENE' : 'EUGENE'}
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                {language === 'fr' ? 'STORE' : 'STORE'}
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {language === 'fr' 
                ? 'Découvrez notre sélection de produits de qualité. Téléphones, électronique, mode et bien plus encore !'
                : 'Discover our selection of quality products. Phones, electronics, fashion and much more!'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105">
                {language === 'fr' ? 'Commencer les achats' : 'Start Shopping'}
              </button>
              <button className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
                {language === 'fr' ? 'Voir les promotions' : 'View Promotions'}
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="animate-fade-in-right">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 rounded-2xl transform rotate-3 scale-105 opacity-20"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 animate-pulse">
                      <div className="w-16 h-16 bg-red-200 dark:bg-red-800 rounded-lg mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                      <div className="w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-lg mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                      <div className="w-16 h-16 bg-green-200 dark:bg-green-800 rounded-lg mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-4/5"></div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 animate-pulse">
                      <div className="w-16 h-16 bg-yellow-200 dark:bg-yellow-800 rounded-lg mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center group hover-bounce"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 animate-fade-in-up">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                  1000+
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {language === 'fr' ? 'Produits' : 'Products'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                  5000+
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {language === 'fr' ? 'Clients satisfaits' : 'Happy Customers'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                  24h
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {language === 'fr' ? 'Livraison rapide' : 'Fast Delivery'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                  100%
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {language === 'fr' ? 'Satisfaction' : 'Satisfaction'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 