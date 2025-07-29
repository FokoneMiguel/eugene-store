import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo eugene store.png" 
                alt="Eugene Store" 
                className="h-10 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden text-xl font-bold text-red-500">
                EUGENE STORE
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Votre boutique en ligne de confiance au Cameroun. 
              Découvrez une large gamme de produits de qualité à des prix compétitifs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Accueil</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Produits</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Promotions</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">À propos</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Service client */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Service client</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Centre d'aide</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Politique de retour</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Conditions d'utilisation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Politique de confidentialité</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Livraison</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-red-500" />
                <span className="text-gray-300">+237 6XX XXX XXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-red-500" />
                <span className="text-gray-300">contact@eugenestore.cm</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                <span className="text-gray-300">
                  Douala, Cameroun<br />
                  Akwa - Bonanjo
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Eugene Store. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Paiement sécurisé</span>
              <span className="text-gray-400 text-sm">Livraison rapide</span>
              <span className="text-gray-400 text-sm">Support 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;