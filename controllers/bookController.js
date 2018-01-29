const Book = require('../models/Book');
const User = require('../models/User');
const validator = require('validator');

exports.addBook = async (req, res) => {
    try {
        const book = await (new Book({
            name: req.body.name,
            author: req.body.author,
            description: req.body.description,
            genre: req.body.genre,
            read: false,
            favorite: false,
        })).save();
        res.json(book);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error_code: 500,
            message: err.message
        })
    }
};

exports.validateAdding = (req, res, next) => {
    if (validator.isEmpty(req.body.name) || validator.isEmpty(req.body.author)){
        return res.status(409).json({
            error_code: 409,
            message: 'Name and author must be filled'
        });
    }
    next();
};

exports.updateBook = async (req, res) => {
    try{
        const book = await Book.findOneAndUpdate({_id: req.params.id}, req.body, {
            new: true,
            runValidators: true,
        }).exec();
        res.json(book);
    } catch (err) {
        console.log(err);
        res.status(500).json({
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
        res.json(book);
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
        const user = await User.findOne({_id: req.userId}).populate('reads');
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
        const user = await User.findOne({_id: req.userId}).populate('vaforites');
        res.json({
            books: user.vaforites
        });
    } catch (err) {
        console.log(err);
        res.json({
            error_code: 500,
            message: err.message
        })
    }
};

function isLabaledBook(operator) {
    return operator === '$pull' ? false : true;
}

exports.setReadBook = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.userId});
        const books = user.reads.map((obj) => obj.toString());
        const operator = books.includes(req.params.id) ? '$pull' : '$addToSet';
        const userUpdate = await User
            .findByIdAndUpdate(user._id,
                {[operator]: {reads: req.params.id}},
                {new: true},
            );
        const book = await Book.findOne({_id:req.params.id});
        book.read = isLabaledBook(operator);
        await book.save();
        res.json({
            read: isLabaledBook(operator)
        });
    } catch (err) {
        console.log('setReadBook');
        console.log(err);
        res.status(500).json({
            error_code: 500,
            message: err.message
        })
    }
};

exports.setFavoriteBook = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.userId});
        const books = user.vaforites.map((obj) => obj.toString());
        const operator = books.includes(req.params.id) ? '$pull' : '$addToSet';
        const userUpdate = await User
            .findByIdAndUpdate(user._id,
                {[operator]: {vaforites: req.params.id}},
                {new: true},
            );
        const book = await Book.findOne({_id:req.params.id});
        book.favorite = isLabaledBook(operator);
        await book.save();
        res.json({
            vaforite: isLabaledBook(operator)
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error_code: 500,
            message: err.message
        })
    }
};