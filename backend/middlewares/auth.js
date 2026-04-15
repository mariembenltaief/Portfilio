const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      success: false,
      message: "Non autorisé — token manquant",
    });
  }

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Format token invalide",
    });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Token invalide (id manquant)",
      });
    }

    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token expiré ou invalide",
    });
  }
};

const softProtect = (req, res, next) => {
  const header = req.headers.authorization;

  if (header?.startsWith("Bearer ")) {
    try {
      const token = header.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
    } catch {
      req.userId = undefined;
    }
  }

  next();
};

module.exports = { protect, softProtect };