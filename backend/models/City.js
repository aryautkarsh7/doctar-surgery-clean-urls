const mongoose = require('mongoose');
const citySchema = new mongoose.Schema({
  name: String,
  slug: String,
  state: String,
  lat: Number,
  lng: Number,
  population: Number
});
module.exports = mongoose.model('City', citySchema);
