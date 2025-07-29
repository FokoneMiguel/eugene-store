import fetch from 'node-fetch';

const testVercelAuth = async () => {
  try {
    console.log('🧪 Test de l\'authentification sur Vercel...\n');
    
    // URL de votre application Vercel (remplacez par votre URL)
    const baseUrl = 'https://eugene-store-frontend.vercel.app'; // Remplacez par votre URL Vercel
    
    console.log(`🌐 URL de test: ${baseUrl}`);
    
    // Test 1: Vérifier que l'API est accessible
    console.log('\n1️⃣ Test de l\'API products...');
    try {
      const productsResponse = await fetch(`${baseUrl}/api/products`);
      const productsData = await productsResponse.json();
      
      if (productsResponse.ok) {
        console.log('✅ API products accessible');
        console.log(`📦 ${productsData.length || 0} produits trouvés`);
      } else {
        console.log('❌ Erreur API products:', productsData.error);
      }
    } catch (error) {
      console.log('❌ Erreur de connexion API products:', error.message);
    }
    
    // Test 2: Initialiser l'admin
    console.log('\n2️⃣ Initialisation de l\'admin...');
    try {
      const initResponse = await fetch(`${baseUrl}/api/init-db`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const initData = await initResponse.json();
      
      if (initResponse.ok) {
        console.log('✅ Admin initialisé avec succès');
        console.log('👤 Email:', initData.admin.email);
        console.log('🔑 Mot de passe:', initData.admin.password);
      } else {
        console.log('❌ Erreur initialisation:', initData.error);
      }
    } catch (error) {
      console.log('❌ Erreur de connexion init-db:', error.message);
    }
    
    // Test 3: Test de connexion admin
    console.log('\n3️⃣ Test de connexion admin...');
    try {
      const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@eugenestore.cm',
          password: 'password'
        })
      });
      const loginData = await loginResponse.json();
      
      if (loginResponse.ok) {
        console.log('✅ Connexion admin réussie');
        console.log('👤 Utilisateur:', loginData.user.firstName, loginData.user.lastName);
        console.log('🔐 Rôle:', loginData.user.role);
        console.log('🎫 Token:', loginData.token ? 'Présent' : 'Manquant');
      } else {
        console.log('❌ Erreur de connexion:', loginData.error);
      }
    } catch (error) {
      console.log('❌ Erreur de connexion login:', error.message);
    }
    
    console.log('\n📋 Résumé des tests :');
    console.log('1. Vérifiez que votre URL Vercel est correcte');
    console.log('2. Vérifiez les variables d\'environnement sur Vercel');
    console.log('3. Vérifiez les logs Vercel pour plus de détails');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
};

testVercelAuth(); 