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

// IMPORTANT: Importer initModels
const { initModels } = require('./controllers/aproposController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/visiteurs', visiteursRoutes);
app.use('/api/cours', coursRoutes);
app.use('/api/ressources-cours', ressourcesCoursRoutes);
app.use('/api/projets-recherche', projetsRechercheRoutes);
app.use('/api/publications', publicationsRoutes);
app.use('/api/articles-blog', articlesBlogRoutes);
app.use('/api/liens-externes', liensExternesRoutes);
app.use('/api/parametres', parametresRoutes);
app.use('/api/statistiques', statistiquesRoutes);
app.use('/api/apropos', aproposRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur'
  });
});

// Connect to database and start server
connectDB().then(() => {
  
  initModels(pool);

  
  app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
   
  });
}).catch(err => {
  console.error('Erreur de connexion à la DB:', err);
});

module.exports = app;