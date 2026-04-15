const roleMiddleware = (req, res, next) => {
  // Pour ce projet, un seul rôle existe (enseignant-chercheur)
  // Cette middleware est gardée pour d'éventuelles extensions futures
  next();
};

module.exports = roleMiddleware;