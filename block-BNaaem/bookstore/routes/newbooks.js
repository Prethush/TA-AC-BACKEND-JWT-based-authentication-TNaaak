let express = require('express');
let router = express.Router();
let Book = require('../models/books');
let Comment = require('../models/comments');

//list all books
router.get('/', (req, res, next) => {
    Book.find({}, (err, books) => {
        if(err) return next(err);
        res.status(200).json({books});
    })
});

//list a single book
router.get('/:id', (req, res, next) => {
    let id = req.params.id;
    Book.findById(id).populate('comments').exec((err, book) => {
        if(err) return next(err);
        res.status(200).json({book});
    })
});

//create a book
router.post('/', (req, res, next) => {
    Book.create(req.body, (err, book) => {
        if(err) return next(err);
        res.status(200).json({book});
    })
});

//update a book
router.put('/:id', (req, res, next) => {
    let id = req.params.id;
    Book.findByIdAndUpdate(id, req.body, (err, book) => {
        if(err) return next(err);
        res.status(200).json({book});
    })
});

//delete a book
router.delete('/:id', (req, res, next) => {
    let id = req.params.id;
    Book.findByIdAndDelete(id, (err, book) => {
        if(err) return next(err);
        Comment.deleteMany({booksId: id}, (err, result) => {
            if(err) return next(err);
            res.status(200).json({book});
        })
        
    })
});

//add comments
router.post('/:id/comments', (req, res, next) => {
    let id = req.params.id;
    req.body.bookId = id;
    Comment.create(req.body, (err, comment) => {
        if(err) return next(err);
        Book.findByIdAndUpdate(id, {$push: {comments: comment.id}}, (err, book) => {
            if(err) return next(err);
            res.status(200).json({comment});
        })
    })
});




module.exports = router;