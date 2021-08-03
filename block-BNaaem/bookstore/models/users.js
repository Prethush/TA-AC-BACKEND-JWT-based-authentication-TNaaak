let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

require("dotenv").config();

let userSchema = new Schema({
    name: {type: String, required: true},
    passwd: {type: String, required: true, minlength: 5},
    email: {type: String, unique: true, required: true},
    books: [{type: Schema.Types.ObjectId, ref: "Book"}],
    cart: [{type: Schema.Types.ObjectId, ref: "Book"}],
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}]
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
    let payload = {userId: this.id, email: this.email, name: this.name};
    try{
        let token = await jwt.sign(payload, process.env.SECRET);
        return token;
    }catch(error) {
        return error;
    }
}

userSchema.methods.userJSON = function(token) {
    return {
        name: this.name,
        email: this.email,
        books: this.books,
        token: token
    }
}


module.exports = mongoose.model("User", userSchema);