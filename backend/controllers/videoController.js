const crudController = require('./crudController');
const Video = require('../models/Video');
module.exports = crudController(Video, 'Video');
