const crudController = require('./crudController');
const Review = require('../models/Review');
module.exports = crudController(Review, 'Review');
