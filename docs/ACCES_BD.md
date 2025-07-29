# 🔍 Guide d'accès à la base de données MongoDB Atlas

## 📋 **Informations de connexion**

- **Cluster :** eugene-store-cluster
- **Base de données :** eugene-store
- **URL de connexion :** mongodb+srv://eugene-admin:ZRAQksujSP3HzbaE@eugene-store-cluster.ukzcyui.mongodb.net/eugene-store

## 🌐 **Accès via l'interface web MongoDB Atlas**

### **Étape 1 : Connexion à MongoDB Atlas**
1. Allez sur [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Cliquez sur **"Sign In"**
3. Connectez-vous avec vos identifiants

### **Étape 2 : Accéder à votre cluster**
1. Dans le dashboard, cliquez sur **"Browse Collections"**
2. Sélectionnez votre cluster : **eugene-store-cluster**
3. Choisissez la base de données : **eugene-store**

### **Étape 3 : Explorer les collections**
Vous verrez les collections suivantes :
- **users** - Utilisateurs (admin, clients)
- **products** - Produits de la boutique
- **orders** - Commandes

### **Étape 4 : Visualiser les données**
- Cliquez sur une collection pour voir les documents
- Utilisez les filtres pour rechercher
- Cliquez sur un document pour le modifier

## 🛠️ **Accès via MongoDB Compass (Application desktop)**

### **Étape 1 : Télécharger MongoDB Compass**
1. Allez sur [https://www.mongodb.com/products/compass](https://www.mongodb.com/products/compass)
2. Téléchargez et installez MongoDB Compass

### **Étape 2 : Se connecter**
1. Ouvrez MongoDB Compass
2. Dans "New Connection", collez l'URL :
   ```
   mongodb+srv://eugene-admin:ZRAQksujSP3HzbaE@eugene-store-cluster.ukzcyui.mongodb.net/eugene-store
   ```
3. Cliquez sur "Connect"

### **Étape 3 : Explorer**
- Naviguez dans les collections
- Visualisez, modifiez, supprimez les documents
- Exécutez des requêtes

## 📊 **Scripts pour interagir avec la BD**

### **Voir tous les utilisateurs**
```bash
npm run check-admin
```

### **Voir tous les produits**
```bash
npm run view-products
```

### **Réinitialiser l'admin**
```bash
npm run reset-admin
```

## 🔧 **Commandes utiles pour la gestion**

### **Vérifier la connexion**
```bash
npm run check-admin
```

### **Réinitialiser la base de données complète**
```bash
npm run init-db
```

## 📱 **Interface mobile**
- L'interface web MongoDB Atlas est responsive
- Vous pouvez y accéder depuis votre téléphone
- Utilisez le navigateur mobile

## 🔐 **Sécurité**
- Gardez vos identifiants secrets
- Ne partagez jamais l'URL de connexion
- Utilisez des mots de passe forts
- Activez l'authentification à deux facteurs si possible

## 🆘 **En cas de problème**
1. Vérifiez votre connexion internet
2. Vérifiez que l'URL de connexion est correcte
3. Vérifiez que votre IP est autorisée dans MongoDB Atlas
4. Contactez le support MongoDB si nécessaire 