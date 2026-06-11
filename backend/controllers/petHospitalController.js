const crudController = require('./crudController');
const PetHospital = require('../models/PetHospital');
module.exports = crudController(PetHospital, 'PetHospital');
