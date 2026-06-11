const crudController = require('./crudController');
const Hospital = require('../models/Hospital');
module.exports = crudController(Hospital, 'Hospital');
