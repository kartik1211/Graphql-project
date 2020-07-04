const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// id will be added automatically by the collection
// no need to specify here
const bookSchema = new Schema({
    name: String,
    genre: String,
    authorId: String
});

module.exports = mongoose.model('Book', bookSchema);