let Book = require('../models/books');
let Comment = require('../models/comments');

module.exports = {
    verifyUser: async (req, res, next) => {
        let id = req.params.id;
        try{
            let book = await Book.findById(id);
            console.log(req.user.userId, book.userId);
            if(req.user.userId == book.userId) {
                return next();
            }else {
                return res.status(400).json({error: "No Authorization to perform this task"});
            }
        }catch(error) {
            next(error);
        }
       
    },

    verifyCommentUser: async (req, res, next) => {
        let id = req.params.id;
        try{
        let comment = await Comment.findById(id);
        console.log(req.user.userId, comment.author);
        if(req.user.userId == comment.author){
            return next();
        }else {
            return res.status(400).json({error: "No Authorization to perform this task"});
        }
        }catch(error) {
            next(error);
        }
    }
}