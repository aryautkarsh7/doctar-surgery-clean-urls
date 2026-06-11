const crudController = require('./crudController');
const SubSubCategory = require('../models/SubSubCategory');
module.exports = crudController(SubSubCategory, 'SubSubCategory');
