let express = require('express');
let router = express.Router();
let User = require('../models/users');
let auth = require('../middleware/auth');


//get a user profile
router.get('/:username', auth.authOptional, async (req, res, next) => {
    let id = req.user ? req.user.userId : false;
    let username = req.params.username;
        try{
            let user = await User.findOne({username});
            if(user) {
                return res.status(201).json({user: user.displayUser(id)});
            }else {
                return res.status(400).json({errors: ["There is no user with that name"]});
            }
    }catch(error) {
        next(error);
    }
});


router.use(auth.verifyToken);

//follow a user
router.post('/:username/follow', async(req, res, next) => {
    let username = req.params.username;
    try{
        let user1 = await User.findOne({username});
        if(!user1) {
            return res.status(400).json({errors: ["There is no user with that name"]});
        }
        let user2 = await User.findById(req.user.userId);
        console.log(user1, user2);
        if((user1.username != user2.username) && (!user2.followingList.includes(user1.id))) {
            user2 = await User.findByIdAndUpdate(user2.id, {$push: {followingList: user1.id}});
            user1 = await User.findByIdAndUpdate(user1.id, {$push: {followersList: user2.id}});
            return res.status(201).json({user: user1.displayUser(user2.id)});
        }else {
            return res.status(400).json({errors: {body: ["You are already following the person"]}});
        }
        
       
    }catch(error) {
        next(error);
    }
});

//unfollow a user
router.delete('/:username/follow', async (req, res, next) => {
    let username = req.params.username;
    try{
        let user1 = await User.findOne({username});
        if(!user1) {
            return res.status(400).json({errors: ["There is no user with that name"]});
        }
        let user2 = await User.findById(req.user.userId);
        if(user2.followingList.includes(user1.id)) {
            user2 = await User.findByIdAndUpdate(user2.id, {$pull: {followingList: user1.id}});
            user1 = await User.findByIdAndUpdate(user1.id, {$pull: {followersList: user2.id}});
            return res.status(200).json({user: user1.displayUser(user2.id)});
        }else {
            return res.status(400).json({errors: {body: ["You are not following this person"]}});
        }
        
    }catch(error) {
        next(error);
    }
});

module.exports = router;