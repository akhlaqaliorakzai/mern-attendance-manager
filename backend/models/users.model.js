const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Users = new Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    id:{
        type: String,
        unique: true,
    },
    image:{
        type: String,
    },
    password:{
        type: String,
        required: true,
    }
});

const model = mongoose.model("Users", Users);
module.exports = model;