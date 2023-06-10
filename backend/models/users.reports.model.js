const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserReports = new Schema({
    email:{
        type: String,
        required: true,
    },
    startDate: {
        type: String,
    },
    endDate: {
        type: String,
    },
    totalAttendance: {
        type: Number,
    },
    totalPresent: {
        type: Number,
    },
    totalAbsent: {
        type: Number,
    },
    totalLeave: {
        type: Number,
    },
    totalLeavePending: {
        type: Number,
    }
});

const model = mongoose.model("UserReports", UserReports);
module.exports = model;