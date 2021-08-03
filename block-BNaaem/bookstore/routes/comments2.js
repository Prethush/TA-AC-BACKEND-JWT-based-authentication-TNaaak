let express = require('express');
let router = express.Router();
let Comment = require('../models/comments');
let Book = require('../models/books');
let User = require('../models/users');
let auth = require('../middlewares/auth');
let auth2 = require('../middlewares/auth2');

router.use(auth.verifyToken);
//edit comment
router.put('/:id', auth2.verifyCommentUser, (req, res, next) => {
    let id = req.params.id;
    Comment.findByIdAndUpdate(id, req.body, (err, comment) => {
        if(err) return next(err);
        res.status(200).json({comment});
    })
});

//delete comment
router.delete('/:id', auth2.verifyCommentUser, (req, res, next) => {
    let id = req.params.id;
    Comment.findByIdAndDelete(id, (err, comment) => {
        if(err) return next(err);
        Book.findByIdAndUpdate(comment.bookId, {$pull: {comments: id}}, (err, book) => {
            if(err) return next(err);
            User.findByIdAndDelete(comment.userId, {$pull: {comments: id}}, (err, user) => {
                if(err) return next(err);
                
                res.status(200).json({comment});
            })
           
        })
    })
});

module.exports = router;