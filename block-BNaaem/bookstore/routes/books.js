let express = require('express');
let router = express.Router();
let Book = require('../models/books');

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
    Book.findById(id, (err, book) => {
        if(err) return next(err);
        res.status(200).json({book});
    })
});

//create a book
router.post('/', (req, res, next) => {
    console.log(req.body);
    req.body.tags = req.body.tags.trim().split(" ");
    Book.create(req.body, (err, book) => {
        if(err) return next(err);
        res.status(200).json({book});
    })
});

//edit a book
router.put('/:id', (req, res, next) => {
    let id = req.params.id;
    req.body.tags = req.body.tags.trim().split(" ");
    Book.findByIdAndUpdate(id, req.body, (err, book) => {
        if(err) return next(err);
        console.log(book);
        res.status(200).json({book});
    })
});

//delete a book
router.delete('/:id', (req, res, next) => {
    let id = req.params.id;
    Book.findByIdAndDelete(id, (err, book) => {
        if(err) return next(err);
        res.status(200).json({book});
    })
});

module.exports = router;