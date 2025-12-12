const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();


// REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Vérifier que l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email déjà utilisé" });

    // Hasher mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer utilisateur
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.json({ message: "Utilisateur créé", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier utilisateur
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Utilisateur introuvable" });

    // Vérifier mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mauvais mot de passe" });

    // Créer token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Connecté", token, user });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

module.exports = router;
