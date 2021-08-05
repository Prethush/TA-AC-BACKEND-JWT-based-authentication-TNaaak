let express = require('express');
let router = express.Router();
let Article = require('../models/article');
let auth = require('../middleware/auth');
let User = require('../models/users');
let Comment = require('../models/comments');


//create article
router.post('/', auth.verifyToken, async (req, res, next) => {
    req.body.article.author = req.user.userId;
    try{
        let article = await Article.create(req.body.article);
        let author = await User.findByIdAndUpdate(req.user.userId, {$push: {articles: article.id}});
        article = await Article.findById(article.id).populate('author');
        res.status(200).json({article: article.displayArticle(req.user.userId)});
    }catch(error) {
        next(error);
    }
});

// feed articles
router.get('/feed', auth.verifyToken, async (req, res, next) => {
   
    try{
        let result = await User.findById(req.user.userId).distinct('followingList');
        let articles = await Article.find({author: {$in: result}}).populate('author');
        res.status(200).json({articles: articles.map((arr) => {
            return arr.displayArticle(req.user.userId)}), arcticlesCount: articles.length});
    }catch(error) {
        next(error);
    }
})

//get specific article
router.get('/:slug', async (req, res, next) => {
    let slug = req.params.slug;
    try {
        let article = await Article.findOne({slug}).populate('author');
        let author = await User.findById(article.author);
        res.status(200).json({article: article.displayArticle()});
    }catch(error) {
        next(error);
    }
});

//list articles
router.get('/', auth.authOptional, async (req, res, next) => {
    let id = req.user ? req.user.userId : false;
    var limit = 20, skip = 0;
    var tags = await Article.find({}).distinct('tagList');
    var authors = await User.find({}).distinct('_id');
    console.log(authors);
    var tagList, author = undefined;
    if(req.query.tag) {
        tagList = req.query.tag;
    }
    if(req.query.limit){
        limit = req.query.limit;
    }
    if(req.query.skip) {
        skip = req.query.skip;
    }
    if(req.query.author) {
        let authorName = req.query.author;
        let user = await User.findOne({username: authorName});
        author = user.id;
    }

    console.log(tagList);
    try{ 
       
        if(req.query.favorited){
            var favorited = req.query.favorited;
            var user = await User.findOne({username: favorited});
            console.log(favorited);
            var articles = await Article.find({tagList: !tagList ? {$in: tags} : tagList, favoriteList: user.id, author: !author ? {$in: authors} : author}).populate('author').limit(Number(limit)).skip(Number(skip)).sort({createdAt: -1});
            res.status(200).json({articles: articles.map((arr) => {
                return arr.displayArticle(id)}), arcticlesCount: articles.length});
           
        }else if(!req.query.favorited){
            console.log("yes");
            var articles = await Article.find({tagList: !tagList ? {$in: tags} : tagList, author: !author ? {$in: authors} : author}).populate('author').limit(Number(limit)).skip(Number(skip)).sort({createdAt: -1});
            res.status(200).json({articles: articles.map((arr) => {
                return arr.displayArticle(id)}), arcticlesCount: articles.length});
        }else {
            return res.status(400).json({errors: {body: ["No results for the search"]}});
        }

       }catch(error) {
        next(error);
    }
});
//update article
router.put('/:slug', auth.verifyToken, async (req, res, next) => {
    let slug = req.params.slug;
    if(req.body.article.title){
        req.body.article.slug = req.body.article.title.split(" ").join("-").toLowerCase()
    }
    try{
        let article = await Article.findOne({slug});
        if(req.user.userId == article.author){
            article = await Article.findOneAndUpdate({slug}, req.body.article).populate('author');
            return res.status(200).json({article: article.displayArticle(req.user.userId)});
        }else {
            return res.status(403).json({error: {body: ["Not Authorized to perform this action"]}});
        }
       
    }catch(error) {
        next(error);
    }
});

//delete article
router.delete('/:slug', auth.verifyToken, async (req, res, next) => {
    let slug = req.params.slug;
    try{
        let article = await Article.findOne({slug});
        if(req.user.userId == article.author){
            article = await Article.findOneAndDelete({slug});
            let user = await User.findByIdAndUpdate(req.user.userId, {$pull: {articles: article.id}});
            return res.status(400).json({msg: "Article is successfully deleted"});
        }else {
            return res.status(403).json({error: {body: ["Not Authorized to perform this action"]}});
        }
    }catch(error) {
        next(error);
    }
});

//create comment
router.post('/:slug/comments', auth.verifyToken, async (req, res, next) => {
    let slug = req.params.slug;
    try{
        let article = await Article.findOne({slug});
        req.body.comment.articleId = article.id;
        req.body.comment.author = req.user.userId;
        let comment = await Comment.create(req.body.comment)
        let user = await User.findByIdAndUpdate(req.user.userId, {$push: {comments: comment.id}});
        article = await Article.findOneAndUpdate({slug}, {$push: {comments: comment.id}});
        comment = await Comment.findById(comment.id).populate('author');
        return res.status(200).json({comment: comment.displayComment(user.id)});
    }catch(error) {
        next(error);
    }
});

//get comments from an article
router.get('/:slug/comments', auth.authOptional, async (req, res, next) => {
    let slug = req.params.slug;
    let id = req.user ? req.user.userId : false;
    try{
        let article = await Article.findOne({slug});
        let comments = await Comment.find({articleId: article.id}).populate('author');
        res.status(200).json({
           comments: comments.map(c => {
                return c.displayComment(id);
            })
        });
        return res.status(200).json({comments: comment.displayComment(id)});
    }catch(error) {
        next(error);
    }
});

//delete comment
router.delete('/:slug/comments/:id', auth.verifyToken, async (req, res, next) => {
    let slug = req.params.slug;
    let id = req.params.id;
    try{
        let comment = await Comment.findById(id);
        if(req.user.userId == comment.author){
            comment = await Comment.findByIdAndDelete(id);
            let author = await User.findByIdAndUpdate(req.user.userId, {$pull: {comments: id}});
            let article = await Article.findOneAndUpdate({slug}, {$pull: {comments: id}});
            return res.status(200).json({msg: "Comment is successfully deleted"});
        } else {
            return res.status(403).json({error: {body: ["Not Authorized to perform this action"]}});
        }
    }catch(error){
        next(error);
    }
});

//favorite article
router.post('/:slug/favorite', auth.verifyToken, async (req, res, next) => {
    let slug = req.params.slug;
    
    try{
        let article = await Article.findOne({slug});
        // console.log(article);
        let user = await User.findById(req.user.userId);
        
        if(!article.favoriteList.includes(user.id)){
            article = await Article.findOneAndUpdate({slug}, {$inc: {favoritesCount: 1}, $push: {favoriteList: user.id}}).populate('author');
            // console.log(user.favoriteList.includes(article.id));
            return res.status(200).json({article: article.displayArticle(user.id)});
        }else {
            // console.log(user.favoriteList.includes(article.id));
            return res.status(200).json({errors: {body: ["Article is already added in your favorite list"]}});
        }
    }catch(error) {
        next(error);
    }
});

//unfavourite article
router.delete('/:slug/favorite', auth.verifyToken, async (req, res, next) => {
    let slug = req.params.slug;
    try{
        let article = await Article.findOne({slug});
        let user = await User.findById(req.user.userId);
        if(article.favoriteList.includes(user.id)){
            article = await Article.findOneAndUpdate({slug}, {$inc: {favoritesCount: -1}, $pull: {favoriteList: user.id}}).populate('author');
            
            return res.status(200).json({article: article.displayArticle(user.id)});
        }else {
            
            return res.status(200).json({errors: {body: ["Article is not added to the favorite list"]}});
        }
    }catch(error) {
        next(error);
    }

});


module.exports = router;