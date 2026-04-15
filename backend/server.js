// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const { connectDB, pool } = require('./config/db');

// Import routes
const visiteursRoutes = require('./routes/visiteurs');
const coursRoutes = require('./routes/cours');
const ressourcesCoursRoutes = require('./routes/ressourcesCours');
const projetsRechercheRoutes = require('./routes/projetsRecherche');
const publicationsRoutes = require('./routes/publications');
const articlesBlogRoutes = require('./routes/articlesBlog');
const liensExternesRoutes = require('./routes/liensExternes');
const parametresRoutes = require('./routes/parametres');
const statistiquesRoutes = require('./routes/statistiques');
const aproposRoutes = require('./routes/aproposRoutes');

const { initModels } = require('./controllers/aproposController');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS ─────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Middleware ───────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/visiteurs',        visiteursRoutes);
app.use('/api/cours',            coursRoutes);
app.use('/api/ressources-cours', ressourcesCoursRoutes);
app.use('/api/projets-recherche',projetsRechercheRoutes);
app.use('/api/publications',     publicationsRoutes);
app.use('/api/articles-blog',    articlesBlogRoutes);
app.use('/api/liens-externes',   liensExternesRoutes);
app.use('/api/parametres',       parametresRoutes);
app.use('/api/statistiques',     statistiquesRoutes);
app.use('/api/apropos',          aproposRoutes);

// ─── Error handling ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur'
  });
});

// ─── Start ────────────────────────────────────────────────────
connectDB().then(() => {
  initModels(pool);
  app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
  });
}).catch(err => {
  console.error('Erreur de connexion à la DB:', err);
});

module.exports = app;