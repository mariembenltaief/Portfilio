const ParametresModel = require('../models/parametresModel');


// 🔓 PUBLIC PARAMETERS
const getPublicParameters = async (req, res) => {
  try {
    const params = await ParametresModel.getPublic();

    res.json({
      success: true,
      parameters: params
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};


// 🔒 USER PARAMETERS (GET)
const getUserParameters = async (req, res) => {
  try {
    let params = await ParametresModel.findByUser(req.userId);

    if (!params) {
      params = await ParametresModel.createDefault(req.userId);
    }

    res.json({
      success: true,
      parameters: params
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};


// 🔒 USER PARAMETERS (UPDATE)
const updateUserParameters = async (req, res) => {
  try {
    const { langue_principale, langue_secondaire } = req.body;

    const params = await ParametresModel.updateUser(req.userId, {
      langue_principale,
      langue_secondaire
    });

    res.json({
      success: true,
      parameters: params
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};


module.exports = {
  getPublicParameters,
  getUserParameters,
  updateUserParameters
};