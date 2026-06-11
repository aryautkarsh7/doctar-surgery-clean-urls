const crudController = require('./crudController');
const Treatment = require('../models/Treatment');
module.exports = crudController(Treatment, 'Treatment');
