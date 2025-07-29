# 🔧 Solution pour l'erreur 401 (Unauthorized)

## 🔍 **Diagnostic de l'erreur**

L'erreur `401 (Unauthorized)` sur `/api/auth/login` indique :
- ✅ L'API route est déployée
- ✅ La connexion MongoDB fonctionne
- ❌ L'utilisateur admin n'existe pas dans la base de données Vercel

## 🛠️ **Solution : Créer l'admin sur Vercel**

### **Étape 1 : Initialiser l'admin**

1. **Allez sur votre site Vercel :** https://eugene-store-1g9cjmn2p-fokonemiguels-projects.vercel.app/
2. **Appuyez sur** `F12` pour ouvrir la console
3. **Collez cette commande :**

```javascript
fetch('/api/init-db', { method: 'POST' })
  .then(res => res.json())
  .then(data => console.log('✅ Résultat:', data))
  .catch(err => console.error('❌ Erreur:', err));
```

### **Étape 2 : Vérifier le résultat**

**Si succès :**
```
✅ Résultat: {success: true, message: "Admin créé avec succès", admin: {...}}
```

**Si erreur :**
```
❌ Erreur: 404 Not Found
```
→ L'API init-db n'est pas encore déployée (attendre 2-3 minutes)

### **Étape 3 : Tester la connexion**

Après l'initialisation réussie, testez la connexion :

```javascript
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@eugenestore.cm',
    password: 'password'
  })
})
.then(res => res.json())
.then(data => console.log('✅ Connexion:', data))
.catch(err => console.error('❌ Erreur:', err));
```

## 🎯 **Résultats attendus**

### **✅ Succès :**
```
✅ Connexion: {
  success: true,
  token: "eyJhbGciOiJIUzI1NiIs...",
  user: {
    id: "...",
    email: "admin@eugenestore.cm",
    firstName: "Admin",
    lastName: "Eugene",
    role: "admin"
  }
}
```

### **❌ Si erreur persiste :**
- Vérifiez les variables d'environnement sur Vercel
- Vérifiez les logs Vercel (Dashboard → Functions → Logs)

## 🔧 **Variables d'environnement Vercel**

Vérifiez que ces variables sont définies sur Vercel :

```
MONGODB_URI = mongodb+srv://eugene-admin:ZRAQksujSP3HzbaE@eugene-store-cluster.ukzcyui.mongodb.net/eugene-store
JWT_SECRET = eugene-store-super-secret-jwt-key-2024
NODE_ENV = production
```

## 📊 **Logs Vercel**

Pour voir les logs détaillés :
1. **Dashboard Vercel** → votre projet
2. **Onglet "Functions"**
3. **Cliquez sur** `/api/auth/login`
4. **Voir les logs** en temps réel

## 🎉 **Après résolution**

Une fois la connexion réussie :
1. **Fermez la console** (F12)
2. **Essayez de vous connecter** normalement via l'interface
3. **Accédez au dashboard admin**

## 🆘 **Si le problème persiste**

1. **Vérifiez l'URL** : https://eugene-store-1g9cjmn2p-fokonemiguels-projects.vercel.app/
2. **Attendez le déploiement** (2-3 minutes après push)
3. **Vérifiez les variables d'environnement**
4. **Contactez le support** si nécessaire 