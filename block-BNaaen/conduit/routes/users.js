var express = require('express');
var router = express.Router();
var User = require('../models/users');
var auth = require('../middleware/auth');
var bcrypt = require('bcrypt');


//register user
router.post('/register', async (req, res, next) => {
  req.body.user.following = false;
  try{
    var user = await User.create(req.body.user);
    var token = await user.signToken();
    return res.status(201).json({user: user.userJSON(token)});
  }catch(error){
    next(error);
  }
});

//login a user
router.post('/login', async (req, res, next) => {
  var {email, passwd} = req.body.user;
  if(!passwd || !email) {
    return res.status(400).json({error: {body: "Password/Email required"}});
  }
  try{
    var user = await User.findOne({email});
    if(!user) {
      return res.status(400).json({error: {body: "Email is not registered"}});
    }
    var result = await user.verifyPasswd(passwd);
    if(!result) {
      return res.status(400).json({error: {body: "Passwd is incorrect"}});
    }
  
    var token = await user.signToken();
    return res.status(201).json({user: user.userJSON(token)});
  }catch(error) {
    next(error);
  }
});

router.use(auth.verifyToken);

//get current user
router.get('/', async (req, res, next) => {
    let id = req.user.userId;
    console.log(id);
    try{
        let user = await User.findById(id);
        res.status(200).json({user: user.displayUser(id)})
    }catch(error) {
        next(error);
    }
});

//update user
router.put('/', async (req, res, next) => {
    let id = req.user.userId;
    try{
        let user = await User.findById(id);
        if(req.body.user.passwd !== user.passwd) {
            req.body.user.passwd = await bcrypt.hash(req.body.user.passwd, 10);  
        }
        user = await User.findByIdAndUpdate(id, req.body.user);
        return res.status(201).json({user: user.displayUser(id)})
    }catch(error) {
        next(error);
    }
});


module.exports = router;
