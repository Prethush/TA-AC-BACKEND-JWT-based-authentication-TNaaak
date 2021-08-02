var express = require('express');
var router = express.Router();
let User = require('../models/users');
let auth = require('../middlewares/auth');

router.use(auth.verifyToken);
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async (req, res, next) => {
  try {
    let user = await User.create(req.body);
    let token = await user.signToken();
    res.status(200).json({user: user.userJSON(token)});
  }catch(error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  let {email, passwd} = req.body;
  if(!email || !passwd) {
    return res.status(400).json({error: "Email/password required"});
  }
  try{
    let user = await User.findOne({email});
    console.log(user);
    if(!user) {
      return res.status(400).json({error: "Email is not registered"});
    }
    
    let result = await user.verifyPasswd(passwd);
    
    if(!result) {
      return res.status(400).json({error: "Password is incorrect"});
    }
    let token = await user.signToken();
    res.status(200).json({user: user.userJSON(token)});
  }catch(error) {
    next(error);
  }
});

router.get('/protected', auth.verifyToken, (req, res, next) => {
  console.log(req.user);
  res.status(200).json({msg: "Protecetd Site"});
});
module.exports = router;
