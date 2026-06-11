const crudController = require('./crudController');
const FAQ = require('../models/FAQ');
module.exports = crudController(FAQ, 'FAQ');
