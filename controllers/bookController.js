const Book = require('../models/Book');

exports.addBook = async (req, res) => {
    try {
        const book = await (new Book(req.body)).save();
        res.json({
            id: book._id,
            name: book.name,
            author: book.author,
            about: book.about,
            genre: book.genre
        });
    } catch (err) {
        console.log(err);
        res.json({
            error_code: 500,
            message: err.message
        })
    }
};

exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find(req.query);
        return res.json({
            books
        });
    } catch (err) {
        console.log(err);
        res.json({
            error_code: 500,
            message: err.message
        })
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findOne({_id: req.params.id});
        res.json({
            id: book._id,
            name: book.name,
            author: book.author,
            about: book.about,
            genre: book.genre
        });
    } catch (err) {
        console.log(err);
        res.json({
            error_code: 500,
            message: err.message
        })
    }
};

exports.getReadBooks = async (req, res) => {
    
};
