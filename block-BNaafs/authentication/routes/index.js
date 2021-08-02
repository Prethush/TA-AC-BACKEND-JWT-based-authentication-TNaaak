var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard', auth.varifyToken, (req, res) => {
  console.log(req.user);
  res.status(200).json({msg: "Protected Page"})
})
module.exports = router;
