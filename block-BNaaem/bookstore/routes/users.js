var express = require('express');
var router = express.Router();
var User = require('../models/users');
var auth = require('../middlewares/auth');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//register a user
router.post('/register', async (req, res, next) => {
  try{
    var user = await User.create(req.body);
  }catch(error) {
    next(error);
  }
});

//login user
router.post('/login', async (req, res, next) => {
  var {email, passwd} = req.body;
  if(!email || !passwd) {
    return res.status(400).json({error: "Email/Password Required"});
  }
  try {
    var user = await User.findOne({email});
    if(!user) {
      return res.status(400).json({error: "Email is not registered"});
    }
    var result = await user.verifyPasswd(passwd);
    if(!result) {
      return res.status(400).json({error: "Password is incorrect"});
    }
    var token = await user.signToken();
    res.status(200).json({user: user.userJSON(token)});
  }catch(error) {
    next(error);
  }
});

router.use(auth.verifyToken);

//add books to cart
router.put('/cart/:id', async (req, res, next) => {
  let id = req.params.id;
  try{
    let user = await User.findByIdAndUpdate(req.user.userId, {$push: {cart: id}});
    return res.status(200).json({msg: "Book successfully added"});
  }catch(error) {
    next(error);
  }
});

//remove book from cart
router.put('/cart/:id/remove', async (req, res, next) => {
  let id = req.params.id;
  try{
    let user = await User.findByIdAndUpdate(req.user.userId, {$pull: {cart: id}});
    return res.status(200).json({masg: "Item successfully removed"});
  }catch(error) {
    next(error);
  }
});

module.exports = router;
