const crudController = require('./crudController');
const Category = require('../models/Category');
module.exports = crudController(Category, 'Category');
