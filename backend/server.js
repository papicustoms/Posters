// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// Connexion DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Route test
app.get("/", (req, res) => {
  res.send("API Posters fonctionne !");
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Serveur démarré sur le port", PORT));
