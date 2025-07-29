# EUGENE STORE

Une boutique en ligne moderne et responsive construite avec React, TypeScript, et Node.js.

## 🚀 Fonctionnalités

- **Interface utilisateur moderne** : Design responsive avec Tailwind CSS
- **Gestion des produits** : Affichage, filtrage par catégorie, recherche
- **Panier d'achat** : Ajout, suppression, modification des quantités
- **Système d'authentification** : Connexion/inscription utilisateur
- **Paiement sécurisé** : Support carte bancaire et mobile money
- **Dashboard administrateur** : Gestion des produits et commandes
- **PWA** : Application web progressive installable
- **API REST** : Backend Node.js avec Express

## 🛠️ Technologies utilisées

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (icônes)
- Vite (build tool)

### Backend
- Node.js
- Express.js
- JWT (authentification)
- Multer (upload de fichiers)
- bcrypt (hashage des mots de passe)

## 📦 Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd EUGENE
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer le développement**
```bash
# Démarrer le frontend uniquement
npm run dev

# Démarrer le backend uniquement
npm run server

# Démarrer les deux serveurs simultanément
npm run dev:full
```

## 🌐 Accès

- **Frontend** : http://localhost:5173 (ou 5174 si le port 5173 est occupé)
- **Backend API** : http://localhost:3001

## 👤 Comptes de test

### Administrateur
- Email : `admin@eugenestore.cm`
- Mot de passe : `password`

### Client
- Utilisez n'importe quel email/mot de passe pour créer un compte client

## 📱 Fonctionnalités PWA

L'application peut être installée comme une application native sur :
- Chrome/Edge (desktop et mobile)
- Safari (iOS)
- Tous les navigateurs supportant les PWA

## 🔧 Configuration

### Variables d'environnement
Créez un fichier `.env` à la racine du projet :

```env
JWT_SECRET=votre-secret-jwt-super-securise
PORT=3001
```

### Base de données
Le projet utilise actuellement une base de données en mémoire. Pour la production, il est recommandé d'utiliser :
- MongoDB
- PostgreSQL
- MySQL

## 📁 Structure du projet

```
EUGENE/
├── public/                 # Fichiers statiques
│   ├── manifest.json      # Manifest PWA
│   ├── sw.js             # Service Worker
│   └── logo eugene store.png
├── server/                # Backend Node.js
│   └── index.js          # Serveur Express
├── src/                   # Frontend React
│   ├── components/        # Composants React
│   ├── context/          # Context API
│   ├── data/             # Données mock
│   ├── types/            # Types TypeScript
│   ├── App.tsx           # Composant principal
│   └── main.tsx          # Point d'entrée
├── package.json
├── vite.config.ts        # Configuration Vite
└── tailwind.config.js    # Configuration Tailwind
```

## 🚀 Déploiement

### Frontend (Vercel/Netlify)
```bash
npm run build
```

### Backend (Heroku/Railway)
```bash
npm run server
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 📞 Support

Pour toute question ou problème :
- Email : contact@eugenestore.cm
- Téléphone : +237 6XX XXX XXX

---

**EUGENE STORE** - Votre boutique en ligne de confiance au Cameroun 🇨🇲 