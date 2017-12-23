const Book = require('../models/Book');
const User = require('../models/User');

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

exports.getReadsBooks = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.userId});
        res.json({
            books: user.reads
        });
    } catch (err) {
        console.log(err);
        res.json({
            error_code: 500,
            message: err.message
        })
    }
};

exports.getFavoritesBooks = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.userId});
        res.json({
            books: user.favorites
        });
    } catch (err) {
        console.log(err);
        res.json({
            error_code: 500,
            message: err.message
        })
    }
};

exports.setReadBook = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.userId});
        const index = user.reads.indexOf(req.params.id);
        if (index => 0) {
            user.reads.splice(index, 1);
            await user.save();
            res.json({
                read: false
            });
        } else {
            user.reads.push(req.params.id);
            await user.save();
            res.json({
                read: true
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            error_code: 500,
            message: err.message
        })
    }
};

exports.setFavoriteBook = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.userId});
        const index = user.favorites.indexOf(req.params.id);
        if (index => 0) {
            user.favorites.splice(index, 1);
            await user.save();
            res.json({
                favorite: false
            });
        } else {
            user.favorites.push(req.params.id);
            await user.save();
            res.json({
                favorite: true
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            error_code: 500,
            message: err.message
        })
    }
};