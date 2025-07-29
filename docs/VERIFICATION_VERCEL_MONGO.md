# 🔗 Guide de vérification et configuration Vercel ↔ MongoDB Atlas

## 📋 **Informations de connexion MongoDB**

- **URL de connexion :** `mongodb+srv://eugene-admin:ZRAQksujSP3HzbaE@eugene-store-cluster.ukzcyui.mongodb.net/eugene-store`
- **Base de données :** `eugene-store`
- **Cluster :** `eugene-store-cluster`

## 🔍 **Étape 1 : Vérifier les variables d'environnement sur Vercel**

### **Accès au dashboard Vercel :**
1. Allez sur [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Connectez-vous avec vos identifiants
3. Sélectionnez votre projet `eugene-store`

### **Vérification des variables :**
1. Cliquez sur l'onglet **"Settings"**
2. Dans le menu de gauche, cliquez sur **"Environment Variables"**
3. Vérifiez que ces variables sont présentes :

```
MONGODB_URI = mongodb+srv://eugene-admin:ZRAQksujSP3HzbaE@eugene-store-cluster.ukzcyui.mongodb.net/eugene-store
JWT_SECRET = eugene-store-super-secret-jwt-key-2024
NODE_ENV = production
```

## ⚠️ **Si les variables sont manquantes :**

### **Ajouter MONGODB_URI :**
1. Cliquez sur **"Add New"**
2. **Name :** `MONGODB_URI`
3. **Value :** `mongodb+srv://eugene-admin:ZRAQksujSP3HzbaE@eugene-store-cluster.ukzcyui.mongodb.net/eugene-store`
4. **Environment :** Sélectionnez `Production`, `Preview`, et `Development`
5. Cliquez sur **"Save"**

### **Ajouter JWT_SECRET :**
1. Cliquez sur **"Add New"**
2. **Name :** `JWT_SECRET`
3. **Value :** `eugene-store-super-secret-jwt-key-2024`
4. **Environment :** Sélectionnez `Production`, `Preview`, et `Development`
5. Cliquez sur **"Save"**

### **Ajouter NODE_ENV :**
1. Cliquez sur **"Add New"**
2. **Name :** `NODE_ENV`
3. **Value :** `production`
4. **Environment :** Sélectionnez `Production`, `Preview`, et `Development`
5. Cliquez sur **"Save"**

## 🔄 **Étape 2 : Redéployer après modification des variables**

### **Redéploiement automatique :**
1. Après avoir ajouté/modifié les variables d'environnement
2. Vercel redéploie automatiquement votre application
3. Attendez que le déploiement soit terminé (statut vert)

### **Redéploiement manuel :**
1. Dans le dashboard Vercel, cliquez sur **"Deployments"**
2. Cliquez sur **"Redeploy"** sur le dernier déploiement
3. Ou faites un nouveau commit et push sur GitHub

## 🧪 **Étape 3 : Tester la connexion**

### **Test via l'application :**
1. Allez sur votre URL Vercel
2. Essayez de vous connecter avec :
   - Email : `admin@eugenestore.cm`
   - Mot de passe : `password`
3. Si la connexion fonctionne → La liaison est correcte

### **Test via les logs Vercel :**
1. Dans le dashboard Vercel, cliquez sur **"Functions"**
2. Cliquez sur une fonction (ex: `/api/auth/login`)
3. Vérifiez les logs pour voir s'il y a des erreurs de connexion MongoDB

## 🚨 **Problèmes courants et solutions**

### **Erreur : "MongoDB connection failed"**
- Vérifiez que `MONGODB_URI` est correctement définie
- Vérifiez que l'URL de connexion est complète
- Vérifiez que le mot de passe MongoDB est correct

### **Erreur : "Authentication failed"**
- Vérifiez que l'utilisateur MongoDB a les bonnes permissions
- Vérifiez que l'IP de Vercel est autorisée (normalement automatique)

### **Erreur : "Database not found"**
- Vérifiez que la base de données `eugene-store` existe
- Exécutez `npm run init-db` pour créer les collections

## 📊 **Vérification finale**

### **Script de test de connexion :**
```bash
# Test local de la connexion
npm run check-admin

# Test des produits
npm run view-products

# Test des utilisateurs
npm run view-users
```

### **Indicateurs de succès :**
- ✅ Connexion à l'application réussie
- ✅ Accès au dashboard admin
- ✅ Affichage des produits
- ✅ Fonctionnalité d'ajout/modification de produits
- ✅ Système d'authentification fonctionnel

## 🔧 **Commandes utiles**

### **Redéploiement complet :**
```bash
git add .
git commit -m "Mise à jour des variables d'environnement"
git push origin main
```

### **Vérification des logs Vercel :**
- Dashboard Vercel → Deployments → Cliquer sur un déploiement → View Function Logs

## 📞 **Support**

Si les problèmes persistent :
1. Vérifiez les logs Vercel
2. Testez la connexion MongoDB localement
3. Vérifiez les permissions MongoDB Atlas
4. Contactez le support Vercel si nécessaire 