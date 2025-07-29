export const translations = {
  fr: {
    // Navigation
    home: 'Accueil',
    products: 'Produits',
    cart: 'Panier',
    login: 'Connexion',
    register: 'Inscription',
    logout: 'Déconnexion',
    profile: 'Profil',
    admin: 'Administration',
    
    // Auth
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    firstName: 'Prénom',
    lastName: 'Nom',
    phone: 'Téléphone',
    loginTitle: 'Se connecter',
    registerTitle: 'S\'inscrire',
    forgotPassword: 'Mot de passe oublié ?',
    alreadyHaveAccount: 'Déjà un compte ?',
    dontHaveAccount: 'Pas encore de compte ?',
    
    // Products
    addProduct: 'Ajouter un produit',
    editProduct: 'Modifier le produit',
    productName: 'Nom du produit',
    description: 'Description',
    price: 'Prix',
    originalPrice: 'Prix original',
    promoPrice: 'Prix promotionnel',
    category: 'Catégorie',
    brand: 'Marque',
    stock: 'Stock',
    outOfStock: 'Rupture de stock',
    inStock: 'En stock',
    quantity: 'Quantité',
    addToCart: 'Ajouter au panier',
    buyNow: 'Acheter maintenant',
    viewDetails: 'Voir les détails',
    
    // Cart & Checkout
    cartEmpty: 'Votre panier est vide',
    cartTotal: 'Total du panier',
    checkout: 'Commander',
    proceedToPayment: 'Procéder au paiement',
    paymentMethod: 'Méthode de paiement',
    card: 'Carte bancaire',
    mtnMoney: 'MTN Mobile Money',
    orangeMoney: 'Orange Money',
    
    // Admin
    dashboard: 'Tableau de bord',
    manageProducts: 'Gérer les produits',
    manageOrders: 'Gérer les commandes',
    manageUsers: 'Gérer les utilisateurs',
    statistics: 'Statistiques',
    sales: 'Ventes',
    revenue: 'Revenus',
    
    // Common
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    confirm: 'Confirmer',
    close: 'Fermer',
    
    // Theme & Language
    lightTheme: 'Thème clair',
    darkTheme: 'Thème sombre',
    french: 'Français',
    english: 'Anglais',
    settings: 'Paramètres',
    
    // Product Options
    color: 'Couleur',
    size: 'Taille',
    material: 'Matériau',
    weight: 'Poids',
    dimensions: 'Dimensions',
    warranty: 'Garantie',
    specifications: 'Spécifications',
    reviews: 'Avis',
    rating: 'Note',
    
    // Messages
    welcomeMessage: 'Bienvenue sur EUGENE STORE',
    productAdded: 'Produit ajouté au panier',
    productRemoved: 'Produit retiré du panier',
    orderPlaced: 'Commande passée avec succès',
    paymentSuccess: 'Paiement réussi',
    paymentFailed: 'Échec du paiement',
    stockUpdated: 'Stock mis à jour',
    productSaved: 'Produit enregistré',
    productDeleted: 'Produit supprimé',
  },
  
  en: {
    // Navigation
    home: 'Home',
    products: 'Products',
    cart: 'Cart',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    profile: 'Profile',
    admin: 'Admin',
    
    // Auth
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Phone',
    loginTitle: 'Login',
    registerTitle: 'Register',
    forgotPassword: 'Forgot Password?',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: 'Don\'t have an account?',
    
    // Products
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    productName: 'Product Name',
    description: 'Description',
    price: 'Price',
    originalPrice: 'Original Price',
    promoPrice: 'Promotional Price',
    category: 'Category',
    brand: 'Brand',
    stock: 'Stock',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    quantity: 'Quantity',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    viewDetails: 'View Details',
    
    // Cart & Checkout
    cartEmpty: 'Your cart is empty',
    cartTotal: 'Cart Total',
    checkout: 'Checkout',
    proceedToPayment: 'Proceed to Payment',
    paymentMethod: 'Payment Method',
    card: 'Credit Card',
    mtnMoney: 'MTN Mobile Money',
    orangeMoney: 'Orange Money',
    
    // Admin
    dashboard: 'Dashboard',
    manageProducts: 'Manage Products',
    manageOrders: 'Manage Orders',
    manageUsers: 'Manage Users',
    statistics: 'Statistics',
    sales: 'Sales',
    revenue: 'Revenue',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    close: 'Close',
    
    // Theme & Language
    lightTheme: 'Light Theme',
    darkTheme: 'Dark Theme',
    french: 'French',
    english: 'English',
    settings: 'Settings',
    
    // Product Options
    color: 'Color',
    size: 'Size',
    material: 'Material',
    weight: 'Weight',
    dimensions: 'Dimensions',
    warranty: 'Warranty',
    specifications: 'Specifications',
    reviews: 'Reviews',
    rating: 'Rating',
    
    // Messages
    welcomeMessage: 'Welcome to EUGENE STORE',
    productAdded: 'Product added to cart',
    productRemoved: 'Product removed from cart',
    orderPlaced: 'Order placed successfully',
    paymentSuccess: 'Payment successful',
    paymentFailed: 'Payment failed',
    stockUpdated: 'Stock updated',
    productSaved: 'Product saved',
    productDeleted: 'Product deleted',
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.fr; 