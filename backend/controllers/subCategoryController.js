const crudController = require('./crudController');
const SubCategory = require('../models/SubCategory');
module.exports = crudController(SubCategory, 'SubCategory');
