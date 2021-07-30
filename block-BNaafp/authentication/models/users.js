let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');

let userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    passwd: {type: String, required: true, minlength: 5}
}, {timestamps: true});

userSchema.pre('save', async function(next) {
    if(this.passwd && this.isModified('passwd')) {
        this.passwd = await bcrypt.hash(this.passwd, 10);
    } 
    next();
});

userSchema.methods.verifyPasswd = async function(passwd) {
    try {
        let result = await bcrypt.compare(passwd, this.passwd);
        return result;
    } catch(error) {
        return error;
    }
    
}
module.exports = mongoose.model("User", userSchema);