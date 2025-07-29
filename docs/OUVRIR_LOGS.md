# 🔍 Guide pour ouvrir les logs du navigateur

## ⌨️ **Méthode 1 : Raccourci clavier (Recommandée)**

### **Chrome / Edge / Brave :**
1. **Appuyez sur** `F12` ou `Ctrl + Shift + I`
2. **Ou** `Ctrl + Shift + J` (pour aller directement aux logs)

### **Firefox :**
1. **Appuyez sur** `F12` ou `Ctrl + Shift + I`
2. **Ou** `Ctrl + Shift + K` (pour aller directement aux logs)

### **Safari (Mac) :**
1. **Appuyez sur** `Cmd + Option + I`
2. **Activez d'abord le menu Développeur** : Safari → Préférences → Avancé → "Afficher le menu Développeur"

## 🖱️ **Méthode 2 : Clic droit**

1. **Clic droit** n'importe où sur la page
2. **Sélectionnez** "Inspecter" ou "Inspecter l'élément"
3. **Cliquez sur l'onglet** "Console"

## 📱 **Méthode 3 : Menu du navigateur**

### **Chrome :**
1. **Cliquez sur** les 3 points ⋮ (en haut à droite)
2. **Plus d'outils** → **Outils de développement**

### **Firefox :**
1. **Cliquez sur** les 3 lignes ☰ (en haut à droite)
2. **Développement web** → **Console web**

## 🎯 **Étapes pour diagnostiquer le problème de connexion**

### **Étape 1 : Ouvrir la console**
1. **Allez sur votre site Vercel**
2. **Appuyez sur** `F12`
3. **Cliquez sur l'onglet** "Console"

### **Étape 2 : Tester l'API d'initialisation**
**Copiez et collez cette commande dans la console :**

```javascript
fetch('/api/init-db', { method: 'POST' })
  .then(res => res.json())
  .then(data => console.log('✅ Résultat:', data))
  .catch(err => console.error('❌ Erreur:', err));
```

### **Étape 3 : Tester la connexion**
**Copiez et collez cette commande :**

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

### **Étape 4 : Tester l'API products**
**Copiez et collez cette commande :**

```javascript
fetch('/api/products')
  .then(res => res.json())
  .then(data => console.log('✅ Produits:', data))
  .catch(err => console.error('❌ Erreur:', err));
```

## 🔍 **Interprétation des résultats**

### **✅ Succès :**
```
✅ Résultat: {success: true, message: "Admin créé avec succès"}
✅ Connexion: {token: "...", user: {...}}
✅ Produits: [{...}, {...}]
```

### **❌ Erreurs courantes :**

#### **Erreur 404 :**
```
❌ Erreur: 404 Not Found
```
→ L'API n'existe pas sur Vercel

#### **Erreur 500 :**
```
❌ Erreur: 500 Internal Server Error
```
→ Problème avec les variables d'environnement ou MongoDB

#### **Erreur de réseau :**
```
❌ Erreur: Failed to fetch
```
→ Problème de connexion ou URL incorrecte

#### **Erreur CORS :**
```
❌ Erreur: CORS policy
```
→ Problème de configuration CORS

## 📊 **Logs Vercel (côté serveur)**

### **Accès aux logs Vercel :**
1. **Dashboard Vercel** → votre projet
2. **Onglet "Functions"**
3. **Cliquez sur** `/api/auth/login`
4. **Voir les logs** en temps réel

### **Logs utiles à vérifier :**
- **Connexion MongoDB**
- **Variables d'environnement**
- **Erreurs d'authentification**
- **Erreurs de base de données**

## 🛠️ **Commandes de débogage avancées**

### **Vérifier les variables d'environnement :**
```javascript
console.log('URL:', window.location.href);
console.log('User Agent:', navigator.userAgent);
```

### **Tester la connexion réseau :**
```javascript
navigator.onLine ? console.log('✅ En ligne') : console.log('❌ Hors ligne');
```

### **Vérifier les cookies :**
```javascript
console.log('Cookies:', document.cookie);
```

## 🎯 **Résolution des problèmes**

### **Si l'API init-db fonctionne :**
- L'admin est créé
- Essayez de vous connecter normalement

### **Si l'API init-db échoue :**
- Vérifiez les variables d'environnement Vercel
- Vérifiez les logs Vercel
- Redéployez l'application

### **Si la connexion échoue :**
- Vérifiez que l'admin existe
- Vérifiez les logs d'authentification
- Testez avec différents identifiants

## 📞 **Support**

**Copiez et collez les messages d'erreur exacts** que vous voyez dans la console pour un diagnostic précis ! 