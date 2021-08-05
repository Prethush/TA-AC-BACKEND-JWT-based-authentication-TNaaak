var express = require('express');
var router = express.Router();
let Article = require('../models/article');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//get tags
router.get('/tags', async (req, res, next) => {
  try {
    let tags = await Article.find({}).distinct('tagList');
    res.status(200).json({tags});
  }catch(error) {
    next(error);
  }
})
module.exports = router;
