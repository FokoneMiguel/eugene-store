# API Documentation - EUGENE STORE

## Base URL
```
http://localhost:3001/api
```

## Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification. Incluez le token dans le header Authorization :

```
Authorization: Bearer <token>
```

## Endpoints

### Authentification

#### POST /auth/login
Connexion utilisateur

**Body:**
```json
{
  "email": "admin@eugenestore.cm",
  "password": "password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "admin-1",
    "email": "admin@eugenestore.cm",
    "firstName": "Admin",
    "lastName": "Eugene Store",
    "role": "admin"
  }
}
```

#### POST /auth/register
Inscription utilisateur

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+237 6XX XXX XXX"
}
```

### Produits

#### GET /products
Récupérer tous les produits

**Response:**
```json
[
  {
    "id": "1",
    "name": "iPhone 15 Pro Max",
    "description": "Le dernier iPhone...",
    "price": 850000,
    "originalPrice": 950000,
    "image": "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg",
    "category": "phones",
    "brand": "Apple",
    "rating": 4.8,
    "reviewCount": 245,
    "inStock": true,
    "stockQuantity": 15,
    "isNew": true,
    "isPromo": true,
    "promoPercentage": 11
  }
]
```

#### GET /products/:id
Récupérer un produit par ID

#### POST /products
Ajouter un nouveau produit (Admin uniquement)

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data
```

**Body:**
```
name: "Nouveau produit"
description: "Description du produit"
price: 50000
originalPrice: 60000
category: "electronics"
brand: "Marque"
stockQuantity: 10
image: <file>
```

#### PUT /products/:id
Modifier un produit (Admin uniquement)

#### DELETE /products/:id
Supprimer un produit (Admin uniquement)

### Commandes

#### GET /orders
Récupérer les commandes (Admin uniquement)

#### POST /orders
Créer une nouvelle commande

**Body:**
```json
{
  "items": [
    {
      "productId": "1",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Rue Example",
    "city": "Douala",
    "region": "Littoral",
    "country": "Cameroun"
  },
  "paymentMethod": "orange_money"
}
```

#### PUT /orders/:id/status
Mettre à jour le statut d'une commande (Admin uniquement)

**Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TRK123456789"
}
```

### Utilisateurs

#### GET /users/profile
Récupérer le profil utilisateur connecté

#### PUT /users/profile
Mettre à jour le profil utilisateur

#### GET /users
Récupérer tous les utilisateurs (Admin uniquement)

## Codes de statut

- `200` - Succès
- `201` - Créé avec succès
- `400` - Requête invalide
- `401` - Non autorisé
- `403` - Accès interdit
- `404` - Ressource non trouvée
- `500` - Erreur serveur

## Gestion des erreurs

Les erreurs sont retournées au format JSON :

```json
{
  "error": "Message d'erreur descriptif"
}
```

## Upload de fichiers

Les images sont uploadées via multipart/form-data et stockées dans le dossier `uploads/`.

**Limites:**
- Taille maximale : 5MB
- Types autorisés : jpeg, jpg, png, gif, webp

## Pagination

Pour les endpoints qui retournent des listes, utilisez les paramètres de requête :

```
GET /products?page=1&limit=10
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Filtrage et recherche

### Produits
```
GET /products?category=phones&search=iphone&minPrice=50000&maxPrice=100000
```

### Commandes
```
GET /orders?status=pending&startDate=2024-01-01&endDate=2024-12-31
```

## Webhooks (à implémenter)

Pour les notifications de paiement et de livraison :

```
POST /webhooks/payment
POST /webhooks/shipping
```

## Rate Limiting

- 100 requêtes par minute par IP
- 1000 requêtes par heure par utilisateur authentifié

## Sécurité

- Tous les endpoints sensibles nécessitent une authentification
- Les mots de passe sont hashés avec bcrypt
- Les tokens JWT expirent après 24h
- Validation des données d'entrée
- Protection CSRF
- Headers de sécurité 