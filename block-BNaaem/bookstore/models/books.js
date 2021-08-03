let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let bookSchema = new Schema({
    title: {type: String, required: true},
    summary: {type: String, required: true},
    tags: [String], 
    author: String,
    pages: Number,
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    category: [String],
    userId: {type: Schema.Types.ObjectId, ref: "User"},
    price: Number, 
    quantity: Number
}, {timestamps: true});

module.exports = mongoose.model("Book", bookSchema);