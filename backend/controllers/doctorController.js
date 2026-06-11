const crudController = require('./crudController');
const Doctor = require('../models/Doctor');
module.exports = crudController(Doctor, 'Doctor');
