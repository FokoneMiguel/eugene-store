import connectDB from '../../config/database.js';
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Un compte avec cet email existe déjà' });
    }

    // Créer le nouvel utilisateur
    const user = new User({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      phone,
      role: 'customer'
    });

    await user.save();

    // Générer le token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Retourner les données utilisateur sans le mot de passe
    const userData = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone
    };

    res.status(201).json({
      success: true,
      token,
      user: userData
    });
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
} 