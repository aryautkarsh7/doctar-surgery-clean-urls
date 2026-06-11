const crudController = require('./crudController');
const Blog = require('../models/Blog');
module.exports = crudController(Blog, 'Blog');
