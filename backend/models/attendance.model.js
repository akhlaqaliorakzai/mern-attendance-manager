const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Attendance = new Schema({
    email:{
        type: String,
        required: true,
    },
    date:{
        type: String,
        required: true,
    },
    mark:{
        type: String,
        required: true,
    }
});

const model = mongoose.model("Attendance", Attendance);
module.exports = model;