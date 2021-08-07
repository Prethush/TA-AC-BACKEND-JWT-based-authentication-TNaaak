let express = require('express');
let router = express.Router();

//get tags
router.get('/', async (req, res, next) => {
    try {
      let tags = await Article.find({}).distinct('tagList');
      res.status(200).json({tags});
    }catch(error) {
      next(error);
    }
  });

module.exports = router;