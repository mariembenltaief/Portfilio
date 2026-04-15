// routes/aproposRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const aproposController = require("../controllers/aproposController");

// Routes PUBLIQUES
router.get("/skills", aproposController.getPublicSkills);
router.get("/parcours", aproposController.getPublicParcours);

// Routes PROTÉGÉES
// Skills
router.get("/skills/me", protect, aproposController.getMySkills);
router.post("/skills", protect, aproposController.createSkill);
router.put("/skills/:id", protect, aproposController.updateSkill);
router.delete("/skills/:id", protect, aproposController.deleteSkill);
router.patch("/skills/reorder", protect, aproposController.reorderSkills);

// Parcours
router.get("/parcours/me", protect, aproposController.getMyParcours);
router.post("/parcours", protect, aproposController.createParcours);
router.put("/parcours/:id", protect, aproposController.updateParcours);
router.delete("/parcours/:id", protect, aproposController.deleteParcours);
router.patch("/parcours/reorder", protect, aproposController.reorderParcours);

module.exports = router;