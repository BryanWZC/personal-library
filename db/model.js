const mongoose = require('mongoose');
const librarySchema = require('./schema');

const Library = mongoose.model('Library', librarySchema);

module.exports = Library;