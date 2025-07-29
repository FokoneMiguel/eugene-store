import React from 'react';
import { useApp } from '../context/AppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true, 
  requireAdmin = false,
  fallback 
}) => {
  const { state } = useApp();

  // Si l'authentification n'est pas requise, afficher directement
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Si l'utilisateur n'est pas connecté
  if (!state.user) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Connexion requise
          </h2>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour accéder à cette page.
          </p>
          <button
            onClick={() => {
              // Déclencher l'ouverture du modal d'authentification
              const event = new CustomEvent('openAuthModal');
              window.dispatchEvent(event);
            }}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  // Si l'admin est requis mais l'utilisateur n'est pas admin
  if (requireAdmin && state.user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Accès refusé
          </h2>
          <p className="text-gray-600 mb-6">
            Vous devez être administrateur pour accéder à cette page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  // Si tout est OK, afficher le contenu
  return <>{children}</>;
};

export default ProtectedRoute; 