//user schema
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require("bcrypt");
let jwt = require('jsonwebtoken');

require("dotenv").config();

let userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    passwd: {type: String, required: true},
    bio: String,
    image: String,
    following: Boolean,
    articles: [{type: Schema.Types.ObjectId, ref: "Article"}],
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    followingList: [{type: Schema.Types.ObjectId, ref: "User"}],
    followersList: [{type: Schema.Types.ObjectId, ref: "User"}],
    
}, {timestamps: true});

userSchema.pre('save', async function(next) {
    if(this.passwd && this.isModified('passwd')) {
        this.passwd = await bcrypt.hash(this.passwd, 10);
    }
    next();
});

userSchema.methods.verifyPasswd = async function(passwd) {
    try{
        let result = await bcrypt.compare(passwd, this.passwd);
        return result;
    }catch(error) {
        return error;
    }
}

userSchema.methods.signToken = async function() {
    let payload = {userId: this.id, email: this.email, username: this.username};
    try{
        let token = await jwt.sign(payload, process.env.SECRET);
        return token;
    }catch(error) {
        return error;
    }
}

userSchema.methods.userJSON = function(token) {
    return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: null,
        token: token
    }
}

userSchema.methods.displayUser = function(id = null) {
    return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image, 
        following: id ? this.followersList.includes(id) : false
    }
}

userSchema.methods.isFavorite = function(id){
    if(this.favoriteList.indexOf(id) !== -1){
        return true;
    }else {
        return false;
    }
}

module.exports = mongoose.model("User", userSchema);