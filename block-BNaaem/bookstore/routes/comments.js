let express = require('express');
let router = express.Router();
let Comment = require('../models/comments');
let Book = require('../models/books');
//edit comment
router.put('/:id', (req, res, next) => {
    let id = req.params.id;
    Comment.findByIdAndUpdate(id, req.body, (err, comment) => {
        if(err) return next(err);
        res.status(200).json({comment});
    })
});

//delete comment
router.delete('/:id', (req, res, next) => {
    let id = req.params.id;
    Comment.findByIdAndDelete(id, (err, comment) => {
        if(err) return next(err);
        Book.findByIdAndUpdate(comment.bookId, {$pull: {comments: id}}, (err, book) => {
            if(err) return next(err);
            res.status(200).json({comment});
        })
    })
});

module.exports = router;