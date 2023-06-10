const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SystemReports = new Schema({
    name:{
        type: String,
    },
    startDate: {
        type: String,
    },
    endDate: {
        type: String,
    },
    total:{
        type: Number
    },
    gradeA: {
        type: Number,
        default: 0,
    },
    gradeB: {
        type: Number,
        default: 0,
    },
    gradeC: {
        type: Number,
        default: 0,
    },
    gradeD: {
        type: Number,
        default: 0,
    },
    gradeF: {
        type: Number,
        default: 0,
    }
});

const model = mongoose.model("SystemReports", SystemReports);
module.exports = model;