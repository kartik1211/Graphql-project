const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// id will be added automatically by the collection
const authorSchema = new Schema({
    name: String,
    age: Number
});

module.exports = mongoose.model('Author', authorSchema);