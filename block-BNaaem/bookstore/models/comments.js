let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let commentSchema = new Schema({
    title: {type: String, required: true},
    bookId: {type:Schema.Types.ObjectId, ref: "Book", required: true},
    author: {type: Schema.Types.ObjectId, ref: "User"}
}, {timestamps: true});

module.exports = mongoose.model("Comment", commentSchema);