const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: 'Please supply a name',
        trim: true,
    },
    description: {
        type: String,
    },
    genre: {
        type: String,
    },
    favorite: {
        type: Boolean,
    },
    read: {
        type: Boolean,
    },
});

module.exports = mongoose.model('Book', bookSchema);
