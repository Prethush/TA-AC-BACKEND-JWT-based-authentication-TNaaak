var express = require('express');
var router = express.Router();
var User = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).json({msg: "User Page"});
});

//register user
router.post('/register', async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    res.status(200).json({user});
  } catch(error) {
    next(error);
  }
});

//login user
router.post('/login', async (req, res, next) => {
  let {email, passwd} = req.body;
  if(!email || !passwd) {
    return res.status(400).json({error: "Email/Password required"});
  }
  try {
    let user = await User.findOne({email});
    if(!user) {
      return res.status(400).json({error: "Email is not registered"});
    }
    let result = await user.verifyPasswd(passwd);
    if(!result) {
      return res.status(400).json({error: "Password is Incorrect"});
    }
    console.log(user, result);
  }catch(error) {
    next(error);
  }
})

module.exports = router;
